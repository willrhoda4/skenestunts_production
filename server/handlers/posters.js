







const { pool }        = require('./database');
const { simpleQuery } = require('./database');











// logs a new poster in the database once its particulars
// are returned by the poster_gopher
const newPoster = (request, response) => {


    const posterData = request.body;
    const query      = 'INSERT INTO posters (title, imdb_id, image_url) VALUES ($1, $2, $3)';

    
    console.log(`Adding a poster for ${posterData[0]} to the database...\n`)

        
    pool.query(query, posterData, (err, res) => {
        if (err) { console.log(err.stack);  response.send(err.message).status(400)    }  
        else     { console.log(res);        response.send(posterData)                 }

    })
        


}




// logs an array of new posters in the database amd returns a summary to the client.
// we were unable to get this to work with the poster_gopher, due to rate limiting by IMDb.
const newPosters = (request, response) => {

    // Get the array of poster data from the request body
    const posterDataArray = request.body;

    // Initialize an array to store result messages
    const resultMessages = [];
  
    // Define the SQL query template
    const query = 'INSERT INTO posters (title, imdb_id, image_url) VALUES ($1, $2, $3)';
  
    // Use a loop to process each poster data item in the array
    for (const posterData of posterDataArray) {
      console.log(`Adding a poster for ${posterData[0]} to the database...\n`);
  
      // Execute the query for each poster data item
      pool.query(query, posterData, (err, res) => {

        if (err) {

          console.error(err.stack);
          // If there's an error, create an error message
          resultMessages.push(`There was an error adding ${posterData[0]} to the database: ${err.message}`);
        } else {

          console.log(res);

          // If successful, check if the poster URL is 'no poster' and add an appropriate message
          if (posterData[2] === 'no poster') {
            resultMessages.push(`Found no poster for ${posterData[0]}.`);
          } else {
            resultMessages.push(`Successfully added ${posterData[0]} to the database.`);
          }
        }
  
        // Check if all poster data items have been processed
        if (resultMessages.length === posterDataArray.length) {
          // Send the result messages as a single string to the client
          response.send(resultMessages.join(' '));
        }
      });
    }
  };
  
  





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

    // build an SQL IN clause with placeholders for the id values,
    const idsList = ids.join(', ');
    
    // then use a CASE statement to assign a rank to each id.
    // this ensures that posters are returned in the order they were selected.
    const cases  = ids.map( (id, index) => `WHEN ${id} THEN ${index+1}`).join(' ');

    let   query  = `       SELECT       * 
                             FROM  ${  table    } 
                            WHERE  ${  column   } 
                               IN (${  idsList  })
                    ORDER BY CASE  ${  column   }
                                   ${  cases    }
                    END;
                    ` 

    return simpleQuery(response, query);

}




  
module.exports = {
                    newPoster,
                    newPosters,
                    // getFlicks, 
                    // getPoster, 
                    getPosterList, 
                    getDoublesPosters,
                    getPostersByLetter, 
                 };
