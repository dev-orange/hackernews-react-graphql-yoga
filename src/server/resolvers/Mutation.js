const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, generateRandomPassword} = require('../utils');
const axios = require("axios");
const {clientID, clientSecret} = require("../constants");

async function signup(parent, args, context, info) {
    // ①
    const password = await bcrypt.hash(args.password, 10)

    // ②
    const user = await context.prisma.user.create({ data: { ...args, password } })

    // ③
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // ④
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    // ⑤
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) {
        throw new Error('No such user found')
    }

    // ⑥
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // ⑦
    return {
        token,
        user,
    }
}

async function signupOrLoginWithGithub(parent, args, context, info) {
    const { data: tokenData } = await axios.get('https://github.com/login/oauth/access_token', {
        params: {
            client_id: clientID,
            client_secret: clientSecret,
            code: args.code
        }
    });

    const { access_token } = tokenData.split('&').reduce((acc, item) => {
        const [key, value] = item.split('=');
        acc[key] = value;
        return acc;
    }, {});

    const { data: userData } = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    });

    let user = await context.prisma.user.findUnique({ where: { email: `id-${userData.id}@github.com` } })

    if (!user) {
        const password = await bcrypt.hash(generateRandomPassword(), 10)

        user = await context.prisma.user.create({
            data: {
                email: `id-${userData.id}@github.com`,
                name: userData.name,
                password
            }
        })
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}


async function post(parent, args, context) {
    const { userId } = context;

    const newLink = await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        }
    });

    context.pubSub.publish("NEW_LINK", newLink);

    return newLink;
}

module.exports = {
    signup,
    login,
    post,
    signupOrLoginWithGithub
}