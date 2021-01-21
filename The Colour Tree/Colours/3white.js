//vscode-fold=1

/*
    www.eggradients.com/shades-of-white
    4-2

    #DDD
*/

addLayer("white", {
    symbol: "W",
    color: "#DDD",

    x() {
        let ret = 0;
        return ret;
    },
    y() {
        let ret = 0;
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
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " coloured pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },

    layerShown() {
        if (tmp[this.layer]) player[this.layer].shown = true;
        return tmp[this.layer + "Pigment"].layerShown || player.debugOptions.showAll;
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
            embedLayer: "whitePigment",
        },
    },
});

addLayer("whitePigment", {
    color: "#DDD",
    resource: "white pigment",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    effectDescription() {
        return "reflecting " + format(tmp[this.layer].effect) + " light per second.";
    },
    
    layerShown() {
        let unlockCondition = player.orangePigment.unlocked && player.greenPigment.unlocked && player.purplePigment.unlocked;
        let challengeCondition = !inChallenge() || inChallenge("whitePigment");
        return unlockCondition && challengeCondition || player.debugOptions.showAll;
    },

    startData() {
        return {
            points: new Decimal(0),
            lifetimeBest: new Decimal(0),
            lifetimeTotal: new Decimal(0),

            light: new Decimal(0),
            lifetimeBestLight: new Decimal(0),
            lifetimeTotalLight: new Decimal(0),
            
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
        ["point-display", [
            "You have reflected ",
            function() {
                return player.whitePigment.light;
            },
            " light."
        ]],
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        ["upgrades", function() {
            let rows = [];
            if (getBuyableAmount("whitePigment", 11).gte(2) || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("whitePigment", 13) || player.debugOptions.showAll) rows.push(2);
            if (hasUpgrade("whitePigment", 23) || player.debugOptions.showAll) rows.push(3);
            return rows;
        }],
        "challenges",
        "blank",
    ],

    hotkeys: [
        {
            key: "w",
            description: "W : Combine coloured pigment to make white pigment.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 2,
    prestigeButtonText() {
        return "Combine coloured pigment for " + formatWhole(tmp[this.layer].getResetGain) + " white pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " coloured pigment.";
    },
    passiveGeneration() {
        let gain = 0;

        gain *= player[this.layer].unlocked;

        return gain;
    },

    exponent: 0.5,
    baseAmount() {
        return player.redPigment.points.min(player.bluePigment.points).min(player.yellowPigment.points).min(player.orangePigment.points).min(player.greenPigment.points).min(player.purplePigment.points);
    },
    requires() {
        let multiplier = (false ? 1 : Decimal.pow(1e9, player[this.layer].requiresExponent));
        return new Decimal(1e7).mul(multiplier);
    },
    gainMult() {
        let mult = new Decimal(1);
        
        if (player.stats.firstShade == this.layer) mult = mult.mul(1.1);
        mult = mult.mul(tmp.milestones.effect[this.layer].div(100).add(1));

        if (hasUpgrade(this.layer, 31)) mult = mult.mul(upgradeEffect(this.layer, 31));
        if (hasUpgrade(this.layer, 32)) mult = mult.mul(upgradeEffect(this.layer, 32));
        if (hasUpgrade(this.layer, 33)) mult = mult.mul(upgradeEffect(this.layer, 33));

        if (tmp.greyPigment.layerShown) mult = mult.mul(buyableEffect("greyPigment", 11));

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
        return tmp[this.layer].getResetGain.gte(1) && tmp[this.layer].passiveGeneration < 1;
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

    update(diff) {

        player[this.layer].light = player[this.layer].light.add(tmp[this.layer].effect.mul(diff));

    },

    effect() {
        ret = (hasAchievement("challenges", 34) ? player[this.layer].best : player[this.layer].points);

        ret = ret.mul(tmp.milestones.effect.absorbedLight.div(100).add(1));

        ret = ret.mul(tmp[this.layer].buyables[12].effect);

        return ret;
    },

    buyables: {
        rows: 1,
        cols: 2,

        11: {
            title: "Tints",
            display() {
                return `
                Multiply all primary and secondary pigment gain by ` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Discover a new tint for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` absorbed light.<br>
                You have discovered ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` different tint` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying all primary and secondary pigment gain by ` + format(tmp[this.layer].buyables[this.id].effect) + `.
                `
            },

            unlocked() {
                return player.whitePigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(1),
            exponent() {
                let ret = new Decimal(10);

                if (hasUpgrade(this.layer, 21)) ret = ret.pow(upgradeEffect(this.layer, 21));

                return ret;
            },
            cost() {
                return this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
            },
            canAfford() {
                return player[this.layer].light.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                if (!hasAchievement("challenges", 35)) player[this.layer].light = player[this.layer].light.sub(tmp[this.layer].buyables[this.id].cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            baseEffect() {
                let ret = new Decimal(1.5);
                return ret;
            },
            effect() {
                return tmp[this.layer].buyables[this.id].baseEffect.pow(getBuyableAmount(this.layer, this.id));
            },
        },
        12: {
            title() {
                return formatNth(getBuyableAmount(this.layer, this.id).add(2)) + " Coat"
            },
            display() {
                return `
                Each layer of paint increases the reflectivity by ` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Add another layer of white paint for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` white pigment.<br>
                You have painted ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` additional layer` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying reflectivity by ` + format(tmp[this.layer].buyables[this.id].effect) + `.
                `
            },

            unlocked() {
                return player.whitePigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(2),
            exponent() {
                return new Decimal(1.5);
            },
            cost() {
                return this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                if (!hasAchievement("challenges", 35)) player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            baseEffect() {
                let ret = new Decimal(1);
                return ret;
            },
            effect() {
                return tmp[this.layer].buyables[this.id].baseEffect.mul(getBuyableAmount(this.layer, this.id)).add(1);
            },
        }
    },

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Snow White",
            description: "Exponate base black pigment gain by 1.5.",

            effect: 1.5,
            cost: new Decimal(1),
        },
        12: {
            title: "Ivory",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(2),
        },
        13: {
            title: "Platinum",
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
            title: "White Smoke",
            description: "Exponate Tint cost exponent by 0.5.",

            effect: 0.5,
            cost: new Decimal(10),
        },
        22: {
            title: "Linen",
            description: "Gain 50% of secondary pigment gain per second.",

            effect: 0.5,
            cost: new Decimal(25),
        },
        23: {
            title: "Magnolia",
            description: "Boost blank pigment gain based on reflected light.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].light.add(1).log(20).add(1);
            },
            cost() {
                return (this.layer == player.stats.firstShade ? new Decimal(10000000) : new Decimal(250))
            },
        },

        31: {
            title: "Honeydew",
            description: "Boost white pigment gain based on reflected light.",

            effect() {
                return player[this.layer].light.add(1).log(100).add(1);
            },
            cost() {
                return (this.layer == player.stats.firstShade ? new Decimal(1e8) : new Decimal(1000))
            },
        },
        32: {
            title: "Old Lace",
            description: "Boost white pigment gain based on absorbed light.",

            effect() {
                let base = new Decimal(0);
                if (tmp.blackPigment.layerShown) base = base.add(player.blackPigment.light);
                return base.add(1).log(100).add(1);
            },
            cost() {
                return (this.layer == player.stats.firstShade ? new Decimal(5e9) : new Decimal(50000))
            },
        },
        33: {
            title: "Seashell",
            description: "Boost white pigment gain based on white pigment.",
            effectDisplay() {
                return "x" + format(tmp[this.layer].upgrades[this.id].effect);
            },

            effect() {
                return player[this.layer].light.add(1).log(1000).add(1);
            },
            cost() {
                return (this.layer == player.stats.firstShade ? new Decimal(5e11) : new Decimal(5e6))
            },
        },

    },

    challenges: {
        rows: 1,
        cols: 3,

        11: {
            name: "Subtractive",
            challengeDescription: "Only have red, yellow, blue, and white pigment.",
            goalDescription: "Reach 100,000,000 blank pigment.",
            rewardDescription: "Keep primary pigment upgrades when dying white or secondary pigments.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked || player.debugOptions.showAll;
            },

            canComplete() {
                return player.points.gte(100000000);
            },
        },
        12: {
            name: "Favoritism",
            challengeDescription() {
                return "Only have " + player.stats.firstPrimary.replace(/[A-Z].*/, "") + ", " + player.stats.firstSecondary.replace(/[A-Z].*/, "") + ", and " + player.stats.firstShade.replace(/[A-Z].*/, "") + " pigment.";
            },
            goalDescription: "Reach 1,000,000 blank pigment.",
            rewardDescription: "Keep secondary pigment upgrades and challenges when dying white pigment.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked && player.stats.firstShade == this.layer  || player.debugOptions.showAll;
            },

            canComplete() {
                return player.points.gte(1000000);
            },
        },
        13: {
            name: "Anti-Favoritism",
            challengeDescription() {

                return "Don't have " + player.stats.firstPrimary.replace(/[A-Z].*/, "") + ", " + player.stats.firstSecondary.replace(/[A-Z].*/, "") + ", and " + player.stats.firstShade.replace(/[A-Z].*/, "") + " pigment.";
            },
            goalDescription: "Reach 1e14 blank pigment.",
            rewardDescription: "Keep secondary pigment upgrades and challenges when dying white pigment.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked && player.stats.firstShade != this.layer || player.debugOptions.showAll;
            },

            canComplete() {
                return player.points.gte(1e14);
            },
        },
    },
});