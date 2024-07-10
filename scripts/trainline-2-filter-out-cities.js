const fetch = require("node-fetch-commonjs")
const { createWriteStream } = require("fs")

const { batchedPromiseAll } = require('batched-promise-all')
const { ensureDirSync, readdirSync, readFileSync, writeJsonSync, appendFileSync, removeSync } = require("fs-extra")

removeSync("../data/trainline/cities")
removeSync("../data/trainline/errors.txt")
ensureDirSync("../data/trainline/cities")

let stations = readdirSync("../data/trainline/stations")

stations.forEach(async fileName => {
    const html = await readFileSync(`../data/trainline/stations/${fileName}`)
    const re = /^.*var __STATE__ = (\{.*\}).*$/m
    const result = re.exec(html)
    let state;

    try {
        state = JSON.parse(result[1])
    } catch (_) {
        appendFileSync("../data/trainline/errors.txt", `${fileName}\n`)
        console.error("Error:", fileName)
        return;
    }

    if (!state.origin?.isCity) {
        return;
    }

    writeJsonSync(`../data/trainline/cities/${fileName}.json`, state)
})
