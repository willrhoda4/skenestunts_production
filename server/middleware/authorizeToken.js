





const jwt = require('jsonwebtoken');



// higher-order function that returns an authorization middleware function.
function authorizeToken(role) {


    // define roles and their hierarchy
    const roles = {
        performer:  1,
        team:       2,
        board:      3,
        admin:      4,
    };

    // return the middleware function
    return function(req, res, next) {
        
        // extract the JWT from the cookies
        const token = req.cookies.jwt;

        // if there's no token, deny access
        if (!token) return res.status(401).json( { message: 'Access denied. No token provided.' } );

        try {
            
            // verify the token using the secret key from the .env file
            const decoded = jwt.verify( token, process.env.JWT_SECRET );

            // check if the provided role is valid
            if ( !roles[ role ] ) return res.status(400).json({ message: 'Invalid role specified.' });

            // if role is sufficient, pass control to the next middleware or route handler
            if ( roles[ decoded.role ] >= roles[ role ] ) return next(); 
            
            // else we can assume they have an insufficient role
            return res.status(403).json( { message: 'Forbidden. Insufficient permissions.' } );
        
        } catch (err) {
        
            // if the token verification fails, deny access
            return res.status(401).json( { message: 'Invalid token.' } );
        }
    };
}



module.exports = authorizeToken;
