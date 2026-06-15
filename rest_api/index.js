require('dotenv').config()
const express = require('express');
const BlogRouter = require('./routes/blog')
const app = express()

app.use(express.json())
app.use('/blog', BlogRouter)

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running command http://localhost:${PORT}`)
})