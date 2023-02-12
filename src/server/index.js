const createServer = require('node:http').createServer;
const createYoga = require('graphql-yoga').createYoga;
const createSchema = require('graphql-yoga').createSchema;

const {PrismaClient} = require("@prisma/client");

const fs = require("fs");
const path = require("path");

const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const User = require('./resolvers/User')
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const { getUserId } = require('./utils');
const {createPubSub} = require("graphql-yoga");

const pubSub = createPubSub();

const resolvers = {
    Mutation,
    Query,
    User,
    Link,
    Subscription,
}

const schema = createSchema({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers: resolvers
})

const prisma = new PrismaClient();

// 基于graphql的scheme，创建一个graphql-yoga的实例
const yoga = createYoga({
    schema,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubSub,
            userId: req && req.headers.authorization
                ? getUserId(req)
                : null
        }
    }
})

// 基于实例化后的yoga，创建一个server
const server = createServer(yoga)

// 启动server
server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
})