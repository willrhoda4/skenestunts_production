





const { spawn } = require('child_process');
const   bcrypt  = require('bcrypt');



const Pool = require('pg').Pool


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'skenestunts',
                        password: 'rootUser',
                        port: 5432
                     })







const getFlicks = (request, response) => {

    console.log('getting flicks for ', request.body[0]);
    
    const getFlicks = spawn('python3', ['../../skene_stunts_py/getFlicks.py'].concat(request.body[0]));
    let   flickList = '';

    console.log('getting flicks...');

    getFlicks.stdout.on('data', function (data) {
        console.log(`Pipe data from python script => ${data}`);
        flickList += data.toString();
    })
        getFlicks.on('close', (code) => {
        
            console.log(flickList);
            response.send(JSON.parse(flickList));
        })
}

const getPoster = (request, response) => {

    const getPoster = spawn('python3', ['../../skene_stunts_py/getPoster.py', request.body[0]]);
    let   posterData = '';
    
    console.log('getting poster...', request.body[0]);
    
    getPoster.stdout.on('data', function (data) {

        console.log(`Pipe data from python script => ${data} ${typeof(data)}, ${data.keys}`);

        posterData += data.toString();
    })

    getPoster.on('close', (code) => {
        
        posterData  = JSON.parse(posterData.replace(/'/g, '"'));
        const query = 'INSERT INTO posters (title, imdb_id, image_url) VALUES ($1, $2, $3)';
        
                                          pool.query(query, posterData, (err, res) => {
                                            if (err) { console.log(err.stack);  response.send(err.message).status(400)    }  
                                            else     { console.log(res);        response.send(posterData)                 }

                                        })
        
    })
}



const getData = (request, response) => {

    console.log(request.body);

    let   table        = request.body[0];
    let   filters      = request.body[1];
    
    let columns, limit, orderBy, groupBy;
    
    if (request.body[2])  {( { 
                                orderBy,
                                limit,
                                groupBy,
                                columns    } = request.body[2]
                          )}
          
   
    let query          = !columns ? `SELECT *          FROM ${table}`
                                  : `SELECT ${columns} FROM ${table}`;
    let parameters     = [];
    let index          =  1;


    if (filters) {

        query += ' WHERE ';

        for (let i = 0; i < filters.length; i++) {              
                                                            
            if        (filters[i].length === 2)              {      query += `${filters[i][0]} = $${index} AND `; 
                                                                    parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
                                                                    index += 1;          
                                                             }
            else if   (       filters[i][2]  === 'sub'   )   {      query += `${filters[i][0]} = ${filters[i][1]}    `
                                                                                     //Don't remove these spaces ^^^^
                                                             }
            else if   (typeof(filters[i][2]) === 'string')   {      query += `${filters[i][0]} ${filters[i][2]} $${index} AND `; 
                                                                    parameters.push(filters[i][1]); console.log(typeof(filters[i][1]));
                                                                    index += 1;          
                                                             }
            else if   (filters[i].length === 3)              {      query += `${filters[i][0]} > $${index}   AND `+
                                                                             `${filters[i][0]} < $${index+1} AND `;  
                                                                    parameters.push(parseInt(filters[i][1]), parseInt(filters[i][2]));
                                                                    index += 2;                                                          
                                                             } 
            else                                             {      continue;      }
        }
        query = query.slice(0,-4);
    }

    if (groupBy) {                                query += ` GROUP BY ${groupBy}`;
                 }
    if (orderBy) { typeof(orderBy) === 'string' ? query += ` ORDER BY ${orderBy} DESC`
                                                : query += ` ORDER BY ${orderBy[0]} ASC`;
                 }
    if (limit)   {                                query += ` LIMIT ${limit}`; 
                 }
    

    console.log('parameter => ', parameters[0]);
    console.log(query, `\n`, parameters);
    
    pool.query(query, parameters, (err, res) => {
            if (!err) { console.log(res.rows);    response.send(res.rows);    }
            else      { console.log(err.message); response.send(err.message); }
        })
}


const deleteData = (request, response) => {

    const table  = request.body[0];
    const pkName = request.body[1];
    const id     = request.body[2];
    const rank   = request.body[3];

    const deleteQuery  = `DELETE FROM ${table} WHERE ${pkName} =$1`;
    const cleanUpQuery = `UPDATE ${table} SET rank = rank-1 WHERE rank > $1`;

    if (rank) {

        pool.query(deleteQuery, [id], (err, res) => {
            if (err) { console.log(err.message); response.send(err.message);      }
            else     { pool.query(cleanUpQuery, [rank], (err, res) => {
                if (!err) { console.log(res);         response.send(res);         }
                else      { console.log(err.message); response.send(err.message); }
            })}
        })
    } else {

        pool.query(deleteQuery, [id], (err, res) => {
            if (err) { console.log(err.message); response.send(err.message); }
            else     { console.log(res);         response.send(res);         }
        })
    }
}


const reRankData = (request, response) => {

    const table       = request.body[0];
    const pkName      = request.body[1];
    const id          = request.body[2];
    const oldRank     = request.body[3];
    const newRank     = request.body[4];
    
    let parameters1   = [ oldRank, newRank ]; 
    let parameters2   = [ newRank, id      ];

    let query1;
      oldRank > newRank ? query1 = `UPDATE ${table} SET rank = rank+1 WHERE rank < $1 AND rank >= $2`
    : oldRank < newRank ? query1 = `UPDATE ${table} SET rank = rank-1 WHERE rank > $1 AND rank <= $2`
    :                               response.status(400).send('data error (rank === newRank)');
   
    let query2                   = `UPDATE ${table} SET rank = $1 WHERE ${pkName} = $2`;
    


    pool.query(query1, parameters1, (err, res) => {
        if  (err)  { console.log('query1error: ', err.message); response.send(err.message); }
        else       { console.log('check1');
                    pool.query(query2, parameters2, (err, res) => {
                        if  (err)  { console.log('query2error: ', err.message); response.send(err.message); }
                        else       { console.log('check2', res.rows);    response.send(res.rows);    }
                    })}
    })

} 

async function addData (request, response) {


    let table      = request.body[0];
    let columns    = request.body[1].join(', ');
    let parameters = request.body[2];
    let returning  = request.body[3];

    let values     = parameters.map((column, index) =>'$'+(index+1)).join(', ')
    let query      = 'INSERT INTO '+table+' ('+columns+') VALUES ('+values+')';

    if (returning) { query = query+' RETURNING '+returning; }

        pool.query(query, parameters, (err, res) => {
            if (err) { console.log(err.stack);  response.send(err.message)  } 
            else     {                          response.send(res.rows)     }
        })
}


async function logPassword (request, response) {

    let table       = request.body[0];
    let fkKeyValue  = request.body[1];
    let password    = request.body[2];
    
    let hashedPass  = await bcrypt.hash(password, 10);
    let parameters  = [ fkKeyValue[1], hashedPass ];
    let query       = 'INSERT INTO '+table+' ('+fkKeyValue[0]+', password) VALUES ($1, $2)';

    pool.query(query, parameters, (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message)  } 
        else     {                          response.send(res.rows)     }
    })

}

const updateData = (request, response) => {
    console.log('updating...');
    
    let table      = request.body[0];
    let columns    = request.body[1];
    let parameters = request.body[2];
    let pkKeyValue = request.body[3];
    let query      = 'UPDATE '+table+' SET ';
   
    console.log(columns.length, parameters.length)
    console.log(request.body)

    for (let i = 0; i < columns.length; i++) {
        let value = i +1;
        query += columns[i]+' = $'+value+', ';
    }
    query = query.slice(0,-2)+' WHERE '+pkKeyValue[0]+' = $'+(columns.length+1);
    console.log(query);
    console.log([].concat(parameters, pkKeyValue[1]))

    pool.query(query, [].concat(parameters, pkKeyValue[1]), (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message)  } 
        else     { console.log('rowcount => ',res.rowCount); console.log(res);        response.send(res)     }
    })
}


const getPosterList = (request, response) => {

    pool.query(`SELECT * FROM posters WHERE image_url <> 'no poster' ORDER BY title ASC`, (err, res) => {
            if (!err) { console.log(res.rows);    response.send(res.rows);    }
            else      { console.log(err.message); response.send(err.message); }
        })
}


const getPostersByLetter = (request, response) => {

    console.log(request.body);
    const letter = request.body[0]+'%';

    pool.query(`SELECT * FROM posters WHERE title LIKE $1 ORDER BY title ASC`, [letter], (err, res) => {
            if (!err) { console.log(res.rows);    response.send(res.rows);    }
            else      { console.log(err.message); response.send(err.message); }
        })
}



const checkPassword = (request, response) => {

    let table          = request.body[0];
    let pkKeyValue     = request.body[1];
    let password       = request.body[2];
    let query          = `SELECT * FROM `+table+` WHERE `+pkKeyValue[0]+` = $1`
    
    console.log(query); 
    pool.query(query, [pkKeyValue[1]], async (err, res) => {

        if (err)   { console.log(err.message); return response.status(400).send(err.message); }
        else       { 
            console.log('query for ',pkKeyValue[1],' => ',res.rows)

            if (res.rows.length === 0) { return response.status(400).send('database error'); }

            let stashedPass = res.rows[0].password; console.log('stashed pass => '+stashedPass); console.log('password => ', password);
            
            let match = await bcrypt.compare(password, stashedPass);

            console.log('match => ', match);

            if (match) {  console.log('MATCH!');   response.send('password matches');   }   
            else       {  console.log('no match'); response.send('no match');           }  

             
        }
    })
}



const registerReset = (request, response) => {

    let id     = request.body.resetId;
    let fk     = request.body.fk;
    let table  = request.body.pwTable;
    let token  = response.locals.resetToken;
    let query  = `UPDATE ${table} SET token = $1, reset_at = $2 WHERE ${fk} = $3`;

    pool.query(query, [ token, Date.now(), id ], (err, res) => {

            if (err) { console.log(err.stack);  response.status(400).send(err.message)  } 
            else     {                          response.send('reset re-registered')    }
    })

}

const resetPassword = async (request, response) => {

    console.log('resetFunction\n'+request.body);
    
    let id         =  request.body[0];
    let newPass    =  request.body[1];
    let table      =  request.body[2];
    let fk         =  request.body[3];
    let hashedPass =  await bcrypt.hash(newPass, 10);
    let query      = `UPDATE ${table} SET password = $1 WHERE ${fk} = $2`


    pool.query(query, [hashedPass, id], (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message)           } 
        else     { console.log(res);        response.send('password reset')      }
    })
}


const newPasswordLogin = (request, response) => {

    let table = request.body[0];
    let idKey = request.body[1];
    let id    = request.body[2];

    let query = `SELECT * FROM ${table} WHERE ${idKey} = $1`

    pool.query(query, [id], (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message);  } 
        else     { console.log(res);        response.send(res.rows);     }
    })
}


  
module.exports = { getData, 
                   addData, 
                   getFlicks, 
                   getPoster, 
                   deleteData, 
                   reRankData, 
                   updateData, 
                   logPassword,
                   getPosterList, 
                   checkPassword, 
                   registerReset,
                   resetPassword,
                   newPasswordLogin,
                   getPostersByLetter, 
                };





