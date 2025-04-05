// importing built in modules
const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

// importing user defined modules
const result = require('../utils/result')
const pool = require('../db/db')
const config = require('../utils/config')

const router = express.Router()

router.post('/registration', (req, res) =>{
    const { firstName, lastName, email, password, phone} = req.body
    const encryptedPassword = String(cryptoJs.SHA256(password))
    
    // sql query
    const sql = `INSERT INTO user (firstName, lastName, email, password, phoneNumber)
                VALUES (?, ?, ?, ?, ?) `
    pool.query(sql, [firstName, lastName, email, encryptedPassword, phone ], (error, data) => {
        
        res.send(result.createResult(error, data))
    })
})

router.post('/login', (req,res) =>{
    const {email, password} = req.body
    const encryptedPassword = String(cryptoJs.SHA256(password))
    // sql query
    const sql = `SELECT * FROM user WHERE email = ? AND password = ?`
    pool.query(sql, [email, encryptedPassword], (error, data) => {
        // create the token and send to the user inside the response body
        
        // if data is present 
        if(data){
            // data is there means some row is fetched
            if(data.length != 0){
                // creating payload for creating token 
                // token needs three things
                // 1) header 2) payload data (e.g id of user) 3) signature (i.e secret key)
                const payload = {
                    userId: data[0].id
                }
                const token = jwt.sign(payload, config.secret)
                const body = {
                    token : token,
                    name: `${data[0].firstName} ${data[0].lastName}`
                }
                res.send(result.createSuccessResult(body))
            }
            // mysql returned an empty set
            else{
                res.send(result.createErrorResult("Invalid email or password"))
            }
        }
        // mysql had given some error 
        else{
            res.send(result.createErrorResult(error))
        }
    })
})
router.get('/profile', (req, res) => {
    const sql = `SELECT firstName, lastName, phoneNumber, email FROM user WHERE id = ?`
    pool.query(sql, [req.headers.userId], (error, data) => {
        res.send(result.createResult(error, data))
    })
})
router.put('/profile', (req, res) => {
    const { firstName, lastName, phone } = req.body
    console.log("req.headers.userId "+req.headers.userId);
    
    const sql = `UPDATE user SET firstName=?, lastName=?, phoneNumber=? WHERE id = ?`
    pool.query(sql, [firstName, lastName, phone, req.headers.userId], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

module.exports = router