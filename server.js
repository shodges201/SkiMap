const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/home.html'));
})

app.get('/bromley', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/bromley/bromley.html'));
})



app.get('/status/bromley', (req, res) => {
    let openList;
    let closedList;
    request('https://www.bromley.com/the-mountain/snow-report/?gclid=CjwKCAiAuqHwBRAQEiwAD-zr3Zsnjp-8ANKUpyu_0CnnXRHzdgs6XwJDWK0WnMUM9SxqHczh3CrdjhoCTNwQAvD_BwE', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            
            const openTrails = $('.lift-status-section').children(".lift-status-info").children('.lift-status-icon').children(".icon_snowreport_open").parent().parent().children(".lift-name");
            const closedTrails = $('.lift-status-section').children().children('.icon_snowreport_closed');

            console.log(openTrails[0]);
            //console.log(closedTrails);

            /*openList = listOfTrails(openTrails);
            closedList = listOfTrails(closedTrails);

            console.log(closedList.length + openList.length);


            res.send({
                "open": openList,
                "closed": closedList
            })*/

            // res.send({
            //     "open": openTrails
            // })
        }
    })
})

app.get('/status/abasin', (req, res) => {
    let openList;
    let closedList;
    request('https://www.arapahoebasin.com/snow-conditions/terrain/', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            //const trails = $('.ab-terrain-section').children('.ab-status-sub').children('ab-status').text();
            const openTrails = $('.status_open').parent();
            const closedTrails = $('.status_closed').parent();
            // console.log(closedTrails);
            //console.log(openTrails[1].children[1].data);


            let map = new Map();
            const orderedList = ["Moose Hollow", "North Fork", "Exhibition", "Sundance", "Wrangler", "Tree Chutes 1-8", "North Y Chute", "North Y Chute",
            "South Y Chute", "Corner Chute", "Corner Chute", "Willy's Wide", "North Pole", "Falcon", "Humbug", "Zuma Lift", "Ptarmigan", "Loafer", "Peaceful Valley",
            "The Last Waltz", "Dreamcatcher", "Bighorn", "Bighorn", "Glockenspiel Glade", "Pioneer Willy", "Drummond", "Bald Spot", "Janitors Only", "Christmas Trees",
            "Pali Wog", "Rock Garden", "Turbo", "West Turbo", "Timber Glades", "East Avenue", "Pali Main Street", "Pallavicini", "Pallavicini", "East Woods", 
            "Face Shot Gully", "Thick & Thin", "Bailey Bros.", "Faculty Club", "Jaeger", "Hauk", "Castor", "The Spine", "Pali Face", "1st Alley - David's Run", "2nd Alley",
            "3rd Alley", "4th Alley (West Alley)", "Gauthier", "SG 1", "SG 2", "SG 3", "SG 4", "SG 5", "The Cellar", "Jetta", "Alex", "Digger", "Beaver Bowl", "Marmot", "Davis",
            "Wildcat", "West Wall", "Jamie's Face", "Half Moon Glades", "Cabin Glades", "East Gully", "East Wall - Below the Traverse", "Land of the Giants", "Dragon", "West Gully",
            "Lenawee Parks", "Dercum's Gulch", "Knolls", "Pallavicini Lift", "Molly Hogan Lift", "Black Mountain Express Lift", "Standard", "Bear Trap", "International",
            "13 Cornices", "My Chute", "North Glade", "Grizzly Road", "Powder Keg", "Slalom Slope", "North Chute", "Nose", "South Chute", "Cornice Run", "King Cornice",
            "Challenger Zone", "Lynx Lane", "TB Glades", "Upper Chisholm Trail", "High Noon", "The Gulch", "Ramrod", "Weasel Way", "Lower Chisholm Trail", "Lenawee Mountain Lift",
            "Norway Face", "Norway Mountain Run", "Beavers"];
            listOfTrails(openTrails, 1, map);
            listOfTrails(closedTrails, 0, map);
            console.log(map);
            // console.log("-----------------------");
            let binaryString = "";
            for(let i = 0; i < orderedList.length; i++){
                let bit = map.get(orderedList[i]);
                if(bit === undefined){
                    console.log(`${orderedList[i]} cannot be found in scraped data and returned a value of ${bit}`);
                }
                binaryString += bit;
            }
            console.log(binaryString);
            console.log(binaryString.length);
            return res.send(`${String.fromCharCode(2)}${binaryString}`);
        }
    });
})

function listOfTrails(list, value, map) {
    trailsList = [];
    const notIncluded = ['Open', 'Closed', 'From 5:00 AM until 8:00 AM', 'During Ski Area Operational Hours', 'From Ski Area Closing until 5:00 AM',
        "Lower Mountain Blues", "Lower Mountain Greens", "Terrain Parks", "East Wall", "East Wall Hiking", "Lower Lenawee Zone", "Upper Lenawee Zone", "West Wall Zone", "North Glade Zone", "Pallavinci", "Slalom Slope/Grizzly Road", "Standard/Exhibition Zone", "Steep Gullies & Hike Back Terrain", "East Zuma", "Hike Back Terrain", "MGD Zone", "Montezuma Bowl Blues", "West Zuma", "Beavers Intermediate Terrain", "Lower Beavers Zone", "Upper Beavers Zone", "Molly Hogan", "Molly's Magic Carpet", "Pika Place Carpet", "Pika Place"]
    for (let i = 0; i < list.length; i++) {
        const trail = list[i];
        for (let j = 0; j < trail.children.length; j++) {
            const child = trail.children[j];
            if (child.type === "text") {
                //console.log(child);
                if (child.data.trim() && !notIncluded.includes(child.data.trim()) && child.data.trim() !== trailsList[trailsList.length - 1]) {
                    //console.log(child.data.trim());
                    map.set(child.data.trim(), value);
                }
            }
        }
    }
    return;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})