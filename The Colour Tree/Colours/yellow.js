// www.eggradients.com/shades-of-yellow
// 4-3

addLayer("yellow", {
    symbol: "Y",
    color: "#DD2",

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
            embedLayer: "yellowPigment",
        },
    },
});
    
addLayer("yellowPigment", {
    color: "#DD2",
    resource: "yellow pigment.",
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

        if (hasUpgrade("yellowPigment", 13)) mult = mult.mul(upgradeEffect("yellowPigment", 13));
        if (hasUpgrade("yellowPigment", 23)) mult = mult.mul(upgradeEffect("yellowPigment", 23));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },

    hotkeys: [
        {
            key: "y",
            description: "Y : Dye blank pigment yellow.",
            onPress() {
                if (player.yellowPigment.unlocked) doReset("yellowPigment");
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Lemon Yellow",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Canary Yellow",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Golden Yellow",
            description: "Multiply yellow pigment gain by 2.",

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Dandelion Yellow",
            description: "Boost blank pigment gain based on blank pigment amount.",

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(10),
        },
        22: {
            title: "Citrine Yellow",
            description: "Boost blank pigment gain based on yellow pigment amount.",

            effect() {
                return player.yellowPigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Mustard Yellow",
            description: "Boost yellow pigment gain based on yellow pigment amount.",

            effect() {
                return player.yellowPigment.points.add(1).log(10).add(1);
            },
            cost: new Decimal(50),
        },
    },
});