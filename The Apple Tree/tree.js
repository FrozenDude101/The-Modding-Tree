//vscode-fold=1

function generateTree() {

    const DATA = [{id: "0"}].concat(generateIDs());
    const TREE = {};
    data.IDS = [];
    for (let OBJ of DATA) {
        ID = OBJ.id;
        LEN = OBJ.length;
        SPLIT = OBJ.split;
        data.IDS.push(ID);

        if (ID == "0") {
            TREE[ID] = {
                states: {},
                angle: 0,
            };
            for (let i = 0; i <= 4; i ++) {
                TREE[ID].states[i] = {
                    time: 0,
                    position: [2, 4],
                    branches: [{id: "", colour: "#593", width: 0}],
                };
            }
        } else {
            TREE[ID] = {
                root: ID.slice(0, -1),
                angle: Math.PI*(SPLIT*(ID[ID.length-1]*60-30) + nRand()*10*ID.length - 5*ID.length)/180,
                length: LEN,
                states: {},
            };
            for (let i = 0; i <= 4; i ++) {
                if (i+1 < ID.length) {
                    TREE[ID].states[i] = {
                        time: 0,
                        position: [
                            TREE[TREE[ID].root].states[i].position[0],
                            TREE[TREE[ID].root].states[i].position[1],
                        ],
                    };
                } else {
                    TREE[ID].states[i] = {
                        time: 10000,
                        position: [
                            TREE[TREE[ID].root].states[i].position[0]-LEN*Math.sin(TREE[TREE[ID].root].angle + TREE[ID].angle),
                            TREE[TREE[ID].root].states[i].position[1]-LEN*Math.cos(TREE[TREE[ID].root].angle + TREE[ID].angle),
                        ],
                        branches: [{id: TREE[ID].root, colour: colourApproach("#862", "#530", i/4), width: approach(0, (7-ID.length)*5, i/4)}],
                    };
                }
            }
            if (ID.length >= 4) {
                generateLeaves(ID, TREE);
                generateApple(ID);
            }
        }
    }

    return TREE;

}

function generateIDs(id = "00", growth = 4, split = false) {

    let r1, r2;
    let IDs;

    r1 = growth*nRand()/6 + growth/3;
    if (r1 < 0.3 || id.length > 5) return [];
    IDs = [{id: id, length: r1, split: split}];
    r2 = bRand(0.75);

    IDs = IDs.concat(generateIDs(id + "0", growth - r1, r2));
    if (r2) {
        IDs = IDs.concat(generateIDs(id + "1", growth - r1, r2));
    }

    return IDs;
}

function generateLeaves(ID, TREE) {

    const ROOT = TREE[ID];
    const offset = nRand()*Math.PI*2;
    for (let i = 0; i < 3; i ++) {
        data.IDS.push("L" + i + ID);
        let leafID = "L" + i + ID;
        TREE[leafID] = {
            root: ID,
            angle: offset + Math.PI*2*i/3,
            states: {},
        }
        for (let j = 0; j <= 4; j ++) {
            if (j+1 < ID.length) {
                TREE[leafID].states[j] = {
                    time: 0,
                    scale: 0,
                    position: [
                        TREE[TREE[leafID].root].states[j].position[0],
                        TREE[TREE[leafID].root].states[j].position[1],
                    ],
                    colour: "#CF9",
                };
            } else {
                TREE[leafID].states[j] = {
                    time: 10000,
                    scale: 1,
                    position: [
                        TREE[TREE[leafID].root].states[j].position[0]-0.4*Math.sin(TREE[TREE[leafID].root].angle + TREE[leafID].angle),
                        TREE[TREE[leafID].root].states[j].position[1]-0.4*Math.cos(TREE[TREE[leafID].root].angle + TREE[leafID].angle),
                    ],
                    colour: colourApproach("#CF9", "#5A0", j/4),
                };
            }
        }
    }

}

function generateApple(ID) {

    
    for (let i = 0; i < 3; i ++) {
        data.IDS.push("A" + i + ID);
    }

}

function newTree(seed = Math.floor(Math.random()*255)) {

    player.seed = seed;
    data.previousRandom = seed;
    data.TREE = generateTree();
    if (player.fruiting) {
        for (apple of player.fruiting) {
            player.apples[apple] = DEFAULT_APPLE();
        }
        player.fruiting = [];
    }

}

function setState(state) {

    player.state.previous = player.state.current;
    player.state.current = state;
    player.state.time = player.time;

}

function generateLayers() {

    let IDs = ["0"];
    for (let i = 0; i < 2; i ++) {
        IDs.push("0" + i);
        for (let j = 0; j <= 1; j ++) {
            IDs.push("0" + i + j);
            for (let k = 0; k < 2; k ++) {
                IDs.push("0" + i + j + k);
                for (let l = 0; l < 3; l ++) {
                    IDs.push("L" + l + "0" + i + j + k);
                }
                for (let l = 0; l < 2; l ++) {
                    IDs.push("0" + i + j + k + l);
                    for (let m = 0; m < 3; m ++) {
                        IDs.push("L" + m + "0" + i + j + k + l);
                    }
                }
                for (let l = 0; l < 3; l ++) {
                    IDs.push("A" + l + "0" + i + j + k);
                }
                for (let l = 0; l < 2; l ++) {
                    for (let m = 0; m < 3; m ++) {
                        IDs.push("A" + m + "0" + i + j + k + l);
                    }
                }
            }
        }
    }

    for (let ID of IDs) {
        let nodeData;
        switch (ID[0]) {
            case "A":
                nodeData = {
                    symbol: "",
                    tooltip: "",
                    color() {
                        return player.apples[ID].colour || "#5A0";
                    },
                    nodeStyle() {
                        if (!player.fruiting.includes(ID) || !  data.IDS.includes(ID)) return;
                        return {
                            position: "absolute",
                            top: "calc(120px + " + (120*data.TREE["L" + ID.slice(1)].states[4].position[1] + player.apples[ID].offset[1]) + "px)",
                            left: "calc((50% - 300px) + " + (120*data.TREE["L" + ID.slice(1)].states[4].position[0] + player.apples[ID].offset[0]) + "px)",

                            height: "25px",
                            width: "25px",
                            "z-index": 100,

                            "border-radius": "100%",

                            background: player.apples[ID].colour || "#5A0",
                        };
                    },
                    
                    layerShown() {
                        return player.fruiting.includes(ID) && data.IDS.includes(ID);
                    },

                    canClick() {
                        return player.apples[ID].state >= 2;
                    },
                    onClick() {
                        if (player.apples[ID].state == 2) {
                            player.points = player.points.add(1);
                            player.apples[ID].time = player.time;
                            player.apples[ID].state = 3;
                        }
                    },

                    update(diff) {
                        switch (player.apples[ID].state) {
                            case 1:
                                player.apples[ID].colour = colourApproach("#5A0", "#F00", (player.time - player.apples[ID].time)/10000);
                                if (player.time - player.apples[ID].time > 10000) {
                                    player.apples[ID].state = 2;
                                }
                                break;
                            case 2:
                                player.apples[ID].colour = "#F00";
                                break;
                            case 3:
                                player.apples[ID].offset[1] += 1+10*diff*((player.time - player.apples[ID].time)/1000)**2;
                                if (player.time - player.apples[ID].time > 10000) {
                                    player.fruiting.splice(player.fruiting.indexOf(ID), 1);
                                    player.apples[ID] = DEFAULT_APPLE();
                                }
                        }
                    },
                };
                break;
            case "L":
                nodeData = {
                    symbol: "",
                    tooltip: "",
                    color() {
                        if (tmp[ID].state == undefined || tmp[ID].state instanceof Decimal) return;
                        return tmp[ID].state.colour;
                    },
    
                    nodeStyle() {
                        if (tmp[ID].state == undefined || tmp[ID].state instanceof Decimal) return;
                        return {
                            position: "absolute",
                            top: "calc(120px + " + 120*tmp[ID].state.position[1] + "px)",
                            left: "calc((50% - 300px) + " + 120*tmp[ID].state.position[0] + "px)",
                            background: tmp[ID].state.colour,
                            transform: "scale(" + tmp[ID].state.scale + "," + tmp[ID].state.scale + ")",
                        };
                    },
        
                    state() {
                        if (data.TREE[ID] == undefined) return;
                        let stateTime = (player.time - player.state.time)/data.TREE[ID].states[player.state.current].time;
                        if (stateTime > 1) return {
                            position: data.TREE[ID].states[player.state.current].position,
                            colour: data.TREE[ID].states[player.state.current].colour,
                            scale: data.TREE[ID].states[player.state.current].scale,
                        };
        
                        return {
                            position: [
                                approach(data.TREE[ID].states[player.state.previous].position[0], data.TREE[ID].states[player.state.current].position[0], stateTime),
                                approach(data.TREE[ID].states[player.state.previous].position[1], data.TREE[ID].states[player.state.current].position[1], stateTime),
                            ],
                            colour: colourApproach(data.TREE[ID].states[player.state.previous].colour, data.TREE[ID].states[player.state.current].colour, stateTime),
                            scale: approach(data.TREE[ID].states[player.state.previous].scale, data.TREE[ID].states[player.state.current].scale, stateTime),
                        };
                    },
                    
                    layerShown() {
                        return player.state.current > (ID.length - 4);
                    },
                };
                break;
            default:
                nodeData = {
                    branches() {
                        if (tmp[ID].state == undefined || tmp[ID].state instanceof Decimal) return;
                        return tmp[ID].state.branches;
                    },
        
                    nodeStyle() {
                        if (tmp[ID].state == undefined || tmp[ID].state instanceof Decimal) return;
                        return {
                            position: "absolute",
                            top: "calc(120px + " + 120*tmp[ID].state.position[1] + "px)",
                            left: "calc((50% - 300px) + " + 120*tmp[ID].state.position[0] + "px)",
                        };
                    },
        
                    state() {
                        if (data.TREE[ID] == undefined) return;
                        let stateTime = (player.time - player.state.time)/data.TREE[ID].states[player.state.current].time;
                        if (stateTime > 1) return {
                            position: data.TREE[ID].states[player.state.current].position,
                            branches: data.TREE[ID].states[player.state.current].branches,
                        };
        
                        let branches = [];
                        if (data.TREE[ID].states[player.state.current].branches) {
                            for (let newBranch of data.TREE[ID].states[player.state.current].branches) {
                                let match = false;
                                if (data.TREE[ID].states[player.state.previous].branches) {
                                    for (let oldBranch of data.TREE[ID].states[player.state.previous].branches) {
                                        if (newBranch.id == oldBranch.id) {
                                            match = true;
                                            branches.push({id: newBranch.id, colour: colourApproach(oldBranch.colour, newBranch.colour, stateTime), width: approach(oldBranch.width, newBranch.width, stateTime)});
                                            break;
                                        }
                                    }
                                }
                                if (!match) {
                                    branches.push({id: newBranch.id, colour: colourApproach(data.TREE[data.TREE[ID].root].states[player.state.previous].branches[0].colour, newBranch.colour, stateTime), width: approach(newBranch.width/2, newBranch.width, stateTime)});
                                }
                            }
                        }
        
                        return {
                            position: [
                                approach(data.TREE[ID].states[player.state.previous].position[0], data.TREE[ID].states[player.state.current].position[0], stateTime),
                                approach(data.TREE[ID].states[player.state.previous].position[1], data.TREE[ID].states[player.state.current].position[1], stateTime),
                            ],
                            branches: branches,
                        };
                    },
        
                    layerShown() {
                        return (data.TREE[ID] == undefined ? false : "ghost")
                    },
                };
                break;
        }
        addNode(ID, nodeData)
    }

}

generateLayers();