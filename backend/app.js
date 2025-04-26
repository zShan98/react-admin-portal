const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./utils/error-handler');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const verifyRoutes = require('./routes/verify-payment')
const registerRoutes = require('./routes/register')


const app = express();



app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/portal', dashboardRoutes)
app.use('/portal', registerRoutes)
app.use('/verification', verifyRoutes)

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// app.get("/", (res) => {
    
//   res.status(200).json({connection: "PR Portal Server is running"})

// })

app.use(errorHandler);



module.exports = app;
