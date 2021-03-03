const { ApolloServer, PubSub } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const { APP_SECRET, getUserId } = require('./utils')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')


const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
    // Query: {
    //     info: () => `This is the API of a Hackernews clone`,

    // },
    // Mutation: {
    //     // post: (parent, args, context, info) => {
    //     //     const newLink = context.prisma.link.create({
    //     //         data: {
    //     //             url: args.url,
    //     //             description: args.description,
    //     //         },
    //     //     })
    //     //     return newLink
    //     // },
    //     // updateLink: (parent, args) => {
    //     //     // find item in Links with id, update to all three fields
    //     //     let linkToUpdate = links.find(item => item.id == args.id)
    //     //     linkToUpdate.description = args.description
    //     //     linkToUpdate.url = args.url
    //     // },
    //     // deleteLink: (parent, args) => {
    //     //     // find id with in Links, delete it
    //     //     // let linkToDelete = links.filter(item => item.id == args.id)
    //     //     // sieve out id, reassign links to filtered array without id
    //     //     links = links.filter(item => item.id != args.id)
    //     //     // splice before id, splice after id, join together


    //     // },
    // }
}

const pubsub = new PubSub()

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null
        }
    }
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))