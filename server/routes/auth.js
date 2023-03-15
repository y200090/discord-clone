const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const verify = require('../middleware/verify');

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id }, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        { expiresIn: '1m' },
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id }, 
        process.env.REFRESH_TOKEN_SECRET_KEY, 
        { expiresIn: '1d' },
    );
};

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usedEmail = await User.findOne({ email }).exec();
        if (usedEmail) {
            return res.status(400).json('このメールアドレスは既に使われています');
        }
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            email, 
            password: hashedPassword,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await RefreshToken.create({
            userId: user.id, 
            refreshToken, 
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true, 
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true, 
        });

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/setupprofile', async (req, res) => {

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json('ユーザーが存在しません');
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return res.status(401).json('パスワードが間違っています');
        }

        if (user && validatePassword) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            const token = await RefreshToken.findOne({ userId: user.id }).exec();
            if (!token) {
                await RefreshToken.create({
                    userId: user.id, 
                    refreshToken 
                });

            } else {
                token.refreshToken = refreshToken;
                await token.save();
            }
            

            res.cookie('access_token', accessToken, {
                httpOnly: true, 
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true, 
            });

            return res.status(200).json(user);
        }
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/logout', verify, async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    try {
        const token = await RefreshToken.findOne({ refreshToken }).exec();
        if (token) {
            await token.remove();
        }
        
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/refreshtoken', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json('更新トークンがありません');
    }
    console.log(refreshToken)

    try {
        const token = await RefreshToken.findOne({ refreshToken }).exec();
        if (!token) {
            return res.status(403).json('トークンが見つかりません');
        }

        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET_KEY, 
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json('有効でないトークンです');
                }

                const newAccessToken = generateAccessToken(decoded);
                const newRefreshToken = generateRefreshToken(decoded);

                token.refreshToken = newRefreshToken;
                await token.save();

                res.cookie('access_token', newAccessToken, {
                    httpOnly: true, 
                });
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true, 
                });

                return res.status(200).json({'res': 'トークンを更新しました'});
            }
        );
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
