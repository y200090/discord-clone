const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json('アクセストークンがありません');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json('有効なトークンではありません');
        }
        
        req.user = user;
        next();
    })
}

module.exports = verify;
