addLayer("lightGrey", {
    symbol: "L",
    color: "#AAA",
    branches: ["black", "white"],

    /*tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },*/

    layerShown() {
        return true //(tmp[this.layer + "Pigment"].layerShown ? true : "ghost");
    },   
    unlocked() {
        player[this.layer].unlocked = true //player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment");
    },

    startData() {
        return {
            unlocked: false,
        };
    },

    tabFormat: {
        /*"Pigment": {
            embedLayer: "yellowPigment",
        },*/
    },
});