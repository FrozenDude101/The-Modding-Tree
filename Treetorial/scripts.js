//  -------- Constants --------

const QUESTIONS = {
    JStypes: [
        {question: "Which of the following are valid strings?",        answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "How would you insert a new line into a string?",   answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "Which of the following are valid numbers?",        answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "What is the result of (true && false || !false)?", answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "Which of the following are truthy values?",        answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "Can you put an Array inside of an Array?",         answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "What does the .shift() Array method do?",          answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "What is the data type is null?",                   answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
        {question: "What is the default value of a variable?",         answers: [1, 3, 6],
        options: ["\"String\"", "true", "'a'", "[\"String\", 2]", "3.4e27", "`3`"]},
    ]
}

//  -------- Formatting Functions --------

function formatCodeBlock(lines) {

    let ret = "";

    ret += "<div class=codeBlock>";
    if (lines.length != 0) {
        for (let i = 0; i < lines.length; i++) {
            ret += "<span class=codeLine>" + lines[i] + "</span><br>";
        }
    }
    ret += "</div>";

    return ret;

}

//  -------- Multi Layer Functions --------

function getQuiz(layer) {

    return [
        ["row", [
            ["clickable", "1000"],
            ["blank", ["50px"]],
            ["display-text", "<h2 class=questionNumber>" + (player.JStypes.question == QUESTIONS["JStypes"].length + 1 ? "Results" : "Question #" + player.JStypes.question) + "</h2>"],
            ["blank", ["50px"]],
            ["clickable", (player.JStypes.question == QUESTIONS["JStypes"].length ? "1002" : "1001")]
        ]],
        "blank",
        ["column", tmp.JStypes.question]
    ];
    
}

function getQuestion(layer) {

    if (!(tmp[layer].refreshQuestion || tmp[layer].refreshQuestion == undefined)) return tmp[layer].question;
    tmp[layer].refreshQuestion = false;
    
    let question = player[layer].question;
    switch(question) {
        case QUESTIONS[layer].length + 1:
            return [
                ["display-text", `
                    Your best score is ` + player[layer].best + `/` + QUESTIONS[layer].length + `.<br>
                    Your last score was ` + player[layer].last + `/` + QUESTIONS[layer].length + `.<br>
                `],
                "blank",
                ["clickable", 1003],
            ];
        default:
            let answers = ["column", []];
            for (let i = 0; i <= 2; i ++) {
                if (i != 0) answers[1].push("blank");
                let row = ["row", []];
                for (let j = 1; j <= 3; j ++) {
                    let id = question*10 + i*3 + j;
                    if (j != 1 && getClickableState(layer, id) != undefined) row[1].push("blank");
                    row[1].push(["clickable", id]);
                }
                answers[1].push(row);
            }
            return [
                ["display-text", QUESTIONS[layer][question-1].question],
                "blank",
                answers,
            ];
    }

}

function markQuestions(layer) {

    let ret = 0;
    for (let i = 0; i <= QUESTIONS[layer].length; i ++) {
        let score = 0;
        for (let j = 1; j <= 9; j ++) {
            if (getClickableState(layer, i+1 + "" + j) == undefined) break;
            let multiplier = QUESTIONS[layer][i].answers.includes(j) * 2 - 1;
            score += multiplier * getClickableState(layer, i+1 + "" + j) / QUESTIONS[layer][i].answers.length;
        }
        ret += Math.max(score, 0);
    }
    ret = Math.floor(ret * 10) / 10;
    return ret;

}

function getClickables(layer) {

    let ret = {
        1000: {
            title: "🡸",
            style() {
                return clickableStyle(this.layer, this.id);
            },

            canClick() {
                return tmp[this.layer].clickables[this.id].style.opacity == 1;
            },
            onClick() {
                clickableFunction(this.layer, this.id);
            },
        },
        1001: {
            title: "🡺",
            style() {
                return clickableStyle(this.layer, this.id);
            },

            canClick() {
                return tmp[this.layer].clickables[this.id].style.opacity == 1;
            },
            onClick() {
                clickableFunction(this.layer, this.id);
            },
        },
        1002: {
            title: "Results",
            style() {
                return clickableStyle(this.layer, this.id);
            },

            canClick() {
                return tmp[this.layer].clickables[this.id].style.opacity == 1;
            },
            onClick() {
                clickableFunction(this.layer, this.id);
            },
        },
        1003: {
            title: "Reset Quiz",
            style() {
                return clickableStyle(this.layer, this.id);
            },

            canClick() {
                return tmp[this.layer].clickables[this.id].style.opacity == 1;
            },
            onClick() {
                clickableFunction(this.layer, this.id);
            },
        },
    }

    let questions = QUESTIONS[layer];
    for (let i = 1; i <= questions.length; i ++) {
        for (let j = 1; j <= questions[i-1].options.length; j ++) {
            ret[i*10+j] = {
                title: questions[i-1].options[j-1],
                style() {
                    return clickableStyle(this.layer, this.id);
                },

                canClick() {
                    return !getClickableState(this.layer, 1002);
                },
                onClick() {
                    clickableFunction(this.layer, this.id);
                },
            };
        }
    }

    return ret;

}

function clickableStyle(layer, id) {

    switch(id) {
        case "1000":
            return {
                height: "40px",
                width: "80px",
                opacity: (player[layer].question == 1 ? 0 : 1),
            };
        case "1001":
            return {
                height: "40px",
                width: "80px",
                opacity: (player[layer].question >= QUESTIONS[layer].length ? 0 : 1),
            };
        case "1002":
            return {
                height: "40px",
                width: "80px",
                opacity: (player[layer].question == QUESTIONS[layer].length ? 1 : 0),
            };
        case "1003":
            return {
                height: "40px",
                width: "80px",
                opacity: (player[layer].question > QUESTIONS[layer].length ? 1 : 0),
            };
        default:
            let colour = (getClickableState(layer, 1002) ? 3 - (getClickableState(layer, id) ^ QUESTIONS[layer][Math.floor(id/10)-1].answers.includes(id%10)) : 1*getClickableState(layer, id));
            switch(colour) {
                case 0:
                    colour = "rgba(0, 0, 0, 0.125)";
                    break;
                case 1:
                    colour = "#FD0";
                    break;
                case 2:
                    colour = "#C01";
                    break;
                case 3:
                    colour = "#282";
                    break;
            }
            return {
                height: "100px",
                width: "150px",
                "border": colour + " 5px solid",
            }
    }

}

function clickableFunction(layer, id) {

    switch(id) {
        case "1000":
            tmp[layer].refreshQuestion = true;
            player[layer].question --;
            break;
        case "1001":
            tmp[layer].refreshQuestion = true;
            player[layer].question ++;
            break;
        case "1002":
            tmp[layer].refreshQuestion = true;
            player[layer].question ++;
            if (getClickableState(layer, id)) return;
            setClickableState(layer, id, true);
            player[layer].last = markQuestions(layer);
            player[layer].best = Math.max(player[layer].best, player[layer].last);
            break;
        case "1003":
            tmp[layer].refreshQuestion = true;
            player[layer].question = 1;
            player[layer].clickables = getStartClickables(layer);
            break;
        default:
            setClickableState(layer, id, !getClickableState(layer, id));
    }

}