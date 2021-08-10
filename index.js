require("dotenv").config()
const express = require("express");
const app = express();
const Note = require("./models/note")


/***MIDDLEWARE***/
app.use(express.json());
app.use(express.static("build"))

/***ROUTES***/
app.get("/", (request, response) => {
    response.send("<h1>The Notes frontEnd should be loaded. if you're seeing this mesage check the app definitions to render app.use(express.static('build')) </h1>")
})

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

//fetching a single resource in RestfulApis
app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id

    Note.findById(id)
        .then(note => {
            console.log(note)
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.error(error)
            response.status(400).send({error: "malformatted id"})
        })
})

//deleting resources
app.delete("/api/notes/:id", (request, response) => {
    const id = +request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.put("/api/notes/:id/importance", (request, response) => {
    console.log(request.params.id)
    console.log("com o valor já invertido", request.body)
    const note = notes.find(note => note.id === request.params.id)

    const changedNote = { ...note }
    changedNote.id = request.body.id
    changedNote.content = request.body.content
    changedNote.date = request.body.date
    changedNote.important = request.body.important

    response.json(changedNote)
})

app.put("/api/notes/:id/date", (request, response) => {
    const newDate = new Date().toISOString()

    const note = notes.find(n => { n.id === request.params.id })

    const changedNote = { ...note }
    changedNote.id = request.body.id
    changedNote.content = request.body.content
    changedNote.date = newDate
    changedNote.important = request.body.important

    response.json(changedNote)
})

app.post("/api/notes", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: "content missing" })
    }
    try {
        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
        })

        note.save().then(savedNote => {
            response.json(savedNote)
        })
    }
    catch (error) {
        console.error(error)
    }

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//HEROKU ADDRESS: https://peaceful-crag-14176.herokuapp.com/api/notes
