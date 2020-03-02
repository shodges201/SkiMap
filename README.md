# Ski Map

This is an IOT project created using an Arduino WIFI Rev 2, a Node.js/Express.js API, and WS2812b LEDs strung together to create a reactive ski-resort map that lights up all the trails with either green or red lights depending on whether they are open or closed and lifts with blue or red lights depending on whether they are open or closed.

#### -- Project Status: Active

## Project Intro/Objective
The objective of this project was to create a physical map that would have lights for all the trails and lifts, and light up open trails and lifts green or blue for open and red for closed. I thought this would be a cool gift for a family member of mine who lives in Colorado and enjoys skiing. 

### Technologies
* Node.js
* Express.js
* Cheerio
* Arduino Wifi Rev 2
* Wifi NINA/SPI/Bridge/Ethernet Arduino Libraries for connecting to Wifi and the Web Server
* AdaFruit NeoPixel Arduino Library for controlling LED behavior
* WS2812b LEDs

## Project Description

The LEDs were glued down to a piece of wood cut to the size of the map. Each WS2812b LED has 6 soldering pins, 4 for power/ground, 1 for data in and 1 for data out.

This project was my introduction to the basics of elictrical engineering as there was lots of soldering involved, as well as planning out power requirements to supply ample power, but not burn out any LEDs. This was the biggest challenge, and lots of planning went into this project before any LEDs were soldered or even glued down. I used [cheerio](https://cheerio.js.org/) as a web scraping tool to scrape the website of the ski resort, and used the Arduino to get the trail/lift data from the Node server and then used this data to light up the LEDs accordingly.


## Contributing Members
* **Scott Hodges shodges@gmail.com**

