// www.eggradients.com/shades-of-blue-color
// 3-1

addLayer("blue", {
    symbol: "B",
    color: "#22D",

    tooltip() {
        return "You have " + player[this.layer + "Pigment"].points + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(layers[this.layer + "Pigment"].requires()) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(player.points) + ".)";
    },

    layerShown() {
        return (layers[this.layer + "Pigment"].layerShown() ? true : "ghost");
    },

    startData() {
        return {
            unlocked: false,
        };
    },    
    unlocked() {
        player[this.layer].unlocked = player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment");
    },

    tabFormat: {
        "Pigment": {
            embedLayer: "bluePigment",
        },
    },
});
    
addLayer("bluePigment", {
    color: "#22D",
    resource: "blue pigment.",
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
        return "Dye blank pigment blue for " + formatWhole(this.getResetGain()) + " blue pigment.<br>Next at " + format(this.getNextAt()) + " blank pigment.";
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
            case "greenPigment": 
            case "purplePigment":
                layerDataReset(this.layer, keep);
        }
    },

    hotkeys: [
        {
            key: "b",
            description: "B : Dye blank pigment blue.",
            onPress() {
                if (player[this.layer].unlocked) doReset(this.layer);
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Royal Blue",
            description: "Add 1 to base blank pigment gain.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || player[this.layer].unlocked;
            },

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Navy Blue",
            description: "Multiply blank pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 11);
            },

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Cobalt Blue",
            description: "Multiply blue pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 12);
            },

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Baby Blue",
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
            title: "Tiffany Blue",
            description: "Boost blank pigment gain based on blue pigment amount.",
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
            title: "Midnight Blue",
            description: "Boost blue pigment gain based on blue pigment amount.",
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