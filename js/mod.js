let modInfo = {
	name: "The Apple Tree",
	id: "FD101/TheAppleTree",
	author: "FrozenDude101",
	pointsName: "apple",
	discordName: "Friendly Robot Games",
	discordLink: "https://discord.gg/qcXwBYSBr3",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Seedling",
}

let changelog = `
`;

let winText = `
	Congratulations!<br>
	You beat The Apple Tree v1.0!<br>
`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = []

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false;
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	let apples = {};
    for (let i = 0; i < 2; i ++) {
        for (let j = 0; j <= 1; j ++) {
            for (let k = 0; k < 2; k ++) {
                for (let l = 0; l < 3; l ++) {
                    apples["A" + l + "0" + i + j + k] = DEFAULT_APPLE();
                }
                for (let l = 0; l < 2; l ++) {
                    for (let m = 0; m < 3; m ++) {
						apples["A" + m + "0" + i + j + k + l] = DEFAULT_APPLE();
                    }
                }
            }
        }
    }

	return {
		state: {
			current: 0,
			previous: 0,
			time: 0,
		},

		resources: {
			apples: 0,
			wood: 0,
			money: 0,
		},

		toAdd: {},
		flags: {},

		apples: apples,
		fruiting: [],
		appleTime: 0,

		baseApplePrice: 1,
		baseWoodPrice: 5,
	};
}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.resources.money >= 1000;
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}