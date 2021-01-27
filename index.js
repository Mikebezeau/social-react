const { Apollo, ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGO_DB } = require('./config.js');

const typeDefs = require('./graphql/TypeDefs');
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose.connect(MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongo connected');
    return server.listen({ port: 5000});
  }).then(res => {
      console.log(`Server running at ${res.url}`);
  });

  