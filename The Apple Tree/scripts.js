//vscode-fold=1

// -------- Constants --------

const data = {
    IDS: [],
    TREE: {},

    previousRandom: 0,
    transitionTime: 0,
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

}