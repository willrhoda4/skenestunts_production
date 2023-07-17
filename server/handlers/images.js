







const   fs            = require('fs')
const { google }      = require('googleapis');
const   path          = require('path');


// use a Heroku config variable to dynamically generate some .json

// retrieve Google credentials from Heroku config variable to generate a json keyfile.
const keyFileContent = process.env.GDRIVE_CREDENTIALS;
const keyFile        = path.join(__dirname, 'service-account-key.json');
                       fs.writeFileSync(keyFile, keyFileContent);




// use .json to initiate driveService 
const   scopes        = ['https://www.googleapis.com/auth/drive', 'profile'];
const   auth          = new google.auth.GoogleAuth({ keyFile,  scopes });
const   driveService  = google.drive({version: 'v3', auth});




// receives performer headshot and deposits it in google drive
async function headshot (req, res, next) {

        
    console.log(`uploading headshot for ${res.locals.performerName}`);
    res.locals.performerName = req.body.name;
    
    
    const fileMetaData = {
        'name': res.locals.performerName+'_HEADSHOT',
        'parents': [process.env.PERFORMER_IMAGES]
    };
    

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.files['headshot'][0].path)
    };
    

    driveService.files.create(      {           
                                        resource: fileMetaData,
                                        media,
                                        fields: 'id'
                                    }
                          )
                     .then(_res =>  {    
                                         
                                        res.locals.headshotId = _res.data.id;

                                        fs.unlink(req.files.headshot[0].path, (err) => { 
                                            
                                            if (err) {      console.error(err);
                                                            res.status(400).send(err);
                                                     }  
                                            else     {      console.log(`headshot deposited.`);
                                                            next();
                                                     }               
                                        })
                                    }
                          )
                    .catch(err =>   {                       console.log(err); res.status(400);  }   )
    
}




// receives performer bodyshot and deposits it in google drive
async function bodyshot (req, res) {
        

    console.log(`uploading bodyshot for ${res.locals.performerName}`);


    const fileMetaData = {
        'name': res.locals.performerName+'_BODYSHOT',
        'parents': [ process.env.PERFORMER_IMAGES ]
    };
    

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.files['bodyshot'][0].path)
    };
    
    
    driveService.files.create(          {      
                                            resource: fileMetaData,
                                            media,
                                            fields: 'id'
                                        }
                             )
                        .then(_res =>   {          
                                            res.locals.bodyshotId = _res.data.id;

                                            fs.unlink(req.files.bodyshot[0].path, (err) => { 
                                                
                                                if (err) {      console.error(err);
                                                                res.status(400).send(err);
                                                         }  
                                                else     {      console.log(`bodyshot deposited.`);
                                                                res.send([res.locals.headshotId, res.locals.bodyshotId]);
                                                         }               
                                            })
                                        }
                              )
                        .catch(err =>   {                       console.log(err); res.status(400);  }   )
}






// receives teamshot and deposits it in google drive
async function teamshot (req, res) {


    console.log(`uploading teamshot for ${req.body.name}...`);
    console.log(req.file);

    
    let id;


    const fileMetaData = {
        'name': req.body.name+'_PROFILE_PHOTO',
        'parents': [ process.env.TEAM_IMAGES ]
    };
    

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path)
    };
    

    driveService.files.create(          {      
                                            resource: fileMetaData,
                                            media,
                                            fields: 'id'
                                        }
                                    )
                        .then(_res =>   {          
                                            id = _res.data.id

                                            fs.unlink(req.files.bodyshot[0].path, (err) => { 
                                                
                                                if (err) {      console.error(err);
                                                                res.status(400).send(err);
                                                         }  
                                                else     {      console.log(`teamshot deposited.`);
                                                                res.send(id);
                                                         }               
                                            })
                                        }
                                    )
                        .catch( err =>  {                       console.log(err); res.status(400);  }   )
}






// receives background and deposits it in google drive
async function background (req, res) {


    console.log('uploading background...');
    console.log(req.file);
  

    let id;


    const fileMetaData = {
        'name':     'header_background',
        'parents': [ process.env.BACKGROUND_IMAGES ]
    };
    

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path)
    };


    driveService.files.create(          {           
                                            resource: fileMetaData,
                                            media,
                                            fields: 'id'
                                        }
                             )
                        .then(_res =>   {   
                                            id = _res.data.id;
                                            fs.unlink(req.file.path, (err) => { 
                                                
                                                if (err) {  console.error(err);
                                                            res.status(400).send(err);
                                                         }  
                                                else     {  console.log('background successfully updated.');
                                                            res.send(id);
                                                         }
                                            });
                                        }
                             )
                       .catch( err  =>  {   console.log(err); res.status(400); }  )
}





module.exports = { headshot, bodyshot, teamshot, background };

