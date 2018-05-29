var idCounter = 0;
var selectToVote;
var btnToVote;
var curVoterIndex = 0;
var whiteAndNullVotesIndexes = [];


function changeGender() {
	var checkboxInput = document.getElementById("gender");
	gender = checkboxInput.checked;
	var selectGender = document.getElementById("selectGender");
	if(gender) {
		selectGender.style.display = "inline-block";
	} else {
		selectGender.style.display = "none";
	}
}

function addCandidate() {
	var labelGender = document.getElementById("labelGender");
	labelGender.style.visibility = "hidden";

	var textInput = document.getElementById("inputCandidate");
	var candidate = {};
	candidate.text = textInput.value;
	candidate.id = idCounter;
	candidate.votes = 0;
	candidate.category = "";
	candidate.elected = false;
	candidate.eliminated = false;
	if(gender) {
		var selectGender = document.getElementById("selectGender");
		candidate.female = (selectGender.value === "female");
		if(candidate.female) {
			totalWomen++;
		}
	}

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
	candidatesToChoose = Number(textInput.value);
	
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
	results.whites = 0;
	results.nulls = 0;

	var lastVoteHeader = document.getElementById("lastVoteHeader");
	lastVoteHeader.textContent = "\xDAltima Papeleta";
	div = document.getElementById("lastVote");
	child = document.createElement("button");
	child.type = "button";
	child.textContent = "Deshacer";
	child.addEventListener("click", undo);
	div.appendChild(child);
   	div.style.visibility = "visible";
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
	child = document.createElement("option");
	child.text = "Voto en blanco";
	child.value = -1;
	selectToVote.appendChild(child);
	child = document.createElement("option");
	child.text = "Voto nulo";
	child.value = -2;
	selectToVote.appendChild(child);
};

function voteCandidate() {
	var selectedIndex = selectToVote.selectedIndex;
	if(selectedIndex == -1) {
		return;
	}

	var option = selectToVote.options[selectedIndex];
	var indexCandidate = option.value;

	if(indexCandidate == -1) {
		//White vote
		results.whites++;
		var obj = {};
		obj.kind = "white";
		obj.index = curVoterIndex;
		whiteAndNullVotesIndexes.push(obj);
		fillLastVote();
	}
	else if(indexCandidate == -2) {
		//Null vote
		results.nulls++;
		var obj = {};
		obj.kind = "null";
		obj.index = curVoterIndex;
		whiteAndNullVotesIndexes.push(obj);
		fillLastVote();
	}
	else {
		selectToVote.removeChild(option);
		if(typeof results.voters[curVoterIndex] === "undefined") {
			results.voters[curVoterIndex] = {};
			results.voters[curVoterIndex].votes = [];
			results.totalVotes++;
		}

		var lastOption = selectToVote.options[selectToVote.length-1];
		while(lastOption && lastOption.value < 0) {
			selectToVote.removeChild(lastOption);
			lastOption = selectToVote.options[selectToVote.length-1];
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
	}
};

function fillLastVote() {
	var lastVoteHeader = document.getElementById("lastVoteHeader");
	var table = document.getElementById("lastVoteTable");
	while(table.hasChildNodes()) {
		table.removeChild(table.childNodes[0]);
	}
	if(curVoterIndex > 0) {
		if(whiteAndNullVotesIndexes.length > 0 && whiteAndNullVotesIndexes[whiteAndNullVotesIndexes.length-1].index === curVoterIndex) {
			//White or null
			lastVoteHeader.textContent = "\xDAltima Papeleta";
			var row = document.createElement("tr");
			var column = document.createElement("td");
			var txt = document.createElement("p");
			if(whiteAndNullVotesIndexes[whiteAndNullVotesIndexes.length-1].kind === "white") {
				txt.textContent = "Voto en blanco";
			} else {
				txt.textContent = "Voto nulo";
			}
			column.appendChild(txt);
			row.appendChild(column);
			table.appendChild(row);
		} else {
			lastVoteHeader.textContent = "\xDAltima Papeleta (" + curVoterIndex + ")";
			for(var i=0; i < results.voters[curVoterIndex-1].votes.length; ++i) {
				var row = document.createElement("tr");
				var column = document.createElement("td");
				var txt = document.createElement("p");
				txt.textContent = "" + (i+1) + " - " + results.voters[curVoterIndex-1].votes[i].text;
				column.appendChild(txt);
				row.appendChild(column);
				table.appendChild(row);
			}
		}
	} else {
		lastVoteHeader.textContent = "\xDAltima Papeleta";
	}
}

function nextVoter() {
	
	fillSelectToVote();
	curVoterIndex++;
	btnToVote.textContent = "Votar en la posici\xF3n 1";
	table = document.getElementById("votesTable");
	while(table.hasChildNodes()) {
		table.removeChild(table.childNodes[0]);
	}

	fillLastVote();
};

function undo() {
	if(curVoterIndex > 0 || whiteAndNullVotesIndexes.length > 0) {
		if(typeof results.voters[curVoterIndex] !== "undefined") {
			//If there's a half done voting, take it out too
			results.voters.pop();	
			results.totalVotes--;
		}
		if(whiteAndNullVotesIndexes.length > 0 && whiteAndNullVotesIndexes[whiteAndNullVotesIndexes.length-1].index === curVoterIndex) {
			//White or null
			whiteAndNullVotesIndexes.pop();
		} else {
			results.voters.pop();
			curVoterIndex--;
			results.totalVotes--;
		}

		fillLastVote();
	}
}

function endVotesAndCount() {
	var div = document.getElementById("votes");
	div.parentNode.removeChild(div);
	outputProgress = document.getElementById("progress");
	resultsTable = document.getElementById("results");
	prepareVUT();
};