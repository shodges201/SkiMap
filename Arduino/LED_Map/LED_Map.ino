#include <stdlib.h>
#include <Adafruit_NeoPixel.h>
#include <Ethernet.h>
#include <Bridge.h>
#include <SPI.h>
#include <WiFiNINA.h>

//wifi info
#include "arduino_secrets.h"

// LED variables
const int LEDPin = 8;
const int LEDCount = 172;
//Adafruit_NeoPixel strip(LEDCount, LEDPin, NEO_GRB + NEO_KHZ800);

// Wifi and Server Variables
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;     // the Wifi radio's status
char url[] = "ski-map.herokuapp.com";
WiFiSSLClient client;
bool printWebData = false;

//Four Hour Interval between calls to API
//const unsigned long postingInterval = 14400000;
const unsigned long postingInterval = 100000;

// Used to tell whether to check API again
unsigned long lastConnectionTime = 0;

// initialize LED strip and some commonly used colors
Adafruit_NeoPixel strip(LEDCount, LEDPin, NEO_GRB + NEO_KHZ800);
uint32_t red = strip.Color(127, 0, 0);
uint32_t green = strip.Color(0, 127, 0);
uint32_t blue = strip.Color(0, 0, 127);

//variables for parsing the API response and handling which LEDs to light up
boolean foundStart = false;
unsigned int pixelNum = 0;
unsigned int dataCount = 0;

void setup() {

  strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();            // Turn OFF all pixels ASAP
  strip.setBrightness(125); // Set BRIGHTNESS to about 1/5 (max = 255)

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  //connect to wifi network
  wifiConnect();

  // you're connected now, so print out the data:
  Serial.print("You're connected to the network");
  printCurrentNet();
  printWifiData();

}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) { //Check the current connection status

    // if there are incoming bytes available
    // from the server, read them and print them:
    int len = client.available();
    
    if (len > 0) {
      unsigned char buffer[len];
      if (len > 80) len = 80;
      client.read(buffer, len);
      if (printWebData) {
        Serial.write(buffer, len);
      }
      
      // if headers are still being read
      int i = 0;
      if (!foundStart) {
        for (i; i < len; i++) {
          if (buffer[i] == 2) {
            Serial.println("FOUND WHERE START OF MESSAGE IS");
            foundStart = true;
            i++;
            break;
          }
        }
      }
  
      //once past headers, read the useful data
      if (foundStart) {
        for (int j = i; j < len; j++) {
          Serial.print("j: ");
          Serial.println(j);
          Serial.print("buffer[j]: ");
          Serial.println((char)buffer[j]);
          Serial.print("pixelNum: ");
          Serial.println(pixelNum);
          Serial.print("dataCount: ");
          Serial.println(dataCount);
          if (buffer[j] == 48) {
            Serial.println("closed trail");
            // data point for a lift
            if (dataCount == 15 || dataCount == 78 || dataCount == 79 || dataCount == 80 || dataCount == 104 || dataCount == 107) {
              Serial.println("found a lift");
              colorLift(red);
            }
            else {
              strip.setPixelColor(pixelNum, red);
              pixelNum++;
            }
          }
          // trail is open
          else if (buffer[j] == 49) {
            Serial.println("open trail");
            // data point for a lift
            if (dataCount == 15 || dataCount == 78 || dataCount == 79 || dataCount == 80 || dataCount == 104 || dataCount == 107) {
              Serial.println("found a lift");
              colorLift(blue);
            }
            else {
              strip.setPixelColor(pixelNum, green);
              pixelNum++;
            }
          }
          dataCount++;
          strip.show();
        }
      }
    }

    if (millis() - lastConnectionTime > postingInterval || lastConnectionTime == 0) {
      //reset the variables needed for parsing a response
      foundStart = false;
      pixelNum = 0;
      dataCount = 0;
      if (serverConnect()) {
        strip.clear();
      }
      else {
        Serial.println("Server could not be reached");
      }
    }
  }
  else {
    Serial.print("You were disconnected from the network");
    wifiConnect();
    printCurrentNet();
    printWifiData();
  }
}

void colorLift(uint32_t color) {
  switch (dataCount) {
    case 15:
      Serial.println("15th data point");
      for (pixelNum; pixelNum < 22; pixelNum++) {
        strip.setPixelColor(pixelNum, color);
      }
      break;
    case 78:
      Serial.println("78th data point");
      for (pixelNum; pixelNum < 102; pixelNum++) {
        strip.setPixelColor(pixelNum, color);
      }
      break;
    case 79:
      Serial.println("79th data point");
      for (pixelNum; pixelNum < 105; pixelNum++) {
        strip.setPixelColor(pixelNum, color);
      }
      break;
    case 80:
      Serial.println("80th data pointl");
      for (pixelNum; pixelNum < 118; pixelNum++) {
        strip.setPixelColor(pixelNum, red);
      }
      break;
    case 104:
      Serial.println("104th data point");
      for (pixelNum; pixelNum < 153; pixelNum++) {
        strip.setPixelColor(pixelNum, color);
      }
      break;
    case 107:
      Serial.println("107th data point");
      for (pixelNum; pixelNum < 172; pixelNum++) {
        strip.setPixelColor(pixelNum, color);
      }
      break;
  }
  Serial.print("pixelNum after lift: ");
  Serial.println(pixelNum);
}

boolean serverConnect() {
  client.stop();
  if (!client.connect(url, 443)) {
    Serial.println(F("Connection failed"));
    return false;
  }

  Serial.println(F("Connected!"));

  // Send HTTP request
  client.println("GET /status/abasin HTTP/1.1");
  client.println("Host: ski-map.herokuapp.com");
  client.println("Connection: close");
  client.println();
  if (client.println() == 0) {
    Serial.println(F("Failed to send request"));
    return false;
  }

  lastConnectionTime = millis();
  return true;
}

void wifiConnect() {
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    //WiFi.disconnect();
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);

    // output some diagnostic info
    Serial.println(status);
  }
}


void printWifiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  Serial.println(ip);

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  printMacAddress(mac);
}

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type:");
  Serial.println(encryption, HEX);
  Serial.println();
}

void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
    if (i > 0) {
      Serial.print(":");
    }
  }
  Serial.println();
}
