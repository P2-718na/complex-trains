#!/usr/local/bin/node
const { writeJsonSync } = require("fs-extra");

const stationList = require("../data/trainline/stationList.js");

const stations = Object.values(stationList)
    .reduce((acc, stationList) => {
        acc.push(...stationList);
        return acc;
    }, [])

console.log("Total stations in Europe:", stations.length)

const links = stations.map(({href}) =>`https://www.thetrainline.com${href}`)

writeJsonSync("../data/trainline/allStationLinks.json", links);
