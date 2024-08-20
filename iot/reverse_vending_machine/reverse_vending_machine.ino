#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Stepper.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebSocketsClient.h>
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
#define COLOR_S0 7
#define COLOR_S1 8
#define COLOR_S2 12
#define COLOR_S3 13
#define COLOR_OUT 11

// WiFi credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";
const char* server = "http://yourserver.com/api"; // Replace with your server URL

// WebSocket settings
WebSocketsClient webSocket;
const char* webSocketHost = "your.websocket.server"; // Replace with your WebSocket server URL
const uint16_t webSocketPort = 80;

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
bool rfidDetected = false;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  
  lcd.init();
  lcd.backlight();

  stepper.setSpeed(10);
  
  pinMode(LED_PIN, OUTPUT);
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

  // Initialize WebSocket
  webSocket.begin(webSocketHost, webSocketPort, "/");
  webSocket.onEvent(webSocketEvent);
  
  lcd.setCursor(0, 0);
  lcd.print("Smart Bin Ready");
}

void loop() {
  webSocket.loop();

  if (!rfidDetected && mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // RFID detected
    rfidDetected = true;
    rfidId = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      rfidId += String(mfrc522.uid.uidByte[i], HEX);
    }
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
        sendToServer(weight, rfidId);
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

void sendToServer(float weight, String rfidId) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect(server, 80)) {
      String postData = "weight=" + String(weight) + "&rfidId=" + rfidId;
      client.println("POST /add_weight HTTP/1.1");
      client.println("Host: yourserver.com");
      client.println("Content-Type: application/x-www-form-urlencoded");
      client.println("Content-Length: " + String(postData.length()));
      client.println();
      client.println(postData);
      client.stop();
    }
  }
}

// WebSocket event handler
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected!");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected!");
      break;
    case WStype_TEXT:
      Serial.printf("WebSocket message: %s\n", payload);
      // Assuming the payload is the RFID ID from the QR code
      rfidId = String((char*)payload);
      rfidDetected = true;
      handleRFID();
      break;
  }
}

void handleRFID() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Welcome");
}
