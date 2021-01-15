//vscode-fold=1

addLayer("pink", {
    symbol: "P",
    color: "#F6B",
    branches: ["red", "white"],

    /*tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },*/
  
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

addLayer("pinkPigment", {

    startData() {
        return {
            points: new Decimal(0),
        };
    },

});