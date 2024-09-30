const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());  
app.use(express.json());

const{connectToDb,getDb}=require('./db');
let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001, () => {
            console.log("connected to database");
        });
        db=getDb();
    }
})


//app.get
app.get('/contacts',(req,res)=>{
    let contacts=[];
    db.collection('contact')
    .find()
    .forEach((contact)=>contacts.push(contact))
    .then(()=>{
        res.status(200).json(contacts);
    })
    .catch(()=>{
        res.status(500).json({msg:'error in something'});
    })
})


//app.get using id
app.get('/contacts/:id',(req,res)=>{
    const contactID=parseInt(req.params.id);
    if(!isNaN(contactID))
    {
        db.collection('contact')
        .findOne({id:contactID})
        .then((contact)=>{
            if(contact){
                res.status(200).json(contact);
            }
            else{
                res.status(500).json({msg:'student not found'});
            }
        })
        .catch(()=>{
            res.status(500).json({msg:'something went wrong'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})

//app.post
app.post('/contacts',(req,res)=>{
    const contact=req.body;
    db.collection('contact')
    .insertOne(contact)
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch(()=>{
        res.status(500).json({msg:'error in inserting the data'});
    })
})

//app.patch
app.patch('/contacts/:id',(req,res)=>{
    let update=req.body;
    const contactID = parseInt(req.params.id);
    if(!isNaN(contactID))
    {
        db.collection('contact')
        .updateOne({id:contactID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in updating the data'});
        })
    }
    else
    {
        res.status(500).json({msg:'not a number'});
    }
})


//app.delete
app.delete('/contacts/:id',(req,res)=>{
    const contactID = parseInt(req.params.id);
    if(!isNaN(contactID))
    {
        db.collection('contact')
        .deleteOne({id:contactID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in deleting the data'});
        })
    }
    else
    {
        res.status(500).json({msg:'not a number'});
    }
})



