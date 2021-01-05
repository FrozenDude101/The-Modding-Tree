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

function pigmentsUnlocked() {

    return -3 + player.redPigment.unlocked + player.orangePigment.unlocked + player.yellowPigment.unlocked + player.greenPigment.unlocked + player.bluePigment.unlocked + player.purplePigment.unlocked;

}