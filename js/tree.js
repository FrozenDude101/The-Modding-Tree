var layoutInfo = {
    startTab: "none",
	showTree: true,
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [
        ["tree", function() {
            return [
                ["red", "yellow", "blue", "orange", "green", "purple", "black", "white", "grey", "pink"],
            ];
        }],
    ],
});