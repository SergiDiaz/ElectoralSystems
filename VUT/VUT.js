var resultsTable;
var outputProgress;
var candidatesToChose;

var candidates = [];
var results = {};
var answersByCandidate;
var droopQuota;
var indexCandidate;
var numCandidatesElected;
var numCandidatesEliminated;
var firstDistributionDone = false;
var candidateElectedLastPass;


function onLoad() {

};

function prepareVUT() {
	for(var i = 0; i < results.voters.length; ++i) {
		results.voters[i].curIndexVote = 0;
		results.voters[i].curVoteValue = 1;
	}
	droopQuota = Math.floor(results.totalVotes / (candidatesToChose+1) + 1);
	numCandidatesElected = 0;
	numCandidatesEliminated = 0;
	indexCandidate = 0;
	candidateElectedLastPass = false;
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
	var candidate = candidates[indexCandidate];
	if(!candidate.elected && candidate.votes >= droopQuota) {
		electCandidate(candidate);
	}
	indexCandidate++;
	if(indexCandidate < candidates.length) {
		setTimeout(calculate, 1);
	}
	else if(numCandidatesElected < candidatesToChose) {
		firstDistributionDone = true;
		if(candidateElectedLastPass) {
			setTimeout(transferSurplus, 1);
		}
		else {
			setTimeout(eliminateCandidate, 1);
		}
	}
	else {
		outputProgress.textContent = "Done!";
	}
};

function electCandidate(candidate) {
	numCandidatesElected++;
	var row = document.createElement("tr");
	var column = document.createElement("td");
	var txt = document.createElement("p");
	txt.textContent = "" + numCandidatesElected + " - " + candidate.text;
	column.appendChild(txt);
	row.appendChild(column);
	resultsTable.appendChild(row);
	candidate.elected = true;
	candidateElectedLastPass = true;
}

function transferSurplus() {
	var surplusTransfered = false;
	for(var i = 0; i < candidates.length; ++i) {
		if(candidates[i].votes > droopQuota) {
			surplusTransfered = true;
			var surplus = candidates[i].votes - droopQuota;
			var voteValue = surplus / candidates[i].votes;
			candidates[i].votes = droopQuota;
			transferVotesFromCandidate(candidates[i], voteValue);
		}
	}

	setTimeout(eliminateCandidate, 1);
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
			if(candidate.votes < numVotes) {
				numVotes = candidate.votes;
				candidateToEliminate = candidate;
				found = true;
			}
		}
	}

	if(found) {
		candidateToEliminate.eliminated = true;
		candidateToEliminate.votes = 0;
		numCandidatesEliminated++;
		if(numCandidatesEliminated >= candidates.length - candidatesToChose) {
			electNonEliminatedCandidates();
		}
		else {
			transferVotesFromCandidate(candidateToEliminate, 1);
		}
	}
	indexCandidate = 0;
	setTimeout(calculate, 1);
}

function electNonEliminatedCandidates() {
	for(var i = 0; i < candidates.length; ++i) {
		var candidate = candidates[i];
		if(!candidate.elected && !candidate.eliminated) {
			electCandidate(candidate);
		}
	}

	outputProgress.textContent = "Done!";
}