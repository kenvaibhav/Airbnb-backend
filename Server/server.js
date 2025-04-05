
const express = require('express')

const userRouter = require('./routes/user')
const authorization = require('./routes/authorization')

const app = express()

app.use(express.json())
app.use(authorization)
app.use('/users', userRouter)

app.listen(4000, 'localhost', () => {
    console.log('server started at port no 4000')
})