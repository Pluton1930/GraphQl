const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { schema, root } = require('./schema');

const app = express();

// Configuramos la ruta /graphql para manejar las solicitudes GraphQL
app.all('/graphql', createHandler({
  schema: schema,
  rootValue: root
}));

// Iniciamos el servidor en el puerto 4000
app.listen(4000, () => {
  console.log('Servidor GraphQL en http://localhost:4000/graphql');
});