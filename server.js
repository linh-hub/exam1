"use strict";


let express = require('express');
let mustache = require('mustache-express');

let model = require('./model');
let app = express();


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


const cookieSession = require('cookie-session');
app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie',
}));

app.use(express.static('public'));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');







app.post('/add_to_cart', (req, res) => {
    const student = model.login(req.body.email, req.body.password);
    if (student != -1) {
      req.session.user = student;
      req.session.email = req.body.email;
      res.redirect('/');
    } else {
      res.redirect('error');
    }
  });
  

  
  app.post('/remove_from_cart', (req, res) => {
    const user = model.new_user( req.body.email,req.body.password,req.body.role);
    if (user != -1) {
      req.session.user = user;
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      req.session.role = req.body.role;

      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
  app.post('/checkout', (req, res) => {
    const user = model.new_user( req.body.email,req.body.password,req.body.role);
    if (user != -1) {
      req.session.user = user;
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      req.session.role = req.body.role;

      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  
  app.get('/login', (req, res) => {
    res.render('login');
  });
  
  app.get('/new_user', (req, res) => {
    res.render('new_user');
  });

  app.get('/', (req, res) => {
    res.render('index');
  });


  app.get('/read/:id', (req, res) => {
    let entry = model.read(req.params.id);
    res.render('read', entry);
  });
  
  app.get('/create', is_authenticated, (req, res) => {
    res.render('create');
  });

  app.get('/update/:id', is_authenticated, (req, res) => {
    let entry = model.read(req.params.id);
    res.render('update', entry);
  });
  
  app.get('/delete/:id', is_authenticated, (req, res) => {
    let entry = model.read(req.params.id);
    res.render('delete', {id: req.params.id, title: entry.title});
  });
  
  function post_data_to_demand(req) {
    return {
      sendid: req.body.sendid, 
      receiveid: req.body.receiveid,
      title: req.body.title,
      content: req.body.content,
      status: req.body.istatus
      
    };
  }
  
 
  
  app.post('/update/:id', is_authenticated, (req, res) => {
    let id = req.params.id;
    model.update(id, post_data_to_demand(req));
    res.redirect('/read/' + id);
  });
  
  app.post('/delete/:id', is_authenticated, (req, res) => {
    model.delete(req.params.id);
    res.redirect('/');
  });

   // Enregistrement d'un rdv
  app.post('/create', (req, res) => {

  // Extraire les données du formulaire de req.body et les stocker dans des variables    
    let title = req.body.title;
    let content= req.body.content;
    

  const succes= model.creat(title,content);

  if(succes){
    
    res.redirect('/');
  
  }
  else{ res.send('error'); }
  
});

  app.listen(3002, () => console.log('listening on http://localhost:3000'));





