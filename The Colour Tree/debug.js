//vscode-fold=1

addLayer("debug", {
    symbol: "🐞",
    row: "side",

    tooltip: "Debug",

    layerShown() {
        return gameEnded || player.forceDebug;
    },
    autoSave() {
        if (player.forceDebug) return;
        if (player.autosave) save();
        if (tmp[this.layer].layerShown) player.autosave = false;
    },

    tabFormat: {
        Information: {
            content: [
                ["display-text", `
                Welcome to the debug screen!<br>
                Feel free to play around with any of these debug settings!<br>
                <br>
                Don't worry about your save.<br>
                Anything you do won't be kept after you refresh.<br>
                <br>
                Feel free to use the console to edit any values.<br>
                You can use the Layers tab to view and edit data about a layer.<br>
                You can use the Options tab to toggle various debug options.<br>
                <br>
                This is mainly for my use.<br>
                So these screens are unlikely to be updated frequently.<br>
                `],
            ],
        },
        Layers: {
            embedLayer: "debugLayers",
        },
        Options: {
            embedLayer: "debugOptions",
        },
    },
});

addLayer("debugLayers", {
    startData() {
        return {
            activeLayer: "none",
        };
    },
    activeLayer() {
        if (document.getElementById("selectLayer")) player[this.layer].activeLayer = document.getElementById("selectLayer").value;
    },

    createDropDownMenu() {
        let ret = "<select id=selectLayer>";
        for (let LAYER of ["none"].concat(LAYERS)) {
            if (["info-tab", "options-tab", "changelog-tab", "blank", "tree-tab", "achievements", "secrets", "help", "statistics", "debug", "debugLayers", "debugOptions", "red", "yellow", "blue", "orange", "green", "purple", "black", "white", "grey", "pink"].includes(LAYER)) continue;
            let selected = (LAYER == player[this.layer].activeLayer ? "selected='selected'" : "");
            ret += "<option value=" + LAYER + " " + selected + ">" + LAYER.charAt(0).toUpperCase() + LAYER.slice(1).replace(/([A-Z])/g,' $1') + "</option>";
        }
        ret += "</select>";
        return ret;
    },
    componentEditor() {
        let ret = "";
        let layerName = player[this.layer].activeLayer;

        if (typeof player[this.layer].activeLayer == "string" && player[this.layer].activeLayer != "none") {
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
            
            if (layer.buyables) {
                ret += "<h2>Buyables</h2><br><br>";
                let colRange = [9, 0];
                let rowRange = [Infinity, 0];
                for (let buyable in layer.buyables) {
                    if (buyable == "rows" || buyable == "cols" || buyable == "layer") continue;
                    colRange[0] = Math.min(colRange[0], buyable.slice(-1))
                    colRange[1] = Math.max(colRange[1], buyable.slice(-1))
                    rowRange[0] = Math.min(rowRange[0], buyable.slice(0, -1))
                    rowRange[1] = Math.max(rowRange[1], buyable.slice(0, -1))
                }
                for (let i = rowRange[0]; i <= rowRange[1]; i++) {
                    for (let j = colRange[0]; j <= colRange[1]; j++) {
                        let exists = layer.buyables[i+""+j];
                        let style = (exists ? "" : "opacity: 0");

                        let id = (exists ? i+""+j : "");
                        let amount = (exists ? formatWhole(getBuyableAmount(layerName, id)) : "")

                        let cssClass = (exists && getBuyableAmount(layerName, id).gte(1) ? "bought" : "locked");

                        ret += "<button style='" + style + "' class='debugButton " + cssClass + "' onclick=\"buyBuyable('" + layerName + "', '" + id + "', true)\">" + i + j + "<br>" + amount + "</button>";
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

        if (layer == "none") {
            for (let attribute in player) {
                if (typeof player[attribute] == "object" && !(player[attribute] instanceof Decimal)) continue;
                if (player[attribute] == undefined) continue;
                if (["navTab"].includes(attribute)) continue;

                let name = attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1');
                if (name == "Has Na N") name = "Has NaN";   

                if ((player[attribute] instanceof Decimal)) tableData[name] = formatWhole(player[attribute]) + " (Decimal)";
                else if (["timePlayed"].includes(attribute)) tableData[name] = formatTime(player[attribute]) + " (Integer)";
                else if (["time"].includes(attribute)) tableData[name] = formatTime(player[attribute]/1000);
                else tableData[name] = player[attribute];
            }

        } else {
            for (let attribute in player[layer]) {
                if (["achievements", "buyables", "challenges", "clickables", "milestones", "upgrades", "levels"].includes(attribute)) continue;

                let name = attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1');
                
                if ((player[layer][attribute] instanceof Decimal)) tableData[name] = formatWhole(player[layer][attribute]) + " (Decimal)";
                else if (["resetTime"].includes(attribute)) tableData[name] = formatTime(player[layer][attribute]);
                else tableData[name] = player[layer][attribute];
            }
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

addLayer("debugOptions", {
    startData() {
        return {
            showAll: false,
            infinitePoints: false,
        };
    },
    infinitePoints() {
        if (!player[this.layer].infinitePoints) return;
        player.points = new Decimal("1eeeeeeeeee1");
        player.redPigment.points = new Decimal("1eeeeeeeeee1");
        player.yellowPigment.points = new Decimal("1eeeeeeeeee1");
        player.bluePigment.points = new Decimal("1eeeeeeeeee1");
        player.orangePigment.points = new Decimal("1eeeeeeeeee1");
        player.greenPigment.points = new Decimal("1eeeeeeeeee1");
        player.purplePigment.points = new Decimal("1eeeeeeeeee1");
    },

    tabFormat: [
        ["row", [
            ["column", [
                ["display-text", "Show All"],
                ["toggle", ["debugOptions", "showAll"]],
            ]],
            "blank",
            "blank",
            "blank",
            "blank",
            ["column", [
                ["display-text", "Infinite Points"],
                ["toggle", ["debugOptions", "infinitePoints"]],
            ]],
        ]],
    ],
});