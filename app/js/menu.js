const ipcRenderer = require('electron').ipcRenderer


document.getElementById('start').addEventListener('click', function(){
    getHard();
    window.location.href = `file://${__dirname}/../target.html`
    
});

document.getElementById('end').addEventListener('click', function(){
    ipcRenderer.send('quit');
})

function getHard() {
    var diffRadio = document.getElementsByName('group1');
    let difficulty = "easy"; // default difficulty. 
    var typeRadio = document.getElementsByName('game-type');
    let gameType = "easy"; // default gameType. 
    for (var i = 0, length = diffRadio.length; i < length; i++) {
        if (diffRadio[i].checked) {
            difficulty = diffRadio[i].value;
            console.log("Difficulty set to " + difficulty);
            console.assert(typeof difficulty === "string")
            break;
        }
    }
    for (var i = 0, length = typeRadio.length; i < length; i++) {
        if (typeRadio[i].checked) {
            // do whatever you want with the checked radio
            gameType = typeRadio[i].value;
            console.log("GameType set to " + gameType);
            console.assert(typeof gameType === "string")
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    ipcRenderer.send('game-settings', difficulty, gameType);
}
