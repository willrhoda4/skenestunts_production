







const { spawn }       = require('child_process');
const   Pool          = require('pg').Pool
const { simpleQuery } = require('./database');


const pool = new Pool({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'skenestunts',
                        password: 'rootUser',
                        port: 5432
                     })






// accept array of IMDB ids for Skene Stunts team and leverages Python child script
// to retrieve comprehensiver list of flicks from IMDB and return them to the client.
const getFlicks = (request, response) => {

    console.log('getting flicks for ', request.body[0]);
    
    const getFlicks = spawn('python3', [process.env.GET_FLICKS].concat(request.body[0]));
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




// after getFlicks successfully does its thing, the return data is compared against the database
// and this function is called iteratively to fetch the poster data for any new movies and store it in database. 
const getPoster = (request, response) => {

    const getPoster = spawn('python3', [process.env.GET_POSTER, request.body[0]]);
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



// scoops up all the data for movies that have a valid poster image_url
// and returns it to the client in alphabetic order.
// a workhorse primarily employed by poster dropdowns for team and board forms.
const getPosterList = (request, response) => {

    pool.query(`SELECT * FROM posters WHERE image_url <> 'no poster' ORDER BY title ASC`, (err, res) => {
            if (!err) { console.log(res.rows);    response.send(res.rows);    }
            else      { console.log(err.message); response.send(err.message); }
        })
}



// rounds up all the data for movies that begin with a given letter.
// a mercenary for the poster barn.
const getPostersByLetter = (request, response) => {

    console.log(request.body);
    const letter = request.body[0]+'%';

    pool.query(`SELECT * FROM posters WHERE title LIKE $1 ORDER BY title ASC`, [letter], (err, res) => {
            if (!err) { console.log(res.rows);    response.send(res.rows);    }
            else      { console.log(err.message); response.send(err.message); }
        })
}


// accepts an array of poster_id's for a team or board member and returns the corresponding poster data.
const getDoublesPosters = (request, response) => {

    const table  = request.body[0];
    const column = request.body[1];
    const ids    = request.body[2].filter( id => id.length > 0 );

    // if ids filter request.body[2] all the way down to zero, 
    // they haven't selected any posters and we can just return an empty array.
    if ( ids.length === 0 ) return response.send([]);

    const idsList = ids.join(', ');

    const cases  = ids.map( (id, index) => `WHEN ${id} THEN ${index+1}`).join(' ');

    let   query  = `       SELECT       * 
                             FROM  ${  table    } 
                            WHERE  ${  column   } 
                               IN (${  idsList  })
                    ORDER BY CASE  ${  column   }
                        ${ cases }
                    END;
                    ` 

    return simpleQuery(response, query);

}




  
module.exports = {
                    getFlicks, 
                    getPoster, 
                    getPosterList, 
                    getDoublesPosters,
                    getPostersByLetter, 
                 };
