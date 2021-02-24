const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews clone`,
        feed: () => links,
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            // find item in Links with id, update to all three fields
            let linkToUpdate = links.find(item => item.id == args.id)
            linkToUpdate.description = args.description
            linkToUpdate.url = args.url
        },
        deleteLink: (parent, args) => {
            // find id with in Links, delete it
            // let linkToDelete = links.filter(item => item.id == args.id)
            // sieve out id, reassign links to filtered array without id
            links = links.filter(item => item.id != args.id)
            // splice before id, splice after id, join together


        },
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))