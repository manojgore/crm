const express = require('express');
const bodyParser = require('body-parser');
const multer=require("multer")
const path = require("path")
const pool = require('./db');
const cors = require('cors');
const addCustomerRoutes = require('./routes/addCustomerRoutes');
const adminRoute=require('./routes/addAdmin')
const verifyEmail=require('./routes/verifyEmail')
const addCoustomer=require("./routes/addCustomer")
const addInovice=require("./routes/addInvoice")
const addVendors=require("./routes/addVendors")
const companySettings=require("./routes/companySettings")
const addCompany_self_profile=require("./routes/addCompany_self_profile")
const searchAPI=require("./routes/searchAPI")
const email_verification=require("./routes/email-verification")
const account_settings=require("./routes/account_settings")
const searchExpense=require("./routes/searchExpense")
const addExpenses=require("./routes/addExpenses")
const updateaccountsettiings=require("./routes/updateAccountSettings")
const updateCompanySettings=require("./routes/updateCompanySettings");
const vendor_settings=require("./routes/vendor_settings")
const userlogin=require("./routes/userlogin")
const checksubscription = require('./routes/checkSubscription');
// const searchAPI1=require("./routes/searchAPI1")
// const searchAPI2=require("./routes/searchAPI2")
// const searchAPI3=require("./routes/searchAPI3");
const search =require("./routes/search");
const checkRole = require('./routes/checkRole');
const getAllInvoices = require('./routes/getAllInvoices');
const getAllProjects = require('./routes/getProjects');
const adminaddcompany = require('./routes/adminAddCompany');
const admindeletecompany = require('./routes/adminDeleteCompany');
const adminEditCompany = require('./routes/editCompany');
const getAllPackages = require('./routes/getAllPackages');
const addPackage = require('./routes/addPackages');
const deletePackage = require('./routes/deletePackage');
const editPackage = require('./routes/editPackages');
const getUserDetails = require('./routes/getUserDetails');
const cancellSubscription = require('./routes/cancellSubscription');
const getAccountSettiings = require('./routes/getAccountSettings');
const getCompanySettiings = require('./routes/getCompanySettings');
const subscribe = require('./routes/subscribe');
const initiatePayment = require('./routes/initiatePayment');
const checkPayment = require('./routes/checkPayment');
const addInvoiceFromCsv = require('./routes/addInvoiceFromCsv');
const editInvoice = require('./routes/editinvoice');
const deleteInvoice = require('./routes/deleteInvoice');
const editExpenses = require('./routes/editExpenses');
const deleteExpenses = require('./routes/deleteExpenses');
const getAllCustomers = require('./routes/getAllCustomer');
const taxFile = require('./routes/taxFile');
const checkTaxFile = require('./routes/checkTaxFileStatus');
const getAllTaxFiles = require('./routes/getAllTaxFiles');
const deleteTaxFile = require('./routes/deleteTaxFile');
const rejectTaxFile = require('./routes/rejectTaxfile');
const updateMobile = require('./routes/updateMobile');
const changePassword = require('./routes/changeUserPassword');
const checkUser = require('./routes/checkUserExistance');
const addItems = require('./routes/addItem');
const getAllItems = require('./routes/getAllItems');
const editItem = require('./routes/editItem');
const deleteItem = require('./routes/deleteItem');
const sendMobileOtp = require('./routes/mobileVerification');
const sendforgotpassmail = require('./routes/SendForgotPassOtop');
const resetpass = require('./routes/resetPass');
const editCustomer = require('./routes/editCustomer');
const deleteCustomer = require('./routes/deleteCustomer');
const getAllVendors = require('./routes/getAllVendors');
const deleteVendor = require('./routes/deleteVendor');
const editVendor = require('./routes/editVendor');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '100mb'}));
app.use(cors());
//-----------------------------------image uploading function
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "../accountsettings"));
    },
    filename: (req, file, callback) => {
        const name = Date.now() + '-' + file.originalname;
        callback(null, name);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//-----------------------------------image uploading function
// Routes
app.use('/api/customers', addCustomerRoutes);
app.use('/api/customers', updateMobile);
app.use('/api/customers', getAllCustomers);
app.use('/api/customers', editCustomer);
app.use('/api/customers', deleteCustomer);
app.use('/api/email',email_verification);
app.use('/api/email',sendforgotpassmail);
app.use('/api/sms', sendMobileOtp);
app.use('/api/admin',adminRoute) //admin + customer login
app.use('/api/customer',addCoustomer)
app.use('/api/invoices',addInovice)
app.use('/api/invoices',addInvoiceFromCsv)
app.use('/api/invoices',editInvoice)
app.use('/api/invoices',deleteInvoice)
app.use('/api/invoices', getAllInvoices)
app.use('/api/items', addItems)
app.use('/api/items', getAllItems)
app.use('/api/items', editItem)
app.use('/api/items', deleteItem)
app.use('/api/vendors',addVendors)
app.use('/api/settings',companySettings)
app.use('/api/update',updateaccountsettiings)
app.use('/api/companyprofile',addCompany_self_profile)
// app.use("/searchAPI",searchAPI)
// app.use("/searchAPI",searchAPI1)
// app.use("/searchAPI",searchAPI2)
// app.use("/searchAPI",searchAPI3)
app.use("/searchAPI",search)
app.use("/expenses",searchExpense)
app.use("/api/expenses",addExpenses)
app.use("/api/expenses",editExpenses)
app.use("/api/expenses",deleteExpenses)
app.use("/api/user", userlogin)
app.use("/api/user", resetpass)
app.use("/api/user", checkUser)
app.use("/api/account",account_settings)
app.use("/api/update",updateCompanySettings)
app.use("/api/vendors",vendor_settings)
app.use("/api/vendors",getAllVendors)
app.use("/api/vendors",deleteVendor)
app.use("/api/vendors",editVendor)
app.post("/mail-verification",verifyEmail)
app.use("/customer", checksubscription);
app.use("/admin", getAllProjects);
app.use('/admin', adminaddcompany);
app.use('/admin', admindeletecompany);
app.use('/admin', adminEditCompany);
app.use('/admin', getAllPackages);
app.use('/admin', addPackage);
app.use('/admin', deletePackage);
app.use('/admin', editPackage);
app.use('/admin', getUserDetails);
app.use('/admin', cancellSubscription);
app.use('/admin', getAllTaxFiles);
app.use('/admin', deleteTaxFile);
app.use('/admin', rejectTaxFile);
app.use('/api/get', getAccountSettiings);
app.use('/api/get', getCompanySettiings);
app.use('/api/user', subscribe);
app.use('/api/user', initiatePayment);
app.use('/api/user/', checkPayment);
app.use('/api/user/', taxFile);
app.use('/api/user/', checkTaxFile);
app.post("/checkrole", checkRole);
app.put("/imageAcc",upload.single("image"),(req,res)=>{
   const { PANNo,image}=req.body
   pool.query("UPDATE accountsettings SET image = ? WHERE PANNo = ?",[image,PANNo],(error,result)=>{
    if (error) {
        console.error('Error updating data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No records found for the given PANNo' });
    }

    // Send a success response
    return res.status(200).json({ message: 'Data updated successfully' });

   })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
