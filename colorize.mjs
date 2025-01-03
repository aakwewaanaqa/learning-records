function colorize(t) {
    return t
        .split("\n")
        .map((e, i) => e.replace(
            /\b(var|new|this)\b/g, 
            "<span style='color: var(--keyword)'>$1</span>"))
        .map((e, i) => e.replace(
            /\b(return|yield|await|try|is|not|catch|throw|if|else|while|break)\b/g,
            "<span style='color: var(--flow)'>$1</span>"))
        .map((e, i) => e.replace(
            /\b(public|private|static|const|namespace|class|struct|null|void|readonly|get|set|async)\b/g,
            "<span style='color: var(--keyword)'>$1</span>"))
        .map((e, i) => e.replace(
            /([a-zA-Z0-9]+)(?<!var)\(/g, 
            "<span style='color: var(--method)'>$1</span>("))
        .map((e, i) => e.replace(
            / [/][/](.*)/g, 
            "<span style='color: var(--comment)'> //$1</span>"))
        .reduce((a, b) => a + "\n" + b)
}

function replacement(t) {
    return t
        .replace(
            /\|(.+)\|/g,
            `&lt;$1&gt;`
        );
}

document.querySelectorAll('p').forEach(p => {
    var html = colorize(p.innerHTML)
    html = replacement(html)
    p.innerHTML = html
})