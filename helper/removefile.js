const fs = require('fs');
const path = require('path');

exports.removeFile=(filepath)=>{
    filepath = path.join(__dirname,'..',filepath);
    return fs.unlink(filepath,(err)=>{
        if(err){
            throw new Error('unable to Delete the file')
        }
    })
}