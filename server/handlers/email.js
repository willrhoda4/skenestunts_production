








const nodemailer    = require('nodemailer');





// takes care of all email endpoints
function emailHandler (req, res) {

    console.log('launching the emailHandler...');



    const { cc,
            name, 
            type,
            email, 
            token, 
            phone,
            origin,
            invite,
            message, 
            resetId,
            subject  } = req.body



    // helper function that delivers email using nodemailer
    async function deliverEmail (   response, 
                                    options, 
                                    successMsg, 
                                    errorMsg, 
                                    cleanUpSuccess, 
                                    cleanUpError
                                ) {

        // create  transporter object using the default SMTP transport
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


    // userEmail producerEmail reachingOut, resetEmail
    function emailHTML (url) {

        const logoUrl    = 'https://drive.google.com/uc?export=view&id=1PLvD9xcxJUxY_t-FZIkdV7sC68a-81T5';

        const resetTitle = invite ? 'initialize password' 
                                  : 'reset password';

        const resetGraf  = invite ? `You've been invited to Skene Stunts Director's Chair. Click below to activate your account.`
                                  : `Click below to proceed with you password reset. Ignore this email if you didn't make a reset request.`;

        const content = type === 'userEmail'      
                     || type === 'producerEmail'      ?  `<p>
                                                            <b>Name:</b>    ${name}<br>
                                                            <b>Email:</b>   ${email}<br>
                                                            <b>Phone #:</b> ${phone}<br>
                                                            <b>Subject:</b> ${subject}<br>
                                                            <b>Message:</b> ${message}
                                                          </p>
                                                          `
    
                      : type === 'reachingOut'
                     || type === 'errorNotification'  ?  `<p>${message}</p>
                                                          <br><br>
                                                          `
    
                      : type === 'resetEmail'         ?  `<p>${resetGraf}</p>
                                                          <br><br>
                                                          <p><a href="${url}">${resetTitle}</a></p>
                                                          <br><br>
                                                         `
                      :                                  null;

                    

        return `
                    <!DOCTYPE html>

                    <html>
                        <head>
                            <style>

                                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400&display=swap');

                                body {
                                    margin: 0;
                                    padding: 0;
                                }
                            
                                .container {
                                    border-left: 20px solid red;
                                    padding: 20px 30px;
                                    font-size: 18px;
                                    font-family: 'Barlow Condensed', 'Courier New', Courier, monospace;
                                }

                                .container a {
                                    color: #000000;
                                    text-decoration: none;
                                }
                              
                                .container a:hover {
                                    color: #ff0000;
                                }

                            </style>

                        <body>
                            <div class="container">
                                ${content}
                                <img src="${logoUrl}" alt="skene stunts logo" />
                            </div>
                        </body>
                    </html>
               `
    }



    
    // receives email from contact form
    async function formMail(request, response) {

  

        const userSubject     = `Website email from ${name} subject: ${subject}`;
        const producerSubject = `PRODUCR MSG FROM: ${name}  subject: ${subject}`;
        const emailSubject    = type==='userEmail' ? userSubject : producerSubject

        console.log(`receiving a ${emailSubject}\n`);

        const mailOptions = {       from: email,
                                      to: process.env.EMAIL,
                                 subject: emailSubject,
                                    html: emailHTML()
                            }
        
        deliverEmail(   response, 
                        mailOptions, 
                        `Message succesfully received from ${email}.`, 
                        `Error receiving message from ${email}`
                    );
    }

 

    // sends password reset link     
    async function sendResetLink(request, response) {

        console.log(`sending reset link to ${email}...\n`);

        const url              = `${process.env.URL}passwordReset?id=${resetId}&origin=${origin}&invite=${invite}&token=${token}`;

        const resetLinkOptions = {        
                                           to:  email,
                                         from:  `"Skene Stunts" ${process.env.EMAIL}`,
                                      subject: invite ? `Welcome to Skene Stunts Director's Chair` : `Password Reset`,
                                         html: emailHTML(url)
                                 } 
        

            deliverEmail(    response, 
                             resetLinkOptions, 
                            `reset link successfully sent.`, 
                            `error delivering password reset email.`,
                        );
        
    }





    // sends email to performer directly from website
    async function reachOut(request, response) {

        console.log(`reaching out to ${email}...\n`)

        const reachOutOptions = {        to: email,
                                       from: `"Skene Stunts" ${process.env.EMAIL}`,
                                         cc: cc,
                                    subject: subject,
                                       html: emailHTML()
                                }
        deliverEmail(    response, 
                         reachOutOptions, 
                        `Reset link successfully sent.`, 
                        `Error resetting password.`
                    );
    }






    // sends email to performer directly from website
    async function errorNotification(request, response) {

        console.log(`notifying tech team of an error...\n`)

        const reachOutOptions = {        to: 'willrhoda4@gmail.com',
                                       from: `"Skene Stunts" ${process.env.EMAIL}`,
                                    subject: 'Error Notification',
                                       html: emailHTML()
                                }
        deliverEmail(    response, 
                         reachOutOptions, 
                        `Error notification successfully sent.`, 
                        `Error sending error notification.`
                    );
    }



    // the type prop determines which function to execute.
    switch (type) {

        case 'userEmail':         formMail(req, res);                       break;
        case 'producerEmail':     formMail(req, res);                       break;
        case 'reachingOut':       reachOut(req, res);                       break;
        case 'resetEmail':        sendResetLink(req, res);                  break;
        case 'errorNotification': errorNotification(req, res);              break;
        default:                res.status(400).send('Invalid email type'); break;  
    }
}

module.exports = { emailHandler };














// const { atomicQuery } = require('./database');






// // creates a new user in the database.
// // inserts a new row into the performers table and a new row into the performer_passwords table.
// async function logError (request, response) {



//     const message    = request.body[0];






//     const dataQuery  = `INSERT INTO error_log }) VALUES (${values}) RETURNING performer_id;`;
//     const passQuery  = `INSERT INTO performer_passwords (performer_id, password) VALUES ($1, $2);`;

//     // parameter values for password query
//     // unshift adds the performer_id to the beginning of the array during dataCallback.
//     const passData  = [ hashedPass ];


//     // callback function for data query
//     // adds the performer_id to the beginning of the array during dataCallback.
//     const dataCallback  = (data) => { passData.unshift(data[0].performer_id); };

//     return atomicQuery(      request, 
//                              response,
//                            [ dataQuery,   passQuery   ],
//                            [ data,        passData    ],
//                            [ dataCallback             ],
//                             'rank successfully updated'
//     );

// }
