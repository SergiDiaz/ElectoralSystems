var idCounter = 0;
var selectToVote;
var btnToVote;
var curVoterIndex = 0;

function addCandidate() {
	var textInput = document.getElementById("inputCandidate");
	var candidate = {};
	candidate.text = textInput.value;
	candidate.id = idCounter;
	candidate.votes = 0;
	candidate.category = "";
	candidate.elected = false;
	candidate.eliminated = false;

	candidates.push(candidate);
	idCounter++;

	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = candidate.text;
	column.appendChild(txt);
	row.appendChild(column);
	var table = document.getElementById("candidates");
	table.appendChild(row);

	textInput.value = "";
};

function closeCandidates() {
	var textInput = document.getElementById("inputNumElected");
	candidatesToChose = textInput.value;
	
	var div = document.getElementById("candidatures");
	var child = document.getElementById("inputCandidate");
	div.removeChild(child);
	child = document.getElementById("btnClose");
	div.removeChild(child);
	child = document.getElementById("btnAdd");
	div.removeChild(child);

	div = document.getElementById("votes");
	selectToVote = document.createElement("select");
	div.appendChild(selectToVote);
	fillSelectToVote();
	btnToVote = document.createElement("button");
	btnToVote.type = "button";
	btnToVote.textContent = "Votar en la posici\xF3n 1";
	btnToVote.addEventListener("click", voteCandidate);
	div.appendChild(btnToVote);

	child = document.createElement("button");
	child.type = "button";
	child.textContent = "Siguiente votante";
	child.addEventListener("click", nextVoter);
	div.appendChild(child);

	child = document.createElement("button");
	child.type = "button";
	child.textContent = "Cerrar votaci\xF3n";
	child.addEventListener("click", endVotesAndCount);
	div.appendChild(child);

	child = document.createElement("br");
	div.appendChild(child);

	child = document.createElement("table");
	child.id = "votesTable";
	div.appendChild(child);

	results.voters = [];
	results.totalVotes = 0;
};

function fillSelectToVote() {
	while(selectToVote.hasChildNodes()) {
		selectToVote.removeChild(selectToVote.childNodes[0]);
	}

	var child;
	for(var i=0; i<candidates.length; ++i) {
		child = document.createElement("option");
		child.text = candidates[i].text;
		child.value = candidates[i].id;
		selectToVote.appendChild(child);
	}
};

function voteCandidate() {
	var selectedIndex = selectToVote.selectedIndex;
	if(selectedIndex == -1) {
		return;
	}

	var option = selectToVote.options[selectedIndex];
	var indexCandidate = option.value;
	selectToVote.removeChild(option);

	if(typeof results.voters[curVoterIndex] === "undefined") {
		results.voters[curVoterIndex] = {};
		results.voters[curVoterIndex].votes = [];
		results.totalVotes++;
	}

	var vote = {};
	vote.category = candidates[indexCandidate].category;
	vote.id = candidates[indexCandidate].id;
	vote.text = candidates[indexCandidate].text;
	vote.indexCandidate = indexCandidate;
	results.voters[curVoterIndex].votes.push(vote);

	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = "" + (results.voters[curVoterIndex].votes.length) + " - " + vote.text;
	column.appendChild(txt);
	row.appendChild(column);
	var table = document.getElementById("votesTable");
	table.appendChild(row);

	btnToVote.textContent = "Votar en la posici\xF3n " + (results.voters[curVoterIndex].votes.length + 1);
};

function nextVoter() {
	fillSelectToVote();
	curVoterIndex++;
	btnToVote.textContent = "Votar en la posici\xF3n 1";
	var table = document.getElementById("votesTable");
	while(table.hasChildNodes()) {
		table.removeChild(table.childNodes[0]);
	}
};

function endVotesAndCount() {
	var div = document.getElementById("votes");
	div.parentNode.removeChild(div);
	outputProgress = document.getElementById("progress");
	resultsTable = document.getElementById("results");
	prepareVUT();
};