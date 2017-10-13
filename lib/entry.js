const redis = require('redis');
const db = redis.createClient();

class Entry{
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
    }

    save = (fn)=>{
        let entryJSON = JSON.stringify(this);

        db.lpush(
            'entries',
            entryJSON,
            (err)=>{
                if(err)return fn(err);
                fn();
            }
        );
    }

    static getRange = (from,to,fn)=>{
        db.lrange('entries',from,to,(err,items)=>{
            let entries = [];
            items.forEach((items)=>{
                entries.push(JSON.Parse(items))
            });
        });
    }

}







module.exports = Entry;
