//vscode-fold=1#

// Make base cost be 1e10.

addLayer("grey", {
    symbol: "G",
    color() {
        let shade = Math.floor(player.greyPigment.shade/20+64);
        return "rgb(" + shade + "," + shade + "," + shade + ")";
    },
    branches: ["black", "white"],

    x() {
        let ret = 0;
        return ret;
    },
    y() {
        let ret = 1;
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
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " black and white pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },

    layerShown() {
        if (layerShown(this.layer) && !(layerShown(this.layer) instanceof Decimal)) player[this.layer].shown = true;
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
            embedLayer: "greyPigment",
        },
    },
});

addLayer("greyPigment", {
    color() {
        let shade = Math.floor(player.greyPigment.shade/20+64);
        if (document.getElementById("greyPigmentShadeSlider")) document.getElementById("greyPigmentShadeSlider").style.background = "rgb(" + shade + "," + shade + "," + shade + ")";
        return "rgb(" + shade + "," + shade + "," + shade + ")";
    },
    resource: "grey pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },
    
    layerShown() {
        let unlockCondition = player.blackPigment.unlocked && player.whitePigment.unlocked;
        let challengeCondition = inChallenge("orangePigment") || inChallenge("greenPigment") || inChallenge("purplePigment") || inChallenge("blackPigment") || inChallenge("whitePigment");
        return unlockCondition && !challengeCondition || player.debugOptions.showAll;
    },

    startData() {
        return {
            points: new Decimal(0),
            lifetimeBest: new Decimal(0),
            lifetimeTotal: new Decimal(0),

            shade: 640,
            
            unlocked: false,
            minned: false,
            maxed:false,
            resets: 0,
        };
    },
    minMax() {
        if (player[this.layer].shade == 0)    player[this.layer].minned = true;
        if (player[this.layer].shade == 1280) player[this.layer].maxed  = true;
    },

    createSlider() {
        if (typeof tmp.greyPigment.createSlider == "string" && player.tab == "grey" && player.subtabs.grey.mainTabs == "Pigment") return tmp.greyPigment.createSlider;
        return `<input id=greyPigmentShadeSlider class=slider type=range min=0 max=1280 value=` + player.greyPigment.shade + ` oninput="player.greyPigment.shade = this.value">`;
    },
    tabFormat: [
        "main-display",
        ["prestige-button", "", function() {
            return (tmp.greyPigment.passiveGeneration < 0.1 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        ["display-text", function() {
                return "You are dying " + format(tmp.greyPigment.getResetGain.mul(tmp.greyPigment.passiveGeneration)) + " grey pigment per second.";
        }, function() {
            return (tmp.greyPigment.passiveGeneration != 0 || player.debugOptions.showAll ? {} : {display: "none"});
        }],
        "blank",
        ["raw-html", function() {
            return tmp.greyPigment.createSlider
        }, function() {
            return (player.greyPigment.unlocked ? {} : {display: "none"});
        }],
        "blank",
        ["display-text", function() {
            return "Your shade of grey is boosting<br>black pigment gain by x" + format(tmp.greyPigment.effect.blackPigment) + ".<br>white pigment gain by x" + format(tmp.greyPigment.effect.whitePigment) + ".";
        }, function() {
            return (player.greyPigment.unlocked ? {} : {display: "none"});
        }],
        "blank",
        "buyables",
        "blank",
        ["upgrades", function() {
            let rows = [];
            if (getBuyableAmount("greyPigment", 11).gte(1) || includesAny(player.greyPigment.upgrades, [11, 12, 13]) || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("greyPigment", 13) || includesAny(player.greyPigment.upgrades, [21, 22, 23]) || player.debugOptions.showAll) rows.push(2);
            if (hasUpgrade("greyPigment", 23) || includesAny(player.greyPigment.upgrades, [31, 32, 33]) || player.debugOptions.showAll) rows.push(3);
            return rows;
        }],
        "challenges",
        "blank",
    ],

    hotkeys: [
        {
            key: "G",
            description: "Shift+G : Combine black and white pigment to make grey pigment.",
            onPress() {
                if (player[this.layer].unlocked && canReset(this.layer)) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 3,
    prestigeButtonText() {
        return "Combine black and white pigment for " + formatWhole(tmp[this.layer].getResetGain) + " grey pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " black and white pigment.";
    },
    passiveGeneration() {
        let gain = 0;

        if (hasAchievement("challenges", 45)) gain += 0.1;

        gain *= player[this.layer].unlocked;

        return gain;
    },

    exponent: 0.5,
    baseAmount() {
        return player.blackPigment.points.min(player.whitePigment.points);
    },
    requires() {
        return new Decimal(1e10);
    },
    gainMult() {
        let mult = new Decimal(1);
        
        if (player.stats.firstShade == this.layer) mult = mult.mul(1.1);
        mult = mult.mul(tmp.milestones.effect[this.layer].div(100).add(1));

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
        return tmp[this.layer].getResetGain.gte(1) && tmp[this.layer].passiveGeneration < 0.1;
    },
    doReset(layer) {
        let keep = ALWAYS_KEEP_ON_RESET.slice();
        let keepUpgrades = [];

        if ([].includes(layer)) {
            keepUpgrades = filter(player[this.layer].upgrades, keepUpgrades);
            layerDataReset(this.layer, keep);
            if (!keep.includes("upgrades")) player[this.layer].upgrades = keepUpgrades;
        }
    },

    update(diff) {

        if (hasAchievement("challenges", 43)) {
            for (let buyable in tmp[this.layer].buyables) {
                if (["rows", "cols"].includes(buyable)) continue;
                if (tmp[this.layer].buyables[buyable].canAfford) {
                    layers[this.layer].buyables[buyable].buy();
                    break;
                }
            }
        }

    },

    effect() {
        let normalisedShade = new Decimal(player.greyPigment.shade).div(1280);

        let exponent = new Decimal(2);

        let mult = new Decimal(1);
        mult = mult.mul(buyableEffect(this.layer, 12));

        return {
            blackPigment: Decimal.pow(normalisedShade, exponent).mul(mult).add(1),
            whitePigment: Decimal.pow(1-normalisedShade, exponent).mul(mult).add(1),
        };
    },

    buyables: {
        rows: 1,
        cols: 2,

        11: {
            title: "Tones",
            display() {
                return `
                Multiply all black, white, and coloured pigment gain by ` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Discover a new tone for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` grey pigment.<br>
                You have discovered ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` different tone` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying all black, white, and coloured pigment gain by ` + format(tmp[this.layer].buyables[this.id].effect) + `.
                ` + (buyableEffect(this.layer, this.id).gte(1e100) ? "<br>(Softcapped)" : "") + `
                `
            },

            unlocked() {
                return player.greyPigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(1),
            exponent() {
                let ret = new Decimal(5);

                if (hasUpgrade(this.layer, 21)) ret = ret.pow(upgradeEffect(this.layer, 21));

                return ret;
            },
            cost() {
                let ret = this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
                if (hasUpgrade(this.layer, 32)) ret = ret.mul(upgradeEffect(this.layer, 32));
                return ret;
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                if (!hasAchievement("challenges", 44)) player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            baseEffect() {
                let ret = new Decimal(1.5);
                return ret;
            },
            effect() {
                let ret = tmp[this.layer].buyables[this.id].baseEffect.pow(getBuyableAmount(this.layer, this.id));
                if (ret.gte(1e100)) ret = ret.sqrt().mul(1e50);
                return ret;
            },
        },
        12: {
            title() {
                return formatNth(getBuyableAmount(this.layer, this.id).add(2)) + " Coat"
            },
            display() {
                return `
                Each layer of paint multiplies the grey shade multiplier by ` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Add another layer of grey paint for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` grey pigment.<br>
                You have painted ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` additional layer` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying the grey shade multiplier by ` + format(tmp[this.layer].buyables[this.id].effect) + `.
                `
            },

            unlocked() {
                return player.greyPigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(2),
            exponent() {
                return new Decimal(1.5);
            },
            cost() {
                let ret = this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
                if (hasUpgrade(this.layer, 32)) ret = ret.mul(upgradeEffect(this.layer, 32));
                return ret;
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                if (!hasAchievement("challenges", 44)) player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            baseEffect() {
                let ret = new Decimal(1.1);
                
                if (hasUpgrade(this.layer, 23)) ret = ret.add(0.1);

                return ret;
            },
            effect() {
                let ret = tmp[this.layer].buyables[this.id].baseEffect.pow(getBuyableAmount(this.layer, this.id));
                if (hasUpgrade(this.layer, 33)) ret = ret.mul(upgradeEffect(this.layer, 33));
                return ret;
            },
        }
    },

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Silver",
            description: "Exponate base blank pigment gain by 1.5.",

            effect: 1.5,
            cost: new Decimal(1),
        },
        12: {
            title: "Slate",
            description: "Multiply blank pigment gain by 2.",

            effect: 2,
            cost: new Decimal(2),
        },
        13: {
            title: "Gunmetal Grey",
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
            title: "Ash Grey",
            description: "Exponate Tone cost exponent by 0.5.",

            effect: 0.5,
            cost: new Decimal(10),
        },
        22: {
            title: "Purple Grey",
            description: "Lose the ability to dye, but gain 10% of black and white pigment gain per second.",

            effect: 0.1,
            cost: new Decimal(25),
        },
        23: {
            title: "Battleship Grey",
            description: "Add 0.1 to the base effect of all coats of paint.",

            effect: 0.1,
            cost: new Decimal(1000),
        },

        31: {
            title: "Cool Grey",
            description: "Automatically purchase one of each black and white pigment buyable per second.",

            cost: new Decimal(10000),
        },
        32: {
            title: "Payne's Grey",
            description: "Halve the cost of all black, white, and grey pigment buyables.",

            effect: 0.5,
            cost: new Decimal(1e7),
        },
        33: {
            title: "Moli",
            description: "Double the effect of all coats of paint.",

            effect: 2,
            cost: new Decimal(1e15),
        },
    },

    challenges: {
        rows: 1,
        cols: 3,

        11: {
            name: "Toner",
            challengeDescription: "Square root blank pigment gain after all effects.",
            goalDescription: "Reach 1e11 blank pigment.",
            rewardDescription: "Keep black and white pigment upgrades, challenges, and buyables when dying grey pigments.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || hasUpgrade(this.layer, 13) || player.debugOptions.showAll;
            },

            canComplete() {
                return player.points.gte(1e11);
            },
        },
    },
});