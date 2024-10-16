const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put("/editCompany", (req, res) => {
    const { project_name, project_details, planType, plan, id } = req.body;

    pool.query("UPDATE company_settings SET project_name = ?, project_details = ?, plan_type = ?, plan = ? WHERE id = ?", [project_name, project_details, planType, plan, id], (selectErr, selectResult) => {
        if (selectErr) {
            console.error("Error checking for duplicate user:", selectErr);
            return res.status(500).json({ error: selectErr });
        }
        console.log(selectResult)
        res.status(200).json({ result: selectResult, message: 'Project/Service edited successfully', success: true });
    })
    
});

module.exports = router;
