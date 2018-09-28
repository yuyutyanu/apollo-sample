const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

// Subs
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws');

const schema = require('./schema');

const PORT = 3020;
const SUBSCRIPTIONS_PATH = '/subscriptions';

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const server = createServer(app)

server.listen(PORT, () => {
  console.log(`API Server is now running on http://localhost:${PORT}/graphql`)
  console.log(`API Subscriptions server is now running on ws://localhost:${PORT}${SUBSCRIPTIONS_PATH}`)
});

// Subs
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server,
    path: SUBSCRIPTIONS_PATH,
  }
);