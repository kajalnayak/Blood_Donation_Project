const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path=require('path');


dotenv.config(); 
connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api/v1/auth',require('./routes/authroutes'));
app.use('/api/v1/inventory',require('./routes/inventoryroutes'));
app.use('/api/v1/analytics',require('./routes/analyticsRoutes'));
app.use("/api/v1/admin",require('./routes/adminRoutes'));


app.use(express.static(Path2D.join(__dirname,'./client/build')))


app.get('*',function(req,res){
    res.sendFile(Path2D.join(__dirname))
})


const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

