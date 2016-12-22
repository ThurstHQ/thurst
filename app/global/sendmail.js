exports.sendEmail = function (to, title, content, attachment) {
    if (to) {
        var data = {
            from: 'Thurst <noreply@thurst.com>',
            to: to,
            subject: title,
            text: content,
            attachment: attachment
        };
        mailgun.messages().send(data, function (error, body) {
            if (error) console.log(error);
        });
    }
};