import { io } from 'socket.io-client';

const URL = 'http://localhost:8000';

export const socket = io(URL, {
    autoConnect: false,
});

socket.on('connect', () => {
    console.log('ソケットサーバーと接続を開始しました');
});

socket.on('disconnect', (reason) => {
    console.log('ソケットサーバーと接続を終了しました');
    console.log('reason: ', reason);
});
