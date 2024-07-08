const { readdirSync, readFileSync, appendFileSync, writeFileSync } = require("fs-extra");

const { parse } = require('node-html-parser');

const trains = readdirSync("data/trains");


frecce = trains.filter(train => {
	const trainFile = `data/trains/${train}`;

	const root = parse(readFileSync(trainFile));

	/*console.log("__",
		root.querySelectorAll("strong")
		.forEach(e => console.log(e.innerText)))
	,"__"*/

	return root
		.querySelector('h1')
		.innerText
		.split(" ")
		[0]
			===
		"FR"

})

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
		
	