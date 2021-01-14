//vscode-fold=1

/*
    www.eggradients.com/shades-of-green
    4-2

    #2D2
*/

addLayer("green", {
    symbol: "G",
    color: "#2D2",
    branches() {
        if (inChallenge(this.layer + "Pigment", 12)) return ["red"]
        return ["yellow", "blue"];
    },

    tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " yellow and blue pigment to unlock the colour " + this.layer + ".\n(You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },

    layerShown() {
        return (tmp[this.layer + "Pigment"].layerShown ? true : "ghost");
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
            embedLayer: "greenPigment",
        },
    },
});

addLayer("greenPigment", {
    color: "#2D2",
    resource: "green pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        let unlockCondition = player.yellowPigment.unlocked && player.bluePigment.unlocked;
        let challengeCondition = !(inChallenge("orangePigment", 11) || inChallenge("orangePigment", 12) || inChallenge("purplePigment", 11) || inChallenge("purplePigment", 12));
        return unlockCondition && challengeCondition;
    },

    startData() {
        return {
            points: new Decimal(0),
            lifetimeBest: new Decimal(0),
            lifetimeTotal: new Decimal(0),
            
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
            if (player.greenPigment.unlocked) rows.push(1);
            if (hasUpgrade("greenPigment", 13) || hasChallenge("greenPigment", 12)) rows.push(2);
            if (hasChallenge("greenPigment", 12)) rows.push(3);
            return rows;
        }],
        "challenges",
    ],

    type: "custom",
    row: 1,
    prestigeButtonText() {
        return "Combine yellow and blue pigment for " + formatWhole(tmp[this.layer].getResetGain) + " green pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " yellow and blue pigment.";
    },

    exponent: 0.5,
    baseAmount() {
        if (hasAchievement("challenges", 24)) return player.bluePigment.points.add(player.yellowPigment.points);
        return player.bluePigment.points.min(player.yellowPigment.points);
    },
    requires() {
        return new Decimal(1000).mul(Decimal.pow(10, player[this.layer].requiresExponent));
    },
    gainMult() {
        let mult = new Decimal(1);
        
        if (player.stats.firstSecondary == this.layer) mult = mult.mul(achievementEffect("challenges", 14));
        mult = mult.mul(1+tmp.milestones.effect[this.layer]/100);

        if (hasUpgrade(this.layer, 13)) mult = mult.mul(upgradeEffect(this.layer, 13));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));
        if (hasUpgrade(this.layer, 33)) mult = mult.mul(upgradeEffect(this.layer, 33));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },
    getResetGain() {
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return new Decimal(0);
        return tmp[this.layer].baseAmount.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent).mul(tmp[this.layer].gainMult).pow(tmp[this.layer].gainExp).floor().max(0);
    },
    getNextAt() {
        return tmp[this.layer].getResetGain.add(1).root(tmp[this.layer].gainExp).div(tmp[this.layer].gainMult).root(tmp[this.layer].exponent).times(tmp[this.layer].requires).max(tmp[this.layer].requires);
    },

    canReset() {
        return tmp[this.layer].getResetGain.gte(1);
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
            key: "g",
            description: "G : Combine yellow and blue pigment to make green pigment.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Chartreuse",
            description: "Add 1 to base blank pigment gain.",

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Kelly Green",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(2),
        },
        13: {
            title: "Forest Green",
            description: "Boost blank pigment gain based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(5),
        },

        21: {
            title: "Lime Green",
            description: "Multiply green pigment gain by 2.",

            effect: 2,
            cost: new Decimal(10),
        },
        22: {
            title: "Hunter Green",
            description: "Boost blank pigment gain based on green pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Neon Green",
            description: "Boost green pigment gain based on green pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },
        
        31: {
            title: "Pastel Green",
            description: "Keep yellow and blue pigment upgrades on green pigment reset.",

            cost: new Decimal(200),
        },
        32: {
            title: "Mint",
            description: "Boost red pigment gain based on green pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(100).add(1)
            },
            cost: new Decimal(500),
        },
        33: {
            title: "Spring Green",
            description: "Boost green pigment gain based on red pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player.yellowPigment.points.add(1).log(100).add(1);
            },
            cost: new Decimal(1000),
        },
    },

    challenges: {
        rows: 1,
        cols: 2,

        11: {
            name: "Additive",
            challengeDescription: "Only have blue, green, and yellow pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of yellow and blue pigment upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked;
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
        12: {
            name: "Complementary",
            challengeDescription: "Only have red and green pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of red and green pigment upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked;
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
    },
})