const User = require('../lib/user');

exports.form = (req,res)=>{
    res.render('login',{title:'login'});
};

exports.submit = (req,res,next)=>{
    let data = req.body;
    User.authenticate(data.userName,data.userPassword,(err,user)=>{
       if(err) return next(err);

       if(user){
           req.session.uid = user.id;
           res.redirect('/');
       }else {
           res.error('username or password wrong');
           res.redirect('back');
       }
    });
};

exports.logout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    });
};

