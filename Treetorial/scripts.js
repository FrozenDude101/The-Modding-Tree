//vscode-fold=1

//  -------- Constants --------

const QUESTIONS = {
}

//  -------- Formatting Functions --------

function formatCodeBlock(lines) {

    let ret = "";

    ret += "<div class=codeBlock>";
    if (lines.length != 0) {
        for (let i = 0; i < lines.length; i++) {
            ret += "<span class=codeLine>" + lines[i] + "</span><br>";
        }
    }
    ret += "</div>";

    return ret;

}

//  -------- Multi Layer Functions --------

function getNodeStyle(x, y) {
    
    return {
        position: "absolute",
        left: "calc((50% - 250px) + " + 10*x + "px)",
        top: "calc(120px + " + 10*y + "px)",
        margin: 0,
    };

}

function getNodeClasses(layer, size) {

    let ret = {
        treeNode: tmp[layer].isLayer,
        treeButton: !tmp[layer].isLayer,
        smallNode: size == 'small',
        [layer]: true,
        ghost: tmp[layer].layerShown == 'ghost',
        hidden: !tmp[layer].layerShown,
        locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
        notify: tmp[layer].notify,
        resetNotify: tmp[layer].prestigeNotify,
        can: ((player[layer].unlocked || tmp[layer].isLayer) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
        [tmp[layer].class]: true,
    };
    if (tmp[layer].classes) {
        for (let styleClass of tmp[layer].classes) {
            ret[styleClass] = true;
        }
    }
    return  ret;

}

//  -------- Other Functions --------

function merge(obj1, obj2) {

    layOver(obj1, obj2);
    return obj1;

}

function update(diff) {

    let points = 0;
    for (let module in QUESTIONS) {
        if (player[module].completed) points ++;
    }
    player.points = new Decimal(points);
    // Calculates the player's points every tick.

}