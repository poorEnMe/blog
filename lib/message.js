const res = require('express').response;


res.message = function(msg,type = 'info'){
    let sess = this.req.session;
    sess.message = sess.message || [];
    sess.message.push({type:type,string:msg});
};

res.error = function(msg) {
    console.log('this:'+this);
    return this.message(msg, 'error');
};



module.exports = (req,res,next)=>{
    res.locals.message = req.session.message || [];
    res.locals.removeMessages = ()=>{
        req.session.message = [];
    };
    next();
};