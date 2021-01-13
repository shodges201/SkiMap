# Ski Map

This is an IOT project created using an Arduino WIFI Rev 2, a Node.js/Express.js API, and WS2812b LEDs strung together to create a reactive ski-resort map that lights up all the trails with either green or red lights depending on whether they are open or closed and lifts with blue or red lights depending on whether they are open or closed. The same information passed to the map can be found in a simple web interface found [here](https://ski-map.herokuapp.com/).

#### -- Project Status: Active

## Project Intro/Objective
The objective of this project was to create a physical map that would have lights for all the trails and lifts, and light up open trails and lifts green or blue for open and red for closed. I thought this would be a cool gift for a family member of mine who lives in Colorado and enjoys skiing.  

![Map Video](https://github.com/shodges201/SkiMap/blob/master/Images/ezgif.com-video-to-gif.gif)

### Technologies
* Node.js
* Express.js
* Cheerio
* Arduino Wifi Rev 2
* Wifi NINA/SPI/Bridge/Ethernet Arduino Libraries for connecting to Wifi and the Web Server
* AdaFruit NeoPixel Arduino Library for controlling LED behavior
* WS2812b LEDs

## Project Description

The LEDs were glued down to a piece of wood cut to the size of the map. The spots to place each LED were measured out on the map and then an LED was glued to that same place on the wooden board. Each WS2812b LED has 6 soldering pins, 2 for power, 2 for ground, 1 for data in, and 1 for data out. The LEDs came in a roll where they were already connected to each other so they could be cut into single LEDs or shorter strings as needed. Receiving them in this format was especially useful for lifts, because it reduced the amount of soldering needed, because long strips could be cut and placed where lifts are without needing to solder 6 wires to each individual LED, instead only having to solder at the first and last LED in the pre-attached strip.

This project was my introduction to the basics of elictrical engineering as there was lots of soldering involved, as well as planning out power requirements to supply ample power, but not burn out any LEDs. This was the biggest challenge, and lots of planning went into this project before any LEDs were soldered or even glued down. 

[Cheerio](https://cheerio.js.org/) was used as a web scraping tool to scrape the website of the ski resort. The Arduino was then used to hit the API route that sent back an ordered binary string with a character at the front of the message signifying that the binary string is starting. I used an ASCII 2 character which seemed fitting because it is supposed to signify the beginning of text according to [http://www.asciitable.com/](http://www.asciitable.com/). The Arduino then receives the data as a byte stream and so I ignored all characters until the ASCII 2 character and then read the 1s and 0s and used the neopixel library to light up the trails and lifts according to the ordered data. The only issue with this was that lifts comprised of more than one LED, so I had to keep track of which lift corresponded to which data point, and light up the number of LEDs that comprised the lift before moving on to the next data point.

## TODO
* Get the map framed


## Contributing Members
* **Scott Hodges shodges@gmail.com**

