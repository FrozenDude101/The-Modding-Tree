//vscode-fold=1

// -------- Constants --------

const data = {
    previousRandom: undefined,
    IDS: undefined,
    TREE: undefined,
};

// -------- Multi Layer Functions --------

// ---- Random ----

function rand(previous = data.previousRandom) {

    if (previous == undefined) previous = player.seed;
    let result = (181 * previous + 157) % 256;
    data.previousRandom = result;
    return result;

}

function nRand() {

    return rand()/255;

}

// ---- Other ----

function onLoad() {

    newTree(player.seed);

}

function update(diff) {

    drawTree();

}