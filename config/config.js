exports.config = {
    getEnv: function () {
        switch (process.env.NODE_ENV) {
            case 'dev':
                return {
                    port: 8080,
                    key : "key-cc5f4eb3ba23938ff5126ed828bb325f",
                    domain : "qa-thurst-back-end-1346444650.us-west-2.elb.amazonaws.com",
                    smtps : 'smtps://tt477018@gmail.com:^ksvqyaNM*r5EVPQk\'Ab@smtp.gmail.com',
                    database : 'mongodb://thurstuser:thurstuserpwd@54.200.212.61:27017/thurst',
                    secret : 'skjdhcskldhfr438rhfs78e63278f78234r62gf7832465274682',
                };
            case 'prod':
                return {
                    port: 443
                };
            default:
                return {
                    port: 8080,
                    key : "key-cc5f4eb3ba23938ff5126ed828bb325f",
                    domain : "sandbox4cd7db4c8830475bb6ce9f24a83af592.mailgun.org",
                    smtps : 'smtps://tt477018@gmail.com:^ksvqyaNM*r5EVPQk\'Ab@smtp.gmail.com',
                    database : 'mongodb://thurstuser:thurstuserpwd@54.200.212.61:27017/thurst',
                    secret : 'skjdhcskldhfr438rhfs78e63278f78234r62gf7832465274682'
                };
        }
    },

};
