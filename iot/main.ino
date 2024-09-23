#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <Wire.h>

#define RST_PIN D3 // Configurable, see typical pin layout above
#define SS_PIN D4  // Configurable, see typical pin layout above

#define SERVO_PIN D8 // Servo motor pin

#define GREEN_LED_PIN D0
#define GREEN_RED_PIN D9

// ESP32 CAM pin for object recognition
#define OBJECT_DETECT_PIN D6

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

// LCD setup (16x2 display, I2C address 0x27)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Servo setup
Servo servoMotor;

// WiFi credentials
const char *ssid = "MTN-2.4G-3D6751";
const char *password = "CEAD9ABF";

// Server endpoint
const String serverUrl = "https://greenback.onrender.com/dispose-to-machine-via-card";

// Variables for RFID card ID
String rfidUID = "";

void scrollText(String msg)
{
    int length = msg.length();

    // Scroll from right to left
    for (int i = 0; i < length - 16; i++)
    {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print(msg.substring(i, i + 16)); // Print 16 characters at a time
        lcd.setCursor(3, 1);
        lcd.print("Thank you!");
        delay(300); // Adjust delay to control the speed of animation
    }
}

void welcomeMessage()
{
    // Display welcome message
    lcd.clear();
    lcd.setCursor(1, 0);
    lcd.print("Scan your RFID");
    lcd.setCursor(3, 1);
    lcd.print("Green Card");
}

// Function to send POST request
void sendPostRequest(String id)
{
    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"card_id\":\"ABCD\",\"machine_id\":1,\"channel\":\"RFID\",\"weight_in_gram\":43553}";

    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0)
    {
        Serial.println("POST sent successfully.");
    }
    else
    {
        Serial.println("Error sending POST.");
        Serial.println(httpResponseCode);
    }

    http.end();
}

void setup()
{
    Serial.begin(9600); // Initialize serial communications with the PC

    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
    while (!Serial)
        ;

    SPI.begin(); // Init SPI bus

    mfrc522.PCD_Init(); // Init MFRC522
    delay(4);           // Optional delay. Some board do need more time after init to be ready, see Readme

    mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
    Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));

    lcd.begin();     // Initialize LCD
    lcd.backlight(); // Turn on backlight

    // Initialize components
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Connecting to");
    lcd.setCursor(0, 1);
    lcd.print("WiFi...");

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi...");
    }

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Connected to");
    lcd.setCursor(0, 1);
    lcd.print("WiFi");

    Serial.println("Connected to WiFi");

    delay(2000);

    welcomeMessage();

    pinMode(GREEN_LED_PIN, OUTPUT);
    pinMode(GREEN_RED_PIN, OUTPUT);

    pinMode(OBJECT_DETECT_PIN, INPUT);

    servoMotor.attach(SERVO_PIN);
    servoMotor.write(0); // Servo at 0 degrees
}

void loop()
{
    // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
    if (!mfrc522.PICC_IsNewCardPresent())
    {
        return;
    }

    // Select one of the cards
    if (!mfrc522.PICC_ReadCardSerial())
    {
        return;
    }

    // Turn on green LED for success
    digitalWrite(GREEN_LED_PIN, HIGH);
    delay(500);
    digitalWrite(GREEN_LED_PIN, LOW);

    // Dump debug info about the card; PICC_HaltA() is automatically called
    mfrc522.PICC_DumpToSerial(&(mfrc522.uid));

    rfidUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        rfidUID += String(mfrc522.uid.uidByte[i], HEX);
    }

    Serial.print("RFID Card detected: ");
    Serial.println(rfidUID);

    // Display welcome message
    lcd.clear();
    lcd.setCursor(1, 0);
    lcd.print("Make the world");
    lcd.setCursor(3, 1);
    lcd.print("green back!");

    delay(2000);

    // Prompt to insert bottle
    lcd.clear();
    lcd.setCursor(2, 0);
    lcd.print("Insert your");
    lcd.setCursor(5, 1);
    lcd.print("bottle");

    delay(5000);

    // Check if it's a plastic bottle using ESP32 CAM
    isPlastic = digitalRead(OBJECT_DETECT_PIN);
    if (isPlastic)
    {
        Serial.print("Disposing...");

        // Bottle recognized, proceed
        servoMotor.write(90); // Move servo to throw the bottle

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Disposing");
        lcd.setCursor(0, 1);
        lcd.print("Please wait...");

        delay(3000);         // Wait for the bottle to drop
        servoMotor.write(0); // Move servo back to original position
        delay(3000);         // Wait for servo to return back to orginal position

        Serial.print("Rewarding...");

        // Send post request with RFID ID
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Rewarding you");
        lcd.setCursor(0, 1);
        lcd.print("Please wait...");

        delay(1000);

        sendPostRequest(rfidUID);

        // Send post request with RFID ID
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Reward sent!");
        lcd.setCursor(0, 1);
        lcd.print("10 GCoin");

        delay(1000);

        // Turn on green LED for success
        digitalWrite(GREEN_LED_PIN, HIGH);
        delay(3000);
        digitalWrite(GREEN_LED_PIN, LOW);

        scrollText("Visit GreenBack web app to donate to charity causes.");
    }
    else
    {
        // Turn on red LED for error
        digitalWrite(GREEN_RED_PIN, HIGH);
        delay(2000);
        digitalWrite(GREEN_RED_PIN, LOW);

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Not a plastic");
        lcd.setCursor(0, 1);
        lcd.print("bottle!");
        delay(2000);
        lcd.clear();
    }

    delay(2000);

    // Reset LCD message
    welcomeMessage();
}