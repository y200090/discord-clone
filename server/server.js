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
        origin: `${process.env.CLIENT_APP_URL}`,
    },
});

// ソケット通信接続時の処理
io.on('connection', (socket) => {
    console.log('--------------------');
    console.log('--------------------');
    console.log(`接続開始　ID: ${socket.id}`);

    // ログイン時の処理
    socket.on('now_online', async (currentUser) => {
        socket.user = currentUser;
        socket.join(currentUser?._id);

        console.log('--------------------');
        console.log(`${currentUser?.displayName}がオンラインになりました`);

        // if (currentUser?.online) return;
        
        // console.log('--------------------');
        console.log('オンラインステータスを変更します');

        const newCurrentUser = await User.findByIdAndUpdate(currentUser?._id, {
            $set: {
                online: true,
                socketId: socket.id
            }
        }, { 
            runValidators: true,
            new: true, 
            upsert: true,
        });

        const friendIds = currentUser?.friends.map((friend) => {
            return friend._id;
        });

        if (friendIds.length) {
            io.to(friendIds).emit('update_online_status', newCurrentUser);
        }
    });

    socket.on('create_server', async (newServer) => {
        console.log('--------------------');
        console.log('新しいサーバーが作成されました:', newServer);
        io.to(socket.id).emit('new_server_created', newServer);
        io.to(socket.id).emit('new_channel_created', newServer?.ownedChannels);
    });

    socket.on('join_server', async ({ server, currentUser }) => {
        console.log('--------------------');
        console.log(`${server?.title}に参加しました`);

        const allowedUserIds = server?.ownedChannels[0]?.allowedUsers?.map((user) => {
            return user?._id;
        });
        allowedUserIds.push(currentUser?._id);

        io.to(currentUser?._id).emit('new_server_created', server);
        io.to(currentUser?._id).emit('new_channel_created', server?.ownedChannels)
        io.to(allowedUserIds).emit('server_joined', {
            channels: server?.ownedChannels,
            currentUser,
        });
    });

    socket.on('delete_server', async (server) => {
        const memberIds = server?.members?.map((member) => {
            return member?._id;
        });
        console.log(memberIds);

        io.to(memberIds).emit('server_deleted', server);
    });

    socket.on('create_channel', async (newChannel) => {
        console.log('--------------------');
        console.log('新しいチャンネルが作成されました：', newChannel);

        const memberIds = newChannel?.parentServer?.members?.map((member) => {
            return member._id;
        });
        console.log(memberIds);
        io.to(memberIds).emit('new_channel_created', [newChannel]);
    });

    socket.on('delete_channel', async (channel) => {
        const allowedUserIds = channel?.allowedUsers?.map((user) => {
            return user?._id;
        });
        io.to(allowedUserIds).emit('channel_deleted', channel);
    });

    socket.on('send_request', async (newRequest) => {
        console.log('--------------------');
        console.log(`${socket?.user?.tag}が${newRequest?.to?.tag}へフレンド申請を送信しました`);
        io.to(`${newRequest?.to?._id}`).to(`${newRequest?.from?._id}`).emit('receive_request', newRequest);
    });

    socket.on('approve_request', (data) => {
        const request = data?.request;
        const newDirectMessage = data?.newDirectMessage;
        console.log('--------------------');
        console.log('フレンド申請が承認されました');
        io.to(`${request?.to?._id}`).to(`${request?.from?._id}`).emit('delete_request', request);
        io.to(`${request?.to?._id}`).to(`${request?.from?._id}`).emit('new_channel_created', [newDirectMessage]);

        io.to(`${request?.to?._id}`).emit('request_approved', request?.from);
        io.to(`${request?.from?._id}`).emit('request_approved', request?.to);
    });

    socket.on('discard_request', (request) => {
        console.log('--------------------');
        console.log('フレンド申請が破棄されました');
        io.to(`${request?.to?._id}`).to(`${request?.from?._id}`).emit('delete_request', request);
    });

    socket.on('delete_friend', (friend) => {
        console.log('フレンドが削除されました');
        io.to(friend?._id).emit('friend_deleted', socket?.user?._id);
        io.to(socket.id).emit('friend_deleted', friend?._id);
    });

    socket.on('add_direct_message', (DM) => {
        console.log('--------------------');
        console.log('DMを追加しました');
        if (DM?.category === 'ダイレクトメッセージ') {
            io.to(socket.id).emit('direct_message_added', DM);

        } else if (DM?.category === 'グループダイレクトメッセージ') {
            let allowedUserIds = DM?.allowedUsers?.map((user) => {
                return user?._id;
            });
            console.log(allowedUserIds);
            io.to(allowedUserIds).emit('new_channel_created', [DM]);
            io.to(allowedUserIds).emit('direct_message_added', DM);
        }
    });

    socket.on('remove_direct_message', (directMessageId) => {
        console.log('--------------------');
        console.log('DMを外しました');
        io.to(socket.id).emit('direct_message_removed', directMessageId);
    });

    // グループDMからの招待を受諾
    socket.on('recieve_invitation_from_direct_message', ({ targetUsers, currentUser, directMessage }) => {
        console.log('--------------------');
        console.log('グループDMに招待しました');
        // const allowedUserIds = directMessage?.allowedUsers?.map((user) => {
        //     return user?._id;
        // });
        const targetUserIds = targetUsers?.map((user) => {
            return user?._id;
        });

        io.to([currentUser?._id, ...targetUserIds]).emit('channel_joined', { 
            channel: directMessage,
            targetUsers,
        });
        // io.to(targetUserIds).emit('directMessage_added', directMessage);
        // io.to(targetUserIds).emit('new_channel_created', directMessage);
    });

    // チャンネルから脱退
    socket.on('withdraw_from_channel', ({ targetChannel, withDrawnUser }) => {
        console.log('--------------------');
        console.log(targetChannel?._id, 'から脱退しました');
        const allowedUserIds = targetChannel?.allowedUsers?.map((user) => {
            return user?._id;
        });
        io.to(allowedUserIds).emit('withdrawn_from_channel', {targetChannel, withDrawnUser});
        io.to(socket.id).emit('direct_message_removed', targetChannel?._id);
    });

    // チャンネル入室
    socket.on('join_room', ({ channelId, currentUser }) => {
        socket.join(channelId);
        console.log('--------------------');
        console.log(`${currentUser?.displayName}が${channelId}に入室 `, socket.rooms);
    });

    // チャンネル退出
    socket.on('leave_room', ({ channelId, currentUser }) => {
        socket.leave(channelId);
        console.log('--------------------');
        console.log(`${currentUser?.displayName}が${channelId}から退室 `, socket.rooms);
    });
    
    socket.on('send_message', async (newMessage) => {
        console.log('--------------------');
        console.log('新しいメッセージが送信されました: ', newMessage?.body);
        console.log(`送信者：${newMessage?.sender?.displayName}`);
        console.log(`送信チャンネル：${newMessage?.postedChannel?._id}`);
        console.log(`既読者：${newMessage?.readUsers?.length}`);

        const channelId = newMessage?.postedChannel?._id;
        const allowedUsers = newMessage?.postedChannel?.allowedUsers;
        const allowedUserIds = allowedUsers?.map((user) => {
            return user._id;
        });
        console.log(allowedUserIds);
        io.to(allowedUserIds).emit('message_sent', newMessage);
            
        // カレントユーザーを除くチャンネル参加者
        const otherMemberIds = allowedUserIds.filter((userId) => {
            return userId !== newMessage?.sender?._id;
        });
        
        console.log('--------------------');
        console.log('他のメンバーの人数:', otherMemberIds?.length);
        
        if (otherMemberIds?.length) {            
            // チャンネル滞在者
            const readUserSockets = await io.in(channelId).fetchSockets();
            console.log('--------------------');
            console.log('readUserSockets: ', readUserSockets?.length);

            if (readUserSockets?.length == allowedUsers?.length) return;

            const readUserIds = readUserSockets.map((readUserSocket) => {
                return readUserSocket?.user?._id;
            });
            console.log('--------------------');
            console.log('readUserIds: ', readUserIds);

            const unreadUserIds = otherMemberIds?.filter((memberId) => {
                return !readUserIds.includes(memberId);
            });
            console.log('--------------------');
            console.log('unreadUserIds: ', unreadUserIds);

            try {
                if (newMessage?.postedChannel?.directMessage) {
                    await User.updateMany({
                        _id: {
                            $in: otherMemberIds
                        }
                    }, {
                        $addToSet: {
                            setDirectMessages: channelId
                        }
                    });

                    io.to(unreadUserIds).emit('direct_message_added', newMessage?.postedChannel);
                }
                
                unreadUserIds.forEach(async (unreadUserId) => {
                    await Channel.findByIdAndUpdate(channelId, {
                        $push: {
                            notifications: {
                                recipient: unreadUserId,
                                content: newMessage?._id
                            }
                        }
                    }, { 
                        runValidators: true 
                    });

                    io.to(unreadUserId).emit('new_notification_received', {
                        channelId,
                        recipient: unreadUserId,
                        content: newMessage?._id,
                    });
                });
                console.log('--------------------');
                console.log(`未読ユーザー${unreadUserIds}に新規メッセージを通知しました`);
    
            } catch (err) {
                console.log(err);
            }
        }
    });

    // 既読チェック
    socket.on('read_messages', async ({ currentChannel, currentUser, unreadMessages }) => {
        const channelId = currentChannel?._id;

        console.log('--------------------');
        console.log('チャンネル最新メッセージ：', currentChannel?.latestMessage);

        // チャンネル滞在者
        const readUserSockets = await io.in(channelId).fetchSockets();
        console.log('--------------------');
        console.log('チャンネル滞在者数: ', readUserSockets?.length);

        // if (readUserSockets?.length == currentChannel.latestMessage?.readUsers?.length) return;
        if (currentChannel?.latestMessage?.readUsers?.includes(currentUser?._id)) return;
        
        try {
            await Message.updateMany({
                postedChannel: channelId,
                readUsers: {
                    $ne: currentUser?._id
                }
            }, {
                $addToSet: {
                    readUsers: currentUser?._id
                }
            }, { 
                runValidators: true 
            });
            console.log('--------------------');
            console.log(`${currentUser?._id}が${channelId}の未読メッセージに既読をつけました`);

            const targetChannel = await Channel.findOne({
                _id: channelId, 
                notifications: {
                    $elemMatch: {
                        recipient: currentUser?._id
                    }
                }
            });
            console.log('--------------------');
            console.log('notice', targetChannel?.notifications);

            if (targetChannel) {
                await Channel.findByIdAndUpdate(channelId, {
                    $pull: {
                        notifications: {
                            recipient: currentUser?._id
                        }
                    }
                }, { 
                    multi: true 
                });
                console.log('--------------------');
                console.log('通知を消化しました');

                io.to(`${currentUser?._id}`).emit('notification_cleared', { 
                    channelId, 
                    currentUserId: currentUser?._id,
                });
            }

        } catch (err) {
            console.log(err);
        }        
    });

    socket.on('clear_unreadMessages', ({ currentUser, unreadMessages }) => {
        io.to(currentUser?._id).emit('unreadMessages_cleared', {
            currentUser, 
            unreadMessages,
        });
    });

    socket.on('disconnect', async (reason) => {
        console.log('--------------------');
        console.log('--------------------');
        console.log('接続終了　ID: ', socket.id);
        console.log('reason: ', reason);

        try {
            const currentUser = await User.findOneAndUpdate({ socketId: socket.id }, {
                $set: {
                    online: false,
                    socketId: '',
                },
            }, {
                runValidators: true,
                new: true,
            });

            console.log(`${currentUser?.displayName}がオフラインになりました`);

            const friendIds = currentUser?.friends?.map((friend) => {
                return `${friend?._id}`;
            });

            console.log(friendIds);

            if (friendIds?.length) {
                io.to(friendIds).emit('update_online_status', currentUser);
            }
            
        } catch (err) {
            console.log(err);
        }
    });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('HTTP server is running!');
});
