//vscode-fold=1

//  -------- Constants --------

const QUESTIONS = {
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

//  -------- Quiz Functions --------

/*function getQuiz(layer) {

    return [
        ["row", [
            ["clickable", "1000"],
            ["blank", ["50px"]],
            ["display-text", "<h2 class=questionNumber>" + (player[layer].question == QUESTIONS[layer].length + 1 ? "Results" : "Question #" + player[layer].question) + "</h2>"],
            ["blank", ["50px"]],
            ["clickable", 1001 + (player[layer].question >= QUESTIONS[layer].length) + (player[layer].question > QUESTIONS[layer].length)],
        ]],
        "blank",
        ["column", tmp[layer].question]
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
                    Your scored ` + player[layer].last + `/` + QUESTIONS[layer].length + `.<br>
                    Your best ever score was ` + player[layer].best + `/` + QUESTIONS[layer].length + `.<br>
                `],
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
            if (isNaN(tmp[layer].clickables[1003].style.opacity)) tmp[layer].clickables[1003].style.opacity = 0;
            return {
                height: "40px",
                width: "80px",
                opacity: (player[layer].question > QUESTIONS[layer].length ? Math.min(tmp[layer].clickables[1003].style.opacity + 0.01, 1) : 0),
            };
        default:
            let borderColour = 0;
            let backgroundColour = "";

            if (getClickableState(layer, id)) {
                borderColour += 1;
                if (getClickableState(layer, 1002)) {
                    borderColour += 1;
                    if (QUESTIONS[layer][Math.floor(id/10)-1].answers.includes(id%10)) {
                        borderColour += 1;
                    }
                }
            } else if (getClickableState(layer, 1002) && QUESTIONS[layer][Math.floor(id/10)-1].answers.includes(id%10)) {
                borderColour += 2;
            }

            switch(borderColour) {
                case 0:
                    borderColour = "rgba(0, 0, 0, 0.125)";
                    backgroundColour = "#EEE";
                    break;
                case 1:
                    borderColour = "#FD0";
                    backgroundColour = "#EEE";
                    break;
                case 2:
                    borderColour = "#FD0";
                    backgroundColour = "#B88";
                    break;
                case 3:
                    borderColour = "#FD0";
                    backgroundColour = "#7B5";
                    break;
            }

            return {
                height: "100px",
                width: "150px",
                border: borderColour + " 5px solid",
                "background-color": backgroundColour,
            };
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
            if (player[layer].last == QUESTIONS[layer].length) {
                if (!player[layer].completed) player.points = player.points.add(1);
                player[layer].completed = true;
                needCanvasUpdate = true;
            }
            break;
        case "1003":
            tmp[layer].refreshQuestion = true;
            player[layer].question = 1;
            player[layer].clickables = getStartClickables(layer);
            break;
        default:
            setClickableState(layer, id, !getClickableState(layer, id));
    }

}*/

//  -------- Other Functions --------

function update(diff) {

    let points = 0;
    for (let module in QUESTIONS) {
        if (player[module].completed) points ++;
    }
    player.points = new Decimal(points);
    // Calculates the player's points every tick.

}