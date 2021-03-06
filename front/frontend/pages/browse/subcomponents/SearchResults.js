const Messages = require('../../../../common/api/messages');
const APIRoutes = require('../../../../common/api/routes');
const LangMixin = require('../../../../common/mixins/LangMixin');
const FormMixin = require('../../../../common/mixins/FormMixin');
const FiltersMixin = require('../../../../common/mixins/FiltersMixin');
const CSLSpecs = require('../../../../common/specs/csl');
const PaginationSearchMixin = require('../../../../common/mixins/PaginationSearchMixin');
const FormCleanerMixin = require('../../../../common/mixins/FormCleanerMixin');
const HtmlMixin = require('../../../../common/mixins/HtmlMixin');
const Auth = require('../../../../common/utils/auth');
const Handlebars = require('../../../../../app/modules/utils/templating');

const Toastr = require('toastr');
const Results = require('./Results.vue');

module.exports = {
    mixins: [LangMixin, FormMixin, PaginationSearchMixin, FormCleanerMixin, FiltersMixin, HtmlMixin],
    props: {
        showStatus: { default: false, type: Boolean },
        catName: { default: () => [], type: Array },
        display_l_for_list: { default: false, type: Boolean },
    },
    components: {
        Results,
    },
    data() {
        return {
            state: {
                display_results: false,
                loggedIn: false,
                export_type: '',
                export_subtype: null,
                select_all_to_export: false,

                sinks: {
                    reads: {
                        export: 'exporter_read',
                    },
                },
                mobile_dropdown: {
                    first: false,
                    second: false,
                    third: false,
                },
            },
        };
    },
    methods: {
        join_list(list) {
            return list.map(elt => `<strong>${elt.trim()}</strong>`).join('; ');
        },
        onPageChangeHook() {
            this.$store.commit(Messages.INITIALIZE, {
                form: this.state.sinks.reads.export,
                keep_content: false,
            });
            this.state.select_all_to_export = false;
        },
        export_format(format, subtype) {
            this.state.export_type = format;
            this.state.export_subtype = subtype;

            this.send_information(this.state.sinks.reads.export);
        },
        select_export_csl(value) {
            if (value) {
                this.export_format('csl', value.value);
            }
        },
        send_information(sink) {
            this.state.display_results = true;
            if (sink === this.state.sinks.reads.export) {
                this.run_export(sink);
            } else if (sink === this.searchSink) {
                /* this.$store.commit(Messages.INITIALIZE, {
                    form: this.state.sinks.reads.export,
                    keep_content: false,
                });*/
                this.add_extra_filters(sink, 'pos_aggregate', '*');
                //console.log('running_search in SearchResults, send_information, for sink', sink);
                this.run_search(sink);
            }
        },
        run_export(sink) {
            const content = this.fcontent(sink);
            const ids = this.$lodash.reduce(content, (arr, val, key) => {
                if (val) {
                    arr.push(key);
                }
                return arr;
            }, []);

            if (ids.length === 0) {
                Toastr.error(this.lang('l_please_select_export'));
            } else {
                this.$store.dispatch('download', {
                    path: APIRoutes.export(),
                    body: {
                        ids,
                        type: this.state.export_type || null,
                        subtype: this.state.export_subtype || null,
                    },
                });
            }
        },
    },
    watch: {
        current_state_export(s) {
            if (s !== 'initial') {
                this.dispatch(s, this, this.state.sinks.reads.export);
            }
        },
        select_all_to_export(s) {
            this.state.select_all_to_export = s;
            const obj = this.content.reduce((o, info) => {
                o[info._id] = !!s;
                return o;
            }, {});
            this.$store.commit(Messages.TRANSFERT_INTO_FORM, {
                form: this.state.sinks.reads.export,
                body: obj,
            });
            /* this.$store.commit(Messages.INITIALIZE, {
                form: this.state.sinks.reads.export,
                keep_content: true,
            });*/
        },
    },
    computed: {
        content_received() {
            const content = this.fcontent(this.resultSink);
            return content instanceof Array;
        },
        content() {
            const content = this.fcontent(this.resultSink);
            if (!(content instanceof Array)) {
                return [];
            }

            return content.map((c) => {
                c.html = this.filter_ined_profile_links(this.hlang(Handlebars.compile(c.denormalization.type.template)(c)));
                return c;
            });
        },
        select_all_to_export() {
            return this.state.select_all_to_export;
        },
        total() {
            const form = this.fform(this.resultSink);
            return form.total.value || 0;
        },
        current_state_export() {
            return this.fstate(this.state.sinks.reads.export);
        },
        user() {
            return Auth.user();
        },
        csl_export_styles() {
            return [
                { label: 'APA', value: 'ined_apa'},
                { label: 'Vancouver', value: 'ined_vancouver'},
                { label: 'Population', value: 'ined_population'},
                { label: 'Chicago', value: 'ined_chicago'},
                { label: 'ISO-690', value: 'ined_iso690'}
            ];
        },
        export_data() {
            return [
                { label: this.lang('f_export_bibtex'), value: 'bibtex' },
                { label: this.lang('f_export_ris'), value: 'ris' },
                { label: this.lang('f_export_endnote'), value: 'endnote' },
                { label: this.lang('f_export_csv'), value: 'csv' },
            ];
        },
        items_per_page_options() {
            return [10, 20, 50, 100];
        },
        sorting_options() {
            return [
                { label: this.lang('f_sort_by_year'), value: 'dates.publication' },
                { label: this.lang('f_sort_by_publication_type'), value: 'type' },
                { label: this.lang('f_sort_by_deposit_year'), value: 'dates.deposit' },
            ];
        },
    },
    beforeMount() {
        Auth.loggedIn('publication', ['c', 'u']).then((ok) => {
            this.state.loggedIn = ok;
        }).catch(err => console.error(err));
    },
};
