#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>
#include <SPI.h>
#include <MFRC522.h>

// Replace these with your Wi-Fi credentials
const char *ssid = "your_SSID";
const char *password = "your_PASSWORD";

// Server URL for POST request
const String serverUrl = "http://your-server.com/post-endpoint";

// RFID setup
#define SS_PIN D2
#define RST_PIN D1
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Servo setup
Servo servoMotor;
int servoPin = D5;

// ESP32 CAM pin for object recognition
#define OBJECT_DETECT_PIN D6

// LED setup
#define GREEN_LED D7
#define RED_LED D8

// LCD setup
LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD address

// Variables
String rfidUID = "";
bool isPlastic = false;

void setup()
{
    // Start serial communication
    Serial.begin(115200);

    // Initialize components
    SPI.begin();
    mfrc522.PCD_Init();
    lcd.init();
    lcd.backlight();
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(OBJECT_DETECT_PIN, INPUT);
    servoMotor.attach(servoPin);

    // Connect to Wi-Fi
    connectToWiFi();

    // Display welcome message
    lcd.setCursor(0, 0);
    lcd.print("GreenBack RVM");
    delay(2000);
    lcd.clear();
}

void loop()
{
    // Look for RFID card
    if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial())
    {
        return;
    }

    // Get RFID UID
    rfidUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        rfidUID += String(mfrc522.uid.uidByte[i], HEX);
    }

    // Display welcome message with RFID user
    lcd.setCursor(0, 0);
    lcd.print("Welcome to");
    lcd.setCursor(0, 1);
    lcd.print("GreenBack");
    delay(2000);

    // Request to insert bottle
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Insert your");
    lcd.setCursor(0, 1);
    lcd.print("plastic bottle");
    delay(5000);

    // Check if it's a plastic bottle using ESP32 CAM
    isPlastic = digitalRead(OBJECT_DETECT_PIN);

    if (isPlastic)
    {
        // Move servo to drop the bottle
        servoMotor.write(90);
        delay(2000);
        servoMotor.write(0);

        // Send POST request with RFID data
        sendPostRequest(rfidUID);

        // Turn on green LED for success
        digitalWrite(GREEN_LED, HIGH);
        delay(2000);
        digitalWrite(GREEN_LED, LOW);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Bottle accepted");
        delay(2000);
        lcd.clear();
    }
    else
    {
        // Turn on red LED for error
        digitalWrite(RED_LED, HIGH);
        delay(2000);
        digitalWrite(RED_LED, LOW);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Not a plastic");
        lcd.setCursor(0, 1);
        lcd.print("bottle!");
        delay(2000);
        lcd.clear();
    }
}

void connectToWiFi()
{
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Connecting to");
    lcd.setCursor(0, 1);
    lcd.print("Wi-Fi...");

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Wi-Fi Connected!");
    delay(2000);
    lcd.clear();
}

void sendPostRequest(String rfid)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/x-www-form-urlencoded");

        String postData = "rfid=" + rfid;
        int httpResponseCode = http.POST(postData);

        if (httpResponseCode > 0)
        {
            Serial.println("POST Request Sent.");
            Serial.println("Response code: " + String(httpResponseCode));
        }
        else
        {
            Serial.println("Error sending POST request");
        }

        http.end();
    }
    else
    {
        Serial.println("Error connecting to Wi-Fi");
    }
}
