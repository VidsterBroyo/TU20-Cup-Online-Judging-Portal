// Global variables to store data
let allRubrics = {};
let teamStats = [];
let criteriaAverages = {};
let judgeAverages = {};

// Function to load all the stats data
function loadStats() {
    // Check if a judge is logged in
    if (sessionStorage.getItem('judge')) {
        document.getElementById('backToRubrics').style.display = 'inline-block';
    }
    
    try {
        var request = new XMLHttpRequest();
        request.open('GET', '/getAllRubrics', false);
        request.send();

        allRubrics = JSON.parse(request.responseText);
        
        // Calculate team statistics
        calculateTeamStats();
        
        // Display all the stats
        displaySummaryStats();
        displayTeamRankings();
        displayScoreDistribution();
        displayCriterionAverages();
        displayJudgeComparison();
    } catch (error) {
        console.log("Error loading stats: ", error);
    }
}

// Calculate statistics for each team
function calculateTeamStats() {
    // Create a map of team names to their scores across all judges
    let teamScoresMap = {};
    let criterionScores = {
        "Criterion A": [],
        "Criterion B": [],
        "Criterion C": [],
        "Criterion D": [],
        "Criterion E": []
    };
    judgeAverages = {};
    
    // Initialize judge averages
    Object.keys(allRubrics).forEach(judge => {
        judgeAverages[judge] = {
            count: 0,
            total: 0
        };
    });
    
    // Process all rubrics
    Object.keys(allRubrics).forEach(judge => {
        allRubrics[judge].forEach(rubric => {
            const teamName = rubric["TeamName"];
            const totalScore = parseInt(rubric["Total"]);
            
            // Skip if score is NaN
            if (isNaN(totalScore)) return;
            
            // Add to judge averages
            judgeAverages[judge].count++;
            judgeAverages[judge].total += totalScore;
            
            // Initialize team entry if it doesn't exist
            if (!teamScoresMap[teamName]) {
                teamScoresMap[teamName] = {
                    scores: [],
                    members: rubric["TeamMembers"]
                };
            }
            
            // Add score for this team
            teamScoresMap[teamName].scores.push(totalScore);
            
            // Collect criterion scores
            Object.keys(criterionScores).forEach(criterion => {
                if (rubric[criterion] && !isNaN(parseInt(rubric[criterion]["Score"]))) {
                    criterionScores[criterion].push(parseInt(rubric[criterion]["Score"]));
                }
            });
        });
    });
    
    // Calculate statistics for each team
    Object.keys(teamScoresMap).forEach(teamName => {
        const scores = teamScoresMap[teamName].scores;
        const members = teamScoresMap[teamName].members;
        
        // Sort scores to calculate median
        scores.sort((a, b) => a - b);
        
        teamStats.push({
            teamName: teamName,
            members: members,
            scores: scores,
            average: scores.reduce((a, b) => a + b, 0) / scores.length,
            median: scores.length % 2 === 0 
                ? (scores[scores.length/2 - 1] + scores[scores.length/2]) / 2 
                : scores[Math.floor(scores.length/2)],
            min: scores[0],
            max: scores[scores.length - 1]
        });
    });
    
    // Sort teams by average score (descending)
    teamStats.sort((a, b) => b.average - a.average);
    
    // Calculate criterion averages
    Object.keys(criterionScores).forEach(criterion => {
        const scores = criterionScores[criterion];
        criteriaAverages[criterion] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });
    
    // Calculate average for each judge
    Object.keys(judgeAverages).forEach(judge => {
        if (judgeAverages[judge].count > 0) {
            judgeAverages[judge].average = judgeAverages[judge].total / judgeAverages[judge].count;
        } else {
            judgeAverages[judge].average = 0;
        }
    });
}

// Display summary statistics
function displaySummaryStats() {
    // Calculate overall statistics
    let allScores = [];
    teamStats.forEach(team => {
        allScores = allScores.concat(team.scores);
    });
    
    allScores.sort((a, b) => a - b);
    
    const average = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const median = allScores.length % 2 === 0 
        ? (allScores[allScores.length/2 - 1] + allScores[allScores.length/2]) / 2 
        : allScores[Math.floor(allScores.length/2)];
    const min = allScores[0];
    const max = allScores[allScores.length - 1];
    
    // Create HTML for summary stats
    const summaryHtml = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="font-bold">Number of Teams:</p>
                <p>${teamStats.length}</p>
            </div>
            <div>
                <p class="font-bold">Number of Judges:</p>
                <p>${Object.keys(allRubrics).length}</p>
            </div>
            <div>
                <p class="font-bold">Average Score:</p>
                <p>${average.toFixed(2)}</p>
            </div>
            <div>
                <p class="font-bold">Median Score:</p>
                <p>${median.toFixed(2)}</p>
            </div>
            <div>
                <p class="font-bold">Highest Score:</p>
                <p>${max}</p>
            </div>
            <div>
                <p class="font-bold">Lowest Score:</p>
                <p>${min}</p>
            </div>
        </div>
    `;
    
    document.getElementById('summaryStats').innerHTML = summaryHtml;
}

// Display team rankings
function displayTeamRankings() {
    let rankingsHtml = '';
    
    teamStats.forEach((team, index) => {
        rankingsHtml += `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="border px-4 py-2">${index + 1}</td>
                <td class="border px-4 py-2">${team.teamName}</td>
                <td class="border px-4 py-2">${team.members.join(', ')}</td>
                <td class="border px-4 py-2">${team.average.toFixed(2)}</td>
                <td class="border px-4 py-2">${team.median.toFixed(2)}</td>
                <td class="border px-4 py-2">${team.min}</td>
                <td class="border px-4 py-2">${team.max}</td>
            </tr>
        `;
    });
    
    document.getElementById('teamRankings').innerHTML = rankingsHtml;
}

// Display score distribution chart
function displayScoreDistribution() {
    // Group scores into ranges
    const ranges = {
        '0-10': 0,
        '11-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0,
        '61-70': 0,
        '71-80': 0,
        '81-90': 0,
        '91-100': 0,
        '100+': 0
    };
    
    teamStats.forEach(team => {
        team.scores.forEach(score => {
            if (score <= 10) ranges['0-10']++;
            else if (score <= 20) ranges['11-20']++;
            else if (score <= 30) ranges['21-30']++;
            else if (score <= 40) ranges['31-40']++;
            else if (score <= 50) ranges['41-50']++;
            else if (score <= 60) ranges['51-60']++;
            else if (score <= 70) ranges['61-70']++;
            else if (score <= 80) ranges['71-80']++;
            else if (score <= 90) ranges['81-90']++;
            else if (score <= 100) ranges['91-100']++;
            else ranges['100+']++;
        });
    });
    
    // Create chart
    const ctx = document.getElementById('scoreDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                label: 'Number of Scores',
                data: Object.values(ranges),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Score Range'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Scores'
                }
            }
        }
    });
}

// Display criterion average chart
function displayCriterionAverages() {
    const ctx = document.getElementById('criteriaChart').getContext('2d');
    
    // Get max values for each criterion
    const maxValues = {
        "Criterion A": 20,
        "Criterion B": 15,
        "Criterion C": 15,
        "Criterion D": 30,
        "Criterion E": 20
    };
    
    // Create datasets for actual values and max values
    const criteria = Object.keys(criteriaAverages);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: criteria,
            datasets: [
                {
                    label: 'Average Score',
                    data: criteria.map(c => criteriaAverages[c]),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Maximum Possible',
                    data: criteria.map(c => maxValues[c]),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    type: 'line'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Criterion'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Average Scores by Criterion'
                }
            }
        }
    });
}

// Display judge comparison chart
function displayJudgeComparison() {
    const ctx = document.getElementById('judgeChart').getContext('2d');
    
    const judges = Object.keys(judgeAverages);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: judges,
            datasets: [{
                label: 'Average Score',
                data: judges.map(j => judgeAverages[j].average),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Judge'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Average Scores by Judge'
                }
            }
        }
    });
} 