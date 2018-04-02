var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:SoujanyaVishnu1@localhost:5432/db1';
const config ={
	user: 'postgres',
	database:'db1',
	password:'SoujanyaVishnu1',
	port:5432
	
};

const pool = new pg.Pool(config);


/* GET home page. */
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname + '/landing.html'));
});

/* GET signup page */
router.get('/signup', function(req, res, next) {
 // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname + '/signup.html'));
});



router.post('/api/v1/db1', (req, res, next) => {
  const results = [];
 
  const data = {text: req.body.text, complete: false};
  
  pool.connect(function(err, client, done)  {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
   
     client.query('INSERT INTO user(name, email, password, id) values($1, $2, $3)',
    [data.name, data.email, data.password]);
   
 client.query('SELECT * FROM user ORDER BY id ASC', function(err, result){
	 
	  if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
 
  
 
 
   
    
    
  });
});



router.get('/Registration', (req, res, next) => {
  const results = [];
  
  pool.connect(function(err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
  
   client.query('SELECT * FROM user ORDER BY id ASC', function(err,result){
	    if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
  
	
    
  
    
   
  });
}); 

router.post('/createnewuser', (req, res, next) => {
  
  const data1= {email: req.body.email,  name: req.body.name, password: req.body.password};
  console.log(data1);
  pool.connect(function(err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	
	 client.query('INSERT INTO users (email, name, password) VALUES ($1, $2, $3);', [data1.email, data1.name, data1.password], function (err, result) {
      done() //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

      if (err) {
        // pass the error to the express error handler
        return next(err)
		console.log(err);
      }
		
		//res.redirect('public/landing.html');
		res.sendFile(path.join(__dirname + '/landing.html'));
      res.send(200)
    });
	
	
  /*var sql = "INSERT INTO user(email,name, password) VALUES('"+req.body.email+"','"+req.body.name+"','"+req.body.password+"')";
   client.query(sql, function(err,result){
	    if(err){
               console.log('inside query'+err);
               res.status(400).send(err);
           }
		   console.log('user created');
           res.status(200).send(result);
       });
  */
	
    
  
    
   
  });
}); 




/*router.put('api/v1/db1/:db1_id', (req,res,next) => {
const results = [];
  
  const id = req.params.db1_id;
  
  const data = {text: req.body.text, complete: req.body.complete};
  
  pool.connect(function(err, client, done) => {
   
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });	
	
	
	
	
}); */

module.exports = router;