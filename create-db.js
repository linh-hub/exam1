"use strict";

const fs = require('fs');
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

let product = JSON.parse(fs.readFileSync('data.json').toString());
let cart = JSON.parse(fs.readFileSync('data.json').toString());
let passed_order = JSON.parse(fs.readFileSync('data.json').toString());
let order_cart = JSON.parse(fs.readFileSync('data.json').toString());
let load = function(filename) {
  const recipes = JSON.parse(fs.readFileSync(filename));

  db.prepare('DROP TABLE IF EXISTS product').run();
  db.prepare('DROP TABLE IF EXISTS cart').run();
  db.prepare('DROP TABLE IF EXISTS passed_order').run();
  db.prepare('DROP TABLE IF EXISTS order_cart').run();

  db.prepare('CREATE TABLE product (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, img_url TEXT, description TEXT, price DOUBLE)').run();
  db.prepare('CREATE TABLE cart (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INT, product_id INT REFERENCES product(id)').run();
  db.prepare('CREATE TABLE passed_order (id INTEGER PRIMARY KEY AUTOINCREMENT, receipt_email TEXT, payment_id INT, total DOUBLE)').run();
  db.prepare('CREATE TABLE order_cart ( order_id INT, product_id INT REFERENCES product(id)').run();

  let insert1 = db.prepare('INSERT INTO product VALUES (@id, @name, @img_url, @description, @price)');
  let insert2 = db.prepare('INSERT INTO cart VALUES (@id, @session_id, @product_id)');
  let insert3 = db.prepare('INSERT INTO passed_order VALUES (@id, @receipt_email, @payment_id,@total)');
  let insert4 = db.prepare('INSERT INTO order_cart VALUES (@order_cart, @product_id)');

  let transaction = db.transaction((recipes) => {

    for (let p of product) {
        if(!p.name || !p.img_url || !p.description ||!p.price){
            console.error('Missing fields in demand');
        }
        insert1.run(p);
    }
    for (let c of cart) {
        if(!c.session_id || !c.product_id){
            console.error('Missing fields in demand');
        }
        insert1.run(c);
    }
    for (let po of passed_order) {
        if(!po.receipt_email || !po.payment_id || !po.total){
            console.error('Missing fields in demand');
        }
        insert1.run(po);
    }
    for (let oc of order_cart) {
        if(!oc.order_id || !oc.product_id){
            console.error('Missing fields in demand');
        }
        insert1.run(oc);
    }
      
  });

  transaction();
}

load();

