var indexVoter;


function start() {
	outputProgress = document.getElementById("progress");
	resultsTable = document.getElementById("results");
	candidatesToChose = 62;
	var resultsVistalegre2 = jsonVistalegre2["payload"]["results"]["questions"][4];
	simulate(resultsVistalegre2);
};

function simulate(resultsByCandidate) {

	results.totalVotes = resultsByCandidate["totals"]["valid_votes"] - resultsByCandidate["totals"]["blank_votes"];

	results.voters = [];

	answersByCandidate = resultsByCandidate["answers"];

	for(var i = 0; i < answersByCandidate.length; ++i) {
		outputProgress.textContent = "Creating candidate " + i;
		candidates[i] = {};
		candidates[i].votes = 0;
		candidates[i].category = answersByCandidate[i].category;
		candidates[i].id = answersByCandidate[i].id;
		candidates[i].text = answersByCandidate[i].text;
	}

	indexVoter = 0;
	outputProgress.textContent = "Simulating voter " + indexVoter;
	setTimeout(simulateVoter, 1);
};

//Simulates a voter by using a 1st vote, then a 2nd vote, then a 3rd vote, etc.
function simulateVoter() {
	if(indexVoter < results.totalVotes) {
		for(var j = 0; j < answersByCandidate.length; ++j) {
			answersByCandidate[j].used = false;
		}
		results.voters[indexVoter] = {};
		results.voters[indexVoter].votes = [];
		for(var position = 0; position < 62; ++position) {
			//Looks for a vote in position 'position' and takes it out from the results.
			for(var j = 0; j < answersByCandidate.length; ++j) {
				if(answersByCandidate[j].used) {
					//A voter can't vote for the same candidate more than once.
					continue;
				}
				if(answersByCandidate[j].voters_by_position[position] > 0) {
					answersByCandidate[j].used = true;
					answersByCandidate[j].voters_by_position[position]--;
					results.voters[indexVoter].votes[position] = {};
					results.voters[indexVoter].votes[position].category = answersByCandidate[j].category;
					results.voters[indexVoter].votes[position].id = answersByCandidate[j].id;
					results.voters[indexVoter].votes[position].text = answersByCandidate[j].text;
					results.voters[indexVoter].votes[position].indexCandidate = j;
					break;
				}
			}
			if(j == answersByCandidate.length) {
				break;
			}
		}
		indexVoter++;
		outputProgress.textContent = "Simulating voter " + indexVoter;
		setTimeout(simulateVoter, 1);
	}
	else {
		outputProgress.textContent = "Preparing VUT...";
		setTimeout(prepareVUT, 1);
	}
};