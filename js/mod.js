let modInfo = {
	name: "The Colour Tree",
	id: "FD101/TheColourTreeMajor",
	author: "FrozenDude101",
	pointsName: "blank pigment",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "Expanded Gamut",
}

let changelog = `
<h1>Changelog</h1><br>
<br>
<h3>v0.1.1.1 - v0.1.1.6</h3><br>
<br>
Added an outline to big nodes.<br>
Reduced the opacity of all node text.<br>
All displayed points are now floored to hide rounding errors.<br>
Fixed the outline causing tooltips to be impossible to read.<br>
Changed node symbols again to be slightly transparent with a glow.<br>
Fixed challenge achievement 11, 14 tooltip.<br>
Removed debugLayers from the debug screen.<br>
<br>
<h2><u>v0.1.1</u></h2><br>
<br>
<h3>Debug Menu</h3><br>
Reach endgame to unlock the debug menu.<br>
Your saves are kept safe, even if you use the debug options!<br>
<br>
<h3>Milestone Achievements</h3><br>
Increased max achievement level to 40.<br>
Fixed maxed achievements containing undefined.<br>
<br>
<h3>v0.1.0.1 - v0.1.0.3</h3><br>
<br>
Fixed row 1 of blue pigment upgrades visibility relying on yellow pigment.<br>
Fixed secondary upgrades 31 having an incorrect description.<br>
Fixed green pigment being boosted by upgrade 13 instead of upgrade 21.<br>
<br>
<h2 style='color: #D22'><u>v0.1: Full Spectrum</u></h2><br>
<br>
<h3>Primary Pigments</h3><br>
Dye blank pigment to create primary colours.<br>
15 new upgrades.<br>
<br>
<h3>Secondary Pigments</h3><br>
Combine primary pigments to create secondary colours.<br>
9 new upgrades.<br>
2 new challenges.<br>
<br>
<h3>Milestone Achievements</h3><br>
7 milestone achievements added.<br>
Reach goals to obtain permanent +% bonuses to production!<br>
<br>
<h3>Challenge Achievements</h3><br>
10 challenge achievements added.<br>
Reach goals to obtain permanent perks!<br>
<br>
<h3>Statistics</h3><br>
Several different statistics added.<br>
Compare with friends to compete!<br>
<br>
`

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

	const primary = ["redPigment", "yellowPigment", "bluePigment"];
	const secondary = ["orangePigment", "greenPigment", "purplePigment"];
	const shades = ["blackPigment", "whitePigment"];

	let colours = [];
	for (let colour of primary.concat(secondary).concat(shades)) {
		if (tmp[colour].layerShown) colours.push(colour);
	}
	
	for (let colour of colours) {
		if (primary.concat(secondary).includes(colour)) {
			if (hasUpgrade(colour, 11)) gain = gain.add(upgradeEffect(colour, 11));
		}
	}
	if (hasAchievement("challenges", 21)) gain = gain.add(achievementEffect("challenges", 21));
	// Base add.

	for (let colour of colours) {
		if (shades.includes(colour)) {
			if (hasUpgrade(colour, 11)) {
				gain = gain.pow(upgradeEffect(colour, 11));
			}
		}
	}
	// Base exponation.
	
	for (let colour of colours) {
		if (hasUpgrade(colour, 12)) gain = gain.mul(upgradeEffect(colour, 12));
		if (hasUpgrade(colour, 13)) gain = gain.mul(upgradeEffect(colour, 13));
		if (primary.concat(secondary).includes(colour)) {
			if (hasUpgrade(colour, 22)) gain = gain.mul(upgradeEffect(colour, 22));
		}
		if (shades.includes(colour)) {
			if (hasUpgrade(colour, 23)) gain = gain.mul(upgradeEffect(colour, 23));
		}
	}
	// Multiply.
	
	for (let colour of colours) {
		if (primary.includes(colour)) {
			if (hasUpgrade(colour, 51)) gain = gain.pow(upgradeEffect(colour, 51));
		}
	}
	// Exponation.

	gain = gain.mul(tmp.milestones.effect["blankPigment"].div(100).add(1));
	// Achievement bonus.

	return gain;

}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {

	return {
		lifetimeBest: new Decimal(0),
		lifetimeTotal: new Decimal(0),

		stats: {
			firstPrimary: "",
			firstSecondary: "",
			firstShade: "",

			startTick: Date.now(),

			resets: 0,
			upgradesBought: 0,
			challengesCompleted: 0,
		},
		
		hqTree: true,
		forceDebug: false,
	};

}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.orangePigment.points.gte(10000000) && player.greenPigment.points.gte(10000000) && player.purplePigment.points.gte(10000000);
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {

	for (let achievement of player.milestones.achievements.slice()) {
		if (player.milestones.levels[achievement] >= layers.milestones.achievements[achievement].max) continue;
		player.milestones.achievements.splice(player.milestones.achievements.indexOf(achievement), 1);
	}

}