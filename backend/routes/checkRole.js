const express = require('express');
const router = express.Router();
const pool = require('../db');

const checkRole = async(req, res) => {
    const { id } = req.body;

    try {
        pool.query('SELECT * FROM customer_registration WHERE id = ?', [id], (err, results) => {
            if(results[0].role === 'admin'){
                return res.status(201).json({ message: 'Customer is subscribed',  role: 'admin'});
            }else{
                return res.status(201).json({ message: 'Customer is not subscribed',  role: 'customer'});
            }
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        return res.status(500).json({ error: error });
    }
}

module.exports = checkRole;