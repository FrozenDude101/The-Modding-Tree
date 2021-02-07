//vscode-fold=1

function generateIDs() {

    let r;
    let IDS = ["base", "trunk1", "trunk2", "trunk3"];

    r = nRand();
    IDS = IDS.concat(generateBranchIDs("branch21"))
    if (r > 0.5) {
        IDS = IDS.concat(generateBranchIDs("branch22"))
    }
    r = nRand();
    IDS = IDS.concat(generateBranchIDs("branch31"))
    if (r > 0.5) {
        IDS = IDS.concat(generateBranchIDs("branch32"))
    }

    return IDS;

}

function generateBranchIDs(base) {

    let r;
    let branchIDs = [base];

    if (base.length == 10) return branchIDs;
    
    r = nRand();
    if (r > 0.25) {
        branchIDs = branchIDs.concat(generateBranchIDs(base + "1"))
        if (r > 0.66) {
            branchIDs = branchIDs.concat(generateBranchIDs(base + "2"))
        }
    }

    return branchIDs;

}

function generateTree() {
    
    let treeData = {};

    for (let ID of data.IDS) {
        switch(ID.split(/[0-9]/)[0]) {
            case "base":
                treeData[ID] = {
                    type: "base",
                    states: {},
                };
                for (let i = 0; i <= 6; i++) {
                    treeData[ID].states[i] = {
                        position: [2, 4],
                        branches: [],
                    };
                }
                break;
            case "trunk":
                treeData[ID] = {
                    type: "trunk",
                    root: (ID == "trunk1" ? "base" : "trunk" + (ID[5]-1)),
                    length: 0.5 + nRand(),
                    states: {},
                };
                for (let i = ID[5]; i <= 6; i++) {
                    treeData[ID].states[i] = {
                        position: [
                            treeData[treeData[ID].root].states[i].position[0] + 0,
                            treeData[treeData[ID].root].states[i].position[1] - treeData[ID].length
                        ],
                        branches: [],
                    };
                }
                for (let i = 0; i < ID[5]; i++) {
                    treeData[ID].states[i] = {
                        position: [
                            treeData[treeData[ID].root].states[i].position[0],
                            treeData[treeData[ID].root].states[i].position[1]
                        ],
                        branches: [],
                    };
                }
                break;
            case "branch":
                treeData[ID] = {
                    type: "branch",
                    root: (ID.length == 8 ? "trunk" + ID[6] : ID.substring(0, ID.length-1)),
                    length: 0.5 + nRand()/2,
                    angle: (bRand()*2 - 1) * Math.PI/2 + nRand() * Math.PI/3 - Math.PI/6,
                    states: {},
                };
                if (ID.length > 8) {
                    treeData[ID].angle = treeData[treeData[ID].root].angle + (bRand()*2 - 1) * Math.PI/9 + (bRand()*2 - 1) * Math.PI/18;
                }
                for (let i = ID[6] - 7 + ID.length; i <= 6; i++) {
                    treeData[ID].states[i] = {
                        position: [
                            treeData[treeData[ID].root].states[i].position[0] + treeData[ID].length * Math.sin(treeData[ID].angle),
                            treeData[treeData[ID].root].states[i].position[1] + treeData[ID].length * Math.cos(treeData[ID].angle),
                        ],
                        branches: [],
                    };
                }
                for (let i = 0; i < ID[6] - 7 + ID.length; i++) {
                    treeData[ID].states[i] = {
                        position: [
                            treeData[treeData[ID].root].states[i].position[0],
                            treeData[treeData[ID].root].states[i].position[1]
                        ],
                        branches: [],
                    };
                }
                break;
        }
    }

    return treeData;

}

function newTree(seed = Math.floor(Math.random()*255)) {

    player.seed = seed;
    data.previousRandom = seed;
    data.IDS = generateIDs();
    data.TREE = generateTree();

}

function generateLayers() {

    let IDs = ["base"];
    for (let i = 1; i <= 3; i ++) {
        IDs.push("trunk" + i);
    }
    for (let i = 2; i <= 3; i ++) {
        for (let j = 1; j <= 2; j ++) {
            IDs.push("branch" + i + j);
            for (let k = 1; k <= 2; k ++) {
                IDs.push("branch" + i + j + k);
                for (let l = 1; l <= 2; l ++) {
                    IDs.push("branch" + i + j + k + l);
                }
            }
        }
    }

    for (let ID of IDs) {
        addNode(ID, {
            branches() {
                if (!data.IDS.includes(ID)) return [];
                return [data.TREE[ID].root];
            },

            nodeStyle() {
                if (!data.IDS.includes(ID)) return {};
                return {
                    position: "absolute",
                    top: "calc(120px + " + 120*data.TREE[ID].states[player.state].position[1] + "px)",
                    left: "calc((50% - 300px) + " + 120*data.TREE[ID].states[player.state].position[0] + "px)",
                };
            },

            layerShown: "ghost",
        })
    }

}

generateLayers();