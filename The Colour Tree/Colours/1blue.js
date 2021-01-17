//vscode-fold=1

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
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },

    layerShown() {
        return (tmp[this.layer + "Pigment"].layerShown || player.debugOptions.showAll ? true : "ghost");
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
        return challengeCondition || player.debugOptions.showAll;
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
        ["prestige-button", "", function() {
            return tmp.bluePigment.passiveGeneration < 1 || player.debugOptions.showAll ? {} : {display: "none"};
        }],
        "blank",
        ["upgrades", function() {
            rows = [];
            if (player.bluePigment.unlocked || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("bluePigment", 13) || player.greenPigment.unlocked || player.purplePigment.unlocked || player.debugOptions.showAll) rows.push(2);
            if (hasChallenge("greenPigment", 11) || hasChallenge("purplePigment", 11) || player.debugOptions.showAll) rows.push(3);
            if (hasChallenge("greenPigment", 11) && hasChallenge("purplePigment", 11) || player.debugOptions.showAll) rows.push(4);
            if (hasChallenge("orangePigment", 12) || player.debugOptions.showAll) rows.push(5);
            return rows;
        }],
    ],

    hotkeys: [
        {
            key: "b",
            description: "B : Dye blank pigment blue.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 0,
    prestigeButtonText() {
        return "Dye blank pigment blue for " + formatWhole(tmp[this.layer].getResetGain) + " blue pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " blank pigment.";
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
        return new Decimal(10).mul(Decimal.pow(10, (hasUpgrade(this.layer, 31) ? 0 : player[this.layer].requiresExponent)));
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

        if (tmp.orangePigment.layerShown && hasUpgrade("orangePigment", 32)) mult = mult.mul(upgradeEffect("orangePigment", 32));

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

        switch(layer) {
            case "greenPigment":
                if (hasUpgrade("greenPigment", 31)) keep.push("upgrades");
                if (hasAchievement("challenges", 22)) keepUpgrades = keepUpgrades.concat([31, 33, 43, 53]);
                break;
            case "purplePigment":
                if (hasUpgrade("purplePigment", 31)) keep.push("upgrades");
                if (hasAchievement("challenges", 22)) keepUpgrades = keepUpgrades.concat([31, 33, 43, 53]);
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
            title: "Cobalt Blue",
            description: "Multiply blue pigment gain by 2.",

            effect: 2,
            cost: new Decimal(10),
        },
        22: {
            title: "Baby Blue",
            description: "Boost blank pigment gain based on blue pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
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
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },
        
        31: {
            title: "Midnight Blue",
            description: "Blue pigment acts as if it was bought first.",
            
            cost: new Decimal(20000),
        },
        32: {
            title: "True Blue",
            description: "Boost blue pigment based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
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
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player.redPigment.points.add(player.yellowPigment.points).add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(100000000),
        },
        42: {
            title: "Electric Blue",
            description: "Boost blue pigment gain based on total green and purple pigment.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player.greenPigment.points.add(player.purplePigment.points).add(1).log(10).add(1).log(10).add(1);
            },
            cost: new Decimal(200000000),
        },
        43: {
            title: "Prussian Blue",
            description: "Lose the ability to prestige, but gain an additional 90% of blue pigment gain per second.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 33) || player.debugOptions.showAll;
            },

            effect: 0.9,
            cost: new Decimal(1000000000),
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
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 43) || player.debugOptions.showAll;
            },

            effect: 1,
            cost: new Decimal(1e15),
        },
    },
});