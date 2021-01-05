// www.eggradients.com/shades-of-blue-color
// 3-1

addLayer("blue", {
    symbol: "B",
    color: "#22D",

    tooltip() {
        return "You have " + player[this.layer + "Pigment"].points + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(player.points) + ".)";
    },

    layerShown() {
        return (layers[this.layer + "Pigment"].layerShown() ? true : "ghost");
    },

    startData() {
        return {
            unlocked: false,
        };
    },    
    unlocked() {
        player[this.layer].unlocked = player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment");
    },

    tabFormat: {
        "Pigment": {
            embedLayer: "bluePigment",
        },
    },
});
    
addLayer("bluePigment", {
    color: "#22D",
    resource: "blue pigment.",
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

        if (hasUpgrade("bluePigment", 13)) mult = mult.mul(upgradeEffect("bluePigment", 13));
        if (hasUpgrade("bluePigment", 23)) mult = mult.mul(upgradeEffect("bluePigment", 23));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },

    hotkeys: [
        {
            key: "b",
            description: "B : Dye blank pigment blue.",
            onPress() {
                if (player.bluePigment.unlocked) doReset("bluePigment");
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Royal Blue",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Navy Blue",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Cobalt Blue",
            description: "Multiply blue pigment gain by 2.",

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Baby Blue",
            description: "Boost blank pigment gain based on blank pigment amount.",

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(10),
        },
        22: {
            title: "Tiffany Blue",
            description: "Boost blank pigment gain based on blue pigment amount.",

            effect() {
                return player.bluePigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Midnight Blue",
            description: "Boost blue pigment gain based on blue pigment amount.",

            effect() {
                return player.bluePigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(50),
        },
    },
});