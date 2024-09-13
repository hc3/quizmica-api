const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();
const LOGIN_EVENT = "LOGIN_EVENT";

const resolvers = {
  Query: {
    getConfig: async () => {
      return { config: "retorna mensagem" };
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      if (username === "admin" && password === "password") {
        const message = "Login bem-sucedido";
        pubsub.publish(LOGIN_EVENT, { loginEvent: message });
        return message;
      }
      return "Login falhou";
    },
  },
  Subscription: {
    loginEvent: {
      subscribe: () => pubsub.asyncIterator([LOGIN_EVENT]),
    },
  },
};

module.exports = resolvers;
