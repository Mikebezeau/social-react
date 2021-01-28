const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGO_DB } = require('./config.js');

const typeDefs = require('./graphql/TypeDefs');
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongo connected');
    return server.listen({ port: 5000});
  }).then(res => {
      console.log(`Server running at ${res.url}`);
  });

  