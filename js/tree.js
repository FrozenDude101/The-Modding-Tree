var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: [
        [],
        [],
        ["red", "blank", "blank", "white"],
        ["purple", "orange", "blank", "lightGrey", "darkGrey"],
        ["blue", "green", "yellow", "blank", "black", "blank"],
    ],
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})