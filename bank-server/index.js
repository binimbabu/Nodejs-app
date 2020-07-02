const express = require('express');

const bodyParser = require('body-parser');
const session = require('express-session');
const dataService = require('./data.service');
const db = require('./db');
const app = express();
const cors = require('cors');

app.use(cors({
    origin:'http://localhost:4200',
    credentials: true
}));

app.use(session({
    secret: 'randomText',
    saveUninitialized: true,
    resave:true
}));

app.use(bodyParser.json());

const logMiddleware = (req,res,next) =>{
    console.log(req.body);
    next();
}
app.use(logMiddleware);

const authMiddleware = (req,res, next) => {
    console.log(req.session.accno);
    if(!req.session.accno){
        return res.status(422).json({ "message":"Account details doesn't exist. Please login" });
    }
    const accountDetails = dataService.getAccountDetails(req.session);
    if(!accountDetails){
        return res.status(422).json({ status:422, "message":"Account details doesn't exist." });
    }
    next();
}

app.get('/test', (req,res)=>{
    return db.User.find({})
    .then(data=>res.json(data));
})

app.get('/', authMiddleware, (req,res)=>{
    //const data = dataService.getAccountDetails();
    return res.status(200).json({
        accno:req.session.accno,
        mpin:req.session.mpin,
    });
});
app.post('/register', (req,res)=>{
    return dataService.register(req.body).then(result=>{
        return res.status(result.status).json(result);
    });

});
app.post('/login', (req,res)=>{
return dataService.login(req.body).then(result=>{
    if(result.status==200){
        req.session.accno = req.body.accno;
        req.session.mpin = req.body.mpin;
    }
    return res.status(result.status).json(result);
});
    
});
app.post('/deposit', authMiddleware,(req,res)=>{
    console.log(req.body);
    console.log(req.session);
    return dataService.deposit(req.session, req.body)
    .then(result=>{
        return res.status(result.status).json(result);
    })
});
app.post('/withdraw', authMiddleware,(req,res)=>{
    return dataService.withdraw(req.session, req.body)
    .then(result=>{
        return res.status(result.status).json(result);
    })
   
});
app.get('/balance', authMiddleware,(req,res)=>{
    return dataService.checkBalance(req.session)
    .then(result=>{
        return res.status(result.status).json(result);
    })
  
});
app.get('/history', authMiddleware, (req,res)=>{
    return dataService.getHistory(req.session)
    .then(result=>{
        return res.status(result.status).json(result);
    })
});
app.put('/edit-history/:id', authMiddleware, (req,res)=>{
    return dataService.editHistory(req.params.id, req.session, req.body)
    .then(result=>{
        return res.status(result.status).json(result);
    })
  
});
app.get('/profile', authMiddleware, (req,res)=>{
    const result = dataService.getProfile(req.session);
    return res.status(result.status).json(result);
});
app.put('/profile', authMiddleware, (req,res)=>{
    const result = dataService.updateProfile(req.session, req.body);
    return res.status(result.status).json(result);
});
app.delete('/history/:id', authMiddleware, (req,res)=>{
    return dataService.deleteHistory(req.params.id, req.session)
    .then(result=>{
        return res.status(result.status).json(result);
    })
});
app.listen(9000, function(){console.log("App started")});



























