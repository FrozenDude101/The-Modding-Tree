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

    let rows = 1;
    while (true) {
        if (!getInputState(layer, "property" + rows) && !getInputState(layer, "value" + rows)) {
            while (getInputState(layer, "property" + rows) != undefined && getInputState(layer, "value" + rows) != undefined) {
                setInputState(layer, "property" + rows, getInputState(layer, "property" + (rows + 1)));
                setInputState(layer, "value" + rows, getInputState(layer, "value" + (rows + 1)));
                rows ++;
            }
            deleteInputState(layer, "property" + rows);
            deleteInputState(layer, "value" + rows);
            break;
        }
        rows ++;
    }

    let alt = "";
    if (tmp[layer].generateStyleEditor) {
        if (rows != tmp[layer].generateStyleEditor.length) {
            alt = "2";
        }
    }

    let col = [
        ["row", [
            ["column", [
                ["display-text", "Property"],
                ["row", [
                    ["display-text", "\""],
                    ["text-input" + alt, "property1"],
                    ["display-text", "\""],
                ]],
            ]],
            ["column", [
                ["display-text", " Value", {"white-space": "pre"}],
                ["row", [
                    ["display-text", ": \""],
                    ["text-input" + alt, "value1"],
                    ["display-text", "\","],
                ]],
            ]],
        ]],
    ];

    for (let i = 2; i <= rows; i ++) {
        col.push(["row", [
            ["display-text", "\""],
            ["text-input" + alt, "property"+i],
            ["display-text", "\""],
            ["display-text", ": \""],
            ["text-input" + alt, "value"+i],
            ["display-text", "\","],
        ]]);
    }

    tmp[layer].generateStyleEditor = (alt ? undefined : col);
    return col;

}

function generateStyle(layer) {

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

function generateToggleEditor(layer) {

    let rows = 1;
    while (true) {
        if (!getInputState(layer, "toggle" + rows) && !getInputState(layer, "toggleValue" + rows)) {
            while (getInputState(layer, "toggle" + rows) != undefined && getInputState(layer, "toggleValue" + rows) != undefined) {
                setInputState(layer, "toggle" + rows, getInputState(layer, "toggle" + (rows + 1)));
                setInputState(layer, "toggleValue" + rows, getInputState(layer, "toggleValue" + (rows + 1)));
                rows ++;
            }
            deleteInputState(layer, "toggle" + rows);
            deleteInputState(layer, "toggleValue" + rows);
            break;
        }
        rows ++;
    }

    let alt = "";
    if (tmp[layer].generateToggleEditor) {
        if (rows != tmp[layer].generateToggleEditor.length) {
            alt = "2";
        }
    }

    let col = [
        ["row", [
            ["column", [
                ["display-text", "Property"],
                ["row", [
                    ["display-text", "\""],
                    ["text-input" + alt, "toggle1"],
                    ["display-text", "\""],
                ]],
            ]],
            ["column", [
                ["display-text", " Value", {"white-space": "pre"}],
                ["row", [
                    ["display-text", ": \""],
                    ["text-input" + alt, "toggleValue1"],
                    ["display-text", "\","],
                ]],
            ]],
        ]],
    ];

    for (let i = 2; i <= rows; i ++) {
        col.push(["row", [
            ["display-text", "\""],
            ["text-input" + alt, "toggle"+i],
            ["display-text", "\""],
            ["display-text", ": \""],
            ["text-input" + alt, "toggleValue"+i],
            ["display-text", "\","],
        ]]);
    }

    tmp[layer].generateToggleEditor = (alt ? undefined : col);
    return col;

}

function generateToggles(layer) {
    
    let rows = 1;
    while (getInputState(layer, "toggle" + rows) || getInputState(layer, "toggleValue" + rows)) {
        rows ++;
    }

    let toggles = [];

    for (let i = 1; i <= rows; i ++) {
        if (!getInputState(layer, "toggle" + i) && !getInputState(layer, "toggleValue" + i)) continue;
        toggles.push([getInputState(layer, "toggle" + i), getInputState(layer, "toggleValue" + i)]);
    }

    return toggles;

}

function convertTogglesToString(toggles) {

    if (toggles.length) {
        let ret = "[\n";
        for (let toggle of toggles) {
            ret += "        [\"" + toggle[0] + "\", \"" + toggle[1] + "\"],\n";
        }
        return ret + "    ]";
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