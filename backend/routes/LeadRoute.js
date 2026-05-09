import express from 'express'
import Leads from '../models/Lead.js'

const router = express.Router()

router.get('/',async(req,res)=>{
    try{
        const leads = await Leads.find().sort({createdAt: -1})
        res.status(200).json(leads)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})
export default router