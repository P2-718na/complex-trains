const fetch = require("node-fetch-commonjs")
const { createWriteStream } = require("fs")
const { batchedPromiseAll } = require('batched-promise-all')
const { ensureDir } = require("fs-extra")

ensureDir("../data/trainline/stations")

let links = require("../data/trainline/allStationLinks.json")

const needToRetry = []
const downloadStationPromise = (async (url, index) => {
    const name = url.split("/").pop()
    const res = await fetch(url);

    const fileStream = createWriteStream(`../data/trainline/stations/${name}.html`);
    return new Promise((resolve, reject) => {
        if (res.status !== 200) {
            console.log("Big error:", res.status);
            reject()
        }

        res.body.pipe(fileStream);
        res.body.on("error", () => { console.log("error:", name); needToRetry.push([url, index]); resolve() });
        fileStream.on("finish",  () => { console.log("Done :", index); resolve(); });
    });
});

//links = links.slice(18000);
console.log(links);

(async () => {
    await batchedPromiseAll(
        links,
        (link, index) => downloadStationPromise(link, index),
        16
    )
})();

/*
writeFileSync("data/links.csv", "");
const links = []
frecce.forEach(train => {
    const trainFile = `data/trains/${train}`;

    const root = parse(readFileSync(trainFile));

    console.log(root
        .querySelector('h1')
        .innerText
    )


    root
        .querySelectorAll('h2')
        .map(e => e.innerText)
        .forEach((e, i, arr) => {
            if (typeof arr[i+1] === "undefined") {
                return
            }

            const startNode = e;
            const endNode = arr[i+1];

            const re = new RegExp(`(${startNode})(.*)(?<startTime>[0-9][0-9]:[0-9][0-9])(.*)(${endNode})(.*?)(?<endTime>[0-9][0-9]:[0-9][0-9])`, "gms");
            const regexResult = re.exec(readFileSync(trainFile));

            //console.log(regexResult)

            if (!regexResult) {
                console.error("This should not happen")
                return;
            }

            const { startTime, endTime } = regexResult.groups

            const minuteDiff = parseInt(endTime.split(":")[1]) - parseInt(startTime.split(":")[1])
            let hourDiff = parseInt(endTime.split(":")[0]) - parseInt(startTime.split(":")[0]);
            if (hourDiff < 0) {
                hourDiff += 24
            }

            //console.log(startTime, endTime, hourDiff,  minuteDiff)
            links[`${startNode}, ${endNode}`] = hourDiff * 60 + minuteDiff;
        })

})
Object
    .entries(links)
    .forEach(([name, weight]) => {
        appendFileSync("data/links.csv", `${name}, ${weight}\n`)
    })
*/
