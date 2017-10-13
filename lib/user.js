const redis = require('redis');
const bcrypt = require('bcrypt');
const db = redis.createClient(6379,'127.0.0.1');

class User{
    constructor(obj){
        for (let key in obj){
            this[key] = obj[key];
        }
    }

    save(fn){
        if(this.id){
            this.update(fn);
        }else {
            let user = this;
            db.incr('user:ids',(err,id)=>{
               if(err) return fn(err);
               user.id = id;
               user.hashPassword(function (err) {
                   if(err) return fn(err);
                   user.update(fn);
               });
            });
        }
    }

    update(fn){
        let user = this;
        let id = user.id;
        db.set('user:id:'+user.name,id,function (err) {
            if(err) return fn(err);
            db.hmset('user:'+id,user,function (err) {
                fn(err);
            });
        });
    }

    hashPassword(fn){
        let user = this;
        bcrypt.genSalt(12,function (err,salt) {
            if(err) return fn(err);
            user.salt = salt;
            bcrypt.hash(user.pass,salt,function (err,hash) {
                if(err) return fn(err);
                user.pass = hash;
                fn();
            });
        });
    }

    static getId(name,fn){
        db.get('user:id:' + name,fn);
    }

    static get(id,fn){
        db.hgetall('user:'+id,(err,user)=>{
            if(err) return fn(err);
            fn(null,new User(user));
        });
    }

    static getByName(name,fn){
        User.getId(name,(err,id)=>{
           if(err)return fn(err);
           User.get(id,fn);
        });
    }

    static authenticate(name,pass,fn){
        let user = this;
        user.getByName(name,(err,user)=>{
            if(err) return fn(err);
            if(!user.id) return fn();
            bcrypt.hash(pass,user.salt,(err,hash)=> {
                if(err) return fn(err);
                if(hash === user.pass)return fn(null,user);
                fn();
            });
        });
    }
}
/*var tobi = new User({
    name: 'Tobi',
    pass: 'im a ferret',
    age: '2'
});

tobi.save(function(err){
    if (err) throw err;
    console.log('user id %d', tobi.id);
});*/

module.exports = User;


