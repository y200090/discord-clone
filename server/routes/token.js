const router = require('express').Router();
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        { expiresIn: '30s' }, 
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '60s' },
    );
};

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json('更新トークンがありません');
    }

    try {
        const token = await RefreshToken.findOne({ refreshToken });
        if (!token) {
            return res.status(403).json('有効でないトークンです');
        }

        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET_KEY, 
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json('有効でないトークンです');
                }

                const newAccessToken = generateAccessToken(decoded.userId);
                const newRefreshToken = generateRefreshToken(decoded.userId);

                token.refreshToken = newRefreshToken;
                await token.save();

                res.cookie('access_token', newAccessToken, {
                    httpOnly: true, 
                });
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true, 
                });

                return res.status(200).json({
                    newAccessToken
                });
            }
        );
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
