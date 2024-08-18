



// import the jsonwebtoken package
const jwt = require('jsonwebtoken');




// authorizeToken is a middleware function that checks if a user has a valid jwt token
function authorizeToken( requiredRole ) {


    // define role hierarchy
        const roles = {
            performer:  1,
            team:       2,
            board:      3,
            admin:      4,
        };


    // return the middleware function    
    return ( req, res, next ) => {

        // get the token from the request
        const token = req.cookies.jwt;

        // if there is no token, return an error
        if ( !token ) return res.status(401).json( { message: 'Unauthorized: No token provided' } );

        // if there is a token, verify it
        jwt.verify( token, process.env.JWT_SECRET, (err, user) => {
            
            // if the token is invalid, return an error
            if ( err ) return res.status(401).json( { message: 'Unauthorized: Invalid token' } );

            // if the token is valid, check the user's role
            const userRoleLevel     = roles[ user.role    ];
            const requiredRoleLevel = roles[ requiredRole ] ;
            const insufficientJson  = { message: 'Unauthorized: Insufficient role' };

            // if the user's role is less than the required role, deny access
            if ( userRoleLevel < requiredRoleLevel ) return res.status(403).json( insufficientJson );

            // if the user's role is equal to or greater than the required role, grant access
            req.user = user;

            // call the next middleware function
            next();
        });
    };
}

module.exports = authorizeToken;