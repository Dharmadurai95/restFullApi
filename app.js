const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
const port = 3000;

mongoose.connect("mongodb://localhost:3003/FormDB",{ useNewUrlParser: true , useUnifiedTopology: true} );

const FormsSchema = {
    name:String,
    age:Number,
    maritalstatus:String
};

const Form = mongoose.model('Form',FormsSchema);

app.route('/forms')
.get((req,res)=> {
    Form.find((err,found)=> {
        if(err) {
            res.send(' no value found')
        }
        else {
            res.send(found)
        }
    });
})
.post((req,res)=> {
  const newForm = new Form ({
     name:req.body.name,
     age:req.body.age,
     maritalstatus:req.body.maritalstatus
  });
  newForm.save((err,saved)=> {
      if(saved) {
          res.send('saved')
      }
      else {
          res.send(err)
      }
  });
})
.delete((req,res)=> {
    Form.deleteMany({},(err,deleted)=> {
        if(!err) {
            res.send('deleted')
        }
        else {
              console.log(err)
        }
    })
});

app.route('/forms/:name')
.get((req,res)=> {
    Form.findOne({name:req.params.name},(err,success)=> {
        if(!err) {
            res.send(success)
        }
        else {
            res.send('err')
        }
    })
})
.put((req,res)=> {
  Form.update({name:req.params.name},
    {name:req.body.name,age:req.body.age,maritalstatus:req.body.maritalstatus},
    {overwrite:true},(err,succ)=> {
        if(!err) {
            res.send('success')
        }
        else {
            res.send(err)
        }
    });
})
.patch((req,res)=> {
    Form.updateOne({name:req.params.name},
        {$set:req.body},(err,success)=> {
            if(!err) {
                res.send("success")
            }
            else {
                res.send('err')
            }
        });
})
.delete((req,res)=> {
    Form.deleteOne({name:req.params.name},
        (err,success)=> {
         if(!err) { res.send(success)
         }
         else {
             res.send(err)
         }
        });
});


app.listen(port,()=> {
    console.log('port successfully created');
})

