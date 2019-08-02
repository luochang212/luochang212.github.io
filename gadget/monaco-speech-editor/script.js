var synth = window.speechSynthesis;

var inputTxt = "I am going to play basketball"

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });

}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

	if (inputTxt !== '') {
	var utterThis = new SpeechSynthesisUtterance(inputTxt);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = "Google UK English Female";//voiceSelect.selectedOptions[0].getAttribute('data-name');
	for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.rate = document.getElementById("rate").value;
    utterThis.pitch = document.getElementById("pitch").value;
    synth.speak(utterThis);
  }
}

var pauseResume = 'R';

function doPauseResume() {
	if(pauseResume == 'R') {
		window.speechSynthesis.pause();
		pauseResume = 'P';
	} else if(pauseResume == 'P') {
		window.speechSynthesis.resume();
		pauseResume = 'R';
	} else {
		console.log("Unknown state...");
	}
	return false;
}

function doStop() {
	pauseResume = 'R';
	window.speechSynthesis.cancel();
	return false;
}