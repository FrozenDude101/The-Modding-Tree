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
        "blank",
        ["tree", function() {
            return [data.IDS];
        }],
    ],

    clickables: {
        11: {
            title() {
                return "New Tree<br><br>Current Seed<br>" + player.seed;
            },
            canClick: true,
            onClick() {
                newTree();
            },
        }
    }
})