const {gql, PubSub} = require('apollo-server');
const pubsub = new PubSub()
const faker = require('faker')
const {makeExecutableSchema} = require('graphql-tools')

let tags = []
let id = 0

function addTag (label) {
  const tag = {id: id++, label: label}
  tags.push(tag)
  return tag
}

for (let i = 0; i < 42; i++) {
  addTag(faker.word)
}
const TAG_ADDED = 'TAG_ADDED'

const typeDefs = gql`
  type Tag{
    id: Int
    label: String
  }

  type Query {
    hello: String
    ping(message: String):String
  }
  
  type Mutation{
    addTag(label: String!):Tag
  }
  
  type Subscription{
    tagAdded(label: String):Tag
  }
`;

const resolvers = {
  Query: {
    ping: (root, {message}, context) => `ping message is :${message}`,
    hello: () => 'hello world'
  },
  Mutation: {
    addTag: (root, {label}, context) => {
      const newTag = addTag(label)
      pubsub.publish(TAG_ADDED, {tagAdded: newTag})
      return newTag
    }
  },
  Subscription: {
    tagAdded: {
      subscribe: () => pubsub.asyncIterator([TAG_ADDED]),
    }
  }
};


const jsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports =  jsSchema;