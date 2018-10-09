module.exports = (io) => {
    io.on('connect', (socket) => {
        socket.broadcast.to(`${socket.id}`).emit('welcome', {'message':'Welcome to the server...'});
        
        socket.on('joined', (data) => {
            console.log(sanitize(data.message));
            console.log(sanitize(data.page));
        });

        socket.on('newSiteEvent-answer', () => {
            console.log('siteUpdate Answer Happened');
            socket.broadcast.emit('siteUpdate', {'message':'A new answer has been posted'});
        });
        
        socket.on('newSiteEvent-question', () => {
            console.log('siteUpdate Question Happened');
            socket.broadcast.emit('siteUpdate', {'message':'A new question has been posted'});
        });
    });
}

function sanitize(str) {
    return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
}