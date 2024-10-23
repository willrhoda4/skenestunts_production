






const bcrypt   = require( 'bcrypt'          );
const jwt      = require( 'jsonwebtoken'    );
const db       = require( './database.js'   );





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

    return db.atomicQuery(   request, 
                             response,
                           [ dataQuery,   passQuery   ],
                           [ data,        passData    ],
                           [ dataCallback             ],
                            'rank successfully updated'
    );

}





async function updatePerformer ( request, response) {


    // get the JWT from the request 
    const token = request.cookies.jwt;

    // if the JWT is missing, return an error
    if ( !token ) return response.status(401).json( { message: 'Authentication token missing' } );
    

    try {

        // decode the JWT and extract the id
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        const tokenId = decoded.id;

        // destruct the request body
        const { performerId, columnList, databaseState } = request.body;

        // check if the performerId in the request matches the one in the JWT
        if ( tokenId !== performerId ) return response.status(403).json( { message: 'Permission denied' } );

        // construct the SQL query for updating the performer profile
        const setClause =  columnList.map( ( col, idx ) => `${ col } = $${ idx + 1 }`).join(', ');
        const sqlQuery  = `UPDATE performers SET ${setClause} WHERE performer_id = $${columnList.length + 1}`;

        // combine databaseState with the performerId for the parameters
        const parameters = [ ...databaseState, performerId ];

        // execute the update query
        await db.pool.query(sqlQuery, parameters);

        // clear the JWT cookie and return a success message
        response.clearCookie( 'jwt' )
                .status(       200  )
                .json( { message: 'Profile updated successfully' } );

    } catch (error) {

        console.error(error);
        response.status(500).json( { message: 'Server error' } );
    }
}






async function autoLoginPerformer ( request, response ) {
    
    
    // step 1: validate the token
    const token = request.cookies.jwt;

    if ( !token ) return response.status(401).json( { message: 'Authentication token missing' } );

    try {
    
        // step 2: extract the .id property from the token
        const   decoded       = jwt.verify(token, process.env.JWT_SECRET);
        const { performerId } = decoded.id;

        console.log('\n\nperformerId:', performerId);

        // step 3: make a database query to the performers table
        const query = 'SELECT * FROM performers WHERE performer_id = $1';
        const result = await db.pool.query(query, [ performerId ] );

        // step 4: return the user data barring any errors
        if ( result.rows.length === 0 ) return response.status(404).json( { message: 'user not found' } );
    
        const user = result.rows[0];

        return response.status(200).json( { user } );

    } catch ( error ) {

        console.error('Error during token validation or database query:', error);
        return response.status(500).json( { message: 'Server error' } );
    }
}




module.exports = { newPerformer, updatePerformer, autoLoginPerformer };