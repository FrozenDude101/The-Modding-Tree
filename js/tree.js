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
        "clickables",
        "blank",
        ["tree", function() {
            return [data.IDS];
        }],
    ],

    clickables: {
        rows: 1,
        cols: 2,

        11: {
            title() {
                return "New Seed<br><br>Current Seed<br>" + player.seed%256;
            },
            canClick: true,
            onClick() {
                newTree();
            },
            style: {
                position: "relative",
                top: "-60px",
            },
        },
        12: {
            title() {
                return (player.state.current == 4 ? "Reset Growth" : "Increment Growth") + "<br><br>Current State<br>" + player.state.current;
            },
            canClick() {
                return player.time - player.state.time > 10000 || player.state.current == 0;
            },
            onClick() {
                setState((player.state.current + 1) % 5)
            },
            style: {
                position: "relative",
                top: "-60px",
            },
        }
    },
})