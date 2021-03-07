var layoutInfo = {
    startTab: "none",
	showTree: true,
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)

addLayer("tree-tab", {

    getGrowthDivider() {
    
        let ret = 1;
        if (hasUpgrade(this.layer, 11)) ret *= upgradeEffect(this.layer, 11);
        if (hasUpgrade(this.layer, 12)) ret *= upgradeEffect(this.layer, 12);
        ret *= 1.1 ** parseInt(getBuyableAmount(this.layer, 11));
        return ret;
    
    },
    getAppleDivider() {
    
        let ret = 1;
        if (hasUpgrade(this.layer, 11)) ret *= upgradeEffect(this.layer, 11);
        if (hasUpgrade(this.layer, 12)) ret *= upgradeEffect(this.layer, 12);
        ret *= buyableEffect(this.layer, 11);
        return ret;

    },
    getAppleMultiplier() {
    
        let ret = 1;
        if (hasUpgrade(this.layer, 11)) ret *= 1.5;
        if (hasUpgrade(this.layer, 14)) ret *= 2;
        ret *= buyableEffect(this.layer, 12);
        return ret;
        
    },
    getWoodMultiplier() {
    
        let ret = 1;
        return ret;
        
    },

    tabFormat: [
        ["row", [
            ["tree", function() {
                return [data.IDS];
            }],
            ["display-text", "<h2>Actions</h2>", {
                position: "absolute",
                top: "100px",
                left: "calc((50% - 540px - 1em)",

                width: "calc(250px + 1em)",

                "text-align": "center",
            }],
            ["column", [
                ["clickable", 21],
                "blank",
                ["clickable", 22],
            ], {
                position: "absolute",
                top: "140px",
                left: "calc((50% - 540px - 1em)",
            }],
            ["column", [
                ["clickable", 11],
                "blank",
                ["clickable", 12],
            ], {
                position: "absolute",
                top: "140px",
                left: "calc((50% - 420px)",
            }],
            ["display-text", "<h2>Shop</h2>", {
                position: "absolute",
                top: "100px",
                left: "calc((50% + 295px)",

                width: "calc(250px + 1em)",

                "text-align": "center",
            }],
            ["column", function() {
                return tmp["tree-tab"].getUpg;
            }, {
                position: "absolute",
                top: "140px",
                left: "calc((50% + 295px)",
            }],
            ["column", function() {
                return tmp["tree-tab"].getBuy;
            }, {
                position: "absolute",
                top: "140px",
                left: "calc((50% + 425px + 1em)",
            }],
        ]]
    ],

    getUpg() {
        let upgOrder = [11, 12, 13, 14];
        let ret = [];
        for (let upg of upgOrder) {
            if (ret.length >= 3) break;
            if (!player[this.layer].upgrades.includes(upg)) {
                ret.push(["upgrade", upg]);
                ret.push("blank");
            }
        };
        ret.pop();
        return ret;
    },
    getBuy() {
        let buyOrder = [11, 12, 13];
        let ret = [];
        for (let buy of buyOrder) {
            if (!tmp[this.layer].buyables[buy].unlocked) continue;
            ret.push(["buyable", buy]);
            ret.push("blank");
        };
        ret.pop();
        return ret;
    },

    componentStyles: {
        buyable: {
            height: "120px",
            width: "120px",
        },
    },

    clickables: {
        11: {
            title: "Sell All Apples",
            display() {
                return "($" + format(data.applePrice) + " each)";
            },
            unlocked() {
                if (!player.flags.sellApples) player.flags.sellApples = player.resources.apples >= 1;
                return player.flags.sellApples;
            },
            
            canClick() {
                return player.resources.apples > 0;
            },
            onClick() {
                player.flags.money = true;
                player.resources.money += player.resources.apples * data.applePrice;
                player.resources.apples = 0;
            },
        },
        12: {
            title: "Sell All Wood",
            display() {
                return "($" + format(data.woodPrice) + " each)";
            },
            unlocked() {
                if (!player.flags.plantTree) player.flags.plantTree = player.resources.wood >= 1;
                return player.flags.plantTree;
            },
            
            canClick() {
                return player.resources.wood > 0;
            },
            onClick() {
                player.resources.money += player.resources.wood * data.woodPrice;
                player.resources.wood = 0;
            },
        },
        21: {
            title: "Chop Down The Tree",
            style() {
                let amount = parseInt(getClickableState(this.layer, this.id) + 1) || 1;
                amount -= 1;
                amount *= 100 / (4 + parseInt(getBuyableAmount(this.layer, 13)));
                amount = 95 - amount;
                if (amount == 95) amount = 100;
                return {
                    "background-image": "linear-gradient(rgba(0, 0, 0, 0) " + amount + "%, rgba(0, 0, 0, 0.25) " + (amount + 5) + "%)",
                };
            },
            unlocked() {
                return hasUpgrade(this.layer, 13);
            },

            canClick() {
                let growthTime = 10000 / tmp[this.layer].getGrowthDivider;
                return player.state.current == 4 && player.state.time + growthTime < player.time;
            },
            onClick() {
                setClickableState(this.layer, this.id, parseInt(getClickableState(this.layer, this.id) + 1) || 1);
                if (getClickableState(this.layer, this.id) == (4 + parseInt(getBuyableAmount(this.layer, 13)))) {
                    setClickableState(this.layer, this.id, 0);
                    for (let id of data.IDS) {
                        if (id[0] == "A" || id[0] == "L" || id == "0") continue;
                        player.flags.wood = true;
                        player.resources.wood += buyableEffect(this.layer, 13);
                        data.IDS = [];
                        setState(0);
                        player.flags.plant = true;
                    }
                }
            },
        },
        22: {
            title: "Plant A New Tree",
            unlocked() {
                if (!player.flags.plantTree) player.flags.plantTree = player.resources.wood >= 1;
                return player.flags.plantTree;
            },

            canClick() {
                return player.flags.plant;
            },
            onClick() {
                player.flags.plant = false;
                for (let id in player.toAdd) {
                    setBuyableAmount(this.layer, id, getBuyableAmount(this.layer, id).add(player.toAdd[id]));
                }
                player.toAdd = {};
                newTree();
            },
        },
    },
    upgrades: {
        11: {
            fullDisplay: `
                <h2>Watering Can</h2><br><br>
                Water grows plants faster, and improves apple quality.<br><br>
                <h3>$5<br>
                x1.5</h3>
            `,
            unlocked() {
                if (!player.flags.wateringCan) player.flags.wateringCan = player.resources.money >= 1;
                return player.flags.wateringCan;
            },
            
            canAfford() {
                return player.resources.money >= 5;
            },
            pay() {
                player.resources.money -= 5;
            },

            effect() {
                return 1.5;
            },
        },
        12: {
            fullDisplay: `
                <h2>Fertiliser</h2><br><br>
                Extra nutrients to increase yields.<br><br>
                <h3>$10<br>
                x1.5</h3>
            `,
            unlocked() {
                return hasUpgrade(this.layer, 11);
            },

            canAfford() {
                return player.resources.money >= 10;
            },
            pay() {
                player.resources.money -= 10;
            },

            effect() {
                return 1.5;
            },
        },
        13: {
            fullDisplay: `
                <h2>Axe</h2><br><br>
                Strong enough to chop down the toughest of trees.<br><br>
                <h3>$50</h3>
            `,

            canAfford() {
                return player.resources.money >= 50;
            },
            pay() {
                player.resources.money -= 50;
            },
        },
        14: {
            fullDisplay: `
                <h2>Basket</h2><br><br>
                Reduce the chance of apples bruising, increasing their value.<br><br>
                <h3>$200<br>
                x2</h3>
            `,

            canAfford() {
                return player.resources.money >= 200;
            },
            pay() {
                player.resources.money -= 200;
            },

            effect() {
                return 2;
            },
        },
    },
    buyables: {
        11: {
            title: "Fertilizer Strength",
            display() {
                return `Even more nutrients for the apple tree.<br><br><h3>$` + tmp[this.layer].buyables[this.id].money + `<br>` +  + tmp[this.layer].buyables[this.id].apples + ` apples<br>x` + format(buyableEffect(this.layer, this.id)) + `</h3>`;
            },
            unlocked() {
                return hasUpgrade(this.layer, 12);
            },

            money() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + 1;
                if (amount < 5) {
                    return 5 * amount ** 2 + 5 * amount;
                } else {
                    return 150 * 2 ** (amount - 5);
                }
            },
            apples() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + 1;
                if (amount < 5) {
                    return 5 * amount;
                } else {
                    return 25 * 2 ** (amount - 5);
                }
            },
            canAfford() {
                return player.resources.money >= tmp[this.layer].buyables[this.id].money && player.resources.apples >= tmp[this.layer].buyables[this.id].apples;
            },
            buy() {
                player.resources.money -= tmp[this.layer].buyables[this.id].money;
                player.resources.apples -= tmp[this.layer].buyables[this.id].apples;
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },

            effect() {
                return 1.5 ** parseInt(getBuyableAmount(this.layer, this.id));
            },
        },
        12: {
            title: "Apple Size",
            display() {
                return `A new genome with larger, more valuable apples.<br>Effects next tree.<br><br><h3>$` + tmp[this.layer].buyables[this.id].money + `<br>` +  + tmp[this.layer].buyables[this.id].apples + ` apples<br>x` + format(buyableEffect(this.layer, this.id)) + `</h3>`;
            },
            unlocked() {
                return hasUpgrade(this.layer, 13);
            },

            money() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + (player.toAdd[this.id] || 0);
                return 25 * 2 ** amount;
            },
            apples() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + (player.toAdd[this.id] || 0);
                return Math.ceil(12.5 * 2 ** amount);
            },
            canAfford() {
                return player.resources.money >= tmp[this.layer].buyables[this.id].money && player.resources.apples >= tmp[this.layer].buyables[this.id].apples;
            },
            buy() {
                player.resources.money -= tmp[this.layer].buyables[this.id].money;
                player.resources.apples -= tmp[this.layer].buyables[this.id].apples;
                if (!player.toAdd[this.id]) player.toAdd[this.id] = 0;
                player.toAdd[this.id] += 1;
            },

            effect() {
                return 1.2 ** parseInt(getBuyableAmount(this.layer, this.id));
            },
        },
        13: {
            title: "Wood Quality",
            display() {
                return `A new genome with thicker wood.<br>Effects next tree.<br><br><h3>$` + tmp[this.layer].buyables[this.id].money + `<br>` + tmp[this.layer].buyables[this.id].wood + ` wood<br>x` + format(buyableEffect(this.layer, this.id)) + `</h3>`;
            },
            unlocked() {
                if (!player.flags.woodQuality) player.flags.woodQuality = player.resources.wood >= 20;
                return player.flags.woodQuality;
            },

            money() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + (player.toAdd[this.id] || 0);
                return 60 * 2 ** amount;
            },
            wood() {
                let amount = parseInt(getBuyableAmount(this.layer, this.id)) + (player.toAdd[this.id] || 0);
                return 30 * 2 ** amount;
            },
            canAfford() {
                return player.resources.money >= tmp[this.layer].buyables[this.id].money && player.resources.wood >= tmp[this.layer].buyables[this.id].wood;
            },
            buy() {
                player.resources.money -= tmp[this.layer].buyables[this.id].money;
                player.resources.wood -= tmp[this.layer].buyables[this.id].wood;
                if (!player.toAdd[this.id]) player.toAdd[this.id] = 0;
                player.toAdd[this.id] += 1;
            },

            effect() {
                return 1.2 ** parseInt(getBuyableAmount(this.layer, this.id));
            },
        },
    },
})