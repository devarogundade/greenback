// #include <SoftwareSerial.h>
// #include <Wire.h>
// #include <LiquidCrystal_I2C.h>
// #include <Stepper.h>
// #include <SPI.h>
// #include <MFRC522.h>
// #include "HX711.h"

// // Pin definitions for Arduino Uno
// #define RFID_SS_PIN 10 // Pin 10
// #define RFID_RST_PIN 9 // Pin 9
// #define STEPPER_PIN1 4 // Pin 4
// #define STEPPER_PIN2 5 // Pin 5
// #define STEPPER_PIN3 6 // Pin 6
// #define STEPPER_PIN4 7 // Pin 7
// #define HX711_DT_PIN A1 // Pin A1
// #define HX711_SCK_PIN A0 // Pin A0
// #define LED_PIN 8 // Pin 8
// #define GREEN_LED_PIN 11 // Pin 11
// #define RED_LED_PIN 12 // Pin 12
// #define COLOR_S0 A2 // Pin A2
// #define COLOR_S1 A3 // Pin A3
// #define COLOR_S2 A4 // Pin A4
// #define COLOR_S3 A5 // Pin A5
// #define COLOR_OUT 2 // Pin 2

// // RFID and Load cell
// MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN);
// HX711 scale;

// // LCD
// LiquidCrystal_I2C lcd(0x27, 16, 2);

// // Stepper motor
// const int stepsPerRevolution = 2048;
// Stepper stepper(stepsPerRevolution, STEPPER_PIN1, STEPPER_PIN2, STEPPER_PIN3, STEPPER_PIN4);

// // Serial communication with ESP32
// SoftwareSerial espSerial(2, 3); // RX, TX

// // Color sensor
// int red, green, blue;
// const int whiteThreshold = 100; // Adjust based on testing

// void setup() {
//   Serial.begin(9600);
//   espSerial.begin(9600); // Communication with ESP32-CAM
//   SPI.begin();
//   mfrc522.PCD_Init();

//   lcd.init();
//   lcd.backlight();

//   stepper.setSpeed(10);

//   pinMode(LED_PIN, OUTPUT);
//   pinMode(GREEN_LED_PIN, OUTPUT);
//   pinMode(RED_LED_PIN, OUTPUT);
//   pinMode(COLOR_S0, OUTPUT);
//   pinMode(COLOR_S1, OUTPUT);
//   pinMode(COLOR_S2, OUTPUT);
//   pinMode(COLOR_S3, OUTPUT);
//   pinMode(COLOR_OUT, INPUT);

//   // Set color sensor scaling
//   digitalWrite(COLOR_S0, HIGH);
//   digitalWrite(COLOR_S1, LOW);

//   // Initialize load cell
//   scale.begin(HX711_DT_PIN, HX711_SCK_PIN);

//   lcd.setCursor(0, 0);
//   lcd.print("Smart Bin Ready");
// }

// void loop() {
//   if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
//     String rfidId = "";
//     for (byte i = 0; i < mfrc522.uid.size; i++) {
//       rfidId += String(mfrc522.uid.uidByte[i], HEX);
//     }
//     handleRFID(rfidId);
//   }

//   // Additional operations
// }

// void handleRFID(String rfidId) {
//   lcd.clear();
//   lcd.setCursor(0, 0);
//   lcd.print("RFID Detected");

//   stepper.step(stepsPerRevolution);
//   delay(5000); // Adjust delay as needed

//   float weight = scale.get_units(10);
//   if (weight > 0) {
//     digitalWrite(LED_PIN, HIGH);
//     readColor();

//     if (isWhite()) {
//       sendDataToESP32(weight, rfidId, "RFID");
//       digitalWrite(GREEN_LED_PIN, HIGH);
//       digitalWrite(RED_LED_PIN, LOW);
//     } else {
//       digitalWrite(GREEN_LED_PIN, LOW);
//       digitalWrite(RED_LED_PIN, HIGH);
//     }

//     lcd.clear();
//     lcd.setCursor(0, 0);
//     lcd.print("Weight: ");
//     lcd.setCursor(8, 0);
//     lcd.print(weight);
//     lcd.print(" g");

//     digitalWrite(LED_PIN, LOW);
//   } else {
//     lcd.clear();
//     lcd.setCursor(0, 0);
//     lcd.print("Closing");
//     delay(2000);
//   }

//   stepper.step(-stepsPerRevolution);
//   delay(5000);
// }

// void readColor() {
//   digitalWrite(COLOR_S2, LOW);
//   digitalWrite(COLOR_S3, LOW);
//   red = pulseIn(COLOR_OUT, LOW);

//   digitalWrite(COLOR_S3, HIGH);
//   green = pulseIn(COLOR_OUT, LOW);

//   digitalWrite(COLOR_S2, HIGH);
//   blue = pulseIn(COLOR_OUT, LOW);

//   Serial.print("R: "); Serial.print(red);
//   Serial.print(" G: "); Serial.print(green);
//   Serial.print(" B: "); Serial.println(blue);
// }

// bool isWhite() {
//   return (red < whiteThreshold && green < whiteThreshold && blue < whiteThreshold);
// }

// void sendDataToESP32(float weight, String rfidId, String idSource) {
//   String data = "weight:" + String(weight) + ",rfidId:" + rfidId + ",idSource:" + idSource;
//   espSerial.println(data);
// }
