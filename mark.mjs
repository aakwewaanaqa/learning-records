function $(s) {
    return document.querySelectorAll(s);
}

$('p.answer').forEach(p => {
    const original = p.innerHTML;
    p.innerHTML = "按我看答案。"
    p.onclick = function() {
        p.innerHTML = original;
        p.onclick = null;
    }
});