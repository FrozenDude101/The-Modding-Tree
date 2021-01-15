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
                ["white", "lightGrey", "darkGrey", "black"],
                ["pink", "red", "blank"],
                ["purple", "orange"],
                ["blue", "green", "yellow"],
            ];
        }],
    ],
});