const {
    Server
  } = require("socket.io");


module.exports.listen = ((server, fn) => {
    // 启动socket在3000端口，同一端口也可以启动socket服务
    const io = new Server(server, {
        cors: true,
        serveClient: false
    });
    // 传入回调
    fn && fn()
    
    //监听客户端链接,回调函数会传递本次链接的socket
    io.on('connection', socket => {
        // 中间件
        // socket.use((socket, next) => {
        //     const err = new Error("not authorized");
        //     err.data = { content: "Please retry later" }; // additional details
        //     next(err);
        // });
        
        socket.join("room1");
        console.log(socket.rooms);
        socket.broadcast.emit('hi');
        // 所有人都可以接收到
        io.emit('this', {
            'message': "欢迎进入直播"
        });
        // console.log('a user connected' + Math.random());

        // 监听客户端发送的信息
        // socket.emit('message', {
        //     'message': 'hello world'
        // });
        socket.on("sentToServer", (message, fn) => {
            fn({'message':message})
            // 给客户端返回信息
            io.emit("sendToClient", {
                'message': "测试回复消息"
            });
        });
        socket.on('chat message', (msg, callback) => {
            // 接受回调 会返给前端
            callback({
                status: "ok"
              });
            io.emit('chat message', msg);
        });
    });

    // 监听连接断开事件
    io.on("disconnect", () => {
        console.log("连接已断开...");
    });
})
