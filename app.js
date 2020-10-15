const express = require('express')
const app = express()
const port = process.env.port || 5000
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use('/api/v1',authRoutes);


app.listen(port,() =>
{
    console.log(`listening on port ${port}`);
})