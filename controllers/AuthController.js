var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
///////  crud user
var { post_user, get_user, getAllPasswords, find_user_password, check_username_exists,
     get_password} = require('../model/auth_crud');

const pages_login = (req, res)=>{
	res.locals = { title: 'Login 1' };
	res.render('AuthInner/pages-login');
}

const pages_register = (req, res)=>{
	res.locals = { title: 'Register 1' };
	res.render('AuthInner/pages-register');
}

const pages_recoverpw = (req, res)=>{
	res.locals = { title: 'Recover Password 1' };
	res.render('AuthInner/pages-recoverpw');
}

const pages_lock_screen = async(req, res)=>{

    const user = await get_user(req.session.user.user_id);
	res.locals = { title: 'Lock Screen 1' };
	res.render('AuthInner/pages-lock-screen', { 'message': req.flash('message'), 'error': req.flash('error'), 
	'account_name':user[0].account_name , 'profilePhoto':user[0].profile_photo});

}

const register = (req, res)=>{
	if (req.user) { res.redirect('Dashboard/index'); }
	else {
		res.render('Auth/auth-register', { 'message': req.flash('message'), 'error': req.flash('error') });
	}
}

const login = (req, res)=>{
	res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') });
}

const post_login = async(req, res)=>{
    try {
        var user = await get_password(req.body.username);
        if(!user[0] ){
            req.flash('error', 'Username was not found!');
            return res.redirect('/login');
        }
        var password = user[0].password;
        var user_id = user[0].user_id;        
        var username = user[0].username;
        var result = await bcrypt.compare(req.body.password, password);
        
        if(username.localeCompare(req.body.username) === 0 && result){

            let userData = await get_user(user_id);
                sess = req.session;
                sess.user = userData[0];
                res.redirect('/');

        } else {
            req.flash('error', 'Incorrect username or password!');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}

const forgot_password = (req, res)=>{
	res.render('Auth/auth-forgot-password', { 'message': req.flash('message'), 'error': req.flash('error') });
}

const post_forgot_password = async(req, res)=>{

    const validUser = await check_email_exists(req.body.email);
    if (validUser['length'] === 1) {
        req.flash('message', 'We have e-mailed your password reset link!');
        res.redirect('/forgot-password');
    } else {
        req.flash('error', 'Email Not Found !!');
        res.redirect('/forgot-password');
    }

}

const logout = (req, res)=>{

	// Assign  null value in session
	sess = req.session;
	sess.user = null;

	res.redirect('/login');
}

const page_unlock = async(req, res)=>{
    const password = await find_user_password(req.session.user.user_id);
    const result = await bcrypt.compare(req.body.password, password[0].password);

    if(result){
        res.redirect('/');
    }
    else{
        req.flash('error', 'Incorrect password! Please try again.');
        res.redirect('/pages-lock-screen');
    }
}

const post_register =  async(req, res)=>{
 
    try {

        var username = req.body.username;
        var password = req.body.password;
        var acc_name = req.body.account_name;
        var result = false;

        if(username.startsWith('@')){
            username = username.substring(1);
        }
        const allPasswords = await getAllPasswords();
        const existsUserUsername = await check_username_exists(username);
        
        for(let i=0; i < allPasswords.length; i++){
            result = await bcrypt.compare(password, allPasswords[i].password);
            if(result){
                req.flash('error', 'Password has already been used. Please create a new one!');
                res.redirect('/register');
                break;
            }
        }
        if(result === false){
            
            if(existsUserUsername[0] && existsUserUsername[0].username.localeCompare(username) ===0 ){

                req.flash('error', 'Username have already been taken. Please find a new one!');
                res.redirect('/register');

            } else {
                const cryptedPassword = await bcrypt.hash(password, 10);
                const user = await post_user({username:username, password:cryptedPassword, account_name: acc_name});
                // Assign value in session
                sess = req.session;
                sess.user = user[0];
                res.redirect('/');
            }
            
        }
        
    } catch (error) {
        console.log(error);
    }

}



module.exports = {
    post_login,
    post_forgot_password,
    page_unlock,
    post_register,
	pages_login,
	pages_register,
	pages_recoverpw,
	pages_lock_screen,
	register,
	login,
	forgot_password,
	logout
};