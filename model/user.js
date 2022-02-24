const {ObjectId}=require('mongodb');
const db=require("../middleware/db-connect.js")

module.exports= class User{
    
    constructor(fname,lname,email,password,provider,providerId,image){
        this.fname=fname;
        this.lname=lname;
        this.password=password;
        this.email=email;
        this.provider=provider;
        this.providerId=providerId
        this.image=image
    }
    
    userObj(){
        
            return db.collection('user');
    }
    async save(){
            return await (await this.userObj()).insertOne(this)
        
    }

   static async find(param){
       try {
           
           const e = await db.collection('user');
           return await e.find(param).project({password:0}).toArray();
    } catch (error) {
        return error
     }
       }

    static async findOne(param){
            const e = await db.collection('user');
            var x= await e.findOne(param)
            return x
        }
    static update(id,data){
        return db.collection('user').then((e)=>{
            return e.updateOne({_id:id},data)
        })
    }

 

}

