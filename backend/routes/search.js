const express = require('express');
const pool = require('../db');
const router = express.Router()

router.get('/searching', async (req, res) => {
    const searchTerm = req.query.searchTerm;
  
    // Extract search criteria from searchTerm string
    const queryParams = {};
  
    const partyNameMatch = searchTerm.match(/Party_Name:(.*?)(?=,|$)/);
    if (partyNameMatch) {
      queryParams.Party_Name = mysql.escape(partyNameMatch[1].trim());
    }
  
    const startDateMatch = searchTerm.match(/start_date:(.*?)(?=,|$)/);
    if (startDateMatch) {
      queryParams.start_date = mysql.escape(startDateMatch[1].trim());
    }
  
    const endDateMatch = searchTerm.match(/end_date:(.*?)(?=,|$)/);
    if (endDateMatch) {
      queryParams.end_date = mysql.escape(endDateMatch[1].trim());
    }
  
    const paymentStatusMatch = searchTerm.match(/payment_status:(.*?)(?=,|$)/);
    if (paymentStatusMatch) {
      queryParams.Payment_Status = mysql.escape(paymentStatusMatch[1].trim());
    }
  
    // Construct the SQL query with placeholders for sanitized values
    let sql = `SELECT * FROM your_table`;
    let whereClause = [];
  
    if (queryParams.Party_Name) {
      whereClause.push(`Party_Name LIKE ?`);
    }
  
    if (queryParams.start_date && queryParams.end_date) {
      whereClause.push(`Order_Date BETWEEN ? AND ?`);
    } else if (queryParams.start_date) {
      whereClause.push(`Order_Date >= ?`);
    } else if (queryParams.end_date) {
      whereClause.push(`Order_Date <= ?`);
    }
  
    if (queryParams.Payment_Status) {
      whereClause.push(`Payment_Status = ?`);
    }
  
    if (whereClause.length > 0) {
      sql += ` WHERE ${whereClause.join(' AND ')}`;
    }
  
    try {
      const [rows] = await pool.query(sql, Object.values(queryParams));
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    }
  });
  module.exports=router