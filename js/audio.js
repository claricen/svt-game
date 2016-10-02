// Audio

var audio, muteButton;

function initAudioPlayer() {
	audio = new Audio();
	audio.src = "assets/music/ajunice_instrumental.mp3";
	audio.loop = true;
	audio.play();

	toggleSound = document.getElementById("mute");
	toggleSound.addEventListener("click", mute);

	function mute() {
		audio.muted = audio.muted ? false : true;
	}
}

window.addEventListener("load", initAudioPlayer);