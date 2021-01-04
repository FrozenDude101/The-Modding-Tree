// TODO
// Separate out the baseLayers. Each might have unique things in them anyway, so it can't be done in a loop.
// Come up with unique aspects to put into each layer (for content after initial pigments).

// Red    - Blood / Fire / 
// Orange - Fire / 
// Yellow - Gold / Bees / 
// Green  - Nature / Trees / 
// Blue   - Water / Fish / 
// Purple - Poision / 

baseLayers = {
    red: "#D22",
    orange: "#D82",
    yellow: "#DD2",
    green: "#2D2",
    blue: "#22D",
    purple: "#828",
}

for (let baseLayer in baseLayers) {

    addLayer(baseLayer, {
        symbol: baseLayer[0].toUpperCase(),
        color: baseLayers[baseLayer],

        tooltip() {
            return "You have " + player[this.layer + "Pigment"].points + " " + this.layer + " pigment.";
        },
        tooltipLocked() {
            return (player.points.lt(layers[this.layer + "Pigment"].getNextAt()) ? "You need " + layers[this.layer + "Pigment"].getNextAt() + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(player.points) + ")" : "Unlock the colour " + this.layer + ".");
        },
    
        layerShown() {
            return true;
        },    
        unlocked() {
            player[this.layer].unlocked = player[this.layer + "Pigment"].unlocked || layers[this.layer + "Pigment"].canReset();
        },
    
        startData() {
            return {
                unlocked: false,
            };
        },
    
        tabFormat: {
            "Pigment": {
                embedLayer: baseLayer + "Pigment",
            },
        },
    })

}

addLayer("redPigment", {
    color: layers.red.color,
    resource: "red pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
            unlocked: false,
        };
    },

    type: "custom",
    prestigeButtonText() {
        return "Add dye and make " + formatWhole(this.getResetGain(), 0) + " " + this.resource + "<br>Next at " + formatWhole(this.getNextAt(true), 0) + " blank pigment.";
    },
    getNextAt(canMax = false) {
        if (canMax) {
            return this.getResetGain().add(1).pow(2).mul(this.getNextAt());
        } else {
            return new Decimal(10).pow(Decimal.pow(2, player[this.layer].unlockOrder));
        }
    },
    getResetGain() {
        return player.points.div(this.getNextAt()).pow(0.5).floor();
    },
    canReset() {
        return this.getResetGain().gte(1);
    },
    onPrestige() {
        if (!player.red.unlocked) {
            player.red.unlockOrder = coloursUnlocked();
        }
    },
})

addLayer("orangePigment", {
    color: layers.orange.color,
    resource: "orange pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
        };
    },

    getNextAt() {
        return new Decimal(0);
    },
    canReset() {
        return false;
    }
})

addLayer("yellowPigment", {
    color: layers.yellow.color,
    resource: "yellow pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
        };
    },

    getNextAt() {
        return new Decimal(0);
    },
    canReset() {
        return false;
    }
})

addLayer("greenPigment", {
    color: layers.green.color,
    resource: "green pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
        };
    },

    getNextAt() {
        return new Decimal(0);
    },
    canReset() {
        return false;
    }
})

addLayer("bluePigment", {
    color: layers.blue.color,
    resource: "blue pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
        };
    },

    getNextAt() {
        return new Decimal(0);
    },
    canReset() {
        return false;
    }
})

addLayer("purplePigment", {
    color: layers.purple.color,
    resource: "purple pigment.",
    shouldNotify() {
        return !player[this.layer].unlocked && this.canReset();
    },

    startData() {
        return {
            points: new Decimal(0),
        };
    },

    getNextAt() {
        return new Decimal(0);
    },
    canReset() {
        return false;
    }
})