const app = require('./index');
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const User = require('./models/User');
const Message = require('./models/Message');
const Channel = require('./models/Channel');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

// ソケット通信接続時の処理
io.on('connection', (socket) => {
    console.log('--------------------');
    console.log(`接続開始　ID: ${socket.id}`);

    // ログイン時の処理
    socket.on('online', async (currentUser) => {
        socket.user = currentUser;
        socket.join(currentUser._id);

        console.log('--------------------');
        console.log(`${currentUser?.displayName}がオンラインになりました`);

        await User.findByIdAndUpdate(currentUser._id, {
            $set: {
                online: true,
                socketId: socket.id
            }
        }, { 
            runValidators: true 
        });

        if (currentUser.online) return;

        const friendIds = currentUser.friends.map((friend) => {
            return friend._id;
        });

        if (friendIds.length) {
            io.to(friendIds).emit('new_notices', 'フレンドがオンラインになりました');
        }
    });

    socket.on('send_request', async (targetUserId) => {
        console.log(`${targetUserId}から${socket?.user?._id}へフレンド申請が届きました`);
        io.to(targetUserId).emit('update_request', 'フレンド申請が届きました');
    });

    socket.on('approve_request', (request) => {
        console.log('フレンド申請が承諾されました');
        
        io.to(`${request?.to?._id}`).to(`${request?.from?._id}`).emit('new_notices', 'フレンドが追加されました');
        io.to(`${request?.from?._id}`).emit('update_request', 'フレンドが追加されました');
    });

    socket.on('deny_request', (targetUserId) => {
        console.log('フレンド申請が拒否されました');
        io.to(targetUserId).emit('update_request', 'フレンド申請を削除しました');
    });

    socket.on('delete_friend', (friend) => {
        console.log('フレンドが削除されました');
        io.to(`${friend?._id}`).emit('new_notices', 'フレンドから削除されました');
    });

    // チャンネル入室
    socket.on('join_room', (channelId) => {
        socket.join(channelId);
        console.log('--------------------');
        console.log(`${socket?.user?.displayName}が${channelId}に入室 `, socket.rooms);
    });

    // チャンネル退出
    socket.on('leave_room', (channelId) => {
        socket.leave(channelId);
        console.log('--------------------');
        console.log(`${socket?.user?.displayName}が${channelId}から退室 `, socket.rooms);
    });

    // socket.on('create_channel', async () => {
    // })

    socket.on('send_message', async (newMessage) => {
        const channelId = newMessage?.postedChannel?._id;
        io.to(channelId).emit('sended_message', newMessage);

        // カレントユーザーを除くチャンネル参加者
        const members = newMessage?.postedChannel?.allowedUsers?.filter((member) => {
            return member?._id !== newMessage?.sender?._id;
        });
        console.log('--------------------');
        console.log('members:', members?.length);
        
        if (members?.length) {
            const memberIds = members.map((member) => {
                return member?._id;
            });
            
            console.log('--------------------');
            console.log('postedChannelId: ', channelId);

            // チャンネル滞在者
            const readUserSockets = await io.in(channelId).fetchSockets();
            console.log('--------------------');
            console.log('readUserSockets: ', readUserSockets?.length);

            if (readUserSockets?.length == (memberIds?.length + 1)) return;

            const readUserIds = readUserSockets.map((readUserSocket) => {
                return readUserSocket?.user?._id;
            });
            console.log('--------------------');
            console.log('readUserIds: ', readUserIds);

            const unreadUserIds = memberIds?.filter((memberId) => {
                return !readUserIds.includes(memberId);
            });
            console.log('--------------------');
            console.log('unreadUserIds: ', unreadUserIds);

            try {
                if (newMessage?.postedChannel?.directMessage) {
                    await User.updateMany({
                        _id: {
                            $in: memberIds
                        }
                    }, {
                        $addToSet: {
                            setDirectMessages: newMessage?.postedChannel?._id
                        }
                    });
                }

                unreadUserIds.forEach(async (unreadUserId) => {
                    await Channel.findByIdAndUpdate(newMessage?.postedChannel?._id, {
                        $push: {
                            notifications: {
                                recipient: unreadUserId,
                                content: newMessage?._id
                            }
                        }
                    }, { 
                        runValidators: true 
                    });
                });
                console.log('--------------------');
                console.log('未読ユーザーに新規メッセージを通知しました');
    
            } catch (err) {
                console.log(err);
            }

            io.to(memberIds).except(channelId).emit('new_notices', '未読メッセージがあります');
        }
    });

    // 既読チェック
    socket.on('read_messages', async ({channelId, currentUserId}) => {
        try {
            await Message.updateMany({
                postedChannel: channelId,
                readUsers: {
                    $ne: currentUserId
                }
            }, {
                $addToSet: {
                    readUsers: currentUserId
                }
            }, { 
                runValidators: true 
            });
            console.log('--------------------');
            console.log(`${channelId}の未読メッセージに既読をつけました`);

            const notice = await Channel.find({
                _id: channelId, 
                notifications: {
                    $elemMatch: {
                        recipient: currentUserId
                    }
                }
            });
            console.log('--------------------');
            console.log('notice', notice);

            if (notice.length) {
                await Channel.findByIdAndUpdate(channelId, {
                    $pull: {
                        notifications: {
                            recipient: currentUserId
                        }
                    }
                }, { 
                    multi: true 
                });
                console.log('--------------------');
                console.log('通知を消化しました');

                io.to(currentUserId).emit('new_notices', '通知を消化しました');
            }

        } catch (err) {
            console.log(err);
        }        
    });

    // // ログアウト時の処理
    // socket.on('logged_out', async () => {
    //     console.log('--------------------');
    //     console.log(`${socket.id}がログアウトしました`);
    //     socket.leave(socket?.user?._id);

    //     await User.findByIdAndUpdate(socket?.user?._id, {
    //         $set: {
    //             online: false
    //         }
    //     }, { 
    //         runValidators: true 
    //     });

    //     const friendIds = socket.user.friends.map((friend) => {
    //         return friend._id;
    //     });

    //     if (friendIds.length) {
    //         io.to(friendIds).emit('update_user', 'フレンドがオフラインになりました');
    //     }
    // });

    socket.on('disconnect', async (reason) => {
        console.log('--------------------');
        console.log('接続終了　ID: ', socket.id);
        console.log('reason: ', reason);
        
        if (socket?.user) {
            await User.findOneAndUpdate({ socketId: socket.id }, {
                $set: {
                    online: false,
                    socketId: '',
                }
            }, {
                runValidators: true,
            });

            console.log(`${socket?.user?.displayName}がオフラインになりました`);

            const friendIds = socket?.user?.friends.map((friend) => {
                return friend?._id;
            });

            if (friendIds?.length) {
                io.to(friendIds).emit('new_notices', `${socket?.user?.displayName}がオフラインになりました`);
            }
        }
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('HTTP server is running!');
});
