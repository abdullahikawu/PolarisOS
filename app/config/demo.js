const demo = {
    port: 4002,
    elasticsearch: {
        hosts: [
            'http://localhost:9200',
        ],
        apiVersion: '5.2',
    },
    logger: {
        transports: {
            console: {
                level: 'debug',
            },
            file: {
                level: 'verbose',
            },
        },
    },
};

module.exports = demo;
