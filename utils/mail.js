const nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
function sendEmail(subject, message, recipents, response) {
    nodemailer.createTestAccount((err, account) => {
        let trans = nodemailer.createTransport(smtpPool({
            service: 'gmail',
            auth: {
                user: 'app.chitchat12@gmail.com',
                pass: '1236547899cc'
            }
        }))
        let mailoptions = {
            from: '"Chit-Chat <app.chitchat12@gmail.com>"',
            to: recipents,
            subject: subject,
            html: message
        };
        trans.sendMail(mailoptions, (err, info) => {
            if (err) {
                console.log(err)
                // response.send('cant send mail some error')
            }
            else {
                console.log("mail sent")
            }
        })
    })
}
module.exports = sendEmail;