//vscode-fold=1

// MILESTONE AND TAB 200PX WIDE.

addLayer("Cachievements", {
    symbol: "<h3>Achievement</h3>",
    tooltip: "Achievements",
    classes: ["achievement", "locked"],
    nodeStyle: getNodeStyle(13.5, 41.5),
});

addLayer("Cbuyables", {
    symbol: `
        <span><h2>Buyables</h2><br></span>
        <span><br>A repeatable upgrade!<br><br>Cost: 1 Completed<br>Buyable Module</span>
    `,
    tooltip: "Buyables",
    classes: ["buyable", "locked"],
    nodeStyle: merge(getNodeStyle(30, 0), {color: "#000"}),
});

addLayer("Cchallenges", {
    symbol() {
        return `
            <h3>Challenges</h3><br><br>
            <button class=longUpg>` + (player.tab == "Cchallenges" ? "Exit Early" : "Start") + `</button><br><br>
            <span>Reduce production and reach<br>a goal for an award!</span><br>
            Goal: <span>Challenge Module Completed</span><br>
            Reward: <span>Challenge Knowledge</span><br>
        `
    },
    tooltip: "Challenges",
    classes: ["hChallenge", "locked"],
    nodeStyle: getNodeStyle(25, 24),
});

addLayer("Cclickables", {
    symbol: `
		<span><h2>Clickables</h2><br></span>
		<span>For anything<br>clickable!</span>
    `,
    tooltip: "Clickables",
    classes: ["upg"],
    nodeStyle: merge(getNodeStyle(14, 0), {color: "#000"}),
});

addLayer("Cmilestones", {
    symbol: `
        <h3>Milestones</h3>
        Milestone Module Completed
    `,
    tooltip: "Milestones",
    classes: ["milestone", "locked"],
    nodeStyle: merge(getNodeStyle(0, 14), {"font-size": "18px", height: "75px", width: "260px"}),
});

addLayer("Cother", {
    symbol: "O",
    tooltip: "Other",
    nodeStyle: getNodeStyle(0, 41),
});

addLayer("Ctabs", {
    symbol: "<span>Tabs</span>",
    tooltip: "Tabs",
    classes: ["tabButton"],
    nodeStyle: merge(getNodeStyle(0, 23.5), {height: "35px", width: "230px"}),
});

addLayer("Ctrees", {
    symbol: "Tr",
    tooltip: "Trees",
    branches: ["CtreesNode", "Cother"],
    nodeStyle: getNodeStyle(0, 29),
});

addNode("CtreesNode", {
    symbol: "ees",
    tooltip: "Trees",
    tooltipLocked: "Trees",
    nodeStyle: getNodeStyle(13, 29),

    canClick: true,
    onClick() {
        player.tab = "Ctrees";
    },
});

addLayer("Cupgrades", {
    symbol: `
        <span><h3>Upgrades</h3><br></span>
        <span>Spend currency<br>for a boost!</span>
        <span><br><br>Cost: 1 Completed Upgrade Module</span>
    `,
    tooltip: "Upgrades",
    classes() {
        let ret = ["upg"];
        if (!player.Cupgrades.completed) ret.push("locked");
        if (player.Cupgrades.bought)     ret.push("bought");
        return ret;
    },
    nodeStyle: merge(getNodeStyle(0, 0), {color: "#000"}),

    startData() {
        return {
            completed: false,
            bought: false,
        };
    },

    onClick() {
        if (player.Cupgrades.completed) player.Cupgrades.bought = true;
    },

    tabFormat: {
        Visuals: {
        },
        "Cost / Effect": {

        },
        Functions: {
            content: [
                ["left-align", `
                    <h3>hasUpgrade(layer, id)</h3><br>
                    <h3>➔ returns Boolean</h3><br>
                    <br>
                    Checks if the player has an upgrade.<br>
                    <br>
                    <h3>upgradeEffect(layer, id)</h3><br>
                    <h3>➔ returns effect()</h3><br>
                    <br>
                    Gets the effect of the upgrade.<br>
                    <br>
                    <h3>buyUpgrade(layer, id)</h3><br>
                    <br>
                    Attempts to buy an upgrade.<br>
                    <br>
                `]
            ]
        },
    },
});