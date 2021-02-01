//vscode-fold=1

addLayer("JStypes", {
    symbol: "T",
    branches: [],
    tooltip: "Data Types",
    tooltipLocked: "",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*0.5 + "px)",
        top: "calc(90px + " + 120*0 + "px)",
    },
    layerShown: true,

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return;
        player[this.layer].unlocked = true;
    },

    tabFormat: {
        Introduction: {
            content: [
                ["display-text", `
                JavaScript can store data in several different ways.<br>
                The type of data determines what can be done to it.<br>
                Without these the computer would not know what to do if it encountered:<br>
                `],
                "blank",
                ["code-block", [
                `var result = "Dog" + 22;`
                ]],
                "blank",
                ["display-text", `
                How do you add 22 to "Dog"?<br><br>
                This module will go over:<br>
                What data types exist.<br>
                How to create each data type.<br>
                What you can do to each data type.<br>
                <br>
                In the test suite, you can choose between:<br>
                Checking what type some data is.<br>
                Checking if a method can be done to a specific piece of data.<br>
                `]
            ]
        },
        Strings: {
            content: [
                ["display-text", `
                <h2>Creating Strings</h2><br>
                <br>
                Strings are any number of characters, enclosed by ', ", and \`.<br>
                (Collectively called quotes in this tutorial)<br>
                Here are some examples of strings:<br>
                `],
                "blank",
                ["code-block", [
                `var string1 = "The Prestige Tree";`,
                `var string2 = '1024';`,
                `var string3 = \`true\`;`,
                `var string4 = "";`,
                ]],
                "blank",
                ["display-text", `
                Using ' or " will create a single line string.<br>
                Using \` will allow a string to go over multiple lines.<br>
                `],
                "blank",
                ["code-block", [
                `var string1 = "I am a single line string!";`,
                `var string2 = 'I cannot go on multiple lines.';`,
                `var string3 = \`I am a multi line string.`,
                `               I can go across multiple lines!\`;`,
                ]],
                "blank",
                ["display-text", `
                <h2>Backslash Sequences</h2><br>
                <br>
                You can also use a backslash to insert special characters.<br>
                \\', \\", \\\` will insert the quote into a string created using that quote.<br>
                \\n will insert a new line into a string. This will appear when output in html or the console.<br>
                \\b, \\f, \\r, \\t, and \\v also exist, but serve no function.<br>
                There were designed for typewriters and fax machines.<br>
                `],
                "blank",
                ["code-block", [
                `var string1 = "I am a string with a \\" character!";`,
                `var string2 = 'I am a \\n string on 2 lines."`,
                ]],
                "blank",
                ["display-text", `
                <h2>Methods</h2><br>
                <br>
                While strings are primatives, there is an equivalent String object.<br>
                It is best to not use String objects, as they take longer to create, and perform unexpectedly in conditions.<br>
                You will learn more about objects in the Objects module.<br>
                <br>
                The length property returns the length of the string.<br>
                It returns a number.<br>
                `],
                "blank",
                ["code-block", [
                `var string = "I am 24 characters long.";`,
                `var length = string.length;`,
                ``,
                `    length -> 24`
                ]],
                "blank",
                ["display-text", `
                The indexOf() method returns the first time an input appears in the string.<br>
                The 1st argument is the input to search for.<br>
                It also supports regular expressions, which you will learn about in JavaScript+.<br>
                The 2nd argument is optional, and is the index to start searching from.<br>
                If the string does not contain the input, it will return -1.<br>
                It returns a number.<br>
                `],
                "blank",
                ["code-block", [
                `var string = "I am being searched.";`,
                `var wordIndex = string.indexOf("searched");`,
                `var charIndex = string.indexOf("e", 12);`,
                `var noIndex = string.indexOf("no");`,
                ``,
                `    wordIndex -> 11`,
                `    charIndex -> 0`,
                `    noIndex   -> -1`,
                ]],
                "blank",
                ["display-text", `
                The charAt() method returns the character at a given index.<br>
                The first argument is the index to retrieve from.<br>
                If the index is too big or negative, it will return an empty string.<br>
                It returns a string.<br>
                `],
                "blank",
                ["code-block", [
                `var string = "What character is at index 5?";`,
                `var char = string.charAt(5);`,
                `var empty = string.charAt(105);`,
                ``,
                `    char  -> c`,
                `    empty -> ""`
                ]],
                "blank",
                ["display-text", `
                The slice() method returns part of the string.<br>
                The first argument is the index to start at.<br>
                The second argument is optional and is the index to end at.<br>
                If an end index is not given, it will go until the end.<br>
                Negative indexes start from the end, and go backwards.<br>
                If the indexes are too big or too small, it will not add any extra characters.<br>
                If the start index is further along than the end index, it will return an empty string.<br>
                It returns a string.<br>
                `],
                "blank",
                ["code-block", [
                `var string = "I am being sliced.";`,
                `var noEnd = string.slice(5);`,
                `var negative = string.slice(2, -2);`,
                `var largeIndexes = string.slice(2, 100);`,
                `var backwards = string.slice(10, 2);`,
                ``,
                `    noEnd        -> "being sliced."`,
                `    negative     -> "am being slice"`,
                `    largeIndexes -> "am being sliced."`,
                `    backwards    -> ""`,
                ]],
                "blank",
            ]
        },
        Test: {

        },
    }
});

addLayer("JScomments", {
    symbol: "C",
    branches: [],
    tooltip: "Comments",
    tooltipLocked: "",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*2 + "px)",
        top: "calc(90px + " + 120*0 + "px)",
    },
    layerShown: true,

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = true;
    },

    tabFormat: {
    }
});

addLayer("JSvariables", {
    symbol: "V",
    branches: ["JStypes"],
    tooltip: "Variables",
    tooltipLocked: "Complete Data Types to unlock Variables.",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*0.5 + "px)",
        top: "calc(90px + " + 120*1 + "px)",
    },
    layerShown() {
        return player.JStypes.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = player.JStypes.completed;
    },

    tabFormat: {
    }
});

addLayer("JSdebugging", {
    symbol: "D",
    branches: [],
    tooltip: "Debugging",
    tooltipLocked: "",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*2 + "px)",
        top: "calc(90px + " + 120*1 + "px)",
    },
    layerShown: true,

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = true;
    },

    tabFormat: {
    }
});

addLayer("JSconditions", {
    symbol: "C",
    branches: ["JSvariables"],
    tooltip: "Conditions",
    tooltipLocked: "Complete Variables to unlock Conditions.",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*0 + "px)",
        top: "calc(90px + " + 120*2 + "px)",
    },
    layerShown() {
        return player.JSvariables.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = player.JSvariables.completed;
    },

    tabFormat: {
    }
});

addLayer("JSfunctions", {
    symbol: "F",
    branches: ["JSvariables"],
    tooltip: "Functions",
    tooltipLocked: "Complete Variables to unlock Functions.",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*1 + "px)",
        top: "calc(90px + " + 120*2 + "px)",
    },
    layerShown() {
        return player.JSvariables.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = player.JSvariables.completed;
    },

    tabFormat: {
    }
});

addLayer("JSloops", {
    symbol: "L",
    branches: ["JSconditions"],
    tooltip: "Loops",
    tooltipLocked: "Complete Conditions to unlock Loops.",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*0 + "px)",
        top: "calc(90px + " + 120*3 + "px)",
    },
    layerShown() {
        return player.JSconditions.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = player.JSconditions.completed;
    },

    tabFormat: {
    }
});

addLayer("JSobjects", {
    symbol: "O",
    branches: ["JSfunctions"],
    tooltip: "Objects",
    tooltipLocked: "Complete Functions to unlock Objects.",

    nodeStyle: {
        position: "absolute",
        left: "calc((50% - 180px) + " + 120*1 + "px)",
        top: "calc(90px + " + 120*3 + "px)",
    },
    layerShown() {
        return player.JSfunctions.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            completed: false,
        }
    },
    unlocked() {
        if (player[this.layer].unlocked) return
        player[this.layer].unlocked = player.JSfunctions.completed;
    },

    tabFormat: {
    }
});