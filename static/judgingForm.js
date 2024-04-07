judges = ["Michael", "Trevor", "Franklin"]
judge = ""
team = ""

// function login() {
//     user = document.getElementById('user').value
//     password = document.getElementById('password').value


//     if (judges.includes(user) && password == "Cup2024r0cks!") {
//         sessionStorage.setItem('judge', user)

//         window.location.href = "http://localhost:5000/rubrics"

//     } else {
//         alert("Invalid credentials")
//     }
// }


// function getJudge() {
//     if (sessionStorage.getItem('judge')){
//         judge = sessionStorage.getItem('judge')
//         document.title = `${judge}'s TU20 Cup Rubrics`
//         document.getElementById("welcome").innerText = "Welcome, " + judge
//     } else {
//         alert("You need to log in again")
//         window.location.href = "http://localhost:5000"
//     }

// }


function loadRubrics() {
    getJudge() 

    console.log("running")
    try {
        var request = new XMLHttpRequest()
        request.open('GET', `http://localhost:5000/getRubrics/${judge}`, false)
        request.send()

        rubrics = JSON.parse(request.responseText)
        console.log(rubrics)

        for (i=0; i<rubrics.length; i++){
            document.getElementById("rubricsGroup").innerHTML += `<button id="rubricButton" onclick="displayRubric('${rubrics[i]["TeamName"]}')">${rubrics[i]["TeamName"]}</button><br>`
        }

    } catch (error) {
        console.log(error)
    }
}


function displayRubric(teamName) {
    try {
        team = teamName

        var request = new XMLHttpRequest()
        request.open('GET', `http://localhost:5000/getRubric/${judge}/${teamName}`, false)
        request.send()

        rubric = JSON.parse(request.responseText)
        console.log(rubric)
        console.log(rubric["Criterion A"])


        document.getElementById("rubricTitle").innerHTML = teamName

        document.getElementById("CAS").value = rubric["Criterion A"]["Score"]
        document.getElementById("CAC").value = rubric["Criterion A"]["Comments"]

        document.getElementById("CBS").value = rubric["Criterion B"]["Score"]
        document.getElementById("CBC").value = rubric["Criterion B"]["Comments"]

        document.getElementById("CCS").value = rubric["Criterion C"]["Score"]
        document.getElementById("CCC").value = rubric["Criterion C"]["Comments"]

        document.getElementById("rubric").style.display = "block"
        document.getElementById("allRubrics").style.display = "none"


    } catch (error) {
        console.log(error)
    }
}


function saveRubric() {
    try {


        newRubric = {
            "TeamName":team,
            "Criterion A": {"Score":document.getElementById("CAS").value, "Comments":document.getElementById("CAC").value},
            "Criterion B": {"Score":document.getElementById("CBS").value, "Comments":document.getElementById("CBC").value},
            "Criterion C": {"Score":document.getElementById("CCS").value, "Comments":document.getElementById("CCC").value}
        }



        var request = new XMLHttpRequest()
        request.open('PUT', `http://localhost:5000/updateRubric/${judge}/${team}`, false)
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(newRubric))



        alert("Saved successfully!")
    } catch (error) {
        console.log(error)
    }
}


function back(){
    document.getElementById("rubric").style.display = "none"
    document.getElementById("allRubrics").style.display = "block"
}

function signOut(){
    sessionStorage.removeItem('judge')
    judge = ""
    window.location.href = "http://localhost:5000/";
}