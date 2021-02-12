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

    onClick() {
        if (player.Cupgrades.completed) player.Cupgrades.bought = true;
    },

    startData() {
        return {
            completed: false,
            bought: false,
        };
    },

    generateComponent() {

        let upgrade = "{\n";

        if (player.Cupgrades.inputs.fullDisplay) {
            upgrade += "    fullDisplay: \"" + player.Cupgrades.inputs.fullDisplay + "\",\n";
        } else {
            upgrade += "    title: \"" + player.Cupgrades.inputs.title + "\",\n";
            upgrade += "    description: \"" + player.Cupgrades.inputs.description + "\",\n";
        }

        upgrade += "\n";

        upgrade += "    cost: new Decimal(\"" + (player.Cupgrades.inputs.cost ? player.Cupgrades.inputs.cost : 0) + "\"),\n";
        if (player.Cupgrades.inputs.currencyDisplayName) {
            upgrade += "    currencyDisplayName: \"" + player.Cupgrades.inputs.currencyDisplayName + "\",\n";
        }

        upgrade += "\n";

        if (player.Cupgrades.inputs.effectDisplay) {
            upgrade += "    effectDisplay() {\n        return \"" + player.Cupgrades.inputs.effectDisplay + "\" + upgradeEffect(this.layer, this.id);\n    },\n";
        }

        exportSave(upgrade + "}");
        player.Cupgrades.completed = true;

    },

    tabFormat: {
        Base: {
            content: [
                ["display-text", `
                    To create upgrades, you must put them inside "upgrades".<br>
                    This is a special attribute in the layer object.<br>
                    <br>
                    This object can be given 2 attributes.<br>
                    rows defines the maximum number of rows to display.<br>
                    cols defines the maximum number of columns to display.<br>
                    These are both regular numbers, not Decimals.<br>
                `],
                "blank",
                ["code-block", [
                    `upgrades: {`,
                    `    rows: 2,`,
                    `    cols: 3,`,
                    `},`,
                ]],
                ["display-text", `
                    In this layer, at most, only a 3x2 block of upgrades will appear.<br>
                    All other upgrades, such as 14, 25, 33 will not appear.<br>
                `],
                "blank",
                ["display-text", `
                    Upgrades come with 2 automatic attributes, "layer" and "id",<br>
                    corresponding to the layer the upgrade is in, and the id of the upgrade.<br>
                    These can be accessed in any function of the upgrade.<br>
                    <br>
                    The id serves a second purpose: positioning the upgrade.<br>
                    The first digits are the row, and the final digit is the column.<br>
                `],
                "blank",
                ["code-block", [
                    `addLayer("p", {`,
                    `    ...`,
                    `    upgrades: {`,
                    `        ...`,
                    `        123: {},`,
                    `    },`,
                    `})`,
                ]],
                ["display-text", `
                    This upgrade has a layer attribute of "p", and an id attribute of "123".<br>
                    It is in the 12th row, and the 3rd column.<br>
                `],
                "blank",
                "blank",
            ]
        },
        Visuals: {
            content: [
                ["upgrade", 11],
                "blank",
                ["row", [
                    ["clickable", 12],
                    "blank",
                    ["clickable", 11],
                ]],
                "blank",
                "h-line",
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", `
                            <h3>title</h3><br>
                            <br>
                            A larger title displayed at the top of the upgrade.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
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
                            It should be a string.<br>
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
                "blank",
                "blank",
                ["display-text", `
                    <h3>fullDisplay</h3><br>
                    <br>
                    fullDisplay() overwrites the entire content of the upgrade.<br>
                    It can including formatting and HTML.<br>
                    It should return a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "fullDisplay"],
                    ["display-text", "\""],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>unlocked()</h3><br>
                    <br>
                    unlocked() determines whether or not to show the upgrade.<br>
                    Locked upgrades don't effect the positions of other upgrades.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
            ],
        },
        Cost: {
            content: [
                ["upgrade", 11],
                "blank",
                ["row", [
                    ["clickable", 12],
                    "blank",
                    ["clickable", 11],
                ]],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    <h3>cost</h3><br>
                    <br>
                    cost is how much the upgrade will cost to buy.<br>
                    It should be a Decimal.<br>
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
                "blank",
                ["infobox-column", "custom"],
                "blank",
                "blank",
            ],
        },
        Effect: {
            content: [
                ["upgrade", 11],
                "blank",
                ["row", [
                    ["clickable", 12],
                    "blank",
                    ["clickable", 11],
                ]],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    <h3>effect()</h3><br>
                    <br>
                    effect() should calculate and return the current effect of the upgrade.<br>
                    You will have to implement the effect where it is needed.<br>
                    It should return a Decimal.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>effectDisplay()</h3><br>
                    <br>
                    effectDisplay() should create the display of the effect of the upgrade.<br>
                    It can including formatting and HTML.<br>
                    It should return a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "effectDisplay"],
                    ["display-text", "\" + upgradeEffect(this.layer, this.id)"],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>onPurchase()</h3><br>
                    <br>
                    onPurchase() is called when the upgrade is bought.<br>
                    It is called after the upgrade has been bought.<br>
                    It is useful for setting values.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `effect() {`,
                    `    return new Decimal(2);`,
                    `},`,
                    `effectDisplay() {`,
                    `    return "x" + upgradeEffect(this.layer, this.id);`,
                    `},`,
                    `onPurchase() {`,
                    `    player.generating = true;`,
                    `},`,
                ]],
                ["display-text", `
                    This upgrade multiplies something by 2.<br>
                    It also sets the generating flag to true.<br>
                `],
                "blank",
                "blank",
            ],
        },
        Functions: {
            content: [
                ["display-text", `
                    <h3>hasUpgrade(layer, id)</h3><br>
                    <br>
                    hasUpgrade() checks if the player has an upgrade.<br>
                    It returns true if the have, false if they don't.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>upgradeEffect(layer, id)</h3><br>
                    <br>
                    upgradeEffect gets the effect of the upgrade.<br>
                    It returns the result of the upgrade's effect() function.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>buyUpgrade(layer, id)</h3><br>
                    <br>
                    buyUpgrade attempts to buy an upgrade.<br>
                    It will only buy upgrades you can afford.<br>
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
        Tips: {
            content: [
                ["display-text", `
                    If a function will always return the same value,<br>
                    you can turn it into an attribute to increase performance!<br>
                    If you want any attribute to change, you can turn it into a function,<br>
                    and it will automatically update.<br>
                `],
                "blank",
                ["code-block", [
                    `title() { return player.points; },`,
                    `effect: new Decimal(2),`,
                ]],
                ["display-text", `
                    The title will be the player's current points.<br>
                    The effect will always be 2.<br>
                `],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    When making effects, be careful of invalid inputs.<br>
                    For example, log() will output NaN when given 0.<br>
                    Adding 1 to the input will fix this.<br>
                    <br>
                    Try to make upgrades be useful as soon as they are bought.<br>
                    It's not rewarding to buy an upgrade, but it gives a x1 bonus<br>
                    because you just spent the currency it is based on.<br>
                `],
                "blank",
                ["code-block", [
                    `effect() { return player.points.add(1).log(10).add(1); }`
                ]],
                ["display-text", `
                    The effect is logarithmic, but always >= 1.<br>
                `],
                "blank",
                ["code-block", [
                    `effect() { return player.points.add(2); }`
                ]],
                ["display-text", `
                    The effect is linear, but always >= 2.<br>
                `],
                "blank",
                ["display-text", `
                    <a href="https://www.desmos.com/calculator" target="_blank">Desmos</a>  is a great tool for visualising graphs!<br>
                    However, it only goes up to 1e308.<br>
                `]
            ]
        },
    },

    inputs: {
        title: "Title",
        description: "Description",
        fullDisplay: "",

        cost: "0",
        currencyDisplayName: "points",

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
                    It should be a string.<br>
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
                    currencyLocation() returns the object the currency is stored in.<br>
                    It should return an object.<br>
                    currencyInternalName is the attribute the currency is stored in.<br>W
                    It should be a string.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `currencyLocation() { return player.p; },`,
                    `currencyInternalName: "points",`,
                ]],
                ["display-text", `
                    The upgrade will use points from the "p" layer
                `],
                "blank",
                ["code-block", [``,
                    `currencyLocation() { return player.p.buyables; },`,
                    `currencyInternalName: "11",`,
                ]],
                ["display-text", `
                    The upgrade will use buyable (ID 11) levels from the "p" layer.
                `],
                "blank",                
                ["code-block", [``,
                    `currencyLocation() { return obj; },`,
                    `currencyInternalName: "amount",`,
                ]],
                ["display-text", `
                    The upgrade will use the Decimal stored in obj.amount.
                `],
            ],
        },
        custom: {
            title: "Fully Custom",
            body: [
                ["display-text", `
                    Sometimes you want to do more complex things with upgrades, such as multiple currencies.<br>
                    These methods allow you to use any criteria and costs you want.<br>
                    They are best paired with the fullDisplay() method.<br>
                    Both functions safely overwrite what TMT does.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>canAfford()</h3><br>
                    <br>
                    canAfford() should determine whether or not you can buy the upgrade.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>pay()</h3><br>
                    <br>
                    pay() should reduce the currencies used to purchase the upgrade.<br>
                    It is called before the upgrade is given.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `canAfford() {`,
                    `    return player.p.points.gte(10) &&`,
                    `           player.q.points.gte(10);`,
                    `},`,
                    `pay() {`,
                    `    player.p.points = player.p.points.sub(10);`,
                    `    player.q.points = player.q.points.sub(10);`,
                    `},`,
                    `// The upgrade costs 10 p points, and 10 q points.`,
                ]],
            ],
        },
    },
    clickables: {
        11: {
            display() {
                return "<h3>Export Upgrade</h3>";
            },
            style: {
                height: "45px",
                width: "150px",
                "border-radius": "15px",
            },

            canClick: true,
            onClick() {
                layers[this.layer].generateComponent();
            },
        },
        12: {
            display() {
                switch (getClickableState("Cupgrades", 11)) {
                    default:
                        return "<h3>Change Style</h3><br>Currently unaffordable.";
                    case "unaffordable":
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
                    default:
                    case "unaffordable":
                        setClickableState("Cupgrades", 11, "buyable");
                        break;
                    case "buyable":
                        player.Cupgrades.upgrades = [11];
                        setClickableState("Cupgrades", 11, "bought");
                        break;
                    case "bought":
                        player.Cupgrades.upgrades = [];
                        setClickableState("Cupgrades", 11, "unaffordable");
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
            fullDisplay() {
                return player.Cupgrades.inputs.fullDisplay;
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

x = {
    title: "Faster GPUs",
    description: "The RGB really speeds them up.",

    cost: new Decimal("10"),
    currencyDisplayName: "Bitcoins",

    effectDisplay() {
        return x + upgradeEffect(this.layer, this.id);
    },
};