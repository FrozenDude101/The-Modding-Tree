/*
    www.eggradients.com/shades-of-orange
    4-4

    #D82
*/

addLayer("orange", {
    symbol: "O",
    color: "#D82",
    branches() {
        if (inChallenge(this.layer + "Pigment", 12)) return ["blue"]
        return ["red", "yellow"];
    },

    tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " red and yellow pigment to unlock the colour " + this.layer + ".\n(You have " + formatWhole(layers[this.layer + "Pigment"].baseAmount()) + ".)";
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
            embedLayer: "orangePigment",
        },
    },
});

addLayer("orangePigment", {
    color: "#D82",
    resource: "orange pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        let unlockCondition = player.redPigment.unlocked && player.yellowPigment.unlocked;
        let challengeCondition = !(inChallenge("greenPigment", 11) || inChallenge("greenPigment", 12) || inChallenge("purplePigment", 11) || inChallenge("purplePigment", 12));
        return unlockCondition && challengeCondition;
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
            if (player.orangePigment.unlocked) rows.push(1);
            if (hasUpgrade("orangePigment", 13)) rows.push(2);
            if (hasChallenge("orangePigment", 12)) rows.push(3);
            return rows;
        }],
        "challenges",
    ],

    type: "custom",
    row: 1,
    prestigeButtonText() {
        return "Combine red and yellow pigment for " + formatWhole(this.getResetGain()) + " orange pigment.<br>Next at " + format(this.getNextAt()) + " red and yellow pigment.";
    },

    exponent: 0.5,
    baseAmount() {
        return player.redPigment.points.min(player.yellowPigment.points);
    },
    requires() {
        return new Decimal(1000).mul(Decimal.pow(10, player[this.layer].requiresExponent));
    },
    gainMult() {
        let mult = new Decimal(1);

        if (hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));
        if (hasUpgrade(this.layer, 33)) mult = mult.mul(upgradeEffect(this.layer, 33));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },
    getResetGain() {
        if (this.baseAmount().lt(this.requires())) return new Decimal(0);
        return this.baseAmount().div(this.requires()).pow(this.exponent).mul(this.gainMult()).pow(this.gainExp()).mul(1+layers.achievements.calcEffects(this.layer)/100).floor().max(0);
    },
    getNextAt() {
        return this.getResetGain().add(1).div(1+layers.achievements.calcEffects(this.layer)/100).root(this.gainExp()).div(this.gainMult()).root(this.exponent).times(this.requires()).max(this.requires());
    },

    canReset() {
        return this.getResetGain().gte(1);
    },
    doReset(layer) {
        let keep = ALWAYS_KEEP_ON_RESET.slice();
        let keepUpgrades = [];

        switch(layer) {
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
            key: "o",
            description: "O : Combine red and yellow pigment to make orange pigment.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Amber",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Peach",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(2),
        },
        13: {
            title: "Orange Peel",
            description: "Boost blank pigment gain based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(5),
        },

        21: {
            title: "Burnt Orange",
            description: "Multiply orange pigment gain by 2.",

            effect: 2,
            cost: new Decimal(10),
        },
        22: {
            title: "Champagne",
            description: "Boost blank pigment gain based on orange pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player[this.layer].points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Apricot",
            description: "Boost orange pigment gain based on orange pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },

        31: {
            title: "Pastel Orange",
            description: "Keep red and yellow pigment upgrades on orange pigment reset.",

            cost: new Decimal(200),
        },
        32: {
            title: "Neon Orange",
            description: "Boost blue pigment gain based on orange pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player[this.layer].points.add(1).log(100).add(1)
            },
            cost: new Decimal(500),
        },
        33: {
            title: "Tawny",
            description: "Boost orange pigment gain based on blue pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            effect() {
                return player.bluePigment.points.add(1).log(100).add(1);
            },
            cost: new Decimal(1000),
        },
    },

    challenges: {
        rows: 1,
        cols: 2,

        11: {
            name: "Additive",
            challengeDescription: "Only have red, orange, and yellow pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of red and yellow pigment upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked;
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
        12: {
            name: "Complementary",
            challengeDescription: "Only have blue and orange pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of blue and orange pigment upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked;
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
    },
});