function setupSound(){

    sound = new Object();
    if ($.browser.mozilla) { window.musicExt = 'ogg' } else { window.musicExt = 'mp3' };
    sound.Pop = new Audio("/Sounds/pop." + window.musicExt); // buffers automatically when created
    sound.Pong = new Audio("/Sounds/ponggg." + window.musicExt + ""); // buffers automatically when created
    sound.Win = new Audio("/Sounds/RewardSound." + window.musicExt + ""); // buffers automatically when created
    sound.Lose = new Audio("/Sounds/Boing." + window.musicExt + ""); // buffers automatically when created

}