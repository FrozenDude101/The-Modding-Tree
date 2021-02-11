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
            content: [
                ["upgrade", 11],
                "blank",
                ["clickable", 11],
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", `
                            <h3>title</h3><br>
                            <br>
                            A larger title displayed at the top of the upgrade.<br>
                            It can including formatting and HTML.<br>
                        `],
                        "blank",
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "title"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                    "blank",
                    ["column", [
                        ["display-text", `
                            <h3>description</h3><br>
                            <br>
                            Smaller text placed beneath the title. Should describe what the upgrade does.<br>
                            It can including formatting and HTML.<br>
                        `],
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "description"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                ]],
            ],
        },
        Cost: {
            content: [
                ["upgrade", 11],
                "blank",
                ["clickable", 11],
                "blank",
                ["display-text", `
                    <h3>cost</h3><br>
                    <br>
                    A Decimal for how much the upgrade will cost to buy.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "new Decimal(\""],
                    ["text-input", "cost"],
                    ["display-text", "\")"],
                ]],
                "blank",
                "blank",
                ["infobox-column", "currency"],
            ],
        },
        Effect: {
            content: [
                ["upgrade", 11],
                "blank",
                ["clickable", 11],
                "blank",
                ["display-text", `
                    <h3>effect()</h3><br>
                    <br>
                    This function should calculate and return the current effect of the upgrade.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>effectDisplay()</h3><br>
                    <br>
                    This should display the current effect of the upgrade.<br>
                    It can including formatting and HTML.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "effectDisplay"],
                    ["display-text", "\" + upgradeEffect(this.layer, this.id)"],
                ]],
                "blank",
            ],
        },
        Functions: {
            content: [
                ["display-text", `
                    <h3>hasUpgrade(layer, id)</h3><br>
                    <br>
                    Checks if the player has an upgrade.<br>
                    Returns true if the have, false if they don't.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>upgradeEffect(layer, id)</h3><br>
                    <br>
                    Gets the effect of the upgrade.<br>
                    Returns the result of the upgrade's effect() function.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>buyUpgrade(layer, id)</h3><br>
                    <br>
                    Attempts to buy an upgrade.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `if (hasUpgrade("p", 11)) {`,
                    `    gain = gain.mul(upgradeEffect("p", 11));`,
                    `}`
                ]],
                ["display-text", `
                    Applies an upgrade's effect to gain.<br>
                `],
                "blank",
                ["code-block", [
                    `if (hasUpgrade("q", 11)) {`,
                    `    buyUpgrade("p", 11);`,
                    `    buyUpgrade("p", 12);`,
                    `    buyUpgrade("p", 13);`,
                    `}`
                ]],
                ["display-text", `
                    Attempts to buy the first 3 "p" upgrades.<br>
                `],
            ]
        },
    },

    inputs: {
        title: "Title",
        description: "Description",

        cost: "0",
        currencyDisplayName: "",

        effectDisplay: "",
    },

    infoboxes: {
        currency: {
            title: "Custom Currencies",
            body: [
                ["display-text", `
                    <h3>currencyDisplayName</h3><br>
                    <br>
                    The name of the currency to display.<br>
                    It can including formatting and HTML.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "currencyDisplayName"],
                    ["display-text", "\""],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>currencyLocation() & currencyInternalName</h3><br>
                    <br>
                    currencyLocation returns the object the currency is stored in.<br>
                    currencyInternalName is the attribute the currency is stored in.<br>
                    The attribute must be a Decimal.<br>
                `],
                "blank",
                ["code-block", [
                    `currencyLocation() { return player.p; },`,
                    `currencyInternalName: "points",`,
                    `//  The upgrade will use points from the "p" layer.`,
                    ``,
                    `currencyLocation() { return player.p.buyables; },`,
                    `currencyInternalName: "11",`,
                    `//  The upgrade will use buyable (ID 11)`,
                    `//  levels from the "p" layer.`,
                    ``,
                    `currencyLocation() { return obj; },`,
                    `currencyInternalName: "amount",`,
                    `//  The upgrade will use the Decimal stored in obj.amount.`,
                ]],
            ],
        },
    },

    clickables: {
        11: {
            display() {
                switch (getClickableState("Cupgrades", 11)) {
                    case "":
                        return "<h3>Change Style</h3><br>Currently locked.";
                    case "locked":
                    case "buyable":
                    case "bought":
                        return "<h3>Change Style</h3><br>Currently " + getClickableState("Cupgrades", 11) + ".";
                }
            },
            style: {
                height: "45px",
                width: "150px",
                "border-radius": "15px",
            },

            canClick: true,
            onClick() {
                switch (getClickableState("Cupgrades", 11)) {
                    case "":
                    case "locked":
                        setClickableState("Cupgrades", 11, "buyable");
                        break;
                    case "buyable":
                        player.Cupgrades.upgrades = [11];
                        setClickableState("Cupgrades", 11, "bought");
                        break;
                    case "bought":
                        player.Cupgrades.upgrades = [];
                        setClickableState("Cupgrades", 11, "locked");
                        break;
                }
            },
        },
    },

    upgrades: {
        11: {
            title() {
                return player.Cupgrades.inputs.title;
            },
            description() {
                return player.Cupgrades.inputs.description;
            },
            effectDisplay() {
                if (player.Cupgrades.inputs.effectDisplay) return player.Cupgrades.inputs.effectDisplay + 2.67;
            },

            cost() {
                return new Decimal(player.Cupgrades.inputs.cost);
            },
            currencyDisplayName() {
                return player.Cupgrades.inputs.currencyDisplayName;
            },

            canAfford() {
                return getClickableState("Cupgrades", 11) == "buyable";
            },
            pay() {
                return;
            },
            onPurchase() {
                player.Cupgrades.upgrades = [];
            },
        },
    },
});