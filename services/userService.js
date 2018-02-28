module.exports = UserService;

function UserService(app) {

    this.addUser = addUser;
    this.getUsers = getUsers;

    function addUser(userBody) {
        return new Promise(function (resolve, reject) {
            var user = new app.db1.users(userBody);

            user.save(function (err, doc) {
                if (err) {
                    return reject(err);
                }
                resolve(doc);
            });
        });
    }

    function getUsers() {
        return new Promise(function (resolve, reject) {
            app.db1.users.find()
                .exec(function (err, doc) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(doc);
                });
        });
    }
}