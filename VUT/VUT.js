var resultsTable;
var outputProgress;
var candidatesToChoose;
var roundsTable;

var candidates = [];
var results = {};
var answersByCandidate;
var droopQuota;
var indexCandidate;
var numCandidatesElected;
var numCandidatesEliminated;
var firstDistributionDone = false;
var candidateElectedLastPass;
var gender = false;
var numWomenChoosen;
var minWomenToChoose;
var totalWomen = 0;
var womenLeft;
var menEliminated;
var curRound = 1;


function onLoad() {

};

function prepareVUT() {
	for(var i = 0; i < results.voters.length; ++i) {
		results.voters[i].curIndexVote = 0;
		results.voters[i].curVoteValue = 1;
	}
	droopQuota = Math.floor(results.totalVotes / (candidatesToChoose+1) + 1);
	numCandidatesElected = 0;
	numCandidatesEliminated = 0;
	indexCandidate = 0;
	candidateElectedLastPass = false;
	if(gender) {
		numWomenChoosen = 0;
		womenLeft = totalWomen;
		menEliminated = false;
		minWomenToChoose = Math.ceil(candidatesToChoose / 2);
	}
	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = "Rondas:";
	column.appendChild(txt);
	row.appendChild(column);
	roundsTable.appendChild(row);
	outputProgress.textContent = "Calculating VUT...";
	setTimeout(calculate, 1);
};

function calculate() {
	if(!firstDistributionDone)
	{
		for(var i = 0; i < results.voters.length; ++i) {
			var curIndexVote = results.voters[i].curIndexVote;
			if(results.voters[i].votes[curIndexVote].id == candidates[indexCandidate].id) {
				candidates[indexCandidate].votes++;
			}
		}
	}

	if(gender) {
		if(!menEliminated && (womenLeft > 0) &&
			(numWomenChoosen < minWomenToChoose) && (womenLeft >= candidatesToChoose - numCandidatesElected) && (candidatesToChoose - numCandidatesElected <= minWomenToChoose - numWomenChoosen)) {
			setTimeout(eliminateMen, 1);
			return;
		}
	}

	var candidate = candidates[indexCandidate];
	if(!candidate.elected && candidate.votes >= droopQuota) {
		electCandidate(candidate);
	}
	indexCandidate++;
	if(indexCandidate < candidates.length) {
		setTimeout(calculate, 1);
	}
	else if(numCandidatesElected < candidatesToChoose) {
		firstDistributionDone = true;
		if(candidateElectedLastPass) {
			setTimeout(transferSurplus, 1);
		}
		else {
			setTimeout(eliminateCandidate, 1);
		}
	}
	else {
		var row = document.createElement("tr");
		var column = document.createElement("td");
		var txt = document.createElement("p");
		txt.textContent = "Votos en blanco: " + results.whites;
		column.appendChild(txt);
		row.appendChild(column);
		resultsTable.appendChild(row);

		row = document.createElement("tr");
		column = document.createElement("td");
		txt = document.createElement("p");
		txt.textContent = "Votos nulos: " + results.nulls;
		column.appendChild(txt);
		row.appendChild(column);
		resultsTable.appendChild(row);

		row = document.createElement("tr");
		column = document.createElement("td");
		txt = document.createElement("p");
		txt.textContent = "Cuota para entrar: " + droopQuota;
		column.appendChild(txt);
		row.appendChild(column);
		resultsTable.appendChild(row);

		reportVotes();

		outputProgress.textContent = "Done!";
	}
};

function reportVotes() {
	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = " ";
	column.appendChild(txt);
	row.appendChild(column);
	resultsTable.appendChild(row);
	row = document.createElement("tr");
	column = document.createElement("td");
	txt = document.createElement("p");
	txt.textContent = "Votos emitidos:";
	column.appendChild(txt);
	row.appendChild(column);
	resultsTable.appendChild(row);

	for(var i = 0; i < results.voters.length; ++i) {
		var voter = results.voters[i];
		row = document.createElement("tr");
		column = document.createElement("td");
		txt = document.createElement("p");
		txt.textContent = "Papeleta " + (i+1) + ": ";
		column.appendChild(txt);
		row.appendChild(column);
		for(var j = 0; j < voter.votes.length; ++j) {
			for(var k = 0; k < candidates.length; ++k) {
				if(voter.votes[j].id == candidates[k].id) {
					column = document.createElement("td");
					txt = document.createElement("p");
					txt.textContent = "" + (j+1) + ". " + candidates[k].text;
					column.appendChild(txt);
					row.appendChild(column);
					break;
				}
			}
		}
		resultsTable.appendChild(row);
	}
}

function electCandidate(candidate) {
	numCandidatesElected++;
	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	if(gender) {
		txt.textContent = "" + numCandidatesElected + " - " + candidate.text + " (" + (candidate.female ? "Mujer)" : "Hombre)");
	} else {
		txt.textContent = "" + numCandidatesElected + " - " + candidate.text;
	}
	column.appendChild(txt);
	row.appendChild(column);
	resultsTable.appendChild(row);
	row = document.createElement("tr");
	column = document.createElement("td");
	txt = document.createElement("p");
	txt.textContent = "Ronda " + curRound + ": escogida opción/candidato " + candidate.text;
	column.appendChild(txt);
	row.appendChild(column);
	roundsTable.appendChild(row);
	candidate.elected = true;
	candidateElectedLastPass = true;
	if(gender) {
		if(candidate.female) {
			numWomenChoosen++;
			womenLeft--;
		}
	}
}

function transferSurplus() {
	for(var i = 0; i < candidates.length; ++i) {
		if(candidates[i].votes > droopQuota) {
			var surplus = candidates[i].votes - droopQuota;
			var voteValue = surplus / candidates[i].votes;
			candidates[i].votes = droopQuota;
			transferVotesFromCandidate(candidates[i], voteValue);
		}
	}

	indexCandidate = 0;
	curRound++;
	candidateElectedLastPass = false;
	setTimeout(calculate, 1);
};

function transferVotesFromCandidate(candidate, voteValue) {
	for(var i = 0; i < results.voters.length; ++i) {
		var voter = results.voters[i];
		var curIndexVote = voter.curIndexVote;
		if(curIndexVote < voter.votes.length) {
			if(voter.votes[curIndexVote].id == candidate.id) {
				curIndexVote++;
				if(curIndexVote < voter.votes.length) {
					var newCandidate = candidates[voter.votes[curIndexVote].indexCandidate];
					while(curIndexVote < voter.votes.length && (newCandidate.elected || newCandidate.eliminated)) {
						curIndexVote++;
						if(curIndexVote < voter.votes.length) {
							if(voter.votes[curIndexVote]) {
								newCandidate = candidates[voter.votes[curIndexVote].indexCandidate];
							}
						}
					}
					voter.curIndexVote = curIndexVote;
					if(curIndexVote < voter.votes.length) {
						var curVoteValue = voteValue * voter.curVoteValue;
						voter.curVoteValue = curVoteValue;
						candidates[voter.votes[curIndexVote].indexCandidate].votes += curVoteValue;
					}
				}
			}
		}
	}
};

function eliminateCandidate() {
	var candidateToEliminate;
	var found = false;
	var numVotes = droopQuota*2;
	for(var i = 0; i < candidates.length; ++i) {
		var candidate = candidates[i];
		if(!candidate.elected && !candidate.eliminated) {
			if(candidate.votes <= numVotes) {
				numVotes = candidate.votes;
				candidateToEliminate = candidate;
				found = true;
			}
		}
	}

	if(found) {
		eliminateCandidateInternal(candidateToEliminate);
	}
	indexCandidate = 0;
	curRound++;
	candidateElectedLastPass = false;
	setTimeout(calculate, 1);
}

function eliminateCandidateInternal(candidate) {
	candidate.eliminated = true;
	candidate.votes = 0;
	numCandidatesEliminated++;
	if(gender) {
		if(candidate.female) {
			womenLeft--;
		}
	}

	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = "Ronda " + curRound + ": eliminada opción/candidato " + candidate.text;
	column.appendChild(txt);
	row.appendChild(column);
	roundsTable.appendChild(row);

	if(numCandidatesEliminated >= candidates.length - candidatesToChoose) {
		electNonEliminatedCandidates();
	}
	else {
		transferVotesFromCandidate(candidate, 1);
	}
}

function electNonEliminatedCandidates() {
	for(var i = 0; i < candidates.length; ++i) {
		var candidate = candidates[i];
		if(!candidate.elected && !candidate.eliminated) {
			electCandidate(candidate);
		}
	}
}

function eliminateMen() {
	if(gender) {
		for(var i = 0; i < candidates.length; ++i) {
			var candidate = candidates[i];
			if(!candidate.elected && !candidate.eliminated) {
				if(!candidate.female) {
					eliminateCandidateInternal(candidate);
				}
			}
		}

		menEliminated = true;
		setTimeout(calculate, 1);
	} else {
		console.log("Called eliminateMen when gender isn't active!");
	}
}