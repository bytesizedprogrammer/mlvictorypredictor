// Function for YouTube icon click
function handleYoutubeClick() {
    window.electron.openExternal('https://www.youtube.com/@SSBMVictoryPredictorOfficialCh');
}

// Function for Discord icon click
function handleDiscordClick() {
    window.electron.openExternal('https://discord.gg/2CCP3dq9bm');
}

// Function for Support Us button click
function handleSupportClick() {
    window.electron.openExternal('https://bytesizedprogrammer.github.io/support.html');
}

// Function for Version button click
function handleVersionClick() {
    window.electron.openExternal('https://github.com/bytesizedprogrammer/mlvictorypredictor');
}


//function handleWebsocketClick() {
//    window.electron.startWebSocket();
//}

// Attach click events to elements
document.getElementById('youtubeIcon').addEventListener('click', handleYoutubeClick);
document.getElementById('discordIcon').addEventListener('click', handleDiscordClick);
document.getElementById('supportButton').addEventListener('click', handleSupportClick);
document.getElementById('versionButton').addEventListener('click', handleVersionClick);
//document.getElementById('runModel').addEventListener('click', handleWebsocketClick);