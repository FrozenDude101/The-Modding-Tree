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
        let challengeCondition = !inChallenge();
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
            shade: 640,
        };
    },

    createSlider() {
        if (typeof tmp.greyPigment.createSlider == "string") return tmp.greyPigment.createSlider;
        return `<input id=greyPigmentShadeSlider class=slider type=range min=0 max=1280 value=` + player.greyPigment.shade + ` oninput="player.greyPigment.shade = this.value">`;
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["slider", [[this.layer, "lightness"], 0, 1000]],
        "blank",
        ["raw-html", function() {
            return tmp.greyPigment.createSlider
        }],
        "blank",
        ["display-text", function() {
            return "Your shade of grey is boosting<br>absorption rate by x" + format(tmp.greyPigment.effect.absorbedLight) + "<br>reflectivity by x" + format(tmp.greyPigment.effect.reflectedLight) + ".";
        }],
        "blank",
        "buyables",
        "blank",
        ["upgrades", function() {
            let rows = [];
            if (getBuyableAmount("greyPigment", 11).gte(1) || player.debugOptions.showAll) rows.push(1);
            if (hasUpgrade("greyPigment", 13) || player.debugOptions.showAll) rows.push(2);
            return rows;
        }],
    ],

    hotkeys: [
        {
            key: "G",
            description: "Shift+G : Combine black and white pigment to make grey pigment.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 2,
    prestigeButtonText() {
        return "Combine black and white pigment for " + formatWhole(tmp[this.layer].getResetGain) + " grey pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " black and white pigment.";
    },
    passiveGeneration() {
        let gain = 0;

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

    effect() {
        let normalisedShade = new Decimal(player.greyPigment.shade).div(1280);

        let exponent = new Decimal(2);

        let mult = new Decimal(1);
        mult = mult.mul(buyableEffect(this.layer, 12));

        return {
            absorbedLight: Decimal.pow(normalisedShade, exponent).mul(mult).add(1),
            reflectedLight: Decimal.pow(1-normalisedShade, exponent).mul(mult).add(1),
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
                `
            },

            unlocked() {
                return player.greyPigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(1),
            exponent() {
                let ret = new Decimal(5);

                return ret;
            },
            cost() {
                return this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
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
                return this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            baseEffect() {
                let ret = new Decimal(1.1);
                return ret;
            },
            effect() {
                return tmp[this.layer].buyables[this.id].baseEffect.pow(getBuyableAmount(this.layer, this.id));
            },
        }
    },

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "1",

            cost: new Decimal(1),
        }
    },
});