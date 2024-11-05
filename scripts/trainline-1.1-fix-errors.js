const fetch = require("node-fetch-commonjs")
const { createWriteStream, readdirSync } = require("fs")
const { batchedPromiseAll } = require('batched-promise-all')
const { ensureDir } = require("fs-extra")
const sleep = require("sleep-promise");

ensureDir("../data/trainline/stations")
const alreadyDownloaded = readdirSync("../data/trainline/stations")
    .map(e => e.split(".")[0]);

let links = require("../data/trainline/allStationLinks.json")

console.log(alreadyDownloaded.length, "cities already downloaded out of: ", links.length);

const downloadStationPromise = (async (url) => {
    const name = url.split("/").pop()

    const res = await fetch(url);
    const fileStream = createWriteStream(`../data/trainline/stations/${name}.html`);
    return new Promise((resolve, reject) => {
        if (res.status !== 200) {
            console.log("Big error:", res.status);
            console.log(url)
            reject()
        }

        res.body.pipe(fileStream);
        res.body.on("error", () => { console.log("error:", url); reject() });
        resolve();
    });
});
// This function takes two arrays of strings and return the non-duplicate strings, by chatgpt
const findUniqueStrings = (array1, array2) => {
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const uniqueInArray1 = array1.filter(str => !set2.has(str));
    const uniqueInArray2 = array2.filter(str => !set1.has(str));

    return [...uniqueInArray1, ...uniqueInArray2];
}

const allStationNames = links.map(e => {const arr = e.split("/"); return arr[arr.length - 1];});
const needToRetry = findUniqueStrings(alreadyDownloaded, allStationNames);

console.log("Need to retry:", needToRetry.length);
console.log(needToRetry.length, links.length - alreadyDownloaded.length); // fixme why the fuck does this happen idk idc


/*
(async () => {
    await batchedPromiseAll(
        links,
        (link, index) => downloadStationPromise(link, startingIndex + index),
        4
    )
})();*/

(async () => {
    for (let link of needToRetry) {
        console.log(link)
        try {
            await downloadStationPromise("https://www.thetrainline.com/en/stations/"+link)
            await sleep(300)
        } catch (_)
        {
            console.log("error", link)
        }
    }
})();


