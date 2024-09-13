


// we use this to validate getData and getAdminData queries.
// for getData, we only allow access to a whitelist of tables.
// for getAdminData, we allow access to the whitelist and a graylist.
function checkTable ( request, response, next ) {


    const path  = request.path;
    const table = request.body[0];                    
    console.log(`checking table ${table} for ${path}...`)




    // geData and getAdminData requests can access these tables.
    const whitelist  =  [
                            'board',
                            'clips',
                            'faq',
                            'media',
                            'misc',
                            'reels',
                            'team',
                            'posters',
                        ];  
    
                        
    // only getAdminData requests can access these tables.                    
    const graylist  =   [
                            'performers',
                        ];   
    
    // if we don't meet muster, return an error.
    if ( 
            ( path === '/getData'      && !whitelist.includes(table)                              )
         || ( path === '/getAdminData' && !whitelist.includes(table) && !graylist.includes(table) )
    
    )    { console.log('error!!!'); return response.status(400).send('invalid table');            }   


    // otherwise, move on to the next handler.
    next();

}



module.exports = checkTable; 