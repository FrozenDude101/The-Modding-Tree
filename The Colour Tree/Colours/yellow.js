// www.eggradients.com/shades-of-yellow
// 4-3

addLayer("yellow", {
    symbol: "Y",
    color: "#DD2",

    tooltip() {
        return "You have " + player[this.layer + "Pigment"].points + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(player.points) + ".)";
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
            embedLayer: "yellowPigment",
        },
    },
});
    
addLayer("yellowPigment", {
    color: "#DD2",
    resource: "yellow pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        return true;
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        };
    },
    unlockOrder() {
        if (!player[this.layer].unlocked) {
            player[this.layer].unlockOrder = pigmentsUnlocked();
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "upgrades",
    ],

    type: "custom",
    row: 0,
    prestigeButtonText() {
        return "Dye blank pigment yellow for " + formatWhole(this.getResetGain()) + " yellow pigment.<br>Next at " + format(this.getNextAt()) + " blank pigment.";
    },

    exponent: 0.5,
    baseAmount() {
        return player.points;
    },
    requires() {
        return new Decimal(10).mul(Decimal.pow(10, 0.5*(player[this.layer].unlockOrder)*(player[this.layer].unlockOrder+1)));
    },
    gainMult() {
        let mult = new Decimal(1);

        if (hasUpgrade(this.layer, 13)) mult = mult.mul(upgradeEffect(this.layer, 13));
        if (hasUpgrade(this.layer, 23)) mult = mult.mul(upgradeEffect(this.layer, 23));

        return mult;
    },
    gainExp() {
        let exp = new Decimal(1);
        return exp;
    },
    getResetGain() {
        if (this.baseAmount().lt(this.requires())) return new Decimal(0);
        return this.baseAmount().div(this.requires()).pow(this.exponent).mul(this.gainMult()).pow(this.gainExp()).floor().max(0);
    },
    getNextAt() {
        return this.getResetGain().add(1).root(this.gainExp()).div(this.gainMult()).root(this.exponent).times(this.requires()).max(this.requires());
    },

    canReset() {
        return this.getResetGain().gte(1);
    },
    doReset(layer) {
        let keep = [];
        switch(layer) {
            case "orangePigment": 
            case "greenPigment":
                layerDataReset(this.layer, keep);
        }
    },

    hotkeys: [
        {
            key: "y",
            description: "Y : Dye blank pigment yellow.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Lemon Yellow",
            description: "Add 1 to base blank pigment gain.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || player[this.layer].unlocked;
            },

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Canary Yellow",
            description: "Multiply blank pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 11);
            },

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Golden Yellow",
            description: "Multiply yellow pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 12);
            },

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Dandelion Yellow",
            description: "Boost blank pigment gain based on blank pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 13);
            },

            effect() {
                return player.points.add(1).log(10).add(1)
            },
            cost: new Decimal(10),
        },
        22: {
            title: "Citrine Yellow",
            description: "Boost blank pigment gain based on yellow pigment amount.",
            effectDisplay() {
                return "x" + format(this.effect());
            },

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 21);
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
                return "x" + format(this.effect());
            },

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 22);
            },

            effect() {
                return player[this.layer].points.add(1).log(20).add(1);
            },
            cost: new Decimal(50),
        },
    },
});