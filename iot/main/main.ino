#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <MFRC522.h>

// Pins for components
#define SS_PIN D4    // RFID SS pin
#define RST_PIN D3   // RFID RST pin
#define SERVO_PIN D1 // Servo motor pin
#define GREEN_LED D5 // Green LED pin
#define RED_LED D6   // Red LED pin

// RFID setup
MFRC522 rfid(SS_PIN, RST_PIN);

// Servo setup
Servo servoMotor;

// LCD setup (16x2 display, I2C address 0x27)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// WiFi credentials
const char *ssid = "Ibrahim";
const char *password = "WifiPassword";

// Server endpoint
const char *serverUrl = "https://server.thegreenback.xyz/dispose-to-machine-via-card";

// Variables for RFID card ID
String rfidUID = "";

// Function to send POST request
void sendPostRequest(String id)
{
    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"rfid_id\": \"" + id + "\"}";

    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0)
    {
        Serial.println("POST sent successfully.");
    }
    else
    {
        Serial.println("Error sending POST.");
    }

    http.end();
}

void setup()
{
    Serial.begin(115200);

    // Initialize components
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    SPI.begin();     // Initialize SPI bus
    rfid.PCD_Init(); // Initialize RFID

    lcd.init();      // Initialize LCD
    lcd.backlight(); // Turn on backlight

    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    servoMotor.attach(SERVO_PIN);
    servoMotor.write(0); // Servo at 0 degrees

    lcd.clear();
    lcd.print("GreenBack Ready");
}

void loop()
{
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
    {
        rfidUID = "";
        for (byte i = 0; i < rfid.uid.size; i++)
        {
            rfidUID += String(rfid.uid.uidByte[i], HEX);
        }

        Serial.print("RFID Card detected: ");
        Serial.println(rfidUID);

        // Display welcome message
        lcd.clear();
        lcd.setCursor(2, 0);
        lcd.print("Welcome to");
        lcd.setCursor(3, 1);
        lcd.print("GreenBack");

        delay(2000);

        // Prompt to insert bottle
        lcd.clear();
        lcd.setCursor(2, 0);
        lcd.print("Insert your");
        lcd.setCursor(5, 1);
        lcd.print("bottle");

        delay(5000);

        // Commented: ESP32-CAM object recognition part
        /*
        if (!isPlasticBottle()) {
          lcd.clear();
          lcd.print("Not a bottle");
          digitalWrite(RED_LED, HIGH);
          delay(3000);
          digitalWrite(RED_LED, LOW);
          return;
        }
        */

        // Bottle recognized, proceed
        servoMotor.write(90); // Move servo to throw the bottle
        delay(2000);          // Wait for the bottle to drop
        servoMotor.write(0);  // Move servo back to original position

        // Send post request with RFID ID
        sendPostRequest(rfidUID);

        // Turn on green LED for success
        digitalWrite(GREEN_LED, HIGH);
        delay(3000);

        digitalWrite(GREEN_LED, LOW);

        lcd.clear();
        lcd.setCursor(2, 0);
        lcd.print("Thank you!");

        delay(2000);

        // Reset LCD message
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("GreenBack Ready");
    }
}