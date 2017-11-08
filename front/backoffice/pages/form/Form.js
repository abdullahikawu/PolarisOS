const Utils = require('../../../common/utils/utils');
const APIRoutes = require('../../../common/api/routes');
const ReaderMixin = require('../mixins/ReaderMixin');
const LangMixin = require('../../../common/mixins/LangMixin');
const FieldTypes = require('../../lists/fieldtypes');

module.exports = {
    mixins: [ReaderMixin, LangMixin],
    data() {
        return {
            state: {
                path: APIRoutes.entity('form', 'POST'),
                rpath: APIRoutes.entity('form', 'GET'),
                cform: 'form_creation',
                rform: 'form_read',
                itemsPerPage: 20,
                itemsPerRow: 2,
                selected_types: {},
            },
        };
    },
    methods: {
        type_change(val, idx) {
            if (val == null) {
                if (idx in this.state.selected_types) {
                    delete this.state.selected_types[idx];
                }
            } else {
                this.$set(this.state.selected_types, idx, val.value);
            }
        },
    },
    mounted() {
        this.$store.dispatch('single_read', {
            form: this.state.rform,
            path: this.state.rpath,
        });
        this.$store.dispatch('search', {
            form: 'datatemplate_read',
            path: APIRoutes.entity('datatemplate', 'POST', true),
            body: {
                projection: ['label', 'name'],
                size: 10000,
            },
        });
    },
    computed: {
        content() {
            if (this.state.rform in this.$store.state.forms) {
                const form = this.$store.state.forms[this.state.rform];
                const content = form.content || [];
                return content.map((c) => {
                    c.label = this.lang(c.label);
                    c.description = this.lang(c.description);
                    return c;
                });
            }
            return [];
        },
        readContent() {
            return Utils.to_matrix(this.content, this.state.itemsPerRow);
        },
        fieldtypes() {
            return FieldTypes.map(ft => ({ value: ft.value, label: this.lang(ft.label) }));
        },
        datasources() {
            if ('datatemplate_read' in this.$store.state.forms) {
                return this.$store.state.forms.datatemplate_read.content;
            }
            return [];
        },
    },
};
