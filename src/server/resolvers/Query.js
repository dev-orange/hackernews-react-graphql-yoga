async function feed(parent, args, context) {
    const where = args.filter
        ? {
            OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } }
            ]
        }
        : {};

    // ①
    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
    });

    // ②
    const count = await context.prisma.link.count({ where });

    return {
        links,
        count
    };
}

module.exports = {
    feed
};