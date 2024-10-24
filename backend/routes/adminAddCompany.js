const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require("multer");
const path = require("path");
const PLAN_STATUS = require('../constants/constants');

router.post("/addCompany", (req, res) => {
    const { plan_type, registered_on, purchased_on, expiring_on, project_name, project_details,id, } = req.body;
    const plan_status = PLAN_STATUS.NOT_STARTED;
    pool.query("INSERT INTO company_settings (id, plan_status, plan_type, project_name, project_details , registered_on, purchased_on, expiring_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, plan_status , plan_type, project_name, project_details, registered_on.slice(0, 19).replace('T', ' '), purchased_on ? purchased_on.slice(0, 19).replace('T', ' ') : null, expiring_on ? expiring_on.slice(0, 19).replace('T', ' ') : null], (selectErr, insertResult) => {
        if (selectErr) {
            console.error("Error checking for duplicate user:", selectErr);
            return res.status(500).json({ error: selectErr });
        }
        res.status(200).json({ result: insertResult, message: 'Project added successfully', success: true });
    })
});

module.exports = router;
