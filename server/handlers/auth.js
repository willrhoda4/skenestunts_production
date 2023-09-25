







const { pool }        = require('./database');
const   bcrypt        = require('bcrypt');
const   crypto        = require('crypto');
const { simpleQuery,
        atomicQuery } = require('./database');






// check password against database and sends response data if it jives.
const checkPassword = (request, response) => {


    let   table          = request.body[0];
    const email          = request.body[1];
    let   pwTable        = request.body[2];
    const pwTableFk      = request.body[3];
    const password       = request.body[4];

    // const dataQuery      = `SELECT * FROM ${table}   WHERE   email      = $1`
    // const pwQuery        = `SELECT * FROM ${pwTable} WHERE ${pwTableFk} = $1`


    console.log(`verifying password for ${email}...\n`);
   


    // once data is retrieved for profile updates, passwordCheck checks the password before sending the response.
    async function passwordCheck (id) {

        const pwQuery        = `SELECT * FROM ${pwTable} WHERE ${pwTableFk} = $1`;  console.log(pwQuery);


        pool.query(pwQuery, [id], async (err, res) => {

                 if (err)                       {  
                                                    console.log(err.message); 
                                                    return response.status(400).send(err.message); 
                                                }
            else if (res.rows.length === 0)     {
                                                    console.log(`password for ${email} not found in database.\n`);
                                                    return response.send('no password');
                                                } 
            else                                {

                const stashedPass = res.rows[0].password;
                
                const match       = await bcrypt.compare(password, stashedPass);
    
                if (match) {  console.log(`password for ${email} matches!`      );   return true;   }   
                else       {  console.log(`password for ${email} doesn't match.`);   return false;  }  
    
            }
        })
    }


    // grabs data from the performers table and runs passwordCheck before sending the response.
    function grabData () {  



        const dataQuery      = `SELECT * FROM ${table} WHERE email = $1`;  
        console.log(dataQuery);


        pool.query(dataQuery, [email], (err, res) => {
                
                     if (err)                   { 
                                                    console.log(err.message); 
                                                    return response.status(400).send(err.message); 
                                                }
                else if (res.rows.length === 0) {
                                                    // for Director's Chair login attempts, if the email 
                                                    // isn't found in the board table, check the team table
                                                    // before sending a response.
                                                    if (table === 'board')  {  
                                                                                table   = 'team';
                                                                                pwTable = 'team_passwords';
                                                                                return     grabData();
                                                                            }


                                                    console.log(`data for ${email} not found in database.\n${table+ pwTable}`);
                                                    return response.send('no email');
                                                } 
                else                            {
                                                    const id = res.rows[0][pwTableFk];       
                    
                                                    passwordCheck(id) ? response.send(res.rows[0]) 
                                                                      : response.send('no match');
                                                }
        })
    }

    // start the process
    grabData();

  
}
    


// stores token in database in preparation for a response to 
// an email invitation to Director's Charir
// or a performer (or team) password-reset request.
const registerReset = (request, response) => {

    
    
    const table       =   request.body[0];
    const fk          =   request.body[1];
    const id          =   request.body[2];

    // log a message to the console based on the table.
    const theDeal     =   table === 'performer_passwords' ? 'registering a performer-password reset request...'
                                                          : 'registering a reset or invitation for Director\'s Chair...';

    console.log(theDeal);

    // generates token for invitation
    const inviteToken =   crypto.randomBytes(32).toString("hex");
    const columns     = [ fk,  'token',     'password',          'reset_at'         ].join(', ');
    const values      = [ id,  inviteToken, 'pendingReset',       Date.now()        ]; 




    // add a new row to the performer_passwords table
    // or update an existing row if the fk already exists.
    const query = `
                    INSERT INTO "${table}" (${columns}) 
                    VALUES ($1, $2, $3, $4::bigint) 
                    ON CONFLICT (${fk}) 
                    DO UPDATE SET token = excluded.token, password = excluded.password, reset_at = excluded.reset_at
                    RETURNING token;
                 `;

    console.log(query);
    simpleQuery(response, query, values);

}





// resets password   
const resetPassword = async (request, response) => {
    
    let id         =  request.body[0];
    let newPass    =  request.body[1];
    let table      =  request.body[2];
    let fk         =  request.body[3];

    let hashedPass =  await bcrypt.hash(newPass, 10);
    let query      = `UPDATE ${table} SET password = $1 WHERE ${fk} = $2`;

    console.log(`resetting password for ${table}...`)


    pool.query(query, [hashedPass, id], (err, res) => {
        if (err) { console.log(err.stack);                      response.send(err.message);      } 
        else     { console.log('password successfully reset');  response.send('password reset'); }
    })
}




// logs user in after password reset
const newPasswordLogin = (request, response) => {

    let table = request.body[0];
    let idKey = request.body[1];
    let id    = request.body[2];

    let query = `SELECT * FROM ${table} WHERE ${idKey} = $1`

    console.log(`logging user in with new password...`);

    pool.query(query, [id], (err, res) => {
        if (err) { console.log(err.stack);              response.send(err.message); } 
        else     { console.log('login successful!');    response.send(res.rows);    }
    })
}




// creates a new user in the database.
// inserts a new row into the performers table and a new row into the performer_passwords table.
async function newPerformer (request, response) {



    const columns    = request.body[0].join(', ');
    const data       = request.body[1];

    const password   = request.body[2];
    const hashedPass = await bcrypt.hash(password, 10);


    const values     = data.map((column, index) =>'$'+(index+1)).join(', ');


    const dataQuery  = `INSERT INTO performers (${columns}) VALUES (${values}) RETURNING performer_id;`;
    const passQuery  = `INSERT INTO performer_passwords (performer_id, password) VALUES ($1, $2);`;

    // parameter values for password query
    // unshift adds the performer_id to the beginning of the array during dataCallback.
    const passData  = [ hashedPass ];


    // callback function for data query
    // adds the performer_id to the beginning of the array during dataCallback.
    const dataCallback  = (data) => { passData.unshift(data[0].performer_id); };

    return atomicQuery(      request, 
                             response,
                           [ dataQuery,   passQuery   ],
                           [ data,        passData    ],
                           [ dataCallback             ],
                            'rank successfully updated'
    );

}









  
module.exports = {  
                    newPerformer,
                    checkPassword, 
                    registerReset,
                    resetPassword,
                    newPasswordLogin,
                 };
