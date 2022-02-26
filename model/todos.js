const db=require('../middleware/db-connect')
const moment=require('moment')
const {ObjectId}=require('mongodb')

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }
module.exports=class Todos{

    constructor(userId,name,desc,list,finished,expire){
        this.userId=userId
        this.name=name;
        this.list=list;
        this.desc=desc;
        this.expire=new Date(expire)
        this.finished=finished;
        this.createdAt=new Date()

        this.modifiedAt=new Date()
        this.deleted=false;

    }

     save(){
        
        return db.collection('todos').then((e)=>{
         return  e.insertOne(this) 
        })
    
        }
    static find(param,user){
        param.userId=user._id
       return db.collection('todos').then((e)=>{
       return e.find(param).toArray()
        })
    }

    static findOne(param,user){
        param.userId=user._id
        return db.collection('todos').then((e)=>{
            return e.findOne(param)
        })
    }
    //grud
    static delete(id){
        return db.collection('todos').then((e)=>{
            return e.deleteOne({"_id":ObjectId(id)})
        }).then((e)=>{
            return e
        }).catch((e)=>{
            throw new Error(e)
        })
    }
    static update(id,data){
        return db.collection('todos').then((e)=>{
            var newDateObj =data.expire
            data.expire=newDateObj
            return e.updateOne({_id:ObjectId(id)},{$set:data})
        }).then((e)=>{
            console.log(e);
        }).catch((e)=>{
            console.log(e);
        })

    }




    static groupByDate(user){
        return db.collection('todos').then((e)=>{
            return e.aggregate([
                {$match:{userId:user._id}},
                { $project: { 
                    day:{$dayOfMonth:"$expire"},
                    month:{$month:"$expire"},
                    year:{$year:"$expire"},
                    hour: { $hour: "$expire" },
                    minutes: { $minute: "$expire" },
                    cday:{$dayOfMonth:"$createdAt"},
                    cmonth:{$month:"$createdAt"},
                    cyear:{$year:"$createdAt"},
                    chour: { $hour: "$createdAt" },
                    cminutes: { $minute: "$createdAt" },

                    name:1
                }}]).toArray()
        })
    }

    static test(user){
        return db.collection('todos').then((e)=>{
            return e.aggregate([
                {$match:{userId:user._id}},
                {"$group":{_id:{list:'$list'}, count:{$sum:2}, todo: {$push: { name: '$name', desc: '$desc', expire: { $dateToString: { format: "%Y/%m/%d %H:%M:%S", date: "$expire" } },id:"$_id" }}}} , 
            
            
            ]).toArray()
        })
    }
    static day(day,user){
        return db.collection('todos').then((e)=>{
        return  e.aggregate(
              [
                {$match:{userId:user._id}},
                 {
                     $group:{_id:{
                            day: { $dateToString: { format: "%Y-%m-%d", date: "$expire" } },
                            list:"$list"
                     },
                     todo: {$push: { name: '$name', desc: '$desc', expire: { $dateToString: { format: "%Y/%m/%d %H:%M:%S", date: "$expire" } },id:"$_id" }}
                    } 
                 },
                 {$match:{"_id.day":day}}
              ]
            ).toArray()
        })
      }
      static month(month,user){
        return db.collection('todos').then((e)=>{
        return  e.aggregate(
              [
                {$match:{userId:user._id}},
                 {
                     $group:
                     {_id:{
                            month: { $dateToString: { format: "%m", date: "$expire" }},
                            list:"$list"
                           
                     },
                     
                     todo: {$push: { name: '$name', desc: '$desc', expire: { $dateToString: { format: "%Y/%m/%d %H:%M:%S", date: "$expire" } },id:"$_id" }}
                     }



                 },
                 {$match:{"_id.month":month}},
              ]
            ).toArray()
        })
      }

      static expire(user,date,current){
        return db.collection('todos').then((e)=>{
            console.log({current},{date});
            return e.aggregate([
                {$match:{expire:{$gte:current,$lte:date}}},
                {$match:{userId:user._id}},
                {"$group":{_id:{list:'$list'}, count:{$sum:1}, todo: {$push: { name: '$name', desc: '$desc', expire: { $dateToString: { format: "%Y/%m/%d %H:%M:%S", date: "$expire" } },id:"$_id" }}}} , 
            
            
            ]).toArray()
        })
    }
    
}



/* 
static groupBylist(name){
    return db.collection('todos').then((e)=>{
        return e.aggregate([
            {$match:{deleted:false}},
            {$group:{_id:'$list'
            ,name:{"$first":"$name"}
            ,id:{"$first":"$_id"}
            ,expire:{"$first":"$expire"}
            ,finished:{"$first":"$finished"}
            ,createdAt:{"$first":"$createdAt"}
            ,modifiedAt:{"$first":"$modifiedAt"}
        }}
        ]).toArray()
    })
}
 */