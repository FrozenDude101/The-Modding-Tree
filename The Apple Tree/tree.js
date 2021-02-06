//vscode-fold=1

const TREE_DATA = [
    {id: "base"},
    {id: "trunk"},
]

var NODE_DATA = {
    initial: {
        base:  {position: [2, 4], branches: []},
        trunk: {position: [2, 4], branches: []},
        time: 0.5,
    },
    growth1: {
        base:  {position: [2, 4], branches: []},
        trunk: {position: [2, 3], branches: [{id: "base", colour: "#974", width: 15}]},
        time: 3,
    },
    growth2: {
        base:  {position: [2, 4], branches: []},
        trunk: {position: [2, 2], branches: [{id: "base", colour: "#752", width: 30}]},
        time: 3,
    },
    growth3: {
        base:  {position: [2, 4], branches: []},
        trunk: {position: [2, 1], branches: [{id: "base", colour: "#530", width: 45}]},
        time: 3,
    },
};

function setGrowthState(state) {

    player.previousGrowthState = player.growthState;
    player.growthState = state;
    player.growthTime = player.time + NODE_DATA[state].time*1000;

}

function getNodeStyle(position) {

    return {
        position: "absolute",
        top: "calc(120px + " + 120*position[1] + "px)",
        left: "calc((50% - 300px) + " + 120*position[0] + "px)",
    };

}

for (let LAYER of TREE_DATA) {

    addNode(LAYER.id, {

        branches() {
            if (tmp[LAYER.id].transition instanceof Decimal) return [];
            return tmp[LAYER.id].transition.branches;
        },

        nodeStyle() {
            if (tmp[LAYER.id].transition instanceof Decimal) return {};
            return getNodeStyle(tmp[LAYER.id].transition.position);
        },

        startData() {
            return {

            };
        },
        transition() {
            let targetState = NODE_DATA[player.growthState][LAYER.id];
            let previousState = NODE_DATA[player.previousGrowthState][LAYER.id];

            let time = player.growthTime - player.time;
            if (time < 0 && !(tmp[LAYER.id].transition instanceof Decimal)) return targetState;
            if (tmp[LAYER.id].transition instanceof Decimal) time = 0;
            time /= NODE_DATA[player.growthState].time*1000;

            let branches = [];
            for (let branch of targetState.branches) {
                let newBranch = true;
                for (let oldBranch of previousState.branches) {
                    if (branch.id == oldBranch.id) {
                        newBranch = false;
                        branches.push({id: branch.id, colour: colourApproach(branch.colour, oldBranch.colour, time), width: approach(branch.width, oldBranch.width, time)});
                        break;
                    }
                }
                if (newBranch) branches.push(branch);
            }

            return {
                position: [
                    approach(targetState.position[0], previousState.position[0], time),
                    approach(targetState.position[1], previousState.position[1], time),
                ],
                branches: branches,
            };
        },

        layerShown: true,

    });

}