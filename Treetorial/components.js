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
    classes() {
        let ret = [];
        if (player[this.layer].completed) ret.push("milestoneDone");
        else ret.push("milestone");
        return ret;
    },
    nodeStyle: merge(getNodeStyle(0, 14), {"font-size": "18px", height: "75px", width: "260px"}),

    startData() {
        return {
            completed: false,
        };
    },

    generateComponent() {

        let component = "{\n";

        if (getInputState(this.layer, "requirementDescription")) {
            component += "    requirementDescription: \"" + getInputState(this.layer, "requirementDescription") + "\",\n";
        }
        if (getInputState(this.layer, "effectDescription")) {
            component += "    effectDescription: \"" + getInputState(this.layer, "effectDescription") + "\",\n";
        }

        component += "\n";

        component += "    done() { },\n";

        let toggles = convertTogglesToString(generateToggles(this.layer));
        if (toggles) {
            component += "    toggles: " + toggles + ",\n";
        }

        component += "\n";

        let style = convertStyleToString(generateStyle(this.layer));
        if (style) {
            component += "    style: " + style + ",\n";
        }

        exportSave(component + "},\n");
        player[this.layer].completed = true;

    },

    tabFormat: {
        Base: {
            content: [
                ["display-text", `
                    To create milestones, you must put them inside "milestones".<br>
                    This is a special attribute in the layer object.<br>
                `],
                "blank",
                ["code-block", [
                    `milestones: {`,
                    `},`,
                ]],
                "blank",
                ["display-text", `
                    Upgrades come with 2 automatic attributes, "layer" and "id",<br>
                    corresponding to the layer the milestone is in, and the id of the milestone.<br>
                    These can be accessed in any function of the milestone.<br>
                    <br>
                    The id serves a second purpose: positioning the milestone.<br>
                    The smaller the id, the higher up it is placed.<br>
                `],
                "blank",
                ["code-block", [
                    `addLayer("p", {`,
                    `    ...`,
                    `    milestones: {`,
                    `        30: {},`,
                    `        20: {},`,
                    `    },`,
                    `})`,
                ]],
                ["display-text", `
                    These milestones have a layer attribute of "p".<br>
                    One milestone has an id of "30", the other an id of "20".<br>
                    Milestone 20 will be placed above 30.<br>
                `],
                "blank",
                "blank",
            ]
        },
        Visuals: {
            content: [
                "milestones",
                "blank",
                ["row", [
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
                ]],
                "blank",
                ["h-line", "500px"],
                "blank",
                ["display-text", `
                    <h3>requirementDescription</h3><br>
                    <br>
                    A larger title placed at the top of the milestone.<br>
                    It should describe what the player must do to get the milestone.<br>
                    It can including formatting and HTML.<br>
                    It should return a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "requirementDescription"],
                    ["display-text", "\""],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>effectDescription</h3><br>
                    <br>
                    Smaller text placed beneath the title.<br>
                    It should explain the rewards for completing the milestone.<br>
                    The effects will have to implemented where they are needed.<br>
                    It can including formatting and HTML.<br>
                    It should return a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "effectDescription"],
                    ["display-text", "\""],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>unlocked()</h3><br>
                    <br>
                    unlocked() determines whether or not to show the milestone.<br>
                    Locked upgrades do effect the positions of other milestone.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
            ],
        },
        Style: {
            content: [
                "milestones",
                "blank",
                ["row", [
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
                ]],
                "blank",
                ["h-line", "500px"],
                "blank",
                ["display-text", `
                    <h3>style</h3><br>
                    <br>
                    style allows you to set CSS values for this specific component.<br>
                    The attribute is the CSS property, and the value is the value of the property.<br>
                    These should both be strings.<br>
                    style itself is an object.<br>
                `],
                "blank",
                ["column", function() {
                    return generateStyleEditor("Cmilestones");
                }],
                "blank",
                "blank",
            ],
        },
        Completion: {
            content: [
                "milestones",
                "blank",
                ["row", [
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
                ]],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    <h3>done()</h3><br>
                    <br>
                    done() should determine if the milestone is completed.<br>
                    TMT will throw an error if you do not include this function in the milestone.<br>
                    It should return true when the milestone is completed, and false when it isn't.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `done() {`,
                    `    return player.points.gt(100);`,
                    `},`,
                ]],
                ["display-text", `
                    The milestone is completed when the player has more than 100 points.<br>
                `],
                "blank",
                "blank",
                ["infobox-column", "toggles"],
            ],
        },
        Functions: {
            content: [
                ["display-text", `
                    <h3>hasMilestone(layer, id)</h3><br>
                    <br>
                    hasUpgrade() checks if the player has a milestone.<br>
                    It returns true if the have, false if they don't.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `if (hasMilestone("q", 0)) {`,
                    `    buyUpgrade("p", 11);`,
                    `    buyUpgrade("p", 12);`,
                    `    buyUpgrade("p", 13);`,
                    `}`
                ]],
                ["display-text", `
                    Attempts to buy the first 3 "p" upgrades when you have the milestone.<br>
                `],
                "blank",
                "blank",
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
                    `rewardDescription() { return player.points; },`,
                    `unlocked: false,`,
                ]],
                ["display-text", `
                    The reward description will be the player's current points.<br>
                    The milestone will never be shown.<br>
                `],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    It is best, but not required, to base milestones off of total currency.<br>
                    Instead of using .points, use .total.
                `],
                "blank",
                ["code-block", [
                    `done() { return player.p.total.gte(10); },`
                ]],
                ["display-text", `
                    The milestone will be completed once the player reaches 10 total points.<br>
                    They do not need 10 points at the same time.<br>
                `],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    As milestones don't have an equivalent to upgradeEffect(),<br>
                    they are best used for QOL or content unlocks.<br>
                    These effects will have to implemented where they are needed.<br>
                `],
                "blank",
                ["code-block", [
                    `effectDescription: "Automatically purchase P upgrades.",`
                ]],
            ]
        },
    },

    inputs: {
        requirementDescription: "Requirement Description",
        effectDescription: "Effect Description",

        property1: "",
        value1: "",

        toggle1: "",
        toggleValue1: "",
    },
    infoboxes: {
        toggles: {
            title: "Toggles",
            body: [
                ["display-text", `
                    Toggles can be used to add a button to a milestone.<br>
                    They come as pairs of strings.<br>
                    The first string is the layer to store under.<br>
                    The second string is the attribute to store under.<br>
                    It should be a 2D array.<br>
                `],
                "blank",
                ["column", function() {
                    return generateToggleEditor("Cmilestones");
                }],
                ["display-text", `
                    Warning certain values can brick your save.<br>
                    Do not set the property to something TMT uses, such as "milestones".<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `toggles: [`,
                    `    ["p", "auto"],`,
                    `    ["q", "buy"],`,
                    `],`,
                ]],
                ["display-text", `
                    This will create 2 toggle buttons.<br>
                    One will toggle "player.p.auto".<br>
                    The other will toggle "player.q.buy".<br>
                `],
            ],
        },
    },
    clickables: {
        11: {
            display() {
                switch (getClickableState(this.layer, this.id)) {
                    default:
                        return "<h3>Change State</h3><br>Currently locked.";
                    case "locked":
                    case "unlocked":
                        return "<h3>Change State</h3><br>Currently " + getClickableState(this.layer, this.id) + ".";
                }
            },
            style: {
                height: "45px",
                width: "150px",
                "border-radius": "15px",
            },

            canClick: true,
            onClick() {
                switch (getClickableState(this.layer, this.id)) {
                    default:
                    case "locked":
                        player[this.layer].milestones = [0];
                        setClickableState(this.layer, this.id, "unlocked");
                        break;
                    case "unlocked":
                        player[this.layer].milestones = [];
                        setClickableState(this.layer, this.id, "locked");
                        break;
                }
            },
        },
        12: {
            display() {
                return "<h3>Export Milestone</h3>";
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
    },
    milestones: {
        0: {
            requirementDescription() {
                return player[this.layer].inputs.requirementDescription;
            },
            effectDescription() {
                return player[this.layer].inputs.effectDescription;
            },
            style() {
                return generateStyle(this.layer);
            },

            done() {
                return false;
            },
            toggles() {
                let toggles = generateToggles(this.layer);
                for (let i = 0; i < toggles.length; i ++) {
                    toggles[i][0] = "Cmilestones";
                }
                return toggles;
            },
        },
    },
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
        if (!player[this.layer].completed) ret.push("locked");
        if (player[this.layer].bought)     ret.push("bought");
        return ret;
    },
    nodeStyle: merge(getNodeStyle(0, 0), {color: "#000"}),

    onClick() {
        if (player[this.layer].completed) player[this.layer].bought = true;
    },

    startData() {
        return {
            completed: false,
            bought: false,
        };
    },

    generateComponent() {

        let component = "{\n";

        if (getInputState(this.layer, "fullDisplay")) {
            component += "    fullDisplay: \"" + getInputState(this.layer, "fullDisplay") + "\",\n";
        } else {
            component += "    title: \"" + getInputState(this.layer, "title") + "\",\n";
            component += "    description: \"" + getInputState(this.layer, "description") + "\",\n";
        }

        component += "\n";

        component += "    cost: new Decimal(\"" + (getInputState(this.layer, "cost") ? getInputState(this.layer, "cost") : 0) + "\"),\n";
        if (getInputState(this.layer, "currencyDisplayName")) {
            component += "    currencyDisplayName: \"" + getInputState(this.layer, "currencyDisplayName") + "\",\n";
        }

        component += "\n";

        if (getInputState(this.layer, "effectDisplay")) {
            component += "    effect() { },\n"
            component += "    effectDisplay() {\n        return \"" + getInputState(this.layer, "effectDisplay") + "\" + upgradeEffect(this.layer, this.id);\n    },\n\n";
        }

        let style = convertStyleToString(generateStyle(this.layer));
        if (style) {
            component += "    style: " + style + ",\n";
        }

        exportSave(component + "},\n");
        player[this.layer].completed = true;

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
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
                ]],
                "blank",
                ["h-line", "500px"],
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
        Style: {
            content: [
                ["upgrade", 11],
                "blank",
                ["row", [
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
                ]],
                "blank",
                ["h-line", "500px"],
                "blank",
                ["display-text", `
                    <h3>style</h3><br>
                    <br>
                    style allows you to set CSS values for this specific component.<br>
                    The attribute is the CSS property, and the value is the value of the property.<br>
                    These should both be strings.<br>
                    style itself is an object.<br>
                `],
                "blank",
                ["column", function() {
                    return generateStyleEditor("Cupgrades");
                }],
                "blank",
                "blank",
            ],
        },
        Cost: {
            content: [
                ["upgrade", 11],
                "blank",
                ["row", [
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
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
                    ["clickable", 11],
                    "blank",
                    ["clickable", 12],
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
        currencyDisplayName: "",

        effectDisplay: "",

        property1: "",
        value1: "",
    },
    infoboxes: {
        currency: {
            title: "Custom Currencies",
            body: [
                ["display-text", `
                    <h3>currencyDisplayName</h3><br>
                    <br>
                    The name of the currency to display.<br>
                    By default it is the name of the resource of the layer.<br>
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
                switch (getClickableState(this.layer, this.id)) {
                    default:
                        return "<h3>Change State</h3><br>Currently unaffordable.";
                    case "unaffordable":
                    case "buyable":
                    case "bought":
                        return "<h3>Change State</h3><br>Currently " + getClickableState(this.layer, this.id) + ".";
                }
            },
            style: {
                height: "45px",
                width: "150px",
                "border-radius": "15px",
            },

            canClick: true,
            onClick() {
                switch (getClickableState(this.layer, this.id)) {
                    default:
                    case "unaffordable":
                        setClickableState(this.layer, this.id, "buyable");
                        break;
                    case "buyable":
                        player[this.layer].upgrades = [11];
                        setClickableState(this.layer, this.id, "bought");
                        break;
                    case "bought":
                        player[this.layer].upgrades = [];
                        setClickableState(this.layer, this.id, "unaffordable");
                        break;
                }
            },
        },
        12: {
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
    },
    upgrades: {
        11: {
            title() {
                return getInputState(this.layer, "title");
            },
            description() {
                return getInputState(this.layer, "description");
            },
            effectDisplay() {
                if (getInputState(this.layer, "effectDisplay")) return getInputState(this.layer, "effectDisplay" + 2.67);
            },
            fullDisplay() {
                return getInputState(this.layer, "fullDisplay");
            },
            style() {
                return generateStyle(this.layer);
            },

            cost() {
                return new Decimal(getInputState(this.layer, "cost"));
            },
            currencyDisplayName() {
                return (getInputState(this.layer, "currencyDisplayName") ? getInputState(this.layer, "currencyDisplayName") : "points");
            },

            canAfford() {
                return getClickableState(this.layer, 11) == "buyable";
            },
            pay() {
                return;
            },
            onPurchase() {
                player[this.layer].upgrades = [];
            },
        },
    },
});