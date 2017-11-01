module.exports = {
    msw: {
        mappings: {
            form: {
                dynamic: 'strict',
                dynamic_date_formats: [],
                properties: {
                    name: {
                        type: 'keyword',
                    },
                    fields: {
                        type: 'nested',
                        properties: {
                            label: {
                                type: 'keyword',
                                index: false,
                            },
                            placeholder: {
                                type: 'keyword',
                                index: false,
                            },
                            type: {
                                type: 'keyword',
                                index: false,
                            },
                            datasource: {
                                type: 'nested',
                                properties: {
                                    name: {
                                        type: 'keyword',
                                        index: false,
                                    },
                                    add: {
                                        type: 'boolean',
                                        index: false,
                                    },
                                    modify: {
                                        type: 'boolean',
                                        index: false,
                                    },
                                    remove: {
                                        type: 'boolean',
                                        index: false,
                                    },
                                },
                            },
                            name: {
                                type: 'keyword',
                                index: false,
                            },
                            validations: {
                                type: 'nested',
                                properties: {
                                    required: {
                                        type: 'boolean',
                                    },
                                    type: {
                                        type: 'keyword',
                                        index: false,
                                    },

                                },
                            },
                            order: {
                                type: 'integer',
                                index: false,
                            },
                            multiple: {
                                type: 'boolean',
                                index: false,
                            },
                        },
                    },
                },
            },
        },
    },
};
