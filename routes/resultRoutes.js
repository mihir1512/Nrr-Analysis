const express=require('express')
const router=express.Router()
const {fetchTeams,getResult}=require('../controllers/resultControllers')


router.get('/teams',fetchTeams)
router.post('/',getResult)

module.exports=router