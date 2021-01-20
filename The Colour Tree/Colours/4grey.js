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
        ["raw-html", function() { return tmp.greyPigment.createSlider} ],
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

        return {
            absorbedLight: Decimal.pow(normalisedShade, exponent).add(1).mul(mult),
            reflectedLight: Decimal.pow(1-normalisedShade, exponent).add(1).mul(mult),
        };
    },
});