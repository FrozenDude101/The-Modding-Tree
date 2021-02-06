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
    tabFormat: [
        ["clickable", 11],
        ["tree", [
            ["base", "trunk"],
        ]]
    ],

    clickables: {
        11: {
            title() {
                return "Current State<br>" + player.growthState;
            },
            canClick: true,
            onClick() {
                let states = ["initial", "growth1", "growth2", "growth3"];
                let state = player.growthState;
                while (state == player.growthState) {
                    state = states[Math.floor(Math.random()*states.length)];
                }
                setGrowthState(state);
            },

            style: {
                position: "relative",
                top: "-45px",
            }
        },
    }
})