//vscode-fold=1

/*
    #222
*/

addLayer("black", {
    symbol: "B",
    color: "#222",

    x() {
        let ret = 0;
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
        if (tmp[this.layer].layerShown && typeof tmp[this.layer].layerShown != "object") player[this.layer].shown = true;
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
            embedLayer: "blackPigment",
        },
    },
});

addLayer("blackPigment", {
    color: "#333",
    resource: "black pigment",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    effectDescription() {
        return "absorbing " + formatWhole(tmp[this.layer].effect) + " light per second.";
    },
    
    layerShown() {
        let unlockCondition = player.orangePigment.unlocked && player.greenPigment.unlocked && player.purplePigment.unlocked;
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
            "You have absorbed ",
            function() {
                return player.blackPigment.light;
            },
            " light."
        ]],
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        "blank",
        "blank",
        "blank",
        "blank",
        "blank",
        ["upgrades", function() {
            let rows = [];
            if (player.blackPigment.unlocked || player.debugOptions.showAll) rows.push(1);
            return rows;
        }],
    ],

    hotkeys: [
        {
            key: "B",
            description: "Shift+B : Combine coloured pigment to make black pigment.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    type: "custom",
    row: 2,
    prestigeButtonText() {
        return "Combine coloured pigment for " + formatWhole(tmp[this.layer].getResetGain) + " black pigment.<br>Next at " + format(tmp[this.layer].getNextAt) + " coloured pigment.";
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
        return new Decimal(1e7).mul(Decimal.pow(10, (hasUpgrade(this.layer, 31) ? 0 : player[this.layer].requiresExponent)));
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

    update(diff) {

        player[this.layer].light = player[this.layer].light.add(tmp[this.layer].effect.mul(diff));

    },

    effect() {
        ret = player[this.layer].points;

        ret = ret.mul(tmp.milestones.effect.absorbedLight.div(100).add(1));

        ret = ret.mul(tmp[this.layer].buyables[12].effect);

        return ret;
    },

    buyables: {
        rows: 1,
        cols: 2,

        11: {
            title: "Shades",
            display() {
                return `
                Multiply all primary and secondary pigment gain by x` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Discover a new shade for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` absorbed light.<br>
                You have discovered ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` different shade` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying all primary and secondary pigment gain by x` + format(tmp[this.layer].buyables[this.id].effect) + `.
                `
            },

            unlocked() {
                return player.blackPigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(1),
            exponent() {
                return new Decimal(10);
            },
            cost() {
                return this.baseCost.mul(tmp[this.layer].buyables[this.id].exponent.pow(getBuyableAmount(this.layer, this.id)));
            },
            canAfford() {
                return player[this.layer].light.gte(tmp[this.layer].buyables[this.id].cost);
            },
            buy() {
                player[this.layer].light = player[this.layer].light.sub(tmp[this.layer].buyables[this.id].cost);
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
                Each layer of paint increases the absorption rate by ` + format(tmp[this.layer].buyables[this.id].baseEffect) + `.<br>
                Add another layer of black paint for ` + formatWhole(tmp[this.layer].buyables[this.id].cost) + ` black pigment.<br>
                You have painted ` + formatWhole(getBuyableAmount(this.layer, this.id)) + ` additional layer` + (getBuyableAmount(this.layer, this.id).neq(1) ? "s" : "") + `, multiplying absorption rate by x` + format(tmp[this.layer].buyables[this.id].effect) + `.
                `
            },

            unlocked() {
                return player.blackPigment.unlocked || player.debugOptions.showAll;
            },
            
            baseCost: new Decimal(10),
            exponent() {
                return new Decimal(2);
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
            title: "Tada",
        }
    }
});