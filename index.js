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

app.post("/refreshConfig", async (req, res) => {
  try {
    const jsonConfig = await panorama.get()
    await redis.set("config", JSON.stringify(jsonConfig));
    res
      .status(200)
      .send({ message: "Configurações atualizadas e salvas no Redis" });
  } catch (error) {
    res.status(500).send({ error: `Erro ao atualizar configurações ${JSON.stringify(error)}` });
  }
});



const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.start().then(() => {
  app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer, { context: async ({ req }) => ({ token: req.headers.token })}));
  app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
});
