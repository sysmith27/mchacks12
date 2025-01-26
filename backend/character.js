const pb = document.getElementById('princess-buttercup');
const nnb = document.getElementById('nathaniel-nutella-banana');
const ppb = document.getElementById('phillipa-peanut-butter');
const jj = document.getElementById('jimbo-jelly');

pb.addEventListener("click", pbclicked);
function pbclicked() {
    window.location.href = 'maze.html';
    localStorage.char = "butter";
}

nnb.addEventListener("click", nnbclicked);
function nnbclicked() {
    window.location.href = 'maze.html';
    localStorage.char = "nutella";
}

ppb.addEventListener("click", ppbclicked);
function ppbclicked() {
    window.location.href = 'maze.html';
    localStorage.char = "pbhoney";
}

jj.addEventListener("click", jjclicked);
function jjclicked() {
    window.location.href = 'maze.html';
    localStorage.char = "jelly";
}
