const express=require('express')
const app=express()
const resultRoutes=require('./routes/resultRoutes')


app.use(express.json())
app.use('/result',resultRoutes)

const port=3000
app.listen(port,()=>{
    console.log(`Server is listening at port:${port}`);
})