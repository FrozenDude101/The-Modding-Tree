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
                How do you add 22 to "Dog"?<br>
                <br>
                JavaScript contains primitive data types and objects.<br>
                Primitive data types include strings, numbers, and booleans.<br>
                They each have an equivalent object, however they should not be used.<br>
                Objects have different rules for logic, which you will learn in the Objects module.<br>
                `],
                "blank",
                ["code-block", [
                    `var bool1 = new Boolean(true)`,
                    `var bool2 = new Boolean(true)`,
                    `var intendedResult = true == true;`,
                    `var actualResult = bool1 == bool2;`,
                    ``,
                    `    intendedResult -> true`,
                    `    actualResult   -> false`,
                ]],
                "blank",
                ["display-text", `
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
                ["infobox-column", "stringCreation"],
                "blank",
                ["infobox-column", "stringSequences"],
                "blank",
                ["infobox-column", "stringOperators"],
                "blank",
                ["infobox-column", "stringMethods"],
                "blank",
            ]
        },
        Numbers: {
            content: [
                ["infobox-column", "numberCreation"],
                "blank",
                ["infobox-column", "numberSpecial"],
                "blank",
                ["infobox-column", "numberOperators"],
                "blank",
                ["infobox-column", "numberMethods"],
                "blank",
            ]
        },
        Test: {

        },
    },

    infoboxes: {
        stringCreation: {
            title: "Creating Strings",
            body: [
                ["display-text", `
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
                    All the primitive types can be converted to a string using the .toString() method.<br>
                    When data is added to a string using +, JavaScript will attempt to call it's toString() method.<br>
                    Objects can also use this method, which you will learn about in the Objects module.<br>
                `],
                "blank",
                ["code-block", [
                    `var string1 = true.toString();`,
                    `var string2 = 2.toString();`,
                    ``,
                    `    string1 -> "true"`,
                    `    string2 -> "2"`,
                ]],
            ],
        },
        stringSequences: {
            title: "Backslash Sequences",
            body: [
                ["display-text", `
                    You can also use a backslash to insert special characters.<br>
                    \\', \\", \\\` will insert the quote into a string created using that quote.<br>
                    \\n will insert a new line into a string. This will appear when output in html or the console.<br>
                    \\b, \\f, \\r, \\t, and \\v also exist, but serve no function.<br>
                    There were designed for typewriters and fax machines.<br>
                `],
                "blank",
                ["code-block", [
                    `var string1 = "I am a string with a \\" character!";`,
                    `var string2 = 'I am a \\n string on 2 lines.";`,
                ]],
            ],
        },
        stringOperators: {
            title: "String Operators",
            body: [
                ["display-text", `
                    Strings use the + operator for concatenation.<br>
                    They will never use + to perform addition.<br>
                `],
                "blank",
                ["code-block", [
                    `var concat = "I have " + "been joined!";`,
                    `var noAddition = "1" + "2";`,
                    ``,
                    `    concant    -> "I have been joined!"`,
                    `    noAddition -> "12"`,
                ]],
                "blank",
                ["display-text", `
                    Strings will attempt to use -, *, and / with numbers, but never +.<br>
                    If the string can be converted, it will return the result.<br>
                    Otherwise it will return NaN.<br>
                    You will learn about NaN in the Numbers section.<br>
                `],
                "blank",
                ["code-block", [
                    `var valid1 = "23" - 4;`,
                    `var valid2 = 4 * "2.3";`,
                    `var NaN = "I will NaN" / 3;`,
                    ``,
                    `    valid1 -> 19`,
                    `    valid2 -> 9.2`,
                    `    NaN    -> NaN`,
                ]],
                "blank",
                ["display-text", `
                    Boolean operators also work with strings.<br>
                    Strings with content are always a truthy value.<br>
                    Empty strings are falsey.<br>
                `],
                "blank",
                ["code-block", [
                    `var bool1 = "I am truthy." && true;`,
                    `var bool2 = "false" && true;`,
                    `var bool3 = "" && true;`,
                    ``,
                    `    bool1 -> true`,
                    `    bool2 -> true`,
                    `    bool3 -> false`,
                ]],
            ],
        },
        stringMethods: {
            title: "String Methods",
            body: [
                ["display-text", `
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
                ["display-text", `
                    The repeat() method returns the string repeated.<br>
                    The first argument is the number of times to repeat.<br>
                    If the number of times to repeat is 0, it will return an empty string.<br>
                    If the number of times to repeat is negative, it will error.<br>
                    It returns a string.<br>
                `],
                "blank",
                ["code-block", [
                    `var repeat = "Repeat".repeat(2);`,
                    `var repeatZero = "I am gone.".repeat(0);`,
                    ``,
                    `    repeat     -> "RepeatRepeat"`,
                    `    repeatZero -> ""`,
                ]],
            ],
        },
        
        numberCreation: {
            title: "Creating Numbers",
            body: [
                ["display-text", `
                    Numbers are any valid number, not surrounded by anything.<br>
                    Numbers can be integers or non-integers.<br>
                    Numbers can be written out in scientific form too.<br>
                    Here are some examples of numbers:<br>
                `],
                "blank",
                ["code-block", [
                    `var number1 = 22;`,
                    `var number2 = -3.4;`,
                    `var number3 = 2.7e42;`,
                    `var number4 = 0;`,
                ]],
                "blank",
                ["display-text", `
                    Numbers are represented using 64 bit floating point.<br>
                    They have a finite accuracy of 15 decimal places.<br>
                    When using decimal numbers, the result is not always 100% correct.<br>
                    When this happens, a floating point error has occured.<br>
                    For almost all cases, the error is too small to matter.<br>
                `],
                "blank",
                ["code-block", [
                    `var floatingPointError = 0.1 + 0.2;`,
                    ``,
                    `    floatingPointError -> 0.30000000000000004`,
                ]],
                "blank",
                ["display-text", `
                    All the primitive types can be converted to a string using the parseInt() and parseFloat() global methods.<br>
                    These are global methods, so the data must be passed as an argument.<br>
                    parseInt() will always round the result down.<br>
                    When data is used with numeric operators, JavaScript will attempt to convert it into a float.<br>
                    Objects can also use this method, which you will learn about in the Objects module.<br>
                    Boolean data, and invalid strings will be converted to NaN.<br>
                `],
                "blank",
                ["code-block", [
                    `var number1 = parseInt(2);`,
                    `var number2 = parseFloat(2);`,
                    `var number3 = parseInt("8.7");`,
                    `var number4 = parseFloat("8.7");`,
                    `var number5 = parseInt(true);`,
                    `var number6 = parseFloat("I'm an invalid string.");`,
                    ``,
                    `    number1 -> 2`,
                    `    number2 -> 2`,
                    `    number3 -> 8`,
                    `    number4 -> 8.7`,
                    `    number5 -> NaN`,
                    `    number6 -> NaN`,
                ]],
            ],
        },
        numberSpecial: {
            title: "Special Numbers",
            body: [
                ["display-text", `
                    Numbers have a maximum value of about 1.79e308.<br>
                    Any number past this is considered Infinity.<br>
                    Negative Infinity also exists for numbers below -1.79e308.<br>
                    Infinity will also happen if you attempt to divide by 0.<br>
                    <br>
                    A NaN occurs when an operation is invalid.<br>
                    It will appear when you try to use arithmetic on a string that cannot be converted into a number.<br>
                    NaN will also cause any results to become NaN.<br>
                `],
                "blank",
                ["code-block", [
                    `var infinity1 = 2 / Infinity;`,
                    `var infinity2 = -1.79e308 * 10;`,
                    `var nan1 = "I will NaN" - 3;`,
                    `var nan2 = NaN + 2;`,
                    ``,
                    `    infinity1 -> Infinity`,
                    `    infinity2 -> -Infinity`,
                    `    nan1      -> NaN`,
                    `    nan2      -> NaN`,
                ]],
            ],
        },
        numberOperators: {
            title: "Number Operators",
            body: [
                ["display-text", `
                    Numbers use the +, -, *, / operators as you would expect.<br>
                    +, - for addition and subtraction.<br>
                    * and / for multiplication and division.<br>
                `],
                "blank",
                ["code-block", [
                    `var result1 = 1 + 2;`,
                    `var result2 = 1e100 + 1e99;`,
                    `var result3 = 0.2 / 0.1;`,
                    ``,
                    `    result1 -> 3`,
                    `    result2 -> 1.1e100`,
                    `    result3 -> 2`,
                ]],
                "blank",
                ["display-text", `
                    The Math object is a very use object for manipulating numbers.<br>
                    It is a built-in object, so you can use it whenever you want.<br>
                    It contains many useful methods, some of which are show below.<br>
                `],
                "blank",
                ["code-block", [
                    `var round = Math.round(23.4);`,
                    `var sqrt = Math.sqrt(16);`,
                    `var log10 = Math.log10(100);`,
                    `var floor = Math.floor(5.2);`,
                    `var ceil = Math.ceil(5.2);`,
                    `var random = Math.random();`,
                    ``,
                    `    round  -> 23`,
                    `    sqrt   -> 4`,
                    `    log10  -> 2`,
                    `    floor  -> 5`,
                    `    ceil   -> 6`,
                    `    random -> ` + Math.random(),
                ]],
                "blank",
                ["display-text", `
                    There are many more methods available in the Math object, such as min, max, and pow.<br>
                    <br>
                    Boolean operators also work with numbers.<br>
                    All non-zero are truthy.<br>
                    Both 0 and NaN are falsey.<br>
                `],
                "blank",
                ["code-block", [
                    `var bool1 = 22 && true;`,
                    `var bool2 = 0 && true;`,
                    `var bool3 = NaN && true;`,
                    ``,
                    `    bool1 -> true`,
                    `    bool2 -> false`,
                    `    bool3 -> false`,
                ]],
            ],
        },
        numberMethods: {
            title: "Numeric Methods (TODO)",
            body: [
                ["display-text", `
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
            ],
        },
        numberMath: {
            title: "Number Operators",
            body: [
                ["display-text", `
                    Numbers use the +, -, *, / operators as you would expect.
                    +, - for addition and subtraction.
                    * and / for multiplication and division.
                `],
                "blank",
                ["code-block", [
                    `var concat = "I have " + "been joined!";`,
                    `var noAddition = "1" + "2";`,
                    ``,
                    `    concant    -> "I have been joined!"`,
                    `    noAddition -> "12"`,
                ]],
                "blank",
                ["display-text", `
                    Strings will attempt to use -, *, and / with numbers, but never +.<br>
                    If the string can be converted, it will return the result.<br>
                    Otherwise it will return NaN.<br>
                    You will learn about NaN in the Numbers section.<br>
                `],
                "blank",
                ["code-block", [
                    `var valid1 = "23" - 4;`,
                    `var valid2 = 4 * "2.3";`,
                    `var NaN = "I will NaN" / 3;`,
                    ``,
                    `    valid1 -> 19`,
                    `    valid2 -> 9.2`,
                    `    NaN    -> NaN`,
                ]],
                "blank",
                ["display-text", `
                    Boolean operators work with strings.<br>
                    Strings with content are always a truthy value.<br>
                    Empty strings are falsey.<br>
                `],
                "blank",
                ["code-block", [
                    `var bool1 = "I am truthy." && true;`,
                    `var bool2 = "false" && true;`,
                    `var bool3 = "" && true;`,
                    ``,
                    `    bool1 -> true`,
                    `    bool2 -> true`,
                    `    bool3 -> false`,
                ]],
            ],
        },
    },
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