






// this middleware checks if the email type is valid for the path it is being used in.
// its main purpose is to prevent the use of the reachingOut() function by bad actors
// manipulating the /email endpoint.
function checkEmailType ( req, res, next ) {

    
    const path            =     req.path;

    const type            =     req.body.type;

    const validTypes      =  [ 'userEmail', 'producerEmail',  'resetEmail' ];
 
    const restrictedTypes =  [ 'reachingOut',                              ];

    const acceptable      =  (  path === '/email'      && validTypes.includes(      type ) ) 
                          || (  path === '/adminEmail' && restrictedTypes.includes( type ) );



    if ( !acceptable ) return res.status(400).send('Invalid email type');

    return next();
}

module.exports = checkEmailType;