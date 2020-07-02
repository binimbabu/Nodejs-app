
const db = require('./db');
const accountDetails = {
}

const register = (data)=>{
    
   return  db.User.findOne({
        accno: data.accno
     }).then(u=>{
         if(u)
         {
            return { status:422, "message":"Account already exists. Please login" };   
         }
         const user = new db.User({
            accno:data.accno,
            name: `${data.firstName} ${data.lastName}`,
            mpin: data.mpin,
            balance: 0,
            history:[]
        });
        user.save();
        console.log(user);
        return { status:200, "message":"Account registered successfully" };
    });
    }

   

const login = (data)=>{
    return db.User.findOne({
        accno:data.accno,
        mpin: data.mpin,
    }).then(u=>{
        if(!u)
        {
            return {status:422, "message" : "Invalid credentials"};
        }
        return{status:200, "message": "Successfull login"};
    });
}



const deposit = (session, body)=>{
    return db.User.findOne({
        accno:session.accno,
        mpin:body.mpin,
       }).then(user => {
           if(!user){
               return { status: 422, "message": "Invalid credentials"};
           }
           user.balance += parseFloat(body.amount);
           user.history.push({
               id:Math.floor(Math.random()*100000), 
               amount:body.amount, 
               typeAmount:'credit', 
               date: new Date()
           });
           user.save();
           return { status:200, "message0": "Amount deposited successfully"};
       })


 }

const withdraw = (session, body)=>{
    return db.User.findOne({
        accno:session.accno,
        mpin:body.mpin,
       }).then(user => {
           if(!user){
               return { status: 422, "message": "Invalid credentials"};
           }
           user.balance -= parseFloat(body.amount);
           user.history.push({
               id:Math.floor(Math.random()*100000), 
               amount:body.amount, 
               typeAmount:'debit', 
               date: new Date()
           });
           user.save();
           return { status:200, "message0": "Amount withdrawn successfully"};
       })

}

const checkBalance = (session)=>{
    return db.User.findOne({
        accno:session.accno,
       }).then(user => {
    return { status:200, balance:user.balance };
       });
}

const getAccountDetails = (session)=>{
    return db.User.findOne({
        accno:session.accno,
       }).then(user => {
    return { status:200, user};
       });
}

const getHistory = (session)=>{
    return db.User.findOne({
        accno:session.accno,
       }).then(user => {
    return { status:200, history:user.history};
       });
    }

const getProfile = (session)=>{
    return db.User.findOne({
        accno:session.accno,
       }).then(user => {
        return { status:200, profile:user };
       });

}
const updateProfile=(session, body)=>{
    return db.User.updateOne({
        accno:session.accno},{
        mpin:body.mpin,
        name:body.name
       }).then(user => {
    return { status:200, "message":"Profile edited successfully"};
       });
}
const editHistory = (id, session, body) =>{
    return db.User.findOne({
        accno:session.accno,
       }).then(user => {
   const history = user.history.find(history=>history._id==id);
   history.amount = body.amount;
   history.type = body.type;
   history.date = body.date;
   user.save();
   return { status:200, "message":"History edited successfully" };
       });
}
const deleteHistory = (id, session)=>{
    return db.User.findOne({
        accno:session.accno
       }).then(user => {
   user.history = user.history.filter(history=>history._id!=id);
   user.save();
   return { status:200, "message":"History deleted successfully" };
       });
}

module.exports = {
    register,
    getAccountDetails,
    getHistory,
    login,
    deposit,
    withdraw,
    checkBalance,
    editHistory,
    updateProfile,
    getProfile,
    deleteHistory

}