judges = ["Michael", "Trevor", "Franklin"]
judge = ""
team = ""
members = []
change = false

function login() {
    user = document.getElementById('user').value
    password = document.getElementById('password').value


    if (judges.includes(user) && password == "Cup2024r0cks!") {
        sessionStorage.setItem('judge', user)

        window.location.href = "/rubrics"

    } else {
        alert("Invalid credentials")
    }
}


function getJudge() {
    if (sessionStorage.getItem('judge')) {
        judge = sessionStorage.getItem('judge')
        document.title = `${judge}'s TU20 Cup Rubrics`
        document.getElementById("welcome").innerText = "Welcome, " + judge
    } else {
        alert("You need to log in again")
        window.location.href = "/login"
    }

}


function loadRubrics() {
    getJudge()

    rubricsHTML = ""

    console.log("running")
    try {
        var request = new XMLHttpRequest()
        request.open('GET', `/getRubrics/${judge}`, false)
        request.send()

        rubrics = JSON.parse(request.responseText)

        for (i = 0; i < rubrics.length; i++) {
            console.log(rubrics[i]["TeamMembers"])
            rubricsHTML += `<div class="flex items-center justify-between mb-2">
                <button id="rubricButton" class="text-left flex-grow" onclick="displayRubric('${rubrics[i]["TeamName"]}')">${rubrics[i]["TeamName"]}: ${rubrics[i]["TeamMembers"].join(", ")} - ${rubrics[i]["Total"]} points</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2" onclick="deleteRubric('${rubrics[i]["TeamName"]}')">Delete</button>
            </div>`
        }

        document.getElementById("rubricsGroup").innerHTML = rubricsHTML

    } catch (error) {
        console.log(error)
    }
}

function addRubric() {
    tName = document.getElementById("teamName").value
    members = document.getElementById("teamMembers").value.split(",")

    try {

        newRubric = {
            "TeamName": tName,
            "TeamMembers": members,
            "Criterion A": { "Score": 0, "Comments": "" },
            "Criterion B": { "Score": 0, "Comments": "" },
            "Criterion C": { "Score": 0, "Comments": "" },
            "Criterion D": { "Score": 0, "Comments": "" },
            "Criterion E": { "Score": 0, "Comments": "" },
            "Extra": 0,
            "Total": 0,
            "Overall": ""
        }



        var request = new XMLHttpRequest()
        request.open('POST', `/newRubric/${judge}`, false)
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(newRubric))

        alert("Added successfully!")
    } catch (error) {
        console.log(error)
    }

    loadRubrics()
}


function displayRubric(teamName, teamMembers) {
    try {
        team = teamName
        members = teamMembers

        var request = new XMLHttpRequest()
        request.open('GET', `/getRubric/${judge}/${teamName}`, false)
        request.send()

        rubric = JSON.parse(request.responseText)


        document.getElementById("rubricTitle").innerHTML = teamName

        document.getElementById("CAS").value = rubric["Criterion A"]["Score"]
        document.getElementById("CAC").value = rubric["Criterion A"]["Comments"]

        document.getElementById("CBS").value = rubric["Criterion B"]["Score"]
        document.getElementById("CBC").value = rubric["Criterion B"]["Comments"]

        document.getElementById("CCS").value = rubric["Criterion C"]["Score"]
        document.getElementById("CCC").value = rubric["Criterion C"]["Comments"]

        document.getElementById("CDS").value = rubric["Criterion D"]["Score"]
        document.getElementById("CDC").value = rubric["Criterion D"]["Comments"]

        document.getElementById("CES").value = rubric["Criterion E"]["Score"]
        document.getElementById("CEC").value = rubric["Criterion E"]["Comments"]

        document.getElementById("mark").innerHTML = rubric["Total"]
        document.getElementById("overall").value = rubric["Overall"]

        document.getElementById("EP").value = rubric["Extra"]

        document.getElementById("rubric").style.display = "block"
        document.getElementById("allRubrics").style.display = "none"


    } catch (error) {
        console.log(error)
    }

    
}

function changed() {
    change = true
    document.getElementById("mark").innerHTML = parseInt(document.getElementById("EP").value) + parseInt(document.getElementById("CAS").value) + parseInt(document.getElementById("CBS").value) + parseInt(document.getElementById("CCS").value) + parseInt(document.getElementById("CDS").value) + parseInt(document.getElementById("CES").value)
}

function saveRubric() {
    try {


        newRubric = {
            "TeamName": team,
            "TeamMembers": members,
            "Criterion A": { "Score": document.getElementById("CAS").value, "Comments": document.getElementById("CAC").value },
            "Criterion B": { "Score": document.getElementById("CBS").value, "Comments": document.getElementById("CBC").value },
            "Criterion C": { "Score": document.getElementById("CCS").value, "Comments": document.getElementById("CCC").value },
            "Criterion D": { "Score": document.getElementById("CDS").value, "Comments": document.getElementById("CDC").value },
            "Criterion E": { "Score": document.getElementById("CES").value, "Comments": document.getElementById("CEC").value },
            "Extra": document.getElementById("EP").value,
            "Total": document.getElementById("mark").innerHTML,
            "Overall": document.getElementById("overall").value
        }



        var request = new XMLHttpRequest()
        request.open('PUT', `/updateRubric/${judge}/${team}`, false)
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(newRubric))


        change = false
        alert("Saved successfully!")
    } catch (error) {
        console.log(error)
    }
}


function back() {
    if (change && !confirm('You have unsaved changes. Are you sure you want to exit?')){
        return
    }

    loadRubrics()
    document.getElementById("rubric").style.display = "none"
    document.getElementById("allRubrics").style.display = "block"
}

function signOut() {
    sessionStorage.removeItem('judge')
    judge = ""
    window.location.href = "/login";
}

function deleteRubric(teamName) {
    if (confirm(`Are you sure you want to delete the rubric for "${teamName}"?`)) {
        try {
            var request = new XMLHttpRequest()
            request.open('DELETE', `/deleteRubric/${judge}/${teamName}`, false)
            request.send()

            alert("Rubric deleted successfully!")
            loadRubrics()
        } catch (error) {
            console.log(error)
            alert("Error deleting rubric. Please try again.")
        }
    }
}