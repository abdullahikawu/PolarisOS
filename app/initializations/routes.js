const _ = require('lodash');
const Router = require('koa-router');
const Send = require('koa-send');
const Config = require('../config');
const RouterUtils = require('../modules/utils/router');
const BackRoutes = require('../../front/backoffice/routes');
const EntitiesUtils = require('../modules/utils/entities');

async function initialize_routes() {
    const router = new Router();

    router.get('/', async (ctx) => {
        await ctx.render('front/views/front');
    });

    router.get('/news', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/browse', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/search', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/deposit', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/help', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/view/:id', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/u/:id/profile', async (ctx) => {
        await ctx.render('front/views/front');
    });
    router.get('/u/:id/favorites', async (ctx) => {
        await ctx.render('front/views/front');
    });

    _.each(BackRoutes, (route) => {
        router.get(route, async (ctx) => {
            await ctx.render('back/views/back');
        });
    });

    router.get('/public/*', async (ctx) => {
        await Send(ctx, ctx.path, { root: Config.root });
    });


    const response = await EntitiesUtils.search('entity', { size: 10000 });
    const extra_entities = response.result.hits.map(e => e.db.source.type);
    const entities = ['user', 'config', 'lang', 'form', 'function', 'entity', 'datasource', 'pipeline', ...extra_entities];
    console.log('entities for routes:', entities);
    entities.forEach((e) => {
        RouterUtils.generate_entity_routes(router, e, []);
    });
    return router;
}

module.exports = initialize_routes;
