




const Pool = require('pg').Pool
require('dotenv'      ).config();




    console.log(process.env.PG_USER,' <= a user');

//                                      vvvvvv use this configuration for local development
// const pool = new Pool({
//                         user:     process.env.PG_USER,
//                         host:     process.env.PG_HOST,
//                         database: process.env.PG_DATABASE,
//                         password: process.env.PG_PASSWORD,
//                         port:     process.env.PG_PORT,
//                         ssl:      false
//                       })


// use this configuration for deployment to Heroku
const pool = new Pool({
                        connectionString: process.env.DATABASE_URL,
                        ssl:            { rejectUnauthorized: false }
                      });





// runs a series of queries in a transaction
function atomicQuery (request, response, queries, parameters, callbacks, successMsg, next) { 


    // initialize steps counter
    let steps = 0;


    // recursive function that runs queries in a transaction
    function step (err, client, release) {

        // index is the current step in the transaction
        // step not incremented until after this declaration to account for 0-indexing
        let index = steps;

        // gear gets passed to client.query.
        // if there's a parameters array, it gets passed as the second argument
        let gear  = parameters[index] ? [ queries[index], parameters[index] ] 
                                      : [ queries[index]                    ];

        // if there's any steps left to run, run the next one.
        if (steps !== queries.length) {

            // increment steps counter
            steps++;


            // run the query
            client.query(...gear, (err, res) => {

                // if there's an error, rollback the transaction and send the error message
                if (err) { return client.query('ROLLBACK', () => {   release(); 
                                                                     console.error(`Error executing query ${steps}`, err.stack);
                                                                     response.status(400).send(err.stack)
                                                                 })
                         }
                
                // if there's no error, run the callback function for the current step if it exists,
                // then run the next step in the transaction.
                else     {  console.log(res.rows);
                            callbacks[index] && callbacks[index](res.rows, response);  
                            step(err, client, release);
                         }
            })


        // if there's no steps left to run, commit the transaction.
        } else {

            client.query('COMMIT', (err, res) => {
            
                // if there's an error, rollback the transaction and send the error message
                if (err) { return client.query('ROLLBACK', () =>    {   release();
                                                                        console.error('Error committing transaction', err.stack);
                                                                        response.status(400).send(err.stack)
                                                                    })
                         }

                // if there's no error, release the client.
                // proceed to next middleware or send a response.
                else     {
                            release();
                            console.log('Transaction completed successfully');
                            next ? next () : response.send(successMsg);
                         }
            })
        }
    }


    //  set it off by acquiring a client from the pool and running the first step in the transaction
    pool.connect((err, client, release) => {

        if (err) { return console.error('Error acquiring client', err.stack) }

        client.query('BEGIN', (err, res) => {

            if (err) { return console.error('Error starting transaction', err.stack) }

            step(err, client, release);
        })
    }) 

}







function simpleQuery(response, query, parameters, cleanUp, next) {

    const gear = parameters ? [query, parameters] : [query];

    pool.query(...gear, (err, res) => {
        
        if (err) { 
                    console.log(err.stack);
                    response.status(400).send(err.message);
                 } 
        else     { 
                    
                    if  (cleanUp) {
                                    console.log(`moving on to cleanUp function...`);
                                    cleanUp(res.rows, response);
                                  }
                    
                    if  (next)    { 
                                    console.log(`now moving on to next middleware.`);
                                    next();
                                  }
                    else          { 
                                    console.log(`now sending response.\n`);
                                    response.send(res.rows); 
                                  }
        }
    });
};




/* 
Universal getData function that accepts request bodies in this format => [  'table_name', 
                                                                           [[array, of], [filter, arrays]]],
                                                                           { 
                                                                                orderBy: optional,
                                                                                groupBy: option_object,
                                                                                limit:   7
                                                                                columns: comma-separated string of columns to select. Default is *
                                                                           },
                                                                          ]
*/


const getData = (request, response) => {



    let table        = request.body[0];
    let filters      = request.body[1];
    
    let columns, limit, orderBy, groupBy;
    
    if (request.body[2])  {( { 
                                orderBy,
                                limit,
                                groupBy,
                                columns    } = request.body[2]
                          )}
          
   
    let query          = !columns ? `SELECT *          FROM "${table}"`
                                  : `SELECT ${columns} FROM "${table}"`;
    let parameters     = [];
    let index          =  1;

    
    console.log(`generating getData query for ${table}...`);


    if (filters) {

        query += ' WHERE ';

        for (let i = 0; i < filters.length; i++) {              
                  
            // filter arrays with length 2 look for strict equivalence and are parameterized
            if        (filters[i].length === 2)              {      query += `${filters[i][0]} = $${index} AND `; 
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // filter arrays with length 3 and the string 'or' at index 2 are treated the same as filter arrays with
            // length 2, but chained together with an OR.           NOTE: DO NOT REMOVE THIS TRAILING SPACE vvvv
            else if   (       filters[i][2]  === 'or'    )   {      query += `${filters[i][0]} = $${index} OR  `; 
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // else if   (       filters[i][2]  === 'sub'   )   {      query += `${filters[i][0]} = ${filters[i][1]}    `
            //                                                                          //Don't remove these spaces ^^^^
            //                                                  }
            // other filter arrays with length three and a string at index 2 pass in the string in lieu of =
            else if   (typeof(filters[i][2]) === 'string')   {      query += `${filters[i][0]} ${filters[i][2]} $${index} AND `; 
                                                                    parameters.push(filters[i][1]);
                                                                    index += 1;          
                                                             }
            // other filter arrays with length three are assumed to have numbners at index 1 and 2 which will be treated
            // as upper and lower limits for the range being queired.                                            
            else if   (filters[i].length === 3)              {      query += `${filters[i][0]} > $${index}   AND `+
                                                                             `${filters[i][0]} < $${index+1} AND `;  
                                                                    parameters.push(parseInt(filters[i][1]), parseInt(filters[i][2]));
                                                                    index += 2;                                                          
                                                             } 
            else                                             {      continue;      }
        }
        query = query.slice(0,-4);
    }

    
    // the following three if statements handle any extrap properties passed in the request body's option object, if present.
    if (groupBy) {                                query += ` GROUP BY ${groupBy}`;
                 }
    if (orderBy) { typeof(orderBy) === 'string' ? query += ` ORDER BY ${orderBy} DESC`
                                                : query += ` ORDER BY ${orderBy[0]} ASC`;
                 }
    if (limit)   {                                query += ` LIMIT ${limit}`; 
                 }
    

    console.log(`query: ${query}\n`);

    
    return simpleQuery(response, query, parameters);
}






// deletes data from a table and re-ranks the remaining data if the table has a rank column.
const deleteData = (request, response) => {

    const table   = request.body[0];
    const pkName  = request.body[1];
    const id      = request.body[2];
    const rank    = request.body[3];

    const query1  = `DELETE FROM "${table}" WHERE ${pkName} =$1`;
    const query2  = `UPDATE "${table}" SET rank = rank-1 WHERE rank > $1`;

    console.log(`deleting data from ${table}...`);


    if (rank) {

        return atomicQuery(     request, 
                                response,
                              [   query1,   query2   ],
                              [ [ id ],   [ rank ]   ],
                              [],
                                'data successfully deleted'
                          );
    } else {

        return simpleQuery(response, query1, [id]);
    }
}






// re-ranks data in a table.
const reRankData = (request, response) => {


    const table       = request.body[0];
    const pkName      = request.body[1];
    const id          = request.body[2];
    const oldRank     = request.body[3];
    const newRank     = request.body[4];
    
    let parameters1   = [ oldRank, newRank ]; 
    let parameters2   = [ newRank, id      ];

    let query1 = oldRank > newRank ? `UPDATE "${table}" SET rank = rank+1 WHERE (rank < $1 AND rank >= $2)`
               : oldRank < newRank ? `UPDATE "${table}" SET rank = rank-1 WHERE (rank > $1 AND rank <= $2)`
               :                      response.status(400).send('data error (rank === newRank)');
   
    let query2 =                     `UPDATE "${table}" SET rank = $1 WHERE (${pkName} = $2)`;

    console.log(`re-ranking data in ${table}...`);


    return atomicQuery(      request, 
                             response,
                            [ query1,      query2       ],
                            [ parameters1, parameters2  ],
                            [],
                             'rank successfully updated'
                      );
} 





// adds data to a table and returns the new data if the table has a rank column.[ reqTable, cols, params, 'team_id']
async function addData (request, response) {


    let table      = request.body[0];
    let columns    = request.body[1].join(', ');
    let parameters = request.body[2];
    let returning  = request.body[3];

    let values     = parameters.map((column, index) =>'$'+(index+1)).join(', ')
    let query      = `INSERT INTO "${table}" (${columns}) VALUES (${values})`;

    if (returning) { query+=' RETURNING '+returning; }

    console.log(`adding data to ${table}...`);

    
        simpleQuery(response, query, parameters);
}






const updateData = (request, response) => {     console.log('update function called'); console.log(request.body);

    
    const table      = request.body[0];
    const columns    = request.body[1];
    const parameters = request.body[2];
    const conditions = request.body[3];
    
    
    // intializes query string
    let query = 'UPDATE '+table+' SET ';


    // adds columns to query string
    for (let i = 0; i < columns.length; i++) {

        let value = i + 1;
        
        query += columns[i]+' = $'+value+', ';
    }

    // removes trailing comma and space,
    // adds WHERE to query string.
    query = query.slice(0,-2)+' WHERE '
    

    // adds conditions to query string
    for (let i = 0; i < conditions.length; i++) {

        let value = i + 1 + columns.length;
        query += conditions[i][0]+' = $'+value+' AND ';
    }
    query = query.slice(0, -4)+';';
    
  
    // combines parameters and conditions into one array
    const values = parameters.concat(conditions.map(condition => condition[1]));            
    
    console.log(`updating data in ${table}...\n`);


    simpleQuery(response, query, values);
}


 


  
module.exports = { pool,
                   getData, 
                   addData, 
                   deleteData, 
                   reRankData,
                   updateData,
                   simpleQuery,
                   atomicQuery,
                };




