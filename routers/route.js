var app = require('express')();
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var cors = require('cors');

app.use(urlencodeParser);
app.use(bodyParser.json());
app.use(cors());

////Maincontroller

const mainController = require('../controllers/MainController');

module.exports = function (app) {

      function isUserAllowed(req, res, next) {
            sess = req.session;
            if (sess.user) {
                  return next();
            }
            else { res.redirect('/login'); }
      }

      app.get('/', isUserAllowed, mainController.get_main_page);

      // app.post('/post-photo', (req, res)=>{
      //       console.log(req.body.profile_photo);
      // });

      app.post('/post-messages', isUserAllowed, mainController.post_messages);
      app.get('/get-messages', isUserAllowed, mainController.get_messages);
      app.get('/get-contacts', isUserAllowed, mainController.get_contacts);
      app.get('/get-chats', isUserAllowed, mainController.get_chats);

      app.get('/start-chat', isUserAllowed, mainController.start_chat);
}