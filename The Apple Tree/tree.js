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
                    position: [2, 4],
                };
                break;
            case "trunk":
                treeData[ID] = {
                    type: "trunk",
                    root: (ID == "trunk1" ? "base" : "trunk" + (ID[5]-1)),
                    position: [0, -1],
                };
                treeData[ID].position = [treeData[treeData[ID].root].position[0] + treeData[ID].position[0], treeData[treeData[ID].root].position[1] + treeData[ID].position[1]];
                break;
            case "branch":
                treeData[ID] = {
                    type: "branch",
                    root: (ID.length == 8 ? "trunk" + ID[6] : ID.substring(0, ID.length-1)),
                    position: [ID[7]*2-3, 0.5**(ID.length-7)*(ID.length == 8 ? 0 : ID[ID.length-1]*2-3)],
                };
                treeData[ID].position = [treeData[treeData[ID].root].position[0] + treeData[ID].position[0], treeData[treeData[ID].root].position[1] + treeData[ID].position[1]];
                break;
        }
    }

    return treeData;

}

function newTree(seed = Math.floor(Math.random()*255)) {

    player.seed = seed;
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
                    top: "calc(120px + " + 120*data.TREE[ID].position[1] + "px)",
                    left: "calc((50% - 300px) + " + 120*data.TREE[ID].position[0] + "px)",
                };
            },

            layerShown: "ghost",
        })
    }

}

generateLayers();