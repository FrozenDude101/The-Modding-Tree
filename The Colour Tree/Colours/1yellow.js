//vscode-fold=1

/*
    www.eggradients.com/shades-of-yellow
    7-5

    #DD2
*/

addLayer("yellow", {
    symbol: "Y",
    color: "#DD2",

    x() {
        let ret = 2.5;
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
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
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
            embedLayer: "yellowPigment",
        },
    },
});
    
addLayer("yellowPigment", {
    color: "#DD2",
    resource: "yellow pigment.",
    row: 0,
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        let challengeCondition = inChallenge("purplePigment", 11) || inChallenge("orangePigment", 12) || inChallenge("greenPigment", 12) || (player.stats.firstPrimary != this.layer && (inChallenge("blackPigment", 12) || inChallenge("whitePigment", 12))) || (player.stats.firstPrimary == this.layer && (inChallenge("blackPigment", 13) || inChallenge("whitePigment", 13)))
        return !challengeCondition || player.debugOptions.showAll;
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
            return (tmp.yellowPigment.passiveGeneration < 1 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        ["blank", "", function() {
            return (tmp.yellowPigment.passiveGeneration != 0 && tmp.yellowPigment.passiveGeneration < 1 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        ["display-text", function() {
                return "You are dying " + format(tmp.yellowPigment.getResetGain.mul(tmp.yellowPigment.passiveGeneration)) + " yellow pigment per second.";
        }, function() {
            return (tmp.yellowPigment.passiveGeneration != 0 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        "blank",
        ["upgrades", function() {
            rows = [];
            if (player.yellowPigment.unlocked || includesAny(player.yellowPigment.upgrades, [11, 12, 13]) || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("yellowPigment", 13) || player.orangePigment.unlocked || player.greenPigment.unlocked || includesAny(player.yellowPigment.upgrades, [21, 22, 23]) || player.debugOptions.showAll) rows.push(2);
            if (hasChallenge("orangePigment", 11) || hasChallenge("greenPigment", 11) || includesAny(player.yellowPigment.upgrades, [31, 32, 33]) || player.debugOptions.showAll) rows.push(3);
            if (hasChallenge("orangePigment", 11) && hasChallenge("greenPigment", 11) || includesAny(player.yellowPigment.upgrades, [41, 42, 43]) || player.debugOptions.showAll) rows.push(4);
            if (hasChallenge("purplePigment", 12) || includesAny(player.yellowPigment.upgrades, [51, 52, 53]) || player.debugOptions.showAll) rows.push(5);
            return rows;
        }],
    ],

    hotkeys: [
        {
            key: "y",
            description: "Y : Dye blank pigment yellow.",
            onPress() {
                if (player[this.layer].unlocked && canReset(this.layer)) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 0,
    prestigeButtonText() {
        return "Dye blank pigment yellow for " + formatWhole(tmp[this.layer].getResetGain) + " yellow pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " blank pigment.";
    },
    passiveGeneration() {
        let gain = 0;

        if (hasUpgrade(this.layer, 33)) gain += upgradeEffect(this.layer, 33);
        if (hasUpgrade(this.layer, 43)) gain += upgradeEffect(this.layer, 43);
        if (hasUpgrade(this.layer, 53)) gain += upgradeEffect(this.layer, 53);

        gain *= player[this.layer].unlocked;

        return gain;
    },

    exponent: 0.5,
    baseAmount() {
        return player.points;
    },
    requires() {
        let multiplier = (hasUpgrade(this.layer, 31) || hasAchievement("challenges", 32) ? 1 : Decimal.pow(10, player[this.layer].requiresExponent));
        return new Decimal(10).mul(multiplier);
    },
    gainMult() {
        let mult = new Decimal(1);
        
        if (player.stats.firstPrimary == this.layer) mult = mult.mul(achievementEffect("challenges", 11));
        mult = mult.mul(tmp.milestones.effect[this.layer].div(100).add(1));

        if (hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));
        if (hasUpgrade(this.layer, 32)) mult = mult.mul(upgradeEffect(this.layer, 32));
        if (hasUpgrade(this.layer, 41)) mult = mult.mul(upgradeEffect(this.layer, 41));
        if (hasUpgrade(this.layer, 42)) mult = mult.mul(upgradeEffect(this.layer, 42));

        if (layerShown("purplePigment") && hasUpgrade("purplePigment", 32)) mult = mult.mul(upgradeEffect("purplePigment", 32));

        if (layerShown("blackPigment")) mult = mult.mul(buyableEffect("blackPigment", 11));
        if (layerShown("whitePigment")) mult = mult.mul(buyableEffect("whitePigment", 11));
        if (layerShown("greyPigment"))  mult = mult.mul(buyableEffect("greyPigment",  11));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);

        if (hasUpgrade(this.layer, 52)) exp = exp.mul(upgradeEffect(this.layer, 52));

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
        return tmp[this.layer].getResetGain.gte(1) && tmp[this.layer].passiveGeneration < 1;
    },
    doReset(layer) {
        let keep = ALWAYS_KEEP_ON_RESET.slice();
        let keepUpgrades = [];

        if (layer == "orangePigment" && hasUpgrade("orangePigment", 31)) keep.push("upgrades");
        if (layer == "greenPigment" && hasUpgrade("greenPigment", 31)) keep.push("upgrades");
        if (layer == "orangePigment" || layer == "greenPigment" && hasAchievement("challenges", 22)) keepUpgrades = merge(keepUpgrades, [31, 33, 43, 53]);

        if (layer == "blackPigment" && hasChallenge("blackPigment", 11)) keep.push("upgrades");
        if (layer == "whitePigment" && hasChallenge("whitePigment", 11)) keep.push("upgrades");

        if (layer.indexOf("Pigment") != -1 && hasAchievement("challenges", 42)) keep = merge(keep, ["challenges", "upgrades"]);
        
        if (["orangePigment", "greenPigment", "blackPigment", "whitePigment", "greyPigment"].includes(layer)) {
            keepUpgrades = filter(player[this.layer].upgrades, keepUpgrades);
            layerDataReset(this.layer, keep);
            if (!keep.includes("upgrades")) player[this.layer].upgrades = keepUpgrades;
        }
    },

    upgrades: {
        rows: 5,
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
            cost: new Decimal(2),
        },
        13: {
            title: "Golden Yellow",
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
            title: "Dandelion",
            description: "Multiply yellow pigment gain by 2.",

            effect: 2,
            cost: new Decimal(10),
        },
        22: {
            title: "Citrine",
            description: "Boost blank pigment gain based on yellow pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(10).add(1);
            },
            cost: new Decimal(25),
        },
        23: {
            title: "Mustard Yellow",
            description: "Boost yellow pigment gain based on yellow pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },
        
        31: {
            title: "Saffron Yellow",
            description: "Yellow pigment acts as if it was dyed first.",

            cost: new Decimal(20000),
        },
        32: {
            title: "Yellow Chartreuse",
            description: "Boost yellow pigment based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player.points.add(1).log(1000).add(1);
            },
            cost: new Decimal(40000),
        },
        33: {
            title: "Jasmine",
            description: "Gain 10% of yellow pigment gain per second.",

            effect: 0.1,
            cost: new Decimal(250000),
        },

        41: {
            title: "School Bus Yellow",
            description: "Boost yellow pigment gain based on total red and blue pigment.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                let base = new Decimal(0);
                if (layerShown("redPigment"))  base = base.add(player.redPigment.points);
                if (layerShown("bluePigment")) base = base.add(player.bluePigment.points);

                return base.add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(100000000),
        },
        42: {
            title: "Sunflower Yellow",
            description: "Boost yellow pigment gain based on total orange and green pigment.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                let base = new Decimal(0);
                if (layerShown("orangePigment")) base = base.add(player.orangePigment.points);
                if (layerShown("greenPigment"))  base = base.add(player.greenPigment.points);

                return base.add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(200000000),
        },
        43: {
            title: "Visitation",
            description: "Lose the ability to dye, but gain an additional 90% of yellow pigment gain per second.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 33) || player.debugOptions.showAll;
            },

            effect: 0.9,
            cost: new Decimal(1000000000),
        },

        51: {
            title: "Marzipan",
            description: "Exponate blank pigment gain by 1.05.",

            effect: 1.05,
            cost: new Decimal(50000),
        },
        52: {
            title: "Laser Lemon",
            description: "Exponate yellow pigment gain by 1.05.",

            effect: 1.05,
            cost: new Decimal(150000),
        },
        53: {
            title: "Energy Yellow",
            description: "Gain an additional 100% of yellow pigment gain per second.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 43) || player.debugOptions.showAll;
            },

            effect: 1,
            cost: new Decimal(1e15),
        },
    },
});