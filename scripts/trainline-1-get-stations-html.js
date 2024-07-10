const fetch = require("node-fetch-commonjs")
const { createWriteStream } = require("fs")
const { batchedPromiseAll } = require('batched-promise-all')
const { ensureDir } = require("fs-extra")
const sleep = require("sleep-promise");

ensureDir("../data/trainline/stations")

let links = require("../data/trainline/allStationLinks.json")

const needToRetry = []
const downloadStationPromise = (async (url, index) => {
    const name = url.split("/").pop()

    const res = await fetch(url);
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 600)+300))
    const fileStream = createWriteStream(`../data/trainline/stations/${name}.html`);
    return new Promise((resolve, reject) => {
        if (res.status !== 200) {
            console.log("Big error:", res.status);
            console.log(url)
            reject()
        }

        res.body.pipe(fileStream);
        res.body.on("error", () => { console.log("error:", name); reject() });
        fileStream.on("finish",  () => { console.log("Done :", index); resolve(); });
    });
});
const startingIndex = 3700
links = links.slice(startingIndex);
console.log(links);
/*
(async () => {
    await batchedPromiseAll(
        links,
        (link, index) => downloadStationPromise(link, startingIndex + index),
        4
    )
})();*/


(async () => {
    for (let index = startingIndex; index < links.length; index++) {
        const link = links[index]
        try {
            await downloadStationPromise(link, index)
        } catch (_)
        {
            await sleep(60000);
            index--;
        }

    }
})();


