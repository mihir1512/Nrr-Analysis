
const pointTable=require('../src/data/pointTable.json')
const{convertToDecimal}=require('../src/helperFunction/decimalConversion')

const{solveResultForFirstCase}=require('../src/helperFunction/resultFirstCase')
const{resultForAbovePosition}=require('../src/helperFunction/resultOtherCases')
const{solveResultForSecondCase,}=require('../src/helperFunction/resultSecondCase')


exports.fetchTeams=(req,res)=>{
    try {
        const teams=pointTable.map(item=>item.team)
        console.log(`[Teams]-[${JSON.stringify(teams)}]`);
        return res.status(200).json(teams)
    } catch (error) {
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}

const compareFn=(item1,item2)=>{
    if(item1.pts===item2.pts)
    {
        return item2.nrr-item1.nrr
    }
    return item2.pts-item1.pts
}

exports.getResult=(req,res)=>{
    try {
        
        const sortedData=pointTable.sort(compareFn)
        let {yourTeam,oppositionTeam,over,position,runs,tossResult}=req.body
        runs=parseInt(runs)
        over=parseFloat(over)
        position=parseInt(position)
        const targetPositionTeam=sortedData[position-1]
        const favouriteTeam=sortedData.find(item=>item.team===yourTeam)

       
        const decimalOvers=convertToDecimal(over)

        const bodyObj={favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position,sortedData,exactOver:over}
        const currentPosition= sortedData.findIndex(item => item.team=== favouriteTeam.team)+1;
     

        if(favouriteTeam.team==='Rajasthan Royals' && oppositionTeam==="Delhi Capitals" &&position===3)
        {
            const result=solveResultForFirstCase(bodyObj)
            return res.status(200).json({msg:result})
        }
        else if(favouriteTeam.team==='Rajasthan Royals' && oppositionTeam==="Royal Challengers Bangalore" &&position===3)
        {
            const result=solveResultForSecondCase(bodyObj)
            return res.status(200).json({msg:result})
        }
        else{
            
        }
    

        return res.status(200).json({msg:"Invalid Input"})
    } catch (error) {
        console.log(error);
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}