//vscode-fold=1

const ALWAYS_KEEP_ON_RESET = [
    "lifetimeBest",
    "lifetimeTotal",
    "requiresExponent",
]

/*
    Formatting functions.
*/

function formatNumeral(number) {

    let numerals = {
        M : 1000,
        CM:  900,
        D :  500,
        CD:  400,
        C :  100,
        XC:   90,
        L :   50,
        XL:   40,
        X :   10,
        IX:    9,
        V :    5,
        IV:    4,
        I :    1,
    };
    let ret = "";
    for (let numeral in numerals) {
        ret += numeral.repeat(number/numerals[numeral]);
        number %= numerals[numeral];
    }
    return ret;

}

function formatTable(data, {
    caption = null,
    headings = null,
} = {}) {

    let ret = "<table class=formattedTable>";

    if (caption) {
        ret += "<caption>" + caption + "</caption>";
    }

    if (headings) {
        ret += "<tr>";
        for (let heading of headings) {
            ret += "<th>" + heading + "</th>";
        }
        ret += "</tr>";
    }

    let dataAdded = false;
    if (typeof data == "object") {
        for (let lineData in data) {
            if (data[lineData] instanceof Array) {
                let line = "<tr><td>" + lineData + "</td>";
                for (let item of data[lineData]) {
                    line += "<td>" + item + "</td>";
                }
                line += "</tr>";
                ret += line;
            } else {
                ret += "<tr><td>" + lineData + "</td><td>" + data[lineData] + "</td></tr>";
            }
            dataAdded = true;
        }
    }

    ret += "</table>";
    if (!dataAdded) ret = "";

    return ret;

}

/*
    Misc functions.
*/

function filter(arr1, arr2) {

    let ret = [];
    for(let item of arr1) {
        if (arr2.includes(item)) {
            ret.push(item);
        }
    }
    return ret;

}

/*
    Multiple layer functions.
*/

function calcRequiresExponent(layer, delta=0) {

    let primary =   player.redPigment.unlocked + player.yellowPigment.unlocked + player.bluePigment.unlocked;
    let secondary = player.orangePigment.unlocked + player.greenPigment.unlocked + player.purplePigment.unlocked;

    if (["redPigment", "yellowPigment", "bluePigment"].includes(layer)) {
        return Math.max(0.5 * (primary+delta) * (primary+delta+1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0)
    }
    if (["orangePigment", "greenPigment", "purplePigment"].includes(layer)) {
        return Math.max(0.5 * (primary+delta-2) * (primary+delta-1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0)
    }
    alert("Invalid layer '" + layer + "' called to calcUnlock.");
    return 0;

}