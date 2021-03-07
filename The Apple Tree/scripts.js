//vscode-fold=1

// -------- Constants --------

const data = {
    IDS: [],
    TREE: {},

    previousRandom: 0,
    transitionTime: 0,
};

function DEFAULT_APPLE() {
    return {
        state: 0,
        offset: [0, 0],
        time: 0,
        colour: "#5A0",
    };
};

// -------- Multi Layer Functions --------

// ---- Number ----

function rand(previous = data.previousRandom) {

    if (previous == undefined) previous = player.seed;
    let result = (181 * previous + 157) % 256;
    data.previousRandom = result;
    return result;

}

function nRand() {

    return rand()/255;

}

function bRand(chance = 0.5) {

    return nRand() < chance;

}


function approach(num1, num2, percent) {

    return num1 + (num2 - num1) * percent

}

function colourApproach(colour1, colour2, percent) {

    if (colour1.length == 4) {
        colour1 = "#" + colour1[1].repeat(2) + colour1[2].repeat(2) + colour1[3].repeat(2);
    }
    if (colour2.length == 4) {
        colour2 = "#" + colour2[1].repeat(2) + colour2[2].repeat(2) + colour2[3].repeat(2);
    }


    let colour = "#";
    for (let i = 1; i <= 5; i += 2) {
        let hex = Math.floor(approach(parseInt(colour1.substring(i, i+2), 16), parseInt(colour2.substring(i, i+2), 16), percent)).toString(16)
        if (hex.length == 1) hex = "0" + hex;
        colour += hex;
    }

    return colour;

}

// ---- Other ----

function onLoad() {

    newTree(player.seed);

}

function update(diff) {

    drawTree();

    let growthTime = 10000 / tmp["tree-tab"].getGrowthDivider;

    if (player.time > player.state.time + growthTime && player.state.current != 4 && !player.flags.plant) {
        setState(player.state.current + 1); 
    }

    if (player.state.current == 4 && player.time > player.state.time + growthTime && player.time > player.appleTime) {
        let t = (Math.floor(Math.random()*5000) + 5000) / (tmp["tree-tab"].getAppleDivider ** 1.25);
        player.appleTime = player.time + t;
        let leaves = [];
        for (id of data.IDS) {
            if (id[0] == "L" && id.length > 5) leaves.push(id);
        }
        let leafID = leaves[Math.floor(Math.random()*leaves.length)];
        let appleID = "A" + leafID.slice(1);
        if (!player.fruiting.includes(appleID)) {
            player.fruiting.push(appleID);
            player.apples[appleID] = {
                state: 1,
                offset: [
                    Math.floor(Math.random()*60),
                    Math.floor(Math.random()*60),
                ],
                time: player.time,
            };
        }
    }

    let t = player.time / 10000 % 6;
    data.applePrice = player.baseApplePrice * (1 - (t**3 - 9*t**2 + 18*t) / 20) * tmp["tree-tab"].getAppleMultiplier;
    t = player.time / 26000 % 6;
    data.woodPrice = player.baseWoodPrice * (1 - (t**3 - 9*t**2 + 18*t) / 20) * tmp["tree-tab"].getWoodMultiplier;

    player.points = new Decimal(player.resources.apples);

}