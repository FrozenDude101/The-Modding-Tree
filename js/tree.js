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
                return "New Seed<br><br>Current Seed<br>" + player.seed;
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
                return (player.state == 6 ? "Reset State" : "Increment Growth") + "<br><br>Current State<br>" + player.state;
            },
            canClick: true,
            onClick() {
                player.state ++;
                player.state %= 7;
            },
            style: {
                position: "relative",
                top: "-60px",
            },
        }
    }
})