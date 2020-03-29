function mailconst(username, link) {
    msg = "<h3>" + username + "</h3>" + "<br> <h1>Welcome to our portal.</h1><br>Please click on link below to confirm your E-mail address.<br>" + link + "<br> Thank you <br> Team Chit-chat";
    conf_subject = "Please Confirm your e-mail.";
    return { m: msg, su: conf_subject };
}
module.exports = mailconst;