//vscode-fold=1

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
            <span>Goal: Challenge Module Completed</span><br>
            <span>Reward: Challenge Knowledge</span><br>
        `
    },
    tooltip: "Challenges",
    classes() {
        let ret = ["hChallenge"];
        if (player[this.layer].finished) {
            ret.push("done")
        } else if (player[this.layer].completed && player.tab == "Cchallenges") {
            ret.push("canComplete")
        }
        return ret;
    },
    nodeStyle: getNodeStyle(25, 24),

    onClick() {
        if (player[this.layer].completed && player.tab == "Cchallenges") player[this.layer].finished = true;
    },

    generateComponent() {

        let component = "{\n";

        if (getInputState(this.layer, "fullDisplay")) {
            component += "    fullDisplay: \"" + getInputState(this.layer, "fullDisplay") + "\",\n";
        } else {
            component += "    name: \"" + getInputState(this.layer, "name") + "\",\n";
            component += "    challengeDescription: \"" + getInputState(this.layer, "challengeDescription") + "\",\n";
            component += "    goalDescription: \"" + getInputState(this.layer, "goalDescription") + "\",\n";
            component += "    rewardDescription: \"" + getInputState(this.layer, "rewardDescription") + "\",\n";
        }

        component += "\n";

        component += "    canComplete() { },\n"

        component += "\n";

        if (getInputState(this.layer, "rewardDisplay")) {
            component += "    rewardEffect() { },\n"
            component += "    rewardDisplay() {\n        return \"" + getInputState(this.layer, "rewardDisplay") + "\" + challengeEffect(this.layer, this.id);\n    },\n";
            component += "\n";
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
                    To create challenges, you must put them inside "challenges".<br>
                    This is a special attribute in the layer object.<br>
                    <br>
                    This object can be given 2 attributes.<br>
                    rows defines the maximum number of rows to display.<br>
                    cols defines the maximum number of columns to display.<br>
                    These are both regular numbers, not Decimals.<br>
                `],
                "blank",
                ["code-block", [
                    `challenges: {`,
                    `    rows: 2,`,
                    `    cols: 3,`,
                    `},`,
                ]],
                ["display-text", `
                    In this layer, at most, only a 3x2 block of challenges will appear.<br>
                    All other challenges, such as 14, 25, 33 will not appear.<br>
                `],
                "blank",
                ["display-text", `
                    Challenges come with 2 automatic attributes, "layer" and "id",<br>
                    corresponding to the layer the challenge is in, and the id of the challenge.<br>
                    These can be accessed in any function of the upgrade.<br>
                    <br>
                    The id serves a second purpose: positioning the challenge.<br>
                    The first digits are the row, and the final digit is the column.<br>
                `],
                "blank",
                ["code-block", [
                    `addLayer("p", {`,
                    `    ...`,
                    `    challenges: {`,
                    `        ...`,
                    `        123: {},`,
                    `    },`,
                    `})`,
                ]],
                ["display-text", `
                    This challenge has a layer attribute of "p", and an id attribute of "123".<br>
                    It is in the 12th row, and the 3rd column.<br>
                `],
                "blank",
                "blank",
            ]
        },
        Visuals: {
            content: [
                ["challenge", 11],
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
                            <h3>name</h3><br>
                            <br>
                            A larger title displayed above the button.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
                        `],
                        "blank",
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "name"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                    "blank",
                    ["column", [
                        ["display-text", `
                            <h3>challengeDescription</h3><br>
                            <br>
                            A description of the challenge displayed directly below the button.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
                        `],
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "challengeDescription"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                ]],
                "blank",
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", `
                            <h3>goalDescription</h3><br>
                            <br>
                            A description of the goal required to beat the challenge.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
                        `],
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "goalDescription"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                    "blank",
                    ["column", [
                        ["display-text", `
                            <h3>rewardDescription</h3><br>
                            <br>
                            A description of the reward for completing the challenge.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
                        `],
                        "blank",
                        ["blank", "16px"],
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "rewardDescription"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>fullDisplay()</h3><br>
                    <br>
                    fullDisplay() overwrites all display attributes except name.<br>
                    It overwrites the entire description of the challenge.<br>
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
                ["challenge", 11],
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
                    This is intended, but currently broken in the latest TMT.<br>
                    <br>
                    style allows you to set CSS values for this specific component.<br>
                    The attribute is the CSS property, and the value is the value of the property.<br>
                    These should both be strings.<br>
                    style itself is an object.<br>
                `],
                "blank",
                ["column", function() {
                    return generateStyleEditor("Cchallenges");
                }],
                "blank",
                "blank",
            ],
        },
        Completion: {
            content: [
                ["challenge", 11],
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
                    <h3>canComplete()</h3><br>
                    <br>
                    canComplete() determines whether or not a challenge can be completed.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>completionLimit</h3><br>
                    <br>
                    completionLimit allows a challenge to be beaten multiplie times.<br>
                    This works best if the goal and rewards scales with the number of completions.<br>
                    You can also have a unique reward for each completion.<br>
                    It should be a number.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>countsAs</h3><br>
                    <br>
                    countsAs is an Array of challenge ids in this layer that you want to also take effect.<br>
                    It should be an Array of strings.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `canComplete() { return player.p.points.gt(50); }`,
                    `completionLimit: 3,`,
                    `countsAs: [11, 12, 13],`,
                ]],
                ["display-text", `
                    The challenge is completed once the player has 50 "p" points.<br>
                    It can be completed 3 times.<br>
                    Challenges 11, 12, and 13 are also in effect.<br>
                `],
                "blank",
                "blank",
            ],
        },
        Reward: {
            content: [
                ["challenge", 11],
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
                    <h3>rewardEffect()</h3><br>
                    <br>
                    rewardEffect() should calculate and return the current effect of the challenge.<br>
                    You will have to implement the effect where it is needed.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>rewardDisplay()</h3><br>
                    <br>
                    rewardDisplay() should create the display of the effect of the upgrade.<br>
                    It can including formatting and HTML.<br>
                    It should return a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "rewardDisplay"],
                    ["display-text", "\" + challengeEffect(this.layer, this.id)"],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>onComplete()</h3><br>
                    <br>
                    onComplete() is called when the challenge is completed.<br>
                    It is useful for setting values.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `rewardEffect() {`,
                    `    return new Decimal(2);`,
                    `},`,
                    `rewardDisplay() {`,
                    `    return "x" + upgradeEffect(this.layer, this.id);`,
                    `},`,
                    `onComplete() {`,
                    `    player.generating = true;`,
                    `},`,
                ]],
                ["display-text", `
                    This challenge multiplies something by 2.<br>
                    It also sets the generating flag to true.<br>
                `],
                "blank",
                "blank",
            ],
        },
        Functions: {
            content: [
                ["display-text", `
                    <h3>inChallenge(layer, id)</h3><br>
                    <br>
                    Checks if the player is in a challenge.<br>
                    It returns true if they are, false if they aren't.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>hasChallenge(layer, id)</h3><br>
                    <br>
                    Checks if the player has completed a challenge.<br>
                    It returns true if they have, false if they haven't.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>challengeCompletions(layer, id)</h3><br>
                    <br>
                    It returns how many times a challenge has been completed.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>maxedChallenge(layer, id)</h3><br>
                    <br>
                    Checks if the player has maxed a challenge.<br>
                    It returns true if they have, false if they haven't.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>challengeEffect(layer, id)</h3><br>
                    <br>
                    challengeEffect gets the effect of a challenge.<br>
                    It returns the result of the challenge's rewardEffect() function.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `if (inChallenge("p", 11)) gain = gain.div(2);`,
                ]],
                ["display-text", `
                    Divides gain by 2 if the player is in "p" challenge 11.<br>
                `],
                "blank",
                ["code-block", [
                    `if (hasChallenge("p", 11)) {`,
                    `    gain = gain.mul(challengeEffect("p", 11));`,
                    `}`,
                ]],
                ["display-text", `
                    Multiplies gain by the challenge's effect if the player has completed it.<br>
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
                    `rewardEffect() {`,
                    `    return challengeCompletions(this.layer, this.id);`,
                    `},`,
                    `canComplete: true,`,
                ]],
                ["display-text", `
                    The challenge's effect is equal to the number of times completed.<br>
                    The challenge is always completable.<br>
                `],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    Try to avoid challenges that are just waiting to reach the goal.<br>
                    They are not as fun, as if you can't complete them, you have just wasted time.<br>
                    Challenges which require the player to do something new/different are best.<br>
                    The first set of challenges in <a href="https://ivark.github.io/" target="_blank">Antimatter Dimensions</a> are a good example.<br>
                `],
                "blank",
                "blank",
            ]
        },
    },

    inputs: {
        name: "Name",
        challengeDescription: "Challenge Description",
        goalDescription: "Goal Description",
        rewardDescription: "Reward Description",
        fullDisplay: "",

        rewardDisplay: "",

        property1: "",
        value1: "",
    },
    clickables: {
        11: {
            display() {
                switch (getClickableState(this.layer, this.id)) {
                    default:
                        return "<h3>Change State</h3><br>Currently inactive.";
                    case "inactive":
                    case "active":
                    case "completable":
                    case "completed":
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
                    case "inactive":
                        player[this.layer].activeChallenge = 11;
                        setClickableState(this.layer, this.id, "active");
                        break;
                    case "active":
                        setClickableState(this.layer, this.id, "completable");
                        break;
                    case "completable":
                        player[this.layer].activeChallenge = null;
                        player[this.layer].challenges[11] = 1;
                        setClickableState(this.layer, this.id, "completed");
                        break;
                    case "completed":
                        player[this.layer].challenges[11] = 0;
                        setClickableState(this.layer, this.id, "inactive");
                        break;
                }
            },
        },
        12: {
            display() {
                return "<h3>Export Challenge</h3>";
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
    challenges: {
        11: {
            name() {
                return getInputState(this.layer, "name");
            },
            challengeDescription() {
                return getInputState(this.layer, "challengeDescription");
            },
            goalDescription() {
                return getInputState(this.layer, "goalDescription");
            },
            rewardDescription() {
                return getInputState(this.layer, "rewardDescription");
            },
            rewardDisplay() {
                return getInputState(this.layer, "rewardDisplay") + challengeEffect(this.layer, this.id);
            },
            fullDisplay() {
                return getInputState(this.layer, "fullDisplay");
            },
            style() {
                return generateStyle("Cchallenges");
            },

            canComplete() {
                return getClickableState(this.layer, 11) == "completable";
            },

            rewardEffect: 2.67,
        },
    },
});

addLayer("Cclickables", {
    symbol: `
		<span><h2>Clickables</h2><br></span>
		<span>For anything<br>clickable!</span>
    `,
    tooltip: "Clickables",
    classes: ["upg"],
    nodeStyle: merge(getNodeStyle(14, 0), {color: "#000"}),

    generateComponent() {

        let component = "{\n";

        if (getInputState(this.layer, "title")) {
            component += "    title: \"" + getInputState(this.layer, "title") + "\",\n";
        }
        if (getInputState(this.layer, "display")) {
            component += "    display: \"" + getInputState(this.layer, "display") + "\",\n";
        }

        let style = convertStyleToString(generateStyle(this.layer));
        if (style) {
            component += "\n    style: " + style + ",\n";
        }

        exportSave(component + "},\n");
        player[this.layer].completed = true;

    },

    tabFormat: {
        Base: {
            content: [
                ["display-text", `
                    To create clickables, you must put them inside "challenges".<br>
                    This is a special attribute in the layer object.<br>
                    <br>
                    This object can be given 2 attributes.<br>
                    rows defines the maximum number of rows to display.<br>
                    cols defines the maximum number of columns to display.<br>
                    These are both regular numbers, not Decimals.<br>
                `],
                "blank",
                ["code-block", [
                    `clickables: {`,
                    `    rows: 2,`,
                    `    cols: 3,`,
                    `},`,
                ]],
                ["display-text", `
                    In this layer, at most, only a 3x2 block of clickables will appear.<br>
                    All other clickables, such as 14, 25, 33 will not appear.<br>
                `],
                "blank",
                ["display-text", `
                    Clickables come with 2 automatic attributes, "layer" and "id",<br>
                    corresponding to the layer the clickable is in, and the id of the clickable.<br>
                    These can be accessed in any function of the upgrade.<br>
                    <br>
                    The id serves a second purpose: positioning the clickable.<br>
                    The first digits are the row, and the final digit is the column.<br>
                `],
                "blank",
                ["code-block", [
                    `addLayer("p", {`,
                    `    ...`,
                    `    clickables: {`,
                    `        ...`,
                    `        123: {},`,
                    `    },`,
                    `})`,
                ]],
                ["display-text", `
                    This clickable has a layer attribute of "p", and an id attribute of "123".<br>
                    It is in the 12th row, and the 3rd column.<br>
                `],
                "blank",
                "blank",
            ]
        },
        Visuals: {
            content: [
                ["clickable", 13],
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
                            A larger title displayed above the clickable.<br>
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
                            <h3>display</h3><br>
                            <br>
                            Smaller text placed beneath the title. Should describe what the clickable does.<br>
                            It can including formatting and HTML.<br>
                            It should be a string.<br>
                        `],
                        "blank",
                        ["row", [
                            ["display-text", "\""],
                            ["text-input", "display"],
                            ["display-text", "\""],
                        ]],
                    ], {
                        width: "240px",
                    }],
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
                ["clickable", 13],
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
                    return generateStyleEditor("Cclickables");
                }],
                "blank",
                "blank",
            ],
        },
        Effect: {
            content: [
                ["display-text", `
                    <h3>canClick()</h3><br>
                    <br>
                    canClick() determines whether or not the upgrade can be clicked.<br>
                    If not included, the clickable can always be clicked on.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>onClick()</h3><br>
                    <br>
                    onClick() is the function called when the clickable is clicked.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>effect()</h3><br>
                    <br>
                    effect() should calculate and return the current effect of the clickable.<br>
                    You will have to implement the effect where it is needed.<br>
                `],
                "blank",
                "blank",
            ],
        },
        "Master Button": {
            content: [
                "clickables",
                ["clickable", 13],
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
                    The master button applies to all clickables.<br>
                    It goes in the clickables object, not in each clickable.<br>
                `],
                "blank",
                ["code-block", [
                    `clickables: {`,
                    `    ...`,
                    `    masterButtonPress() {`,
                    `        player.p.points = player.p.points.add(1);`,
                    `    },`,
                    `    11: {`,
                    `        ...`,
                    `    },`,
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>masterButtonPress()</h3><br>
                    <br>
                    A larger title displayed above the clickable.<br>
                    This function must be included for the other attributes to take effect.<br>
                    It can including formatting and HTML.<br>
                    It should be a string.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>masterButtonText</h3><br>
                    <br>
                    A larger title displayed above the clickable.<br>
                    It can including formatting and HTML.<br>
                    It should be a string.<br>
                `],
                "blank",
                ["row", [
                    ["display-text", "\""],
                    ["text-input", "masterButtonText"],
                    ["display-text", "\""],
                ]],
                "blank",
                "blank",
                ["display-text", `
                    <h3>showMasterButton()</h3><br>
                    <br>
                    A larger title displayed above the clickable.<br>
                    It can including formatting and HTML.<br>
                    It should return a boolean.<br>
                `],
                "blank",
                ["row", [
                    ["checkbox", "showMasterButton"],
                ]],
                "blank",
                "blank",
            ],
        },
        Functions: {
            content: [
                ["display-text", `
                    <h3>getClickableState(layer, id)</h3><br>
                    <br>
                    getClickableState() gets the state of the clickable.<br>
                    By default, a clickables state is an empty string.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>setClickableState(layer, id, value)</h3><br>
                    <br>
                    setClickableState() sets the state of the clickable.<br>
                    Clickable states can be any primitive value.<br>
                    They cannot be Decimals, objects, or arrays.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>clickableEffect(layer, id)</h3><br>
                    <br>
                    upgradeEffect() gets the effect of the clickable.<br>
                    It returns the result of the clickable's effect() function.<br>
                `],
                "blank",
                "blank",
                ["code-block", [
                    `if (getClickableState("p", 11) == "build") {`,
                    `    gain = gain.mul(clickableEffect("p", 11));`,
                    `}`
                ]],
                ["display-text", `
                    Applies an upgrade's effect to gain, if the clickable's state is "build".<br>
                `],
                "blank",
                ["code-block", [
                    `setClickableState("p", 12,`,
                    `    new Decimal(getClickableState("p", 12).add(1)))`,
                ]],
                ["display-text", `
                    Increments a clickable's state by 1.<br>
                    This correctly deals with the default state.<br>
                `],
                "blank",
                "blank",
            ],
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
                    `showMasterButton: true,`,
                ]],
                ["display-text", `
                    The title will be the player's current points.<br>
                    The master button will always be shown.<br>
                `],
                "blank",
                "h-line",
                "blank",
                ["display-text", `
                    Don't make clickables give a bonus based on the number of times clicked.<br>
                    These aren't fun to use, and encourage autoclickers.<br>
                    Clickables work very well with custom features.<br>
                `],
                "blank",
                "blank",
            ],
        },
    },

    inputs: {
        title: "Title",
        display: "Display",

        masterButtonText: "Master Button Text",
        showMasterButton: true,

        property1: "",
        value1: "",
    },
    clickables: {
        masterButtonPress() {},
        masterButtonText() {
            return player.Cclickables.inputs.masterButtonText;
        },
        showMasterButton() {
            return player.Cclickables.inputs.showMasterButton;
        },

        11: {
            display() {
                switch (getClickableState(this.layer, this.id)) {
                    default:
                        return "<h3>Change State</h3><br>Currently locked.";
                    case "disabled":
                    case "enabled":
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
                    case "disabled":
                        player[this.layer].milestones = [0];
                        setClickableState(this.layer, this.id, "enabled");
                        break;
                    case "enabled":
                        player[this.layer].milestones = [];
                        setClickableState(this.layer, this.id, "disabled");
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
        13: {
            title() {
                return player.Cclickables.inputs.title;
            },
            display() {
                return player.Cclickables.inputs.display;
            },
            style() {
                return generateStyle("Cclickables");
            },

            canClick() {
                return getClickableState(this.layer, 11) == "enabled";
            },
        },
    },
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
                "blank",
                "blank",
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
                "blank",
                "blank",
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
                    <h3>fullDisplay()</h3><br>
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
                    upgradeEffect() gets the effect of the upgrade.<br>
                    It returns the result of the upgrade's effect() function.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>canAffordUpgrade(layer, id)</h3><br>
                    <br>
                    Checks if the player can afford an upgrade.<br>
                    It will return a boolean.<br>
                `],
                "blank",
                "blank",
                ["display-text", `
                    <h3>buyUpgrade(layer, id)</h3><br>
                    <br>
                    buyUpgrade() attempts to buy an upgrade.<br>
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
                "blank",
                "blank",
            ],
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
                `],
                "blank",
                "blank",
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
