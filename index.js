const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const express = require("express");
const typeDefs = require('./apollo/schemas');
const resolvers = require('./apollo/resolvers');
const bodyParser = require("body-parser");
const cors = require('cors');
const panorama = require('./model/panorama');

const app = express();
app.use(bodyParser.json());

function organizeData(data) {
  return data.reduce((acc, entry) => {
      const { email, subject, unit, step, lesson, lesson_status, step_priority, unit_priority, lesson_priority } = entry;

      // Encontrar ou criar a entrada de e-mail no objeto acumulado
      if (!acc[email]) {
          acc[email] = [];
      }

      // Encontrar ou criar a entrada de subject
      let subjectEntry = acc[email].find(sub => sub.subject === subject);
      if (!subjectEntry) {
          subjectEntry = {
              subject: subject,
              units: []
          };
          acc[email].push(subjectEntry);
      }

      // Encontrar ou criar a entrada de unit
      let unitEntry = subjectEntry.units.find(unt => unt.unit === unit);
      if (!unitEntry) {
          unitEntry = {
              unit: unit,
              unit_priority: unit_priority,
              steps: []
          };
          subjectEntry.units.push(unitEntry);
      }

      // Encontrar ou criar a entrada de step
      let stepEntry = unitEntry.steps.find(stp => stp.step === step);
      if (!stepEntry) {
          stepEntry = {
              step: step,
              step_priority: step_priority,
              lessons: []
          };
          unitEntry.steps.push(stepEntry);
      }

      // Adicionar a lesson no step
      stepEntry.lessons.push({
          lesson: lesson,
          lesson_priority: lesson_priority,
          state: lesson_status
      });

      return acc;
  }, {});
}

// Função para ordenar por prioridade
function sortDataByPriority(data) {
  Object.keys(data).forEach(email => {
      data[email].forEach(subject => {
          // Ordena as unidades com base no unit_priority
          subject.units.sort((a, b) => a.unit_priority - b.unit_priority);

          subject.units.forEach(unit => {
              // Ordena os passos com base no step_priority
              unit.steps.sort((a, b) => a.step_priority - b.step_priority);

              // Ordena as lições com base no lesson_priority
              unit.steps.forEach(step => {
                  step.lessons.sort((a, b) => a.lesson_priority - b.lesson_priority);
              });
          });
      });
  });
  return data;
}

app.post("/refreshConfig", async (req, res) => {
  try {
    const jsonConfig = await panorama.getProgressionMap()
    await redis.set("config", JSON.stringify(jsonConfig));
    res
      .status(200)
      .send({ message: "Configurações atualizadas e salvas no Redis" });
  } catch (error) {
    res.status(500).send({ error: `Erro ao atualizar configurações ${JSON.stringify(error)}` });
  }
});


(async () => {
  const response = await panorama.getProgressionMap();
  const x = organizeData(response);
  const y = sortDataByPriority(x);
  console.info(y);
})()


const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.start().then(() => {
  app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer, { context: async ({ req }) => ({ token: req.headers.token })}));
  app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
});
