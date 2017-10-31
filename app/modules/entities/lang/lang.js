// @flow
const ODM = require('../crud/odm');
const Model = require('./models/langs');
const Mapping = require('../crud/mapping');
const Config_ = require('../../../config');

const mapping = new Mapping(Model.Mapping);

class Lang extends ODM {
    static model(): Object {
        return Model;
    }

    static mapping(): Object {
        return mapping;
    }

    static index(): string {
        return `${Config_.elasticsearch.index_prefix}_lang`;
    }

    static type(): string {
        return 'lang';
    }
}

module.exports = Lang;
