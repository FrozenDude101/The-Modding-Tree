//vscode-fold=1

addLayer("debug", {
    symbol: "🐞",
    row: "side",

    tooltip: "Debug",

    layerShown() {
        return gameEnded || player.forceDebug;
    },

    tabFormat: {
        Layers: {
            embedLayer: "debugLayers",
        },
        Saves: {
            embedLayer: "debugSaves",
        },
    },
});

addLayer("debugLayers", {
    startData() {
        return {
            activeLayer: "milestones",
        };
    },
    activeLayer() {
        if (document.getElementById("selectLayer")) player[this.layer].activeLayer = document.getElementById("selectLayer").value;
    },

    createDropDownMenu() {
        let ret = "<select id=selectLayer>";
        for (let LAYER of LAYERS) {
            if (["info-tab", "options-tab", "changelog-tab", "blank", "tree-tab", "achievements", "statistics", "debug", "debugLayers", "debugSaves", "red", "yellow", "blue", "orange", "green", "purple"].includes(LAYER)) continue;
            let selected = (LAYER == player[this.layer].activeLayer ? "selected='selected'" : "");
            ret += "<option value=" + LAYER + " " + selected + ">" + LAYER.charAt(0).toUpperCase() + LAYER.slice(1).replace(/([A-Z])/g,' $1') + "</option>";
        }
        ret += "</select>";
        return ret;
    },

    componentEditor() {
        let ret = "";;

        if (typeof player[this.layer].activeLayer == "string") {
            let layerName = player[this.layer].activeLayer;
            let layer = tmp[layerName];

            if (layer.achievements) {
                ret += "<h2>Achievements</h2><br><br>";
                let colRange = [9, 0];
                let rowRange = [Infinity, 0];
                for (let achievement in layer.achievements) {
                    if (achievement == "rows" || achievement == "cols") continue;
                    colRange[0] = Math.min(colRange[0], achievement.slice(-1))
                    colRange[1] = Math.max(colRange[1], achievement.slice(-1))
                    rowRange[0] = Math.min(rowRange[0], achievement.slice(0, -1))
                    rowRange[1] = Math.max(rowRange[1], achievement.slice(0, -1))
                }
                for (let i = rowRange[0]; i <= rowRange[1]; i++) {
                    for (let j = colRange[0]; j <= colRange[1]; j++) {
                        let exists = layer.achievements[i+""+j];
                        let style = (exists ? "" : "opacity: 0");

                        let id = i+""+j;
                        let comp = (exists && layer.achievements[id].max ? player.milestones.levels[id] : hasAchievement(layerName, i+""+j)*1);
                        let maxComp = (exists && layer.achievements[id].max  ? layer.achievements[id].max : "1");

                        let cssClass = (exists && comp >= maxComp ? "bought" : "locked");

                        ret += "<button style='" + style + "' class='debugButton " + cssClass + "' onClick=updateAchievements('" + layerName + "','" + id + "')>" + id + "<br>" + comp + "/" + maxComp + "</button>";
                    }
                    ret += "<br>";
                }
                ret += "<br>";
            }

            if (layer.challenges) {
                ret += "<h2>Challenges</h2><br><br>";
                let colRange = [9, 0];
                let rowRange = [Infinity, 0];
                for (let challenge in layer.challenges) {
                    if (challenge == "rows" || challenge == "cols") continue;
                    colRange[0] = Math.min(colRange[0], challenge.slice(-1))
                    colRange[1] = Math.max(colRange[1], challenge.slice(-1))
                    rowRange[0] = Math.min(rowRange[0], challenge.slice(0, -1))
                    rowRange[1] = Math.max(rowRange[1], challenge.slice(0, -1))
                }
                for (let i = rowRange[0]; i <= rowRange[1]; i++) {
                    for (let j = colRange[0]; j <= colRange[1]; j++) {
                        let exists = layer.challenges[i+""+j];
                        let style = (exists ? "" : "opacity: 0");

                        let id = (exists ? i+""+j : "");
                        let comp = (exists ? challengeCompletions(layerName, id) : "");
                        let maxComp = (exists ? layer.challenges[id].completionLimit : "");
                        
                        let cssClass = (exists && comp == maxComp ? "bought" : "locked");

                        ret += "<button style='" + style + "' class='debugButton " + cssClass + "' onclick=\"completeChallenge('" + layerName + "', '" + id + "', true)\">" + id + "<br>" + comp + "/" + maxComp + "</button>";
                    }
                    ret += "<br>";
                }
                ret += "<br>"
            }
            
            if (layer.upgrades) {
                ret += "<h2>Upgrades</h2><br><br>";
                let colRange = [9, 0];
                let rowRange = [Infinity, 0];
                for (let upgrade in layer.upgrades) {
                    if (upgrade == "rows" || upgrade == "cols") continue;
                    colRange[0] = Math.min(colRange[0], upgrade.slice(-1))
                    colRange[1] = Math.max(colRange[1], upgrade.slice(-1))
                    rowRange[0] = Math.min(rowRange[0], upgrade.slice(0, -1))
                    rowRange[1] = Math.max(rowRange[1], upgrade.slice(0, -1))
                }
                for (let i = rowRange[0]; i <= rowRange[1]; i++) {
                    for (let j = colRange[0]; j <= colRange[1]; j++) {
                        let exists = layer.upgrades[i+""+j];
                        let style = (exists ? "" : "opacity: 0");

                        let id = (exists ? i+""+j : "");
                        
                        let cssClass = (exists && hasUpgrade(layerName, id) ? "bought" : "locked");

                        ret += "<button style='" + style + "' class='debugButton " + cssClass + "' onclick=\"buyUpgrade('" + layerName + "', '" + id + "', false, true)\">" + i + j + "</button>";
                    }
                    ret += "<br>";
                }
                ret += "<br>";
            }
        }

        return ret;
    },

    attributeViewer() {
        let ret = "<h2>Attributes</h2><br><br>";
        let tableData = {};

        let layer = player[this.layer].activeLayer;

        for (let attribute in player[layer]) {
            if (["achievements", "buyables", "challenges", "clickables", "milestones", "upgrades", "levels"].includes(attribute)) continue;
            
            if (["points", "best", "total", "lifetimeBest", "lifetimeTotal"].includes(attribute)) tableData[attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1')] = formatWhole(player[layer][attribute]) + " (Decimal)";
            else if (["resetTime"].includes(attribute)) tableData[attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1')] = formatTime(player[layer][attribute]);
            else tableData[attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1')] = player[layer][attribute];
        }

        ret += formatTable(tableData, {
            headings: ["Attribute", "Value"],
        }); 

        return ret;
    },

    tabFormat: [
        ["display-text", function() {
            return tmp.debugLayers.createDropDownMenu;
        }],
        "blank",
        ["display-text", "<button class=resetButton onclick='player[player.debugLayers.activeLayer] = getStartPlayer()[player.debugLayers.activeLayer]';><h2>Reset This Layer<h2></button>"],
        "blank",
        ["display-text", function() {
            return tmp.debugLayers.componentEditor;
        }],
        ["display-text", function() {
            return tmp.debugLayers.attributeViewer;
        }],
        "blank",
    ],
});

addLayer("debugSaves", {
    tabFormat: [

    ],
});