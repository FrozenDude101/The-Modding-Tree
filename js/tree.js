var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: [
        [],
        [],
        ["red"],
        ["purple", "orange"],
        ["blue", "green", "yellow"],
    ],
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})