//vscode-fold=1

addLayer("darkGrey", {
    symbol: "D",
    color: "#666",
    branches: ["lightGrey", "black"],

    /*tooltip() {
        return "You have " + formatWhole(player[this.layer + "Pigment"].points) + " " + this.layer + " pigment.";
    },
    tooltipLocked() {
        return "You need " + formatWhole(tmp[this.layer + "Pigment"].requires) + " blank pigment to unlock the colour " + this.layer + ". (You have " + formatWhole(tmp[this.layer + "Pigment"].baseAmount) + ".)";
    },*/

    x() {
        let ret = 0.5;
        return ret;
    },
    y() {
        let ret = 0;
        return ret;
    },
    nodeStyle() {
        return {
            position: "absolute",
            left: "calc(50% - 115px/2 + " + tmp[this.layer].x + "*115px)",
            top: "calc(50%  - 115px*2 + " + tmp[this.layer].y + "*115px)",
        }
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