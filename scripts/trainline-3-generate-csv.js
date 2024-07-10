const fetch = require("node-fetch-commonjs")
const { createWriteStream } = require("fs")

const { batchedPromiseAll } = require('batched-promise-all')
const { ensureDirSync, readdirSync, readFileSync, writeJsonSync, appendFileSync} = require("fs-extra")

let cities = readdirSync("../data/trainline/cities")

cities.forEach(async fileName => {
    const cityData = require(`../data/trainline/cities/${fileName}`)

    const { origin : { name : originName, geoCoordinate: { latitude : originLatitude, longitude : originLongitude } },  topJourneysList } = cityData;

    if (!topJourneysList) {
        console.error(originName)
        return;
    }

    topJourneysList.forEach(({ station : { name, isCity, geoCoordinate: { latitude, longitude } }, shortestDuration, numberOfTrains }) => {

        if (!isCity) {
            return;
        }

        const result = /P((?<d>.)D)?T((?<h>.*)H)?((?<m>.*)M)?/.exec(shortestDuration)

        if (!result) {
            console.error(shortestDuration)
            return
        }

        const dataToPrint = [originName, name,  (+result.groups.d || 0)*60*24 + (+result.groups.h || 0)*60 + (+result.groups.m || 0), numberOfTrains, originLatitude, originLongitude, latitude, longitude];

        console.log(dataToPrint.join(", "))
    })
})
