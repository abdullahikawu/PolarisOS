const _ = require('lodash');
const Handlebars = require('../../../app/modules/utils/templating');

function format(form, ...args) {
    return form.replace(/{(\d+)}/g, (match, number) => {
        if (typeof args[number] !== 'undefined') {
            return args[number];
        }
        return match;
    });
}

function format_with_obj(form, obj) {
    return form.replace(/{([A-Za-z_.-]+)}/g, (match, name) => {
        const info = _.get(obj, name);
        if (info != null) {
            return info;
        }
        return match;
    });
}

function lang(key, obj, n, clang) {
    if (!(key in clang)) {
        return key;
    }

    const info = clang[key];
    let text = key;
    // TODO finish implementation for few and many
    if (n == null) {
        if ('1' in info) {
            text = info['1'] || key;
        } else {
            text = info['n/a'] || key;
        }
    } else if (n === 0) {
        text = info['0'] || info['n/a'] || key;
    } else if (n === 1) {
        text = info['1'] || info['n/a'] || key;
    } else if (n === 2) {
        text = info['2'] || info['n/a'] || key;
    } else {
        text = info.other || info['n/a'] || key;
    }

    if (obj == null || Object.keys(obj).length === 0) {
        return text;
    }

    return Handlebars.compile(text)(obj);
}

function hlang(str, obj, n, clang) {
    const regex = /#POS#LANG(\w+)/g;
    let copy = str;
    let m;

    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex += 1;
        }
        const all = m[0];
        const key = m[1];
        const info = lang(key, obj, n, clang);
        copy = copy.replace(all, info);
    }
    return copy;
}

module.exports = {
    format,
    format_with_obj,
    lang,
    hlang,
};
