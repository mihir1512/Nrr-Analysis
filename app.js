const express=require('express')
const app=express()
const cors=require('cors')
const resultRoutes=require('./src/routes/resultRoutes.route')

app.use(cors())
app.use(express.json())
app.use('/result',resultRoutes)

const port=3000
app.listen(port,()=>{
    console.log(`Server is listening at port:${port}`);
})