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
        return "Combine yellow and red pigment for " + formatWhole(this.getResetGain()) + " orange pigment.<br>Next at " + format(this.getNextAt()) + " yellow and red pigment.";
    },

    exponent: 0.5,
    baseAmount() {
        return player.redPigment.points.min(player.yellowPigment.points);
    },
    requires() {
        return new Decimal(1000);
    },
    gainMult() {
        let mult = new Decimal(1);
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
            description: "O : Combine red and yellow pigments to make orange pigment.",
            onPress() {
                if (player.orangePigment.unlocked) doReset("orangePigment");
            },
        }
    ],
})