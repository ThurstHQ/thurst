var nodemailer = require('nodemailer');

var config = require('../../config/config').config;

var transporter = nodemailer.createTransport(config.getEnv().smtps);

exports.sendEmail = function (to, title, content) {
    if (to) {
        var mailOptions = {
            from: '"Thurst " <thurst@thurst.com>',
            to: to,
            subject: title,
            text: content
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
};

// var config = require('../../config/config').config;
//
// var mailgun = require('mailgun-js')({
//     apiKey: config.getEnv().key,
//     domain: config.getEnv().domain
// });
//
// exports.sendEmail = function (to, title, content, attachment) {
//     if (to) {
//         var data = {
//             from: 'Thurst <noreply@thurst.com>',
//             to: to,
//             subject: title,
//             text: content,
//             attachment: attachment
//         };
//         mailgun.messages().send(data, function (error, body) {
//             if (error) console.log(error);
//         });
//     }
// };