#include "esp_camera.h"
#include <WiFi.h>

// GPIO pin to signal ESP8266 (connected to OBJECT_DETECT_PIN in ESP8266)
#define SIGNAL_PIN 13

// WiFi credentials
const char *ssid = "MTN-2.4G-3D6751";
const char *password = "CEAD9ABF";

// Function prototypes
void setupCamera();
bool detectPlasticBottle();
bool isPlasticColor(uint8_t r, uint8_t g, uint8_t b);

// Setup function
void setup()
{
    Serial.begin(115200);

    // Setup Wi-Fi connection
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    // Initialize the signal pin
    pinMode(SIGNAL_PIN, OUTPUT);
    digitalWrite(SIGNAL_PIN, LOW);

    // Setup camera
    setupCamera();
}

// Main loop function
void loop()
{
    if (detectPlasticBottle())
    {
        Serial.println("Plastic bottle detected!");
        // Send signal to ESP8266 to indicate plastic detection
        digitalWrite(SIGNAL_PIN, HIGH);
        delay(1000); // Keep the signal high for a second
        digitalWrite(SIGNAL_PIN, LOW);
    }
    else
    {
        Serial.println("Non-plastic item detected.");
        // Do not send a signal or trigger any action
    }

    delay(5000); // Add some delay before capturing the next image
}

// Function to setup the ESP32-CAM camera
void setupCamera()
{
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sscb_sda = SIOD_GPIO_NUM;
    config.pin_sscb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_RGB565; // Set to RGB format for color analysis

    config.frame_size = FRAMESIZE_QVGA; // QVGA size is sufficient for color detection
    config.jpeg_quality = 12;
    config.fb_count = 1;

    // Init the camera
    esp_err_t err = esp_camera_init(&config);
    if (err != ESP_OK)
    {
        Serial.printf("Camera init failed with error 0x%x", err);
        return;
    }
}

// Function to detect if an item is a plastic bottle based on color
bool detectPlasticBottle()
{
    // Capture an image from the camera
    camera_fb_t *fb = esp_camera_fb_get();

    if (!fb)
    {
        Serial.println("Camera capture failed");
        return false;
    }

    // Analyze the image for color detection
    int colorMatches = 0;
    int colorThreshold = 50; // Threshold of how many pixels need to match to confirm plastic

    // Loop through a section of the image and check pixel colors
    for (int y = 100; y < 140; y++)
    { // Adjust to a smaller region (e.g., 40 rows)
        for (int x = 100; x < 140; x++)
        { // Adjust to a smaller region (e.g., 40 columns)
            // Each pixel is 2 bytes (RGB565 format), extract RGB
            uint16_t pixel = ((uint16_t)fb->buf[(y * fb->width + x) * 2] << 8) | fb->buf[(y * fb->width + x) * 2 + 1];

            uint8_t r = (pixel >> 11) & 0x1F;
            uint8_t g = (pixel >> 5) & 0x3F;
            uint8_t b = pixel & 0x1F;

            // Normalize RGB values to 8-bit
            r = r << 3;
            g = g << 2;
            b = b << 3;

            // Check if this pixel matches plastic colors
            if (isPlasticColor(r, g, b))
            {
                colorMatches++;
            }
        }
    }

    // Return the buffer to the driver for reuse
    esp_camera_fb_return(fb);

    // If enough pixels match plastic color characteristics, it's a plastic bottle
    if (colorMatches > colorThreshold)
    {
        return true;
    }

    return false;
}

// Function to determine if a pixel's color matches known plastic bottle colors
bool isPlasticColor(uint8_t r, uint8_t g, uint8_t b)
{
    // Define basic color ranges for common plastic bottles (transparent, white, blue, green)

    // Transparent/White (high R, G, B values)
    if (r > 200 && g > 200 && b > 200)
    {
        return true;
    }

    // Blue (low R, medium G, high B values)
    if (r < 100 && g < 150 && b > 150)
    {
        return true;
    }

    // Green (low R, high G, low B values)
    if (r < 100 && g > 150 && b < 100)
    {
        return true;
    }

    // Add more color conditions if needed

    return false; // Not a plastic color
}
