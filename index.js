const express = require("express");
const cors = require("cors");

const Note = require("./models/note")
const app = express();


/***MIDDLEWARE***/
app.use(express.json());
app.use(cors());
app.use(express.static("build"))

/***ROUTES***/
app.get("/", (request, response) => {
    response.send("<h1>Hello World</h1>")
})

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

//fetching a single resource in RestfulApis
app.get("/api/notes/:id", (request, response) => {
    const id = +request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
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

//adding a new note
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}
app.post("/api/notes", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: "content missing" })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)
    response.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//HEROKU ADDRESS: https://peaceful-crag-14176.herokuapp.com/api/notes
