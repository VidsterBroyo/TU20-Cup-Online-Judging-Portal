// npm libraries
const fsP = require('fs').promises
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

// express library setup
const express = require('express')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use("/static", express.static('./static/'))


const PORT = process.env.PORT || 5000


// login page
app.get('/', async (req, res) => {
    // read from index.html file
    let data = await fsP.readFile('./login.html')

    // send html
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(data)
})


// home page
app.get('/rubrics', async (req, res) => {
    // read from index.html file
    let data = await fsP.readFile('./index.html')

    // send html
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(data)
})


// get all judge's rubrics
app.get('/getRubrics/:judge/', async (req, res) => {

    var judge = req.params.judge
    var teamName = req.params.teamName

    try {
        // get rubric data
        let rubrics = JSON.parse(await fsP.readFile('./rubrics.json'))
        console.log(rubrics[judge])

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(rubrics[judge])
        res.end()

    } catch (error) {
        res.end("getRubric response error: " + error)
    }
})


// get judge's rubric for 1 team
app.get('/getRubric/:judge/:teamName', async (req, res) => {

    var judge = req.params.judge
    var requestedTeamName = req.params.teamName

    try {
        // get rubric data
        let rubrics = JSON.parse(await fsP.readFile('./rubrics.json'))[judge]
        console.log(rubrics)
        
        // find the right rubric
        for (i=0; i<rubrics.length; i++){
            if (rubrics[i]["TeamName"] == requestedTeamName){
                rubric = rubrics[i]
                break
            }
        }

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(rubric)
        res.end()

    } catch (error) {
        res.end("getRubric response error: " + error)
    }
})


// updating a rubric
app.put('/updateRubric/:judge/:teamName', async (req, res) => {
    try {
        var judge = req.params.judge
        var teamName = req.params.teamName

        let rubrics = JSON.parse(await fsP.readFile('./rubrics.json'))

        // find the right rubric
        for (i=0; i<rubrics[judge].length; i++){
            if (rubrics[judge][i]["TeamName"] == teamName){
                rubrics[judge][i] = req.body
                break
            }
        }

        console.log(rubrics)
    
        await fsP.writeFile('./rubrics.json', JSON.stringify(rubrics))
        res.end("success")
    }
    catch (error) {
        console.error(error)
        res.end("postRubric response error: " + error)
    }
    
})



// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))
