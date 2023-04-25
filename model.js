"use strict";


const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');


exports.get_product = function() {
  let found = db.prepare('SELECT * FROM product');
  return found;
  
};


exports.add_to_cart = function(session_id,product_id) {
    let result = db.prepare('INSERT INTO cart (session_id, product_id) VALUES (?, ?)').run(session_id, product_id);
    return result.lastInsertRowid;
}



exports.remove_from_cart = function(id){
    db.prepare('DELETE FROM cart WHERE id = ?').run(id);

}
exports.get_cart = function(session_id) {
    let found = db.prepare('SELECT *, SUM(p.price) AS total FROM cart c JOIN product p ON c.product_id = p.id WHERE session_id = ? ');
    return found;
    
};

exports.save_order = function(cart,payment_id,receipt_email) {
    let c = get_cart();
    let total_price = 0;
    for(i in c){
        total_price += i.total;
    }
    db.prepare('INSERT INTO passed_order VALUES (receipt_email,payment_id,total_price)').run(receipt_email,payment_id,total_price);
    for (i in c){
        db.prepare('INSERT INTO order_cart VALUES (i.product_id,(SELECT order_id FROM passed_order LIMIT 1 ORDER BY order_id description))').run(receipt_email,payment_id,total_price);

    }
    
    
  };






