const API = require('../api');
const Messages = require('../api/messages');

async function create_or_update(ctx, { path, body, form }, up = false) {
    const method = up ? 'PUT' : 'POST';
    const payload = {
        path,
        method,
        body,
        commit: ctx.commit,
    };

    ctx.commit(Messages.LOADING, { form });
    const response = await API.fetch(payload);
    ctx.commit(Messages.FETCH, { method, response, form });
}

module.exports = {
    create: async (ctx, payload) => {
        await create_or_update(ctx, payload, false);
    },

    update: async (ctx, payload) => {
        await create_or_update(ctx, payload, true);
    },

    remove: async (ctx, { path, form }) => {
        const payload = {
            path,
            method: 'DEL',
            commit: ctx.commit,
        };

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        ctx.commit(Messages.FETCH, { method: 'DEL', response, form });
    },

    single_read: async (ctx, { form, path }) => {
        const payload = {
            path,
            method: 'GET',
            commit: ctx.commit,
        };

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        ctx.commit(Messages.FETCH, { method: 'GET', response, form });
    },

    search: async (ctx, { form, path, body }) => {
        const payload = {
            path,
            method: 'POST',
            commit: ctx.commit,
            body,
        };

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        ctx.commit(Messages.FETCH, { method: 'GET', response, form });
    },

    grab_config: async (ctx, { path, body }) => {
        const payload = {
            path,
            method: 'POST',
            commit: ctx.commit,
            body,
        };

        const response = await API.fetch(payload);
        // const success = response.type === Messages.SUCCESS;
        if (response.content == null) {
            response.content = {};
        }

        console.log(response.content);

        const content = 'result' in response.content
            && 'hits' in response.content.result ? response.content.result.hits : [];
        if (content.length > 0) {
            ctx.state.global_config = content[0].source;
        }
    },

    grab_language: async (ctx, { path, body }) => {
        const payload = {
            path,
            method: 'POST',
            commit: ctx.commit,
            body,
        };

        const response = await API.fetch(payload);
        // const success = response.type === Messages.SUCCESS;
        if (response.content == null) {
            response.content = {};
        }

        const content = 'result' in response.content
            && 'hits' in response.content.result ? response.content.result.hits : [];
        ctx.state.lang_content = content.reduce((obj, src) => {
            const l = src.source;
            const lang = obj[l.lang] || {};
            lang[l.key] = l.values.reduce((values, v) => {
                values[v.quantity] = v.value;
                return values;
            }, {});
            obj[l.lang] = lang;
            return obj;
        }, {});
    },
};
