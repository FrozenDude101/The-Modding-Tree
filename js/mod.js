let modInfo = {
	name: "The Colour Tree",
	id: "FD101/TheColourTree",
	author: "FrozenDude101",
	pointsName: "blank pigment",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = []

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0);


	let gain = new Decimal(1);

	const primary = ["red", "yellow", "blue"];
	const secondary = ["orange", "green", "purple"];

	let colours = [];
	for (let colour of primary.concat(secondary)) {
		if (layers[colour+"Pigment"].layerShown()) colours.push(colour);
	}

	// Base add.
	for (let colour of colours) {
		if (hasUpgrade(colour+"Pigment", 11)) gain = gain.add(upgradeEffect(colour+"Pigment", 11));
	}

	// Multiply.
	for (let colour of colours) {
		if (hasUpgrade(colour+"Pigment", 12)) gain = gain.mul(upgradeEffect(colour+"Pigment", 12));
		if (hasUpgrade(colour+"Pigment", 13)) gain = gain.mul(upgradeEffect(colour+"Pigment", 13));
		if (hasUpgrade(colour+"Pigment", 22)) gain = gain.mul(upgradeEffect(colour+"Pigment", 22));
	}

	// Exponation.
	for (let colour of colours) {
		if (primary.includes(colour)) {
			if (hasUpgrade(colour+"Pigment", 51)) gain = gain.pow(upgradeEffect(colour+"Pigment", 51));
		}
	}

	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}