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
        Components: {
            content: [
                ["display-text", "Click a component to find out about it.", {position: "relative", top: "-10px"}],
                ["tree", [
                    ["Cachievements", "Cbuyables", "Cchallenges", "Cclickables", "Cmilestones", "Cother", "Ctabs", "Ctrees", "CtreesNode", "Cupgrades"],
                ]]
            ],

            style: {
                position: "relative",
                top: "-90px",
            }
        },
    },
})