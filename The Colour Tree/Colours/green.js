addLayer("green", {
    symbol: "G",
    color: "#2D2",
    branches: ["yellow", "blue"],

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
            embedLayer: "greenPigment",
        },
    },
});

addLayer("greenPigment", {
    layerShown() {
        return player.yellowPigment.unlocked && player.bluePigment.unlocked;
    },
    requires() {
        return new Decimal(Infinity);
    },
})