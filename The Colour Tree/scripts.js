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

function calcRequiresExponent(layer, delta=0) {

    let primary =   player.redPigment.unlocked + player.yellowPigment.unlocked + player.bluePigment.unlocked;
    let secondary = player.orangePigment.unlocked + player.greenPigment.unlocked + player.purplePigment.unlocked;

    if (["red", "yellow", "blue"].includes(layer)) {
        return Math.max(0.5 * (primary+delta) * (primary+delta+1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0)
    }
    if (["orange", "green", "purple"].includes(layer)) {
        return Math.max(0.5 * (primary+delta-2) * (primary+delta-1) + 0.5 * (secondary+delta) * (secondary+delta+1), 0)
    }
    alert("Invalid layer '" + layer + "' called to calcUnlock.");
    return 0;

}