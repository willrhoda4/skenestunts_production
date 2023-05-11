








const nodemailer    = require('nodemailer');
const crypto        = require('crypto');



// takes care of all email endpoints
function emailHandler (req, res, next) {

    console.log(req.body);

    const { cc,
            name, 
            type,
            email, 
            phone,
            origin,
            invite,
            token, 
            subject, 
            message, 
            resetId  } = req.body



    // helper function that delivers email using nodemailer
    async function deliverEmail (   response, 
                                    options, 
                                    successMsg, 
                                    errorMsg, 
                                    cleanUpSuccess, 
                                    cleanUpError
                                ) {

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({

            host:  'smtp.gmail.com',
            port:   465,
            secure: true,
            auth:   {
                        user: process.env.EMAIL,
                        pass: process.env.EMAILPASS 
                    }
        });

        // send mail with defined transport object
        return new Promise((resolve, reject) => {

            transporter.sendMail(options, (err, info) => {

                // if there's an error, log it and send a response or run cleanUpError if it exists.
                if (err) {  console.error(`\n${errorMsg}\n${err.message}`);
                            if (!cleanUpError)   {    return response.status(400).send(errorMsg);   }
                            else                 {    cleanUpError();                               };
                            reject(err);
                         } 
                // if there's no error, log it and send a response or run cleanUpSuccess if it exists.
                else     {  console.log(`\n${successMsg}\n${info.response}`);
                            if (!cleanUpSuccess) {    return response.send(successMsg);             }
                            else                 {    cleanUpSuccess();                             };                     
                            resolve(info);
                         }
            });
        });
    }



    
    // receives email from contact form
    async function formMail(request, response) {

        const userSubject     = `Website email from ${name} subject: ${subject}`;
        const producerSubject = `PRODUCR MSG FROM: ${name}  subject: ${subject}`;
        const otherSubject    = `From Website: ${subject}`;
  
        const mailOptions = {       from: email,
                                      to: process.env.EMAIL,
                                 subject: type==='userEmail' ? userSubject : type==='producerEmail' ? producerSubject : otherSubject,
                                    text: 
                            `                Name:   ${name}
                                            Email:   ${email}
                                            Phone #: ${phone}
                                            Subject: ${subject}
                                            Message: ${message}`
                            }
        
        deliverEmail(   response, 
                        mailOptions, 
                        `Message succesfully received from ${email}.`, 
                        `Error receiving message from ${email}`
                    );
    }

 
    // BE SURE TO FLESH OUT EMAIL TEXT
    // sends password reset link     
    async function sendResetLink(request, response) {

        console.log(`sending reset link to ${email}...\n`);

        const url              = `${process.env.URL}/passwordReset?id=${resetId}&origin=${origin}&invite=${invite}&token=${token}`;

        const resetLinkOptions = {        
                                           to:  email,
                                         from:  `"Skene Stunts" ${process.env.EMAIL}`,
                                      subject: invite ? `Welcome to Skene Stunts Director's Chair` : `Password Reset`,
                                         text: invite ? `Join the revolution => ${url}`            : `Reset your password here => ${url}`
                                 } 
        

            deliverEmail(    response, 
                             resetLinkOptions, 
                            `reset link successfully sent.`, 
                            `error delivering password reset email.`,
                        );
        
    }



    // sends email to performer directly from website
    async function reachOut(request, response) {

        const reachOutOptions = {   to: email,
                                    from: `"Skene Stunts" ${process.env.EMAIL}`,
                                    cc: cc,
                                    subject: subject,
                                    text: message
                                }
        deliverEmail(    response, 
                         reachOutOptions, 
                        `Reset link successfully sent.`, 
                        `Error resetting password.`
                    );
    }



    
    switch (type) {

        case 'userEmail':       formMail(req, res);                         break;
        case 'producerEmail':   formMail(req, res);                         break;
        case 'reachingOut':     reachOut(req, res);                         break;
        case 'resetEmail':      sendResetLink(req, res);                    break;
        default:                res.status(400).send('Invalid email type'); break;  
    }
}

module.exports = { emailHandler };