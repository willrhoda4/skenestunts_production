





// we use this to validate getData and getAdminData queries.
// for getData, we only allow access to a whitelist of tables.
// for getAdminData, we allow access to the whitelist and a graylist.   
// for password tables, we only allow access with a resetToken.
function checkTable ( request, response, next ) {


    const path       = request.path;
    const table      = request.body[0];                    
    const resetToken = request.headers['x-reset-token'];
    const validToken = process.env.RESET_TOKEN === resetToken;

    console.log(`checking table ${table} for ${path} with token  ${validToken} ${resetToken}...`)


    // geData and getAdminData requests can access these tables.
    const whitelist  =  [
        'faq',
        'misc',
        'team',
        'board',
        'clips',
        'reels',
        'media',
        'posters',
    ];  
    
                        
    // only getAdminData requests can access the performers table.                    
    const greylist  =   [
        'performers',
    ];

    
    // password tables are only accessible with a resetToken.
    const passwordTables = [
        'team_passwords',
        'board_passwords', 
        'performer_passwords', 
    ];

    // a token can be used to access password tables, and can also be used
    // to access the greylist without a jwt.
    const requiresToken = greylist.concat(passwordTables).includes(table);



    // if we don't meet muster, return an error.
    // otherwise, move on to the next handler.
    if (
           ( path === '/getData'      && whitelist.includes(table)   )
        || ( path === '/getData'      && requiresToken && validToken )
        || ( path === '/getAdminData' && greylist.includes(table)    )
       
       )   { return next();                                     } 
    else   { return response.status(400).send('invalid table'); }
}




module.exports = checkTable; 