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

    x() {
        let ret = 1.5;
        if (player.black.shown || player.white.shown) ret += 0.5;
        return ret;
    },
    y() {
        let ret = 2;
        return ret;
    },
    nodeStyle() {
        return {
            position: "absolute",
            left: "calc((50% - 240px) + " + 120*tmp[this.layer].x + "px)",
            top: "calc(180px + " + 120*tmp[this.layer].y + "px)",
        };
    },

    tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " yellow and blue pigment to unlock the colour " + this.layer + ".\n(You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },

    layerShown() {
        if (tmp[this.layer]) player[this.layer].shown = true;
        return layerShown(this.layer + "Pigment") || player.debugOptions.showAll;
    },  

    startData() {
        return {
            unlocked: false,
        };
    },
    unlocked() {
        player[this.layer].unlocked = player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment") || player.debugOptions.showAll;
    },

    tabFormat: {
        Pigment: {
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
        let challengeCondition = inChallenge("orangePigment") || inChallenge("purplePigment") || inChallenge("blackPigment", 11) || inChallenge("whitePigment", 11) || (player.stats.firstSecondary != this.layer && (inChallenge("blackPigment", 12) || inChallenge("whitePigment", 12))) || (player.stats.firstSecondary == this.layer && (inChallenge("blackPigment", 13) || inChallenge("whitePigment", 13)))
        return unlockCondition && !challengeCondition || player.debugOptions.showAll;
    },

    startData() {
        return {
            points: new Decimal(0),
            lifetimeBest: new Decimal(0),
            lifetimeTotal: new Decimal(0),
            
            unlocked: false,
            requiresExponent: 0,
            resets: 0,
        };
    },
    requiresExponent() {
        if (!player[this.layer].unlocked) {
            player[this.layer].requiresExponent = calcRequiresExponent(this.layer);
        }
    },

    tabFormat: [
        "main-display",
        ["prestige-button", "", function() {
            return (tmp.greenPigment.passiveGeneration < 0.5 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        ["display-text", function() {
                return "You are dying " + format(tmp.greenPigment.getResetGain.mul(tmp.greenPigment.passiveGeneration)) + " green pigment per second.";
        }, function() {
            return (tmp.greenPigment.passiveGeneration != 0 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        "blank",
        ["upgrades", function() {
            rows = [];
            if (player.greenPigment.unlocked || includesAny(player.greenPigment.upgrades, [11, 12, 13]) || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("greenPigment", 13) || hasChallenge("greenPigment", 12) || includesAny(player.greenPigment.upgrades, [21, 22, 23]) || player.debugOptions.showAll) rows.push(2);
            if (hasChallenge("greenPigment", 12) || includesAny(player.greenPigment.upgrades, [31, 32, 33]) || player.debugOptions.showAll) rows.push(3);
            return rows;
        }],
        "challenges",
        "blank",
    ],

    hotkeys: [
        {
            key: "g",
            description: "G : Combine yellow and blue pigment to make green pigment.",
            onPress() {
                if (player[this.layer].unlocked && canReset(this.layer)) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 1,
    prestigeButtonText() {
        return "Combine yellow and blue pigment for " + formatWhole(tmp[this.layer].getResetGain) + " green pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " yellow and blue pigment.";
    },
    passiveGeneration() {
        let gain = 0;

        if (layerShown("blackPigment") && hasUpgrade("blackPigment", 22)) gain += upgradeEffect("blackPigment", 22);
        if (layerShown("whitePigment") && hasUpgrade("whitePigment", 22)) gain += upgradeEffect("whitePigment", 22);

        gain *= player[this.layer].unlocked;

        return gain;
    },

    exponent: 0.5,
    baseAmount() {
        if (hasAchievement("challenges", 24)) return player.bluePigment.points.add(player.yellowPigment.points);
        return player.bluePigment.points.min(player.yellowPigment.points);
    },
    requires() {
        let multiplier = (hasAchievement("challenges", 32) ? 1 : Decimal.pow(10, player[this.layer].requiresExponent));
        return new Decimal(1000).mul(multiplier);
    },
    gainMult() {
        let mult = new Decimal(1);
        
        if (player.stats.firstSecondary == this.layer) mult = mult.mul(achievementEffect("challenges", 14));
        mult = mult.mul(tmp.milestones.effect[this.layer].div(100).add(1));

        if (hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));
        if (hasUpgrade(this.layer, 33)) mult = mult.mul(upgradeEffect(this.layer, 33));

        if (layerShown("blackPigment")) mult = mult.mul(buyableEffect("blackPigment", 11));
        if (layerShown("whitePigment")) mult = mult.mul(buyableEffect("whitePigment", 11));
        if (layerShown("greyPigment"))  mult = mult.mul(buyableEffect("greyPigment",  11));

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
        return tmp[this.layer].getResetGain.gte(1) && tmp[this.layer].passiveGeneration < 0.5;
    },
    doReset(layer) {
        let keep = ALWAYS_KEEP_ON_RESET.slice();
        let keepUpgrades = [];
        let forceUpgrades = [];

        if (layer == "blackPigment" && hasChallenge("blackPigment", 11)) {
            keep.push("challenges");
            forceUpgrades.push("31");
        }
        if (layer == "whitePigment" && hasChallenge("whitePigment", 11)) { 
            keep.push("challenges");
            forceUpgrades.push("31");
        }
        if (layer == "blackPigment" && hasChallenge("blackPigment", 12)) keep.push("upgrades");
        if (layer == "whitePigment" && hasChallenge("whitePigment", 12)) keep.push("upgrades");
        if (layer == "blackPigment" && hasChallenge("blackPigment", 13)) keep.push("upgrades");
        if (layer == "whitePigment" && hasChallenge("whitePigment", 13)) keep.push("upgrades");

        if (layer.indexOf("Pigment") != -1 && hasAchievement("challenges", 42)) keep = merge(keep, ["challenges", "upgrades"]);

        if (["blackPigment", "whitePigment", "greyPigment"].includes(layer)) {
            keepUpgrades = merge(filter(player[this.layer].upgrades, keepUpgrades), forceUpgrades);
            layerDataReset(this.layer, keep);
            if (!keep.includes("upgrades")) player[this.layer].upgrades = keepUpgrades;
        }
    },

    upgrades: {
        rows: 3,
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
            description: "Keep yellow and blue pigment upgrades when dying green pigment.",

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
                let base = new Decimal(0);
                if (layerShown("redPigment")) base = base.add(player.redPigment.points);

                return base.add(1).log(100).add(1);
            },
            cost: new Decimal(1000),
        },
    },

    challenges: {
        rows: 1,
        cols: 2,

        11: {
            name: "Subtractive",
            challengeDescription: "Only have blue, green, and yellow pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of yellow and blue pigment upgrades.",

            unlocked() {
                let unlockCondition = player[this.layer].unlocked;
                return unlockCondition || player.debugOptions.showAll;
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
                let unlockCondition = player[this.layer].unlocked;
                return unlockCondition || player.debugOptions.showAll;
            },


            canComplete() {
                return player.points.gte(250000);
            },
        },
    },
})