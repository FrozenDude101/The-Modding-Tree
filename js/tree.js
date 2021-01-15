var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: [
        ["red", "yellow", "blue", "orange", "green", "purple", "black", "white", "lightGrey", "darkGrey", "pink"],
    ],
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})