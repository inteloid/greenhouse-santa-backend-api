var UserService = require('../services/userService')

module.exports = function (app) {

    var userService = new UserService(app);

    app.get('/users', function (req, res, next) {
        userService.getUsers().then(function (doc) {
            res.send(doc);
        }).catch(function (err) {
            res.status(409);
            res.send({
                status: 'error',
                message: err.message
            });
        });
    });

    app.post('/users', function (req, res, next) {
        userService.addUser(req.body).then(function (doc) {
            res.send(doc);
        }).catch(function (err) {
            res.status(409);
            res.send({
                status: 'error',
                message: err.message
            });
        });
    });
}