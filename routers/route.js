var app = require('express')();
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var cors = require('cors');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
      destination:(req, file, cb)=>{
            cb(null, 'public/assets/uploadImages/')
      },
      filename:(req, file, cb)=>{
            // console.log(file);
            cb(null, Date.now()+ path.extname(file.originalname))
      }
});
var upload = multer({storage:storage});

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
      app.get('/clear-chat', isUserAllowed, mainController.clear_chat);
      app.get('/get-unreplied', isUserAllowed, mainController.get_unreplied);

      app.post('/update-user-name', isUserAllowed, mainController.update_account_name);
      app.get('/get-user-info', isUserAllowed, mainController.get_user_info);
      app.post('/update-profile-photo', isUserAllowed, upload.single('photo'), mainController.update_profile_photo);

      app.get('/all-users', isUserAllowed, mainController.get_all_users);
      app.post('/create-group', isUserAllowed, mainController.create_group);
      app.get('/get-groups', isUserAllowed, mainController.get_groups);
      app.get('/get-group-info', isUserAllowed, mainController.get_group_by_id);
      app.get('/get-group-members', isUserAllowed, mainController.get_group_members);

      /////group messages

      app.get('/get-group-messages', isUserAllowed, mainController.get_group_messages);
      app.post('/post-group-messages', isUserAllowed, mainController.post_group_messages);

      
}