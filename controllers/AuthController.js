///////  crud user
var { post_user, get_user, delete_user, check_password_exists, find_user_password, check_username_exists} = require('../model/auth_crud');

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

const pages_lock_screen = (req, res)=>{
	res.locals = { title: 'Lock Screen 1' };
	res.render('AuthInner/pages-lock-screen', { 'message': req.flash('message'), 'error': req.flash('error'), 
	'account_name':req.session.user.account_name , 'profilePhoto':req.session.user.profile_photo});
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
        const user = await get_user(req.body);
        if (user[0]) {

            sess = req.session;
            sess.user = user[0];
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
    const findUser = await find_user_password({user_id:req.session.user.user_id, password:req.body.password});
    if(findUser.length===1){
        res.redirect('/');
    }
    else{
        req.flash('error', 'Incorrect password! Please try again.');
        res.redirect('/pages-lock-screen');
    }
}

const deleteUser = async(req, res)=>{
    await delete_user(req.session.user.user_id);
    req.session.user = null;
    
    res.redirect('/login');
}

const post_register =  async(req, res)=>{
 
    var username = String(req.body.username);
    if(username.startsWith('@')){
        username = username.substring(1);
    }
    const existsUserPass = await check_password_exists(req.body.password);
    const existsUserUsername = await check_username_exists(username);
    
    if(existsUserPass[0]){

        req.flash('error', 'Password has already been used. Please create a new one!');
        res.redirect('/register');

    }else if(existsUserUsername[0]){

        req.flash('error', 'Username have already been taken. Please find a new one!');
        res.redirect('/register');

    } else {
        const user = await post_user(req.body);
        // Assign value in session
        sess = req.session;
        sess.user = user[0];
        res.redirect('/');
    }
}



module.exports = {
    post_login,
    post_forgot_password,
    page_unlock,
    deleteUser,
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