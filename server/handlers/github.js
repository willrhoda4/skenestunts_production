

/**
 * this script houses a couple of functions that interact with the database
 * on behalf of GitHub Actions. 
 * 
 * since both handlers are for endpoints related to updating the Poster Barn,
 * they could rightfully live in posters.js, but it was getting a bit crowded.
 * 
 */



const { pool } = require('./database');



// this function retrieves imdb ids for all team members, board members, and credits,
// and passes it back to GitHub Actions for further handling.
async function wrangleImdbIds( request, response ) {

    console.log('wrangling IMDb IDs for GitHub Actions script...');
  
    try {

        // define SQL queries to retrieve IMDb IDs from the team and credits tables
        const teamQuery    = `SELECT imdb_id FROM team
                              UNION
                              SELECT imdb_id FROM board;`            // retrieves team member IMDb IDs
        const creditsQuery = 'SELECT imdb_id FROM posters;';         // retrieves credits IMDb IDs


        // execute both queries using the database pool
        const teamData     = await pool.query(teamQuery);            // get IMDb IDs of team members
        const creditsData  = await pool.query(creditsQuery);         // get IMDb IDs of current credits


        // send a successful response back to the client with the IMDb IDs
        response.status(200).json( { 
                                        team:    teamData.rows.map( double => double.imdb_id ), 
                                        credits: creditsData.rows 
                                 } );
    

    } catch (error) {
    
        // log the error to the console for debugging purposes
        console.error("Error fetching IMDb IDs:", error);

        // send a 500 Internal Server Error response if something goes wrong
        response.status(500).json({ message: 'Failed to retrieve IMDb IDs', error });
    }
}




async function updateCredits( request, response ) {


    console.log('updating IMDb credits from GitHub Actions...');

    // retrieve the data from the request body
    // build parameterized query parts
    // flatten the data into an array for parameterized query
    const newCredits    = request.body; 
    const placeholders  = newCredits.map((_, index) => `( $${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3} )`).join(',');
    const values        = newCredits.flatMap(item => [ item.imdb_id, item.title, item.cloudinary_id ] );

    // check if the data is valid
    // make sure the data is an array and has at least one entry
    // and that each entry has the required fields
    const invalidCredit = newCredits.some(item => !item.imdb_id || !item.title || !item.cloudinary_id);
    const invalidData   = invalidCredit || !Array.isArray(newCredits) || newCredits.length === 0;
    
    if  ( invalidData ) return response.status(400).json({ message: 'invalid data provided.' });


    try {
        const query = `
            INSERT INTO posters (imdb_id, title, cloudinary_id)
            VALUES ${placeholders}
            ON CONFLICT (imdb_id) DO UPDATE 
            SET title = EXCLUDED.title, cloudinary_id = EXCLUDED.cloudinary_id;
        `;


        // execute the query using the parameterized values
        const queryResponse = await pool.query(query, values);

        response.status(200).json({ 
            message: 'Credits updated successfully', 
            rowCount: queryResponse.rowCount, 
            response: queryResponse,
            query: query,
            values: values
        });
    
    } catch (error) {
        console.error('Error updating credits:', error);
        response.status(500).json({ message: 'Failed to update credits', error });
    }
}




// // this function updates the credits table with the latest credits for the team.
// // it's called by GitHub Actions, which sends over an array of json objects.
// // eg: { imdb_id: 'tt1234567', title: 'The Movie', cloudinary_id: 'abc123' }
// async function updateCredits(request, response) {

//     console.log('updating IMDb credits from GitHub Actions...');


//     // retrieve the data (an array of credit objects) from the request body
//     const data = request.body; 

//     // ceck if the data is an array and has at least one entry
//     // if the validation fails, send a 400 Bad Request response
//     if (!Array.isArray(data) || data.length === 0) {
//         return response.status(400).json({ message: 'No valid data provided.' });
//     }

//     try 
//     {

//         // use map() to transform the data array into a string of value tuples for the SQL query
//         // each tuple contains the imdb_id, title, and cloudinary_id for one credit
//         const values = data.map(item => `('${item.imdb_id}', '${item.title}', '${item.cloudinary_id}')`).join(',');

//         // construct the SQL query
//         // the INSERT statement will add new credits to the database
//         // the ON CONFLICT clause ensures that if a credit with the same imdb_id already exists,
//         // its title and cloudinary_id will be updated instead of inserting a duplicate
//         const query = `
//             INSERT INTO posters (imdb_id, title, cloudinary_id)
//             VALUES ${values}
//             ON CONFLICT (imdb_id) DO UPDATE 
//             SET title = EXCLUDED.title, cloudinary_id = EXCLUDED.cloudinary_id;
//         `;

//         // execute the query using the database connection pool
//         // this sends all the updates in a single query, which improves performance and reduces the number of database round trips
//         await pool.query(query);

//         // if the query executes successfully, send a 200 OK response with a success message
//         response.status(200).json({ message: 'Credits updated successfully.' });
    
    
//     } catch (error) {

//         // if an error occurs (e.g., database connection issues, query problems), catch the error
//         // log the error for debugging purposes
//         console.error('Error updating credits:', error);

//         // send a 500 Internal Server Error response with an error message
//         response.status(500).json({ message: 'Failed to update credits', error });
//     }
// }









module.exports = { wrangleImdbIds, updateCredits }