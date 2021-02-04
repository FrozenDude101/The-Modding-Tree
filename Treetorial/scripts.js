//  -------- Constants --------

const answerColours = [
    "", // Not selected.
    "#FD0", // Selected.
    "#C01", // Wrong.
    "#282", // Right.
]

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