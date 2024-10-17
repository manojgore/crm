const express = require('express');
const router = express.Router();
const pool = require('../db');
const { JSON } = require('mysql/lib/protocol/constants/types');

router.get('/getallProjects', async(req, res)=>{
    const { id } = req.headers || undefined;
   try {
        pool.query("SELECT company_settings.*, customers.name, customers.email,customers.number FROM company_settings JOIN customers ON company_settings.id = customers.owner_id", (err, results) => {
            if (err) {
                console.error("Error to fetch all Projects", err);
                return res.status(500).json({ error: err, success: false }); 
            }
            if (results && results.length > 0) {
                if(id != undefined) {
                    results = results.filter((project)=>{return project.id == id});
                    return res.status(200).json({ success:true , results: results});
                } 
                return res.status(200).json({ success:true , results: results});
            } else {
                return res.status(200).json({ success: false, msg: "no Projects where found" });   
            }
        });
   } catch (error) {
        console.log("Some error occured while fetching from database")
   } 
});

module.exports = router;