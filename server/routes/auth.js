const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const verify = require('../middleware/verify');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        { expiresIn: '30m' },
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.REFRESH_TOKEN_SECRET_KEY, 
        { expiresIn: '1h' },
    );
};

// const loggedInOptions = {
//     httpOnly: false,
//     expires: new Date(Date.now() + 3600000 * 0.5),
// };

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const usedEmail = await User.findOne({ email });
        if (usedEmail) {
            return res.status(400).json('このメールアドレスは既に使われています');
        }

        let randomNumber;
        let tag = '#';
        for (let i = 0; i < 4; i++) {
            randomNumber = Math.floor(Math.random() * 10);
            tag += randomNumber;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const colorCode = '#' + Math.random().toString(16).slice(-6);
        
        const user = await User.create({
            tag: username + tag,
            email, 
            password: hashedPassword,
            displayName: username,
            color: colorCode,
        });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await RefreshToken.create({
            userId: user._id, 
            refreshToken, 
        });
        
        const secure = req.secure ? true : false;
        const sameSite = secure ? 'None' : 'Lax';

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 0.5,
            domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
            sameSite,
            secure,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true, 
            maxAge: 60 * 60 * 1000,
            domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
            sameSite,
            secure,
        });
        res.cookie('logged_in', true, {
            httpOnly: false,
            maxAge: 60 * 60 * 1000 * 0.5,
            domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
            sameSite,
            secure,
            // expires: new Date(Date.now() + 3600000 * 0.5), // 30分
            // expires: new Date(Date.now() + 60000), // 1分
        });

        return res.status(200).json({ user, accessToken });
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate(['friends', 'setDirectMessages', 'joinedServers']);
        if (!user) {
            return res.status(401).json('ログインまたはパスワードが無効です。');
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return res.status(401).json('ログインまたはパスワードが無効です。');
        }

        if (user && validatePassword) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            const token = await RefreshToken.findOne({ userId: user._id });
            if (!token) {
                await RefreshToken.create({
                    userId: user._id, 
                    refreshToken 
                });

            } else {
                token.refreshToken = refreshToken;
                await token.save();
            }
            
            const secure = req.secure ? true : false;
            const sameSite = secure ? 'None' : 'Lax';
            
            res.cookie('access_token', accessToken, {
                httpOnly: true, 
                maxAge: 60 * 60 * 1000 * 0.5,
                domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                sameSite,
                secure,
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true, 
                maxAge: 60 * 60 * 1000,
                domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                sameSite,
                secure,
            });
            res.cookie('logged_in', true, {
                httpOnly: false,
                maxAge: 60 * 60 * 1000 * 0.5,
                domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                sameSite,
                secure,
                // expires: new Date(Date.now() + 3600000 * 0.5), // 30分
                // expires: new Date(Date.now() + 60000), // 1分
            });

            return res.status(200).json({ user, accessToken });
        }
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    
    try {
        const token = await RefreshToken.findOne({ refreshToken });
        if (token) {
            await token.deleteOne();
        }
        
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('logged_in');

        return res.status(200).json('ログアウトしました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/confirm/token', verify, async (req, res) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(400).json('アクセストークンが有効ではありません');
    }
    return res.status(200).json(accessToken);
});

router.post('/refresh/token', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(401).json('更新トークンがありません');
    }

    try {
        const token = await RefreshToken.findOne({ refreshToken });
        if (!token) {
            return res.status(401).json('トークン情報が見あたりません');
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
                
                const secure = req.secure ? true : false;
                const sameSite = secure ? 'None' : 'Lax';

                res.cookie('access_token', newAccessToken, {
                    httpOnly: true, 
                    maxAge: 60 * 60 * 1000 * 0.5,
                    domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                    sameSite,
                    secure,
                });
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true, 
                    maxAge: 60 * 60 * 1000,
                    domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                    sameSite,
                    secure,
                });
                res.cookie('logged_in', true, {
                    httpOnly: false,
                    maxAge: 60 * 60 * 1000 * 0.5,
                    domain: process.env.CLIENT_APP_URL.replace(/^https?:\/\//i, ""),
                    sameSite,
                    secure,
                    // expires: new Date(Date.now() + 3600000 * 0.5), // 30分
                    // expires: new Date(Date.now() + 60000), // 1分
                });

                return res.status(200).json({ 
                    accessToken: newAccessToken 
                });
            }
        );
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
