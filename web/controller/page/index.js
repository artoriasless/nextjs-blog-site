'use strict';

const confList = [
    // routerUrl, fileUrl
    ['/', '/index'],
    ['/catalogue/:type/:page', '/catalogue/[type]'],
    ['/paper/:id', '/paper/[id]'],
    ['/profile/:uuid', '/profile/[uuid]'],
    ['/activate/:uuid', '/activate/[uuid]'],
    ['/paper-submit/:id', '/paper-submit/[id]'],
];

const controllerFunc = (app, router, routerUrl, fileUrl) => {
    router.get(routerUrl, async ctx => {
        await app.render(ctx.req, ctx.res, fileUrl, ctx.query);

        ctx.respond = false;
    });
};
const page = (router, app) => {
    // used for page request
    confList.forEach(async confItem => {
        const [
            routerUrl, fileUrl,
        ] = confItem;
        
        controllerFunc(app, router, routerUrl, fileUrl);
    });
    // used for redirect
    router.get('/catalogue', async ctx => {
        ctx.redirect('/catalogue/all/1');
    });
    router.get('/catalogue/:type/', async ctx => {
        const paramType = ctx.params.type;

        ctx.redirect(`/catalogue/${paramType}/1`);
    });

    return router;
};

module.exports = page;