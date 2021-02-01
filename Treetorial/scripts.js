function formatCodeBlock(lines) {

    let ret;

    ret = "<div class=codeBlock>";
    if (lines.length != 0) {
        for (let i = 0; i < lines.length; i++) {
            ret += "<span class=codeLine>" + lines[i] + "</span><br>";
        }
    }
    ret += "</div>";

    return ret;

}