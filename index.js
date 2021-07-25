const express = require("express");
const cors = require("cors");
let notes = require("./notes");


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
    response.json(notes)
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
    //O FRONTEND ESTA INVERTENDO O VALOR DA IMPORTANCIA DA NOTA, PRECISA SUBSTITUIR NO BACKEND, E RETORNAR TODAS AS NOTAS DE VOLTA (REFRESH)
    console.log()
    const id = request.params.id
    const note = notes.filter(note => {
        if(note.id === id){
            note = request.body
        }
    })
    response.status(200).json(notes).end()
})

app.put("/api/notes/:id/date", (request, response) => {
    const id = request.params.id
    const note = note.filter(note => note.id === id)
    console.log(note)
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
