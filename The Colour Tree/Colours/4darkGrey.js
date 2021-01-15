//vscode-fold=1

addLayer("darkGrey", {
    symbol: "D",
    color: "#666",
    branches: ["black", "white"],

    /*tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },*/

    nodeStyle: {
        position: "absolute",
        top: "calc(50% - 3*115px/2 + 1.0*115px)",
        left: "calc(50% - 115px/2  + 2.5*115px)",
    },
    layerShown() {
        return true //(tmp[this.layer + "Pigment"].layerShown ? true : "ghost");
    }, 

    startData() {
        return {
            unlocked: false,
        };
    },  
    unlocked() {
        player[this.layer].unlocked = true //player[this.layer + "Pigment"].unlocked || canReset(this.layer + "Pigment");
    },

    tabFormat: {
        /*"Pigment": {
            embedLayer: "yellowPigment",
        },*/
    },
});