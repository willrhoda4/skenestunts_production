





const crypto = require('crypto');








function authorizeGitHub ( req, res, next ) {


    // extract the authorization header from the incoming request
    const token = req.headers['authorization'];

    console.log('auhorizing github token: ', token);

    // if the token is missing, respond with a 401 Unauthorized error
    if ( !token ) return res.status(401).json( { message: 'Access denied. No token provided.' } );

    // split the authorization header into the scheme and the token itself (e.g., "Bearer <token>")
    const [ scheme, credentials ] = token.split(' ');

    // if the token scheme is not "Bearer", respond with a 400 Bad Request error
    if ( scheme !== 'Bearer' ) return res.status(400).json( { message: 'Invalid token format.' } );

    // use Buffer objects to securely compare the provided token and the expected token from the environment
    const expectedToken    = Buffer.from(process.env.GITHUB_TOKEN); // expected token (from .env)
    const receivedToken    = Buffer.from(credentials);              // provided token (from the request)
    
    const validToken       = expectedToken.length === receivedToken.length &&
                             crypto.timingSafeEqual( expectedToken, receivedToken );


    // if the tokens match, continue to the next middleware or route handler
    if (validToken) return next();  

    // if the tokens do not match, respond with a 401 Unauthorized error
    return res.status(401).json( { message: 'Invalid token.' } );

}

module.exports = authorizeGitHub;
