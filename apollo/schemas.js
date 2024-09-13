const gql = require("graphql-tag");

const typeDefs = gql`
  type Config {
    config: String
  }

  type Query {
    getConfig: Config
  }

  type Mutation {
    login(username: String!, password: String!): String
  }

  type Subscription {
    loginEvent: String
  }
`;

module.exports = typeDefs