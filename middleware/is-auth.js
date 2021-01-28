const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    if(!token){
        const erro = new Error('Not authorized');
        error.statusCode=401;
        throw erro;
    }
    try {
        decodedToken = jwt.verify(token,'secretPrithwish');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};