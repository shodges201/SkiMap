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

            openList = listOfTrails(openTrails);
            closedList = listOfTrails(closedTrails);

            console.log(closedList.length + openList.length);
            // console.log("-----------------------");

            return res.send({`${String.fromCharCode(2)}01010101`})
            
        }
    });
})

function listOfTrails(list) {
    trailsList = [];
    const notIncluded = ['Open', 'Closed', 'From 5:00 AM until 8:00 AM', 'During Ski Area Operational Hours', 'From Ski Area Closing until 5:00 AM',
        "Lower Mountain Blues", "Lower Mountain Greens", "Terrain Parks", "East Wall", "East Wall Hiking", "Lower Lenawee Zone", "Upper Lenawee Zone", "West Wall Zone", "Challenger Zone", "North Glade Zone", "Pallavinci", "Slalom Slope/Grizzly Road", "Standard/Exhibition Zone", "Steep Gullies & Hike Back Terrain", "East Zuma", "Hike Back Terrain", "MGD Zone", "Montezuma Bowl Blues", "West Zuma", "Beavers Intermediate Terrain", "Lower Beavers Zone", "Upper Beavers Zone", "Molly Hogan", "Molly's Magic Carpet", "Pika Place Carpet", "Pika Place"]
    for (let i = 0; i < list.length; i++) {
        const trail = list[i];
        for (let j = 0; j < trail.children.length; j++) {
            const child = trail.children[j];
            if (child.type === "text") {
                //console.log(child);
                if (child.data.trim() && !notIncluded.includes(child.data.trim()) && child.data.trim() !== trailsList[trailsList.length - 1]) {
                    trailsList.push(child.data.trim());
                }
            }
        }
    }
    return trailsList;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})