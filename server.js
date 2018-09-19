const { ApolloServer, gql } = require('apollo-server');
const faker = require('faker')

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
    tagAdded(label: String!):Tag
  }
`;


let tags = []
let id = 0

function addTag(label){
  const tag = {id:id++ , label: label}
  tags.push(tag)
  return tag
}

for(let i = 0; i < 42 ; i++){
  addTag(faker.word)
}

const resolvers = {
  Query: {
    ping:(root, {message}, context) => `ping message is :${message}`,
    hello: () => 'hello world'
  },
  Mutation:{
    addTag:(root, {label}, context) => {
      return addTag(label)
    }
  },
  Subscription:{
    tagAdded:{

    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});