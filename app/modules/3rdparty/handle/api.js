// @flow
const _ = require('lodash');
const ConfigUtils = require('../../utils/config');
const Logger = require('../../../logger');
const Request = require('superagent');

async function get_handle_config(): Promise<?Object> {
    const myconfig = await ConfigUtils.get_config();

    if (!myconfig || !('handle' in myconfig)) {
        return null;
    }

    return myconfig.handle;
}

function generate_hs_admin(handle: string, index: number = 100,
        permissions: string = '1110',
        ttl: number = 86400, admin_permissions: string = '111111111111'): Object {
    return {
        index,
        type: 'HS_ADMIN',
        data: {
            format: 'admin',
            value: { handle, index: 200, permissions: admin_permissions },
        },
        permissions,
        ttl,
    };
}

function generate_url(url: string, index: number = 3,
        permissions: string = '1110', ttl: number = 86400): Object {
    return {
        index,
        type: 'URL',
        data: {
            format: 'string',
            value: url,
        },
        ttl,
        permissions,
    };
}

async function add_or_modify_handle(suffix: string, url: string,
    overwrite: boolean): Promise<boolean> {
    const handle_config = await get_handle_config();
    if (!handle_config) {
        Logger.error('Unable to find handle config in ES');
        return false;
    }

    const login = handle_config.admin_handle;
    const password = handle_config.admin_password;
    const ip = handle_config.ip;
    const port = handle_config.port;
    const prefix = handle_config.prefix;

    const hs_admin = generate_hs_admin(login);
    const hs_url = generate_url(url);

    try {
        const r = await Request.put(`https://${ip}:${port}/api/handles/${prefix}/${suffix}`)
            .query({ overwrite })
            .auth(login, password)
            .send({
                values: [hs_admin, hs_url],
            });
        return true;
    } catch (err) {
        Logger.error(`Unable to find add or modify handle ${prefix}/${suffix}`);
        Logger.error(err);
        return false;
    }
}

function add_handle(suffix: string, url: string): Promise<boolean> {
    return add_or_modify_handle(suffix, url, true);
}

function modify_handle(suffix: string, url: string): Promise<boolean> {
    return add_or_modify_handle(suffix, url, false);
}

async function delete_handle(suffix: string): Promise<boolean> {
    const handle_config = await get_handle_config();
    if (!handle_config) {
        Logger.error('Unable to find handle config in ES');
        return false;
    }

    const login = handle_config.admin_handle;
    const password = handle_config.admin_password;
    const ip = handle_config.ip;
    const port = handle_config.port;
    const prefix = handle_config.prefix;
    try {
        const r = await Request.del(`https://${ip}:${port}/api/handles/${prefix}/${suffix}`)
        .auth(login, password);
        return true;
    } catch (err) {
        Logger.error(`Unable to delete handle ${prefix}/${suffix}`);
        Logger.error(err);
        return false;
    }
}

module.exports = {
    get_handle_config,
    add_handle,
    modify_handle,
    delete_handle,
};
