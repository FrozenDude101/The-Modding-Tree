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
    tabFormat: {
        JavaScript: {
            content: [
                ["tree", [
                    ["JStypes", "JScomments", "JSvariables", "JSfunctions", "JSdebugging", "JSconditions", "JSobjects", "JSloops"],
                ]]
            ],

            style: {
                position: "relative",
                top: "-75px",
            }
        },
    },
})