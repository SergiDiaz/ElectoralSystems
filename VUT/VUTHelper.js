var idCounter = 0;


function addCandidate() {
	var textInput = document.getElementById("inputCandidate");
	var candidate = {};
	candidate.text = textInput.value;
	candidate.id = idCounter;
	candidate.votes = 0;
	candidate.category = "";
	candidate.elected = false;
	candidate.eliminated = false;

	candidates[idCounter] = candidate;
	idCounter++;
};