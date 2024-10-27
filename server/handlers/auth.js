







const { pool }        = require('./database');
const   bcrypt        = require('bcrypt');
const   crypto        = require('crypto');
const   jwt           = require('jsonwebtoken');


const { simpleQuery } = require('./database');



// config obhject for the JWT cookies
const cookieOptions = {
                        httpOnly:  true,                                                     // prevents access to the cookie via JavaScript (enhances security)
                        secure:    process.env.NODE_ENV === 'production',                    // ensures the cookie is sent over HTTPS in production
                        maxAge:    2 * 60 * 60 * 1000,                                       // cookie expires in 2 hours (set in milliseconds)
                        sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Lax',   // prevents CSRF attacks by limiting cross-site requests
                      }



// helper function to generate a JWT token for resetPassword and login.
function returnToken( user, table ) {

    console.log('returning token for:\nuser: ', user);

    // admin privileges for Jan, 
    // and shorten performers to performer, for readability.
    // just return board/team for the board and team
    const role    = ( user.imdb_id === 'nm0804052' ) ? 'admin'
                    : table        === 'performers'  ? 'performer'
                    :                                   table;

    // we'll use the performer_id for performers and the imdb_id for board/team.
    const id      = user[ role === 'performer' ? 'performer_id'  : 'imdb_id' ];

    const payload = { id, role };

    console.log('id:', id);
    console.log('role:', role);
    
    const token   = jwt.sign( 
                                  payload, 
                                  process.env.JWT_SECRET, 
                                { expiresIn: '2h' }
                            );

    return { role, token };
}









// returns data and token for a user providing the correct email and password.
async function login ( request, response ) {


    let   table     = request.body[0];
    const email     = request.body[1];
    let   pwTable   = request.body[2];
    const pwTableFk = request.body[3];
    const password  = request.body[4];


    console.log(`\nAttempting login for ${email}...\n`    );


    // first helper function grabs data from the database.
    async function grabData() {

        const dataQuery  = `SELECT * FROM ${table} WHERE email = $1`;
        const dataResult = await pool.query( dataQuery, [ email ] );

        // if no data is found in the board table, check the team table.
        if ( dataResult.rows.length === 0 ) {

            if (table === 'board') {
                                        table   = 'team';
                                        pwTable = 'team_passwords';
                                        return grabData();
                                   }

            console.log(`Data for ${email} not found in database.\n`);
    
            return null;

        }

        console.log(`Data for ${email} found in database.\n`);

        return dataResult.rows[0];
    }


    // second helper function checks password against database.
    async function checkPassword(pwTable, pwTableFk, id, password) {
        

        const pwQuery  = `SELECT * FROM ${pwTable} WHERE ${pwTableFk} = $1`;       
        const pwResult = await pool.query( pwQuery, [ id ] );

        if ( pwResult.rows.length === 0 ) {

            console.log(`Password not found in database.\n`);
    
            return false;
        }

        const stashedPass = pwResult.rows[0].password;

        console.log(`Password for ${email} found in database.\n`);
    
        return bcrypt.compare(password, stashedPass)
    }



    try {


        // 1. attempt to grab the user data from the database using the provided email.
        let user = await grabData(table, email);

        // 2. if no user data is found (i.e., the email doesn't exist), send the response "no email" and stop further execution.
        if (!user) return response.send('no email');  

        // 3. extract the ID (either performer_id or imdb_id) from the user data.
        const id = user[ pwTableFk ];

        // 4. check if the provided password matches the stored password for the user.
        const match = await checkPassword( pwTable, pwTableFk, id, password );

        // 5. if the password doesn't match, send "no match" as the response and stop further execution.
        if (!match) {
            console.log('Password does not match\n');
            return response.send('no match');
        } 
            
        console.log('Password matches\n');

        // 6. if the password matches, proceed with generating a JWT token and determining the user role.
        const { role, token } = returnToken(user, table);

        console.log('responding with user data and token...\n');
        // 7. set the JWT token as an HTTP-only cookie and send the user data and role back in the response.
        return response.cookie(
                               'jwt', 
                                token, 
                                cookieOptions
        ).send( { user, role } );

    } catch ( err ) {

        // logs the error message for debugging purposes
        console.log( err.message );  

        // sends an error response with a status code of 400 and the error message to the client.
        return response.status(400).send( err.message );
    }


};


    







// stores token in database in preparation for a response to 
// an email invitation to Director's Chair
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





/*
takes care of database operations for resetting a password.

id:         the id of the user whose password is being reset.
newPass:    the new password.
table:      the table where the password is stored.
fk:         the foreign key for the password table.
resetToken: the reset token that was sent to the user.

*/
const resetPassword = async (request, response) => {
    

    const id         = request.body[0];
    const newPass    = request.body[1];
    const table      = request.body[2];
    const fk         = request.body[3];
    const resetToken = request.body[4];


    // before we get started, let's make sure the table is valid.
    const validTable =  table === 'team_passwords'    || 
                        table === 'board_passwords'   || 
                        table === 'performer_passwords';

    if ( !validTable ) return response.status( 400 ).send( 'invalid table specified' );



    // then determine the correct user table based on the password table
    const userTable = table === 'team_passwords'      ? 'team'
                    : table === 'board_passwords'     ? 'board'
                    : table === 'performer_passwords' ? 'performers'
                    :                                    null
  


    // step 1: validate the reset token
    const tokenQuery = `SELECT token, reset_at FROM ${table} WHERE ${fk} = $1`;
    

    try {

        const tokenResult = await pool.query( tokenQuery, [ id ] );
        
        if (tokenResult.rows.length === 0)  {
                                                console.log('Reset token not found in the database');
                                                return response.status(400).send('Invalid reset token');
                                            }

        const { token, reset_at } = tokenResult.rows[0];
        
        // make sure the token matches and isn't more than 15 minutes old
        const invalidToken = token !== resetToken 

        const expiredToken = Date.now() - new Date( reset_at ).getTime() > 900000;

        if ( invalidToken || expiredToken ) {  
                                                console.log('Reset token is invalid or expired');
                                                return response.status(400).send('Invalid or expired reset token');
                                            }

    } catch ( err )                         {

                                                console.log(err.stack);
                                                return response.status(500).send('Error validating reset token');
                                            }




    // step 2: hash the new password and update it in the database
    
    // hash the new password with bcrypt
    const hashedPass  = await bcrypt.hash( newPass, 10 );

    // update the password in the correct table, and clear the reset token
    const updateQuery = `UPDATE ${ table } SET password = $1, token = NULL, reset_at = NULL WHERE ${ fk } = $2`;


    try             {
                        await pool.query( updateQuery, [ hashedPass, id ] );
                        console.log( 'Password successfully reset' );
                    }
    catch ( err )   {
                        console.log(err.stack);
                        return response.status(500).send('Error updating password');
                    }



    // step 3: finally, fetch the user data from the correct table and return a JWT token
    const jwtId = userTable === 'performers' ? 'performer_id' : 'imdb_id';
    
    const userQuery = `SELECT email, ${ jwtId } FROM ${ userTable } WHERE ${ fk } = $1`;
    
    try         {
                    const userResult = await pool.query( userQuery, [ id ] );

                    if (userResult.rows.length === 0) {
                        console.log('User not found in the database');
                        return response.status(400).send('User not found');
                    }

                    const   user    = userResult.rows[0];
                    const { token } = returnToken(user, userTable);

                    // step 4: send the JWT token as an HttpOnly cookie
                    response.cookie(
                                        'jwt', 
                                         token, 
                                         cookieOptions
                                    )
                               .send( {  message: 'Password reset successful' } );

                } 
    catch (err) {
                    console.log( err.stack );
                    return response.status( 500 ).send( 'Error generating JWT token' );
                }

};





  
module.exports = {  
                    login, 
                    registerReset,
                    resetPassword,
                 };
