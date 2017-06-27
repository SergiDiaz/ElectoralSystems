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

function closeCandidates() {
	var divCandidatures = document.getElementById("candidatures");
	var child = document.getElementById("inputCandidate");
	divCandidatures.removeChild(child);
	child = document.getElementById("btnClose");
	divCandidatures.removeChild(child);
	child = document.getElementById("btnAdd");
	divCandidatures.removeChild(child);
};