/*
    www.eggradients.com/shades-of-blue-color
    3-1

    #22D
*/

addLayer("blue", {
    symbol: "B",
    color: "#22D",

    tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(layers[this.layer + "Pigment"].baseAmount()) + ".)";
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
            embedLayer: "bluePigment",
        },
    },
});
    
addLayer("bluePigment", {
    color: "#22D",
    resource: "blue pigment.",
    row: 0,
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        let challengeCondition = !(inChallenge("orangePigment", 11) || inChallenge("greenPigment", 12) || inChallenge("purplePigment", 12))
        return challengeCondition;
    },

    startData() {
        return {
            points: new Decimal(0),
            unlocked: false,

            requiresExponent: 0,
        };
    },
    requiresExponent() {
        if (!player[this.layer].unlocked) {
            player[this.layer].requiresExponent = calcRequiresExponent(this.layer);
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["upgrades", function() {
            rows = [];
            if (player.yellowPigment.unlocked) rows.push(1);
            if (hasUpgrade("bluePigment", 13) || player.greenPigment.unlocked || player.purplePigment.unlocked) rows.push(2);
            if (hasChallenge("greenPigment", 11) || hasChallenge("purplePigment", 11)) rows.push(3);
            if (hasChallenge("greenPigment", 11) && hasChallenge("purplePigment", 11)) rows.push(4);
            if (hasChallenge("orangePigment", 12)) rows.push(5);
            return rows;
        }],
    ],

    type: "custom",
    row: 0,
    prestigeButtonText() {
        return "Dye blank pigment blue for " + formatWhole(this.getResetGain()) + " blue pigment.<br>Next at " + format(this.getNextAt()) + " blank pigment.";
    },
    passiveGeneration() {
        let gain = 0;

        if (hasUpgrade(this.layer, 33)) gain += upgradeEffect(this.layer, 33);
        if (hasUpgrade(this.layer, 43)) gain += upgradeEffect(this.layer, 43);
        if (hasUpgrade(this.layer, 53)) gain += upgradeEffect(this.layer, 53);

        return gain;
    },

    exponent: 0.5,
    baseAmount() {
        return player.points;
    },
    requires() {
        return new Decimal(10).mul(Decimal.pow(10, player[this.layer].requiresExponent));
    },
    gainMult() {
        let mult = new Decimal(1);

        if (hasUpgrade(this.layer, 13)) mult = mult.mul(upgradeEffect(this.layer, 13));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));
        if (hasUpgrade(this.layer, 32)) mult = mult.mul(upgradeEffect(this.layer, 32));
        if (hasUpgrade(this.layer, 41)) mult = mult.mul(upgradeEffect(this.layer, 41));
        if (hasUpgrade(this.layer, 42)) mult = mult.mul(upgradeEffect(this.layer, 42));
        if (hasUpgrade("orangePigment", 32)) mult = mult.mul(upgradeEffect("orangePigment", 32));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);

        if (hasUpgrade(this.layer, 52)) exp = exp.mul(upgradeEffect(this.layer, 52));

        return exp;
    },
    getResetGain() {
        if (this.baseAmount().lt(this.requires())) return new Decimal(0);
        return this.baseAmount().div(this.requires()).pow(this.exponent).mul(this.gainMult()).pow(this.gainExp()).floor().max(0);
    },
    getNextAt() {
        return this.getResetGain().add(1).root(this.gainExp()).div(this.gainMult()).root(this.exponent).times(this.requires()).max(this.requires());
    },

    canReset() {
        return this.getResetGain().gte(1) && this.passiveGeneration() < 1;
    },
    doReset(layer) {
        let keep = ALWAYS_KEEP_ON_RESET.slice();
        let keepUpgrades = [];

        switch(layer) {
            case "greenPigment":
                if (hasUpgrade("greenPigment", 31)) keep.push("upgrades");
                keepUpgrades = [31, 33, 43, 53];
                break;
            case "purplePigment":
                if (hasUpgrade("purplePigment", 31)) keep.push("upgrades");
                keepUpgrades = [31, 33, 43, 53];
                break;
            default:
                keep = undefined;
                break;
        }

        if (keep != undefined) {
            keepUpgrades = filter(player[this.layer].upgrades, keepUpgrades);
            layerDataReset(this.layer, keep);
            if (!keep.includes("upgrades")) player[this.layer].upgrades = keepUpgrades;
        }
    },

    hotkeys: [
        {
            key: "b",
            description: "B : Dye blank pigment blue.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Turquoise",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Royal Blue",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(2),
        },
        13: {
            title: "Navy Blue",
            description: "Multiply blue pigment gain by 2.",

            effect: 2,
            cost: new Decimal(5),
        },
        
        21: {
            title: "Cobalt Blue",
            description: "Boost blank pigment gain based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(10),
        },
        22: {
            title: "Baby Blue",
            description: "Boost blank pigment gain based on blue pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player[this.layer].points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Tiffany Blue",
            description: "Boost blue pigment gain based on blue pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },
        
        31: {
            title: "Midnight Blue",
            description: "Blue pigment acts as if it was bought first.",

            onPurchase() {
                player[this.layer].requiresExponent = 0;
            },
            cost: new Decimal(20000),
        },
        32: {
            title: "True Blue",
            description: "Boost blue pigment based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.points.add(1).log(1000).add(1);
            },
            cost: new Decimal(40000),
        },
        33: {
            title: "Cerulean Blue",
            description: "Gain 10% of blue pigment gain per second.",

            effect: 0.1,
            cost: new Decimal(250000),
        },

        41: {
            title: "Cornflower Blue",
            description: "Boost blue pigment gain based on total red and yellow pigment.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.redPigment.points.add(player.yellowPigment.points).add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(1000000),
        },
        42: {
            title: "Electric Blue",
            description: "Boost blue pigment gain based on total green and purple pigment.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.greenPigment.points.add(player.purplePigment.points).add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(2000000),
        },
        43: {
            title: "Prussian Blue",
            description: "Lose the ability to prestige, but gain an additional 90% of blue pigment gain per second.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 33);
            },

            effect: 0.9,
            cost: new Decimal(10000000),
        },

        51: {
            title: "Ultramarine",
            description: "Exponate blank pigment gain by 1.05.",

            effect: 1.05,
            cost: new Decimal(50000),
        },
        52: {
            title: "Sapphire Blue",
            description: "Exponate blue pigment gain by 1.05.",

            effect: 1.05,
            cost: new Decimal(150000),
        },
        53: {
            title: "Carolina Blue",
            description: "Gain an additional 100% of blue pigment gain per second.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 43);
            },

            effect: 1,
            cost: new Decimal(100000000),
        },
    },
});