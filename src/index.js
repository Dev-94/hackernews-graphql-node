const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')


const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews clone`,
        feed: async (parent, args, context, info) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
        // updateLink: (parent, args) => {
        //     // find item in Links with id, update to all three fields
        //     let linkToUpdate = links.find(item => item.id == args.id)
        //     linkToUpdate.description = args.description
        //     linkToUpdate.url = args.url
        // },
        // deleteLink: (parent, args) => {
        //     // find id with in Links, delete it
        //     // let linkToDelete = links.filter(item => item.id == args.id)
        //     // sieve out id, reassign links to filtered array without id
        //     links = links.filter(item => item.id != args.id)
        //     // splice before id, splice after id, join together


        // },
    }
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    context: {
        prisma,
    }
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))