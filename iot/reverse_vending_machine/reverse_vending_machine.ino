#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Stepper.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFiS3.h>
#include "HX711.h"

// Pin definitions
#define RFID_SS_PIN 10
#define RFID_RST_PIN 9
#define STEPPER_PIN1 2
#define STEPPER_PIN2 3
#define STEPPER_PIN3 4
#define STEPPER_PIN4 5
#define HX711_DT_PIN A1
#define HX711_SCK_PIN A0
#define LED_PIN 6
#define GREEN_LED_PIN 7
#define RED_LED_PIN 8
#define COLOR_S0 9
#define COLOR_S1 12
#define COLOR_S2 13
#define COLOR_S3 11
#define COLOR_OUT 10

// WiFi credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// Server settings
WiFiServer server(80);

// RFID
MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN);

// Load cell
HX711 scale;

// LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Stepper motor
const int stepsPerRevolution = 2048;
Stepper stepper(stepsPerRevolution, STEPPER_PIN1, STEPPER_PIN2, STEPPER_PIN3, STEPPER_PIN4);

// Color sensor thresholds (for white detection)
int red, green, blue;
const int whiteThreshold = 100; // Adjust based on testing

// Global variables
String rfidId = "";
String idSource = ""; // New variable to track the ID source
bool rfidDetected = false;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  
  lcd.init();
  lcd.backlight();

  stepper.setSpeed(10);
  
  pinMode(LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(COLOR_S0, OUTPUT);
  pinMode(COLOR_S1, OUTPUT);
  pinMode(COLOR_S2, OUTPUT);
  pinMode(COLOR_S3, OUTPUT);
  pinMode(COLOR_OUT, INPUT);

  // Set color sensor scaling
  digitalWrite(COLOR_S0, HIGH);
  digitalWrite(COLOR_S1, LOW);

  // Initialize load cell
  scale.begin(HX711_DT_PIN, HX711_SCK_PIN);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Start the server
  server.begin();
  
  lcd.setCursor(0, 0);
  lcd.print("Smart Bin Ready");
}

void loop() {
  // Check for client connection
  WiFiClient client = server.available();

  if (client) {
    Serial.println("New client connected");

    while (client.connected()) {
      if (client.available()) {
        String line = client.readStringUntil('\r');
        Serial.println("Received: " + line);

        // Assuming the message contains an RFID ID from a QR code or similar
        rfidId = line;
        idSource = "QrScan"; // Set ID source to QR Code
        rfidDetected = true;
        handleRFID();
      }
    }

    // Close the connection
    client.stop();
    Serial.println("Client disconnected");
  }

  if (!rfidDetected && mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // RFID detected
    rfidDetected = true;
    rfidId = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      rfidId += String(mfrc522.uid.uidByte[i], HEX);
    }
    idSource = "RFID"; // Set ID source to RFID Card
    handleRFID();
  }

  if (rfidDetected) {
    // Open bin
    stepper.step(stepsPerRevolution);

    // Wait for bottle
    delay(5000); // Adjust delay as needed

    // Measure weight
    float weight = scale.get_units(10);
    Serial.print("Weight: ");
    Serial.print(weight);
    Serial.println(" g");

    if (weight > 0) {
      // Turn on LED
      digitalWrite(LED_PIN, HIGH);

      // Measure color
      readColor();
      if (isWhite()) {
        // Send data to server
        sendToServer(weight, rfidId, idSource);
        
        // Bottle accepted
        digitalWrite(GREEN_LED_PIN, HIGH);
        digitalWrite(RED_LED_PIN, LOW);
      } else {
        // Bottle not accepted
        digitalWrite(GREEN_LED_PIN, LOW);
        digitalWrite(RED_LED_PIN, HIGH);
      }

      // Display weight on LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Weight: ");
      lcd.setCursor(8, 0);
      lcd.print(weight);
      lcd.print(" g");

      // Turn off LED
      digitalWrite(LED_PIN, LOW);
    } else {
      // Display "Closing" and close bin if weight is 0
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Closing");
      delay(2000); // Briefly display "Closing"
    }

    // Close bin
    stepper.step(-stepsPerRevolution);

    // Reset for next cycle
    rfidDetected = false;
    rfidId = "";
    idSource = "";
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, LOW);
    delay(5000);
  }
}

void readColor() {
  digitalWrite(COLOR_S2, LOW);
  digitalWrite(COLOR_S3, LOW);
  red = pulseIn(COLOR_OUT, LOW);

  digitalWrite(COLOR_S3, HIGH);
  green = pulseIn(COLOR_OUT, LOW);

  digitalWrite(COLOR_S2, HIGH);
  blue = pulseIn(COLOR_OUT, LOW);

  Serial.print("R: "); Serial.print(red);
  Serial.print(" G: "); Serial.print(green);
  Serial.print(" B: "); Serial.println(blue);
}

bool isWhite() {
  return (red < whiteThreshold && green < whiteThreshold && blue < whiteThreshold);
}

void sendToServer(float weight, String rfidId, String idSource) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect("localhost:8080", 80)) {
      String postData = "weight=" + String(weight) + "&rfidId=" + rfidId + "&idSource=" + idSource;
      client.println("POST /dispose-to-machine HTTP/1.1");
      client.println("Host: localhost:8080");
      client.println("Content-Type: application/x-www-form-urlencoded");
      client.println("Content-Length: " + String(postData.length()));
      client.println();
      client.println(postData);
      client.stop();
    }
  }
}

void handleRFID() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Welcome");
}
