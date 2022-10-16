const generateId = (notes) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

const requestLogger = (request, response, next) => {
  request.context = request.body.content;
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("Context", request.context);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { generateId, requestLogger, unknownEndpoint };
