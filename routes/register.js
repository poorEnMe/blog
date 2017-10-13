const User = require('../lib/user');

exports.form = (req,res)=>{
    res.render('register',{title:'Register'});
};

exports.submit = (req,res,next)=>{
    let data = req.body;
    /*console.log(data);

    console.log(data.userName);
    User.getByName('Tobi',(err,id)=>{
       console.log(id) ;
    });*/

    User.getByName(data.userName,(err,user)=>{
        if(err)return next(err);
        if(user.id){
            res.error("username already taken");
            res.redirect('back');
        }else{
            user = new User({
               name:data.userName,
               pass:data.userPassword
            });

            user.save((err)=>{
                if(err) return next(err);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    });
};