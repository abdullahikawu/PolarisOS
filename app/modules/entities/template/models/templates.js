// @flow
const Joi = require('joi');
const Crypto = require('crypto');
const TemplateMapping = require('../../../../mappings/template');
const MMapping = require('../../crud/mapping');
const FormatFunctions = require('../../../pipeline/formatter/formatfunctions');
const ComplFunctions = require('../../../pipeline/completer/complfunctions');

const Mapping: Object = TemplateMapping.msw.mappings.properties;

const Validation: Array<any> = [
    Joi.object({
        css: Joi.string().required().label('CSS'),
        name: Joi.string().required().label('Name'),
    }),
];

const Formatting: Array<any> = [];

const Completion: Array<any> = [];

const Defaults: Object = {
};

const Messages: Object = {
    set: 'Template is successfully added',
    remove: 'Template is successfully removed',
    modify: 'Template is successfully modified',
};


module.exports = {
    RawMapping: Mapping,
    Mapping: new MMapping(Mapping),
    Pipelines: [{
        Validation,
        Formatting,
        Completion,
        Defaults,
    }],
    Messages,
    Name: 'Template',
};
