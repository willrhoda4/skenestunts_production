







const   fs            = require('fs')
const { google }      = require('googleapis');
const   path          = require('path');

  
const   keyFile       = process.env.GDRIVE_CREDENTIALS;
const   scopes        = ['https://www.googleapis.com/auth/drive', 'profile'];
const   auth          = new google.auth.GoogleAuth({ keyFile,  scopes });
const   driveService  = google.drive({version: 'v3', auth});




// receives performer headshot and deposits it in google drive
async function headshot (req, res, next) {
        
    console.log(req.body);
    res.locals.performerName = req.body.name;
    
    
    const fileMetaData = {
        'name': res.locals.performerName+'_HEADSHOT',
        'parents': [process.env.PERFORMER_IMAGES]
    };
    
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path.join(req.files['headshot'][0].filename))
    };
    
    driveService.files.create({           resource: fileMetaData,
                                          media,
                                          fields: 'id'
                    }).then(_res => {     console.log(res.locals.performerName, ' headshot deposited'); 
                                          console.log(_res.data);
                                          res.locals.headshotId = _res.data.id;
                                          next();
                                          fs.unlink(req.files.headshot[0].path,  (err) => { if (err) res.status(400); });                
                    }).catch(err => {     console.log(err); res.status(400);})
    
}




// receives performer bodyshot and deposits it in google drive
async function bodyshot (req, res) {
        
    console.log('headshot still here??? => '+res.locals.headshotId)

    const fileMetaData = {
        'name': res.locals.performerName+'_BODYSHOT',
        'parents': [ process.env.PERFORMER_IMAGES ]
    };
    
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path.join(req.files['bodyshot'][0].filename))
    };
    
    driveService.files.create({           resource: fileMetaData,
                                          media,
                                          fields: 'id'
                    }).then(_res => {     console.log(res.locals.performerName, ' bodyshot deposited')
                                          console.log(_res.data);
                                          res.locals.bodyshotId = _res.data.id;
                                          fs.unlink(req.files.bodyshot[0].path,  (err) => {   if (err) res.status(400); });
                    }).then(_res => {     console.log('code ran: '+[res.locals.headshotId, res.locals.bodyshotId]); res.send([res.locals.headshotId, res.locals.bodyshotId]); 
                    }).catch(err => {     console.log(err); res.status(400);})
}





// receives teamshot and deposits it in google drive
async function teamshot (req, res) {


    console.log('uploading teamshot...');
    console.log(req.body);
    console.log(req.file);

    
    let id;

    const fileMetaData = {
        'name': req.body.name+'_PROFILE_PHOTO',
        'parents': [ process.env.TEAM_IMAGES ]
    };
    
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path.join(req.file.path))
    };
    
    driveService.files.create({           resource: fileMetaData,
                                          media,
                                          fields: 'id'
                    }).then(_res => {     console.log('image deposited for ', req.body.name)
                                          console.log(_res.data);
                                          id = _res.data.id
                                          fs.unlink(req.file.path,  (err) => {   if (err) res.status(400); });
                    }).then(_res => {     console.log('code ran: '+ id); res.send(id); 
                    }).catch(err => {     console.log(err); res.status(400);})
}



// receives background and deposits it in google drive
async function background (req, res) {


    console.log('uploading background...');
    console.log(req.file);
    console.log('Keyfile\n',typeof keyFile, keyFile);
    console.log('Background Path =>\n', typeof req.file.path, '\n',req.file.path);


    let id;

    const fileMetaData = {
        'name':     'header_background',
        'parents': [ process.env.BACKGROUND_IMAGES ]
    };
    
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path.toString())
    };


 
    // vvvv Line 144 vvvv
    driveService.files.create({           resource: fileMetaData,
                                          media,
                                          fields: 'id'
                    }).then(_res => {     console.log('background updated')
                                          console.log(_res.data);
                                          id = _res.data.id
                                          fs.unlink(req.file.path.toString(), (err) => { if (err) {
                                                                                    console.error(err);
                                                                                    res.status(400).send(err);
                                                                          } else {
                                                                                    console.log('File deleted successfully');
                                                                                    res.send(id);
                                                                                 }
                                          });
                    }).then(_res => {     console.log('code ran: '+ id); res.send(id); 
                    }).catch(err => {     console.log(err); res.status(400);})
}





module.exports = { headshot, bodyshot, teamshot, background };

