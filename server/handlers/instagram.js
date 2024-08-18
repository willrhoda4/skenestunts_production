





// updates the Instagram token value in the database
async function updateToken ( req, res ) {
    
    
    const { nuToken } = req.body;

    try             {

                        const updateQuery = `UPDATE misc SET value = $1 WHERE description = 'insta_token'`;
                        await pool.query( updateQuery, [ nuToken ] );
                        res.status( 200 ).json( { message: 'Instagram token updated successfully' } );

                    } 
    catch ( error ) {
                        console.error( 'Error updating Instagram token:', error );
                        res.status( 500 ).json( { message: 'Error updating Instagram token' } );
                    }
};



module.exports = updateToken; 