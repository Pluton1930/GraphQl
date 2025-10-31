// Importamos la función buildSchema de graphql que nos permite crear el esquema
const { buildSchema } = require('graphql');

// Definimos el schema utilizando la sintaxis de GraphQL
const schema = buildSchema(`
  type Estudiante {
    id: ID!
    nombre: String!
    carrera: String!
  }

  type Beca {
    id: ID!
    estudianteId: ID!
    estado: String!
  }

  type Query {
    estudiantes: [Estudiante]
    becas: [Beca]
    becaPorEstudiante(id: ID!): Beca
  }

  type Mutation {
    registrarEstudiante(nombre: String!, carrera: String!): Estudiante
    actualizarEstudiante(id: ID!, nombre: String, carrera: String): Estudiante
    eliminarEstudiante(id: ID!): String

    postularBeca(estudianteId: ID!): Beca
    actualizarEstadoBeca(id: ID!, estado: String!): Beca
    eliminarBeca(id: ID!): String
  }
`);

// Arrays para almacenar los datos en memoria
let estudiantes = []; // Almacena la lista de estudiantes
let becas = [];      // Almacena la lista de becas
let idEst = 1;       // Contador para IDs de estudiantes
let idBeca = 1;      // Contador para IDs de becas

const root = {
  // Queries
  estudiantes: () => estudiantes,
  becas: () => becas,
  becaPorEstudiante: ({ id }) => becas.find(b => b.estudianteId === id),

  // Regustra a un nuevo estudiante
  registrarEstudiante: ({ nombre, carrera }) => {
    const nuevo = { id: String(idEst++), nombre, carrera };
    estudiantes.push(nuevo);
    return nuevo;
  },
  // Actualiza los datos de un estudiante existente
  actualizarEstudiante: ({ id, nombre, carrera }) => {
    const est = estudiantes.find(e => e.id === id);
    if (!est) return null;
    if (nombre) est.nombre = nombre;
    if (carrera) est.carrera = carrera;
    return est;
  },
  // Elimina un estudiante y sus becas asociadas
  eliminarEstudiante: ({ id }) => {
    const index = estudiantes.findIndex(e => e.id === id);
    if (index === -1) return "Estudiante no encontrado";
    estudiantes.splice(index, 1);
    // También eliminamos becas asociadas
    becas = becas.filter(b => b.estudianteId !== id);
    return "Estudiante eliminado correctamente";
  },

  // Crea una nueva postulación a beca
  postularBeca: ({ estudianteId }) => {
    const nueva = { id: String(idBeca++), estudianteId, estado: "Pendiente" };
    becas.push(nueva);
    return nueva;
  },
  // Actualiza el estado de una beca
  actualizarEstadoBeca: ({ id, estado }) => {
    const beca = becas.find(b => b.id === id);
    if (beca) beca.estado = estado;
    return beca;
  },
  // Elimina una beca
  eliminarBeca: ({ id }) => {
    const index = becas.findIndex(b => b.id === id);
    if (index === -1) return "Beca no encontrada";
    becas.splice(index, 1);
    return "Beca eliminada correctamente";
  }
};

// Exportamos el esquema y los resolvers
module.exports = { schema, root };