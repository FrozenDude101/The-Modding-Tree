// www.eggradients.com/shades-of-red
// 6-1

addLayer("red", {
    symbol: "R",
    color: "#D22",

    tooltip() {
        return "You have " + player[this.layer + "Pigment"].points + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(player.points) + ".)";
    },

    layerShown() {
        return (layers[this.layer + "Pigment"].layerShown() ? true : "ghost");
    },    
    unlocked() {
        player[this.layer].unlocked = player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment");
    },

    startData() {
        return {
            unlocked: false,
        };
    },

    tabFormat: {
        "Pigment": {
            embedLayer: "redPigment",
        },
    },
});
    
addLayer("redPigment", {
    color: "#D22",
    resource: "red pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        return true;
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        };
    },

    unlockOrder() {
        if (!player[this.layer].unlocked) {
            player[this.layer].unlockOrder = pigmentsUnlocked();
        }
    },

    type: "normal",
    exponent: 0.5,
    baseResource: "blank pigment.",
    baseAmount() {
        return player.points;
    },

    requires() {
        return new Decimal(10).pow(Decimal.pow(2, player[this.layer].unlockOrder));
    },
    gainMult() {
        let mult = new Decimal(1);

        if (hasUpgrade("redPigment", 13)) mult = mult.mul(upgradeEffect("redPigment", 13));
        if (hasUpgrade("redPigment", 23)) mult = mult.mul(upgradeEffect("redPigment", 23));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },

    hotkeys: [
        {
            key: "r",
            description: "R : Dye blank pigment red.",
            onPress() {
                if (player.redPigment.unlocked) doReset("redPigment");
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Maroon",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Burgundy",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Auburn",
            description: "Multiply red pigment gain by 2.",

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Blood Red",
            description: "Boost blank pigment gain based on blank pigment amount.",

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(10),
        },
        22: {
            title: "Candy Apple Red",
            description: "Boost blank pigment gain based on red pigment amount.",

            effect() {
                return player.redPigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Alizarin Crimson",
            description: "Boost red pigment gain based on red pigment amount.",

            effect() {
                return player.redPigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(50),
        },
    },
});