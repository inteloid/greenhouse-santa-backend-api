module.exports = {
    port: 80,
    listen: true,
    mongo: {
        dbUrl: 'mongodb://35.227.54.50:27017/green',
        user: 'green',
        pass: 'green_santa_2042',
        server: {
            reconnectTries: 150000,
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 0,
                socketTimeoutMS: 0
            }
        }
    }
};