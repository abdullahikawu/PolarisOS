const _ = require('lodash');
const LangMixin = require('../../../../common/mixins/LangMixin');

module.exports = {
    mixins: [LangMixin],
    props: {
        form: { type: Object, required: true },
    },
    data() {
        return {
            state: {
                cform: 'deposit_creation',
                path: 'ok',
                rpath: 'ok',
                rform: 'deposit_read',
            },
        };
    },
    computed: {
    },
};
