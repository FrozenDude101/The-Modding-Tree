//vscode-fold=1

// -------- Constants --------

// -------- Multi Layer Functions --------

// ---- Other ----

function approach(num1, num2, percent) {

    return num1 - (num1 - num2) * percent;

}

function colourApproach(colour1, colour2, percent) {

    let ret = "#";
    for (let i = 1; i <= 3; i ++) {
        let colour = Math.floor(approach(parseInt(colour1[i].repeat(2), 16), parseInt(colour2[i].repeat(2), 16), percent)).toString(16)
        if (colour.length == 1) colour = "0" + colour;
        ret += colour;
    }

    return ret;

}

function update(diff) {

    drawTree();

}