module.exports = function (io) {
    io.on('connect', (client) => {
        client.emit('welcome', {'message':'Welcome to the server...'});
        client.on('joined', (data) => {
            console.log(sanitize(data.message));
            console.log(sanitize(data.page));
        });
    });

}

function sanitize(str) {
    return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
}