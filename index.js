require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { requestLogger, unknownEndpoint } = require("./utils");
const Note = require("./models/note");

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  Note.findById(id).then((foundNote) => {
    response.json(foundNote);
  });
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  Note.deleteOne({ id })
    .then((deletedNote) => {
      response.json(deletedNote);
    })
    .catch((error) => console.log(error));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  Note.findById(id)
    .then((foundNote) => {
      console.log(foundNote.important);
      let invertedBoolean = !foundNote.important;
      const editedNote = {
        id: foundNote.id,
        content: foundNote.content,
        date: foundNote.date,
        import: invertedBoolean,
      };
      console.log(editedNote);
      Note.updateOne({id}, editedNote)
        .then(console.log('updated'))
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => console.log(error));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
