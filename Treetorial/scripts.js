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

function formatGraph(data) {

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

function generateStyleEditor(layer) {

    let rows = 0;
    do {
        rows ++;
        if (["", undefined].includes(getInputState(layer, "property" + rows)) && ["", undefined].includes(getInputState(layer, "value" + rows))) {
            let rows2 = rows;
            do {
                setInputState(layer, "property" + rows2, getInputState(layer, "property" + (rows2 + 1)));
                setInputState(layer, "value" + rows2, getInputState(layer, "value" + (rows2 + 1)));
                rows2 ++;
            } while(!["", undefined].includes(getInputState(layer, "property" + (rows2 - 1))) || !["", undefined].includes(getInputState(layer, "value" + (rows2 - 1))));
            deleteInputState(layer, "property" + rows2);
            deleteInputState(layer, "value" + rows2);
        }
    } while (!["", undefined].includes(getInputState(layer, "property" + rows)) || !["", undefined].includes(getInputState(layer, "value" + rows)));

    let col = [
        ["row", [
            ["column", [
                ["display-text", "Property"],
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "property1"],
                    ["display-text", "\""],
                ]],
            ]],
            ["column", [
                ["display-text", " Value", {"white-space": "pre"}],
                ["row", [
                    ["display-text", ": \""],
                    ["text-input", "value1"],
                    ["display-text", "\","],
                ]],
            ]],
        ]],
    ];

    for (let i = 2; i <= rows; i ++) {
        col.push(["row", [
            ["display-text", "\""],
            ["text-input", "property"+i],
            ["display-text", "\""],
            ["display-text", ": \""],
            ["text-input", "value"+i],
            ["display-text", "\","],
        ]]);
    }

    return col;

}

function generateStyle(layer, obj) {

    let rows = 1;
    while (getInputState(layer, "property" + rows) || getInputState(layer, "value" + rows)) {
        rows ++;
    }

    let style = {};

    for (let i = 1; i <= rows; i ++) {
        if (["", undefined].includes(getInputState(layer, "property" + i)) || ["", undefined].includes(getInputState(layer, "value" + i))) continue;
        style[getInputState(layer, "property" + i)] = getInputState(layer, "value" + i);
    }

    return style;

}

function convertStyleToString(style) {

    if (Object.keys(style).length) {
        let ret = "{";

        for (let property in style) {
            ret += "\n        \"" + property + "\": \"" + style[property] + "\",";
        }

        return ret + "\n    }";
    } else {
        return "";
    }

}

//  -------- Other Functions --------

function merge(obj1, obj2) {

    layOver(obj1, obj2);
    return obj1;

}

function update(diff) {

    let points = 0;
    for (let module of LAYERS) {
        if (player[module].completed) points ++;
    }
    player.points = new Decimal(points);
    // Calculates the player's points every tick.

}