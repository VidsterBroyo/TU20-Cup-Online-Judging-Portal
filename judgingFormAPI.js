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


// home page
app.get('/', async (req, res) => {
    // read from index.html file
    let data = await fsP.readFile('./index.html')

    // send html
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(data)
})


// get request
app.get('/getRubric/:judge/:teamName', async (req, res) => {

    var judge = req.params.judge
    var teamName = req.params.teamName

    try {
        // get rubric data
        let data = JSON.parse(await fsP.readFile('./rubrics.json'))[0].rubrics
        console.log(data[judge][teamName])

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(data[judge][teamName])
        res.end()

    } catch (error) {
        res.end("getRubric response error: " + error)
    }
})


// updating rubric
app.put('/putRubric/:judge/:teamName', async (req, res) => {

    var judge = req.params.judge
    var teamName = req.params.teamName

    let data = JSON.parse(await fsP.readFile('./rubrics.json'))

    pretendRequestJSON = { 'Criterion A': { Score: -3, Comments: 'terrible' } }
    // when the frontend is good the just use xmlrequest to send json info here

    data[0].rubrics[judge][teamName] = pretendRequestJSON
    
    try {
        await fsP.writeFile('./rubrics.json', JSON.stringify(data))
        res.end("success")
    }
    catch (error) {
        console.error(error)
        res.end("putRubric response error: " + error)
    }
    
})



// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))