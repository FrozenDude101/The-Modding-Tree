addLayer("orange", {
    symbol: "O",
    color: "#D82",
    branches: ["red", "yellow"],

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
            embedLayer: "orangePigment",
        },
    },
});

addLayer("orangePigment", {
    color: "#D82",
    resource: "orange pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && canReset(this.layer);
    },

    layerShown() {
        return player.redPigment.unlocked && player.yellowPigment.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        };
    },
    unlockOrder() {
        if (!player[this.layer].unlocked) {
            player[this.layer].unlockOrder = Math.max(pigmentsUnlocked()-2, 0);
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "upgrades",
        "challenges",
    ],

    type: "custom",
    row: 1,
    prestigeButtonText() {
        return "Combine red and yellow pigment for " + formatWhole(this.getResetGain()) + " orange pigment.<br>Next at " + format(this.getNextAt()) + " yellow and red pigment.";
    },
    resetsNothing() {
        return hasChallenge(this.layer, 12);
    },

    exponent: 0.5,
    baseAmount() {
        return player.redPigment.points.min(player.yellowPigment.points);
    },
    requires() {
        return new Decimal(1000).mul(Decimal.pow(10, 0.5*(player[this.layer].unlockOrder)*(player[this.layer].unlockOrder+1)));
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
        }
    },

    hotkeys: [
        {
            key: "o",
            description: "O : Combine red and yellow pigment to make orange pigment.",
            onPress() {
                if (player.orangePigment.unlocked) doReset("orangePigment");
            },
        }
    ],

    upgrades: {
        rows: 2,
        cols: 3,

        11: {
            title: "Amber",
            description: "Add 1 to base blank pigment gain.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || player[this.layer].unlocked;
            },

            effect: 1,
            cost: new Decimal(1),
        },
        12: {
            title: "Peach",
            description: "Multiply blank pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 11);
            },

            effect: 2,
            cost: new Decimal(1),
        },
        13: {
            title: "Burnt Orange",
            description: "Multiply orange pigment gain by 2.",

            unlocked() {
                return hasUpgrade(this.layer, this.id) || hasUpgrade(this.layer, 12);
            },

            effect: 2,
            cost: new Decimal(5),
        },
        21: {
            title: "Champagne",
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
            title: "Apricot",
            description: "Boost blank pigment gain based on orange pigment amount.",
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
            title: "Neon Orange",
            description: "Boost orange pigment gain based on orange pigment amount.",
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

    challenges: {
        rows: 1,
        cols: 2,

        11: {
            name: "Additive",
            challengeDescription: "Only have red, orange, and yellow pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of red and yellow pigment upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || player[this.layer].unlocked;
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
        12: {
            name: "Complementary",
            challengeDescription: "Only have blue and orange pigment.",
            goalDescription: "Reach 250,000 blank pigment.",
            rewardDescription: "Unlock a row of blue and orange upgrades.",

            unlocked() {
                return hasChallenge(this.layer, this.id) || hasChallenge(this.layer, 11);
            },

            canComplete() {
                return player.points.gte(250000);
            },
        },
    },
})