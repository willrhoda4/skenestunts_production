






const   axios          = require("axios");
const { pool         } = require("./database"); 

const { emailHandler } = require("./email"); 




// handler function to refresh the Instagram token
// it's triggered by a GitHub action every 50 days.
// if it throws an error, it sends an email notification.
// (allowing 10 days for a fix)
async function refreshInstagram ( req, res ) { 


    try {


        console.log("starting refresh process for Instagram...");



        // fetch the current Instagram token from the database
        const { rows }     = await pool.query("SELECT value FROM misc WHERE description = $1", ["insta_token"]);
        const currentToken = rows[0]?.value;

        if (!currentToken) throw new Error("Instagram token not found in the database.");
    
        console.log("current token fetched from DB:", currentToken);




        // call the Meta API to refresh the token
        const metaApiUrl  = "https://graph.instagram.com/refresh_access_token";
        const response    = await axios.get( metaApiUrl, {
                                                            params: {
                                                                        grant_type:  "ig_refresh_token",
                                                                        access_token: currentToken,
                                                                    },
                                                         } );

        const newToken    = response.data.access_token;

        if (!newToken) throw new Error("failed to retrieve a new token from Meta API.");
        
        console.log("new token retrieved from Meta API:", newToken);




        // update the token in the database
        const updateResult = await pool.query( 
                                                "UPDATE misc SET value = $1, active = TRUE WHERE description = $2", 
                                                [ newToken, "insta_token" ]
                                             );

        if (updateResult.rowCount === 0) throw new Error("failed to update the Instagram token in the database.");
        
        console.log("token successfully updated in the database.");
        
        res.json({ success: true, message: "token refreshed and updated successfully." });
   
   
    } catch (error) {

        console.error("error during token refresh:", error.message);

        // send an email notification for failure
        const emailData = {
            type:    "errorNotification",
            subject: "Skene Stunts Instagram Refresh Failed",
            message: `An error occurred while refreshing the Instagram token: ${error.message}`,
            email:   "willrhoda4@gmail.com",
        };

        try                { await emailHandler({ body: emailData }, res);                                  } 
        catch (emailError) { console.error("Failed to send error notification email:", emailError.message); }

        res.status(500).json( { success: false, message: "Token refresh failed.", error: error.message } );
    }
};

module.exports = { refreshInstagram };