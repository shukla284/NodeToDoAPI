const {UserModel} = require('./../models/Users.js');

// uses token for authentication
// if authentication suceeds then page will be allowed to be accessed.
var authenticate = (request, response, next)=> {
    var token = request.header('x-auth');

    UserModel.findByToken(token).then((user) => {
      // user if not exists then that will be rejected and send to catch block
      if (!user)
         return Promise.reject();

      request.user = user;
      request.token = token;

      next();
    }).catch((e) => {
      // if the promise is not resolved or any error exists then for surely
      // this will be returning 401 case out here.
      response.status(401).send();
    });
};

module.exports = {authenticate};
