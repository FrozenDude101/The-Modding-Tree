//vscode-fold=1

function generateTree() {

    const DATA = [{id: "0"}].concat(generateIDs());
    const TREE = {};
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
                        branches: [{id: TREE[ID].root, colour: colourApproach("#862", "#530", i/4), width: approach(0, LEN*30, i/4)}],
                    };
                }
            }
        }
    }

    return TREE;

}

function generateIDs(id = "00", growth = 4, split = false) {

    let r1, r2;
    let IDs;

    r1 = growth*0/6 + growth/3;
    if (r1 < 0.3) return [];
    IDs = [{id: id, length: r1, split: split}];
    r2 = bRand(0.75);

    IDs = IDs.concat(generateIDs(id + "0", growth - r1, r2));
    if (r2) {
        IDs = IDs.concat(generateIDs(id + "1", growth - r1, r2));
    }

    return IDs;
}

function newTree(seed = Math.floor(Math.random()*255)) {

    player.seed = seed;
    data.previousRandom = seed;
    data.TREE = generateTree();

}

function setState(state) {

    player.state.previous = player.state.current;
    player.state.current = state;
    player.state.time = player.time;

}

function generateLayers() {

    let IDs = ["0"];
    for (let i = 0; i <= 1; i ++) {
        IDs.push("0" + i);
        for (let j = 0; j <= 1; j ++) {
            IDs.push("0" + i + j);
            for (let k = 0; k <= 1; k ++) {
                IDs.push("0" + i + j + k);
                for (let l = 0; l <= 1; l ++) {
                    IDs.push("0" + i + j + k + l);
                }
            }
        }
    }

    for (let ID of IDs) {
        addNode(ID, {
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
                            branches.push({id: newBranch.id, colour: colourApproach(data.TREE[data.TREE[ID].root].states[player.state.previous].branches[0].colour, newBranch.colour, stateTime), width: newBranch.width});
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
        })
    }

}

generateLayers();