





const   jwt           = require('jsonwebtoken');
const { pool }        = require('./database');



// autoLogin is a handler function that automatically logs in
// team and board members based on their JWT token
async function autoLogin (request, response ) {
    
    
    // step 1: Validate the token
    const token = request.cookies.jwt;


    if ( !token ) return response.status(401).json( { message: 'Authentication token missing' } );
    

    try {
        
        // step 2: decode the JWT and extract role and id
        const   decoded    = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;


        console.log(`autoLogin: ${role} ${id}`);
        // step 3: determine the appropriate table based on the role
        const validRoles = ['team', 'board', 'admin'];

        if ( !validRoles.includes(role)) return response.status(400).json( { message: 'Invalid role in token' } );
        
        const table  = role === 'team' ? 'team' : 'board';

        const query  = `SELECT * FROM ${table} WHERE imdb_id = $1`;
        
        // step 4: query the database with the extracted id
        const result = await pool.query( query, [ id ] );

        if ( result.rows.length !== 1 ) return response.status(404).json( { message: 'User not found or not unique' } );

        const user = result.rows[0];

       
        // step 5: return the user data
        return response.status(200).json( { user, role } );

    } catch ( error ) {

        console.error('Error during token validation or database query:', error);
        return response.status(500).json( { message: 'Server error' } );
    }
}


module.exports = { autoLogin };