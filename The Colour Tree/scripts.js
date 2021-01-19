//vscode-fold=1

const ALWAYS_KEEP_ON_RESET = [
    "lifetimeBest",
    "lifetimeTotal",
    "requiresExponent",
];

// ---- Formatting ----

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

function formatNth(number) {

    let n = toNumber(number);
    if (number instanceof Decimal && number.neq(n) || formatWhole(n).includes("e")) {
        return "n<sup>th</sup>";
    }

    let prefix;
    switch (n%100) {
        case 11:
        case 12:
        case 13:
            prefix = "th";
            break;
        default:
            switch(n%10) {
                case 1:
                    prefix = "st";
                    break;
                case 2:
                    prefix = "nd";
                    break;
                case 3:
                    prefix = "rd";
                    break;
                default:
                    prefix = "th";
                    break;
    }
    }

    return formatWhole(n) + "<sup>" + prefix + "</sup>";

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
            ret += "<th><b>" + heading + "</b></th>";
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

// ---- Misc ----

function filter(arr1, arr2) {

    let ret = [];
    for(let item of arr1) {
        if (arr2.includes(item)) {
            ret.push(item);
        }
    }
    return ret;

}

function merge(arr1, arr2) {

    let ret = arr1.slice();
    for(let item of arr2) {
        if (!arr1.includes(item)) {
            ret.push(item);
        }
    }
    return ret;

}

// ---- Multi-Layer ----

function calcRequiresExponent(layer, delta=0) {

    let primary =   player.redPigment.unlocked + player.yellowPigment.unlocked + player.bluePigment.unlocked;
    let secondary = player.orangePigment.unlocked + player.greenPigment.unlocked + player.purplePigment.unlocked;
    let shades = player.blackPigment.unlocked + player.whitePigment.unlocked;

    switch(layer) {
        case "redPigment":
        case "yellowPigment":
        case "bluePigment":
            return Math.max(0.5 * (primary+delta) * (primary+delta+1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0);
        case "orangePigment":
        case "greenPigment":
        case "purplePigment":
            return Math.max(0.5 * (primary+delta) * (primary+delta+1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0);
        case "blackPigment":
        case "whitePigment":
            return shades+delta;
        default:
            alert("Invalid layer '" + layer + "' called to calcUnlock.");
    }
}