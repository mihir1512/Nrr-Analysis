
const{calculateNrr}=require('./calculateNrr')
const{convertToDecimal}=require('./decimalConversion')
const{solveInequality}=require('./solveInequality')
const{convertToExactOver}=require('./exactOverConversion')

const calculateRespForAboveposition=(param)=>{
    let {favouriteTeam,oppositionTeam,targetPositionTeam,runs:b,tossResult,exactOver,decimalOvers:k,position,sortedData}=param

    let desiredTeamNrr=f=targetPositionTeam.nrr

    let targetPositionTeamRuns=g=parseInt(targetPositionTeam.for.split('/')[0])
    let tagetPositionTeamOvers=h=convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    let targetPositionAgainstRuns=i=parseInt(targetPositionTeam.against.split('/')[0])
    let targetPositionAgainstOvers=j=convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    
    let favouriteTeamRuns=a=parseInt(favouriteTeam.for.split('/')[0])
    let favouriteTeamOvers=c=convertToDecimal(parseFloat(favouriteTeam.for.split('/')[1]))
    let favouriteTeamAgainstRuns=d=parseInt(favouriteTeam.against.split('/')[0])
    let favouriteTeamAgainstOvers=e=convertToDecimal(parseFloat(favouriteTeam.against.split('/')[1]))



    if(favouriteTeam.pts===targetPositionTeam.pts )
    {
        if(position-2>=0 && sortedData[position-2].pts==favouriteTeam.pts+2)
        {           
            const obj={a,b,c,d,e,f:sortedData[position-2].nrr,g,h,i,j,k,tossResult,oppositionTeam,targetPositionTeam,check:false}
            const x=solveInequality(obj)
            if(tossResult==='bowling')
            {
                const dbOver=convertToDecimal(x)
                const higherNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+dbOver,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)
                const lowerNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+20,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)

                console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                const lowerOver=x
                const higherOver=convertToExactOver(k)
                const resp=`->If ${favouriteTeam.team} need to chase ${b+1} runs between ${lowerOver} and ${higherOver} overs.
                -> Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}`
                return resp
            }
            else{
                const runs=x
                const higherNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+x,favouriteTeamAgainstOvers+k)
                const lowerNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+b-1,favouriteTeamAgainstOvers+k)

                console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                const lowerRun=Math.ceil(x)
                const higherRuns=b-1
                const resp=`o If ${favouriteTeam.team} score ${b} runs in ${exactOver},${favouriteTeam.team} need to
                restrict ${oppositionTeam} between ${lowerRun} to ${higherRuns} runs in ${exactOver}.
                o Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}.`
                return resp
            }
            
           
        }
    }
   
}

exports.resultForAbovePosition=(param,req,res)=>{
    const {favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position,sortedData,exactOver}=param
    if(favouriteTeam.pts+2<targetPositionTeam.pts)
    {           
        return res.status(200).json({msg:`Your team can't reach at position ${position}`})
    }
    else if(favouriteTeam.pts===targetPositionTeam.pts )
    {
        if(position-2>=0 && sortedData[position-2].pts===favouriteTeam.pts)
        {
            return res.status(200).json({msg:`Your team can't reach at position ${position}`})
        }
        else if(position-2>=0 && sortedData[position-2].pts==favouriteTeam.pts+2)
        {
            if(sortedData[position-2].nrr<=favouriteTeam.nrr)
            {
                return res.status(200).json({msg:`Your team can't reach at position ${position}`})
            }
            else
            {
                // resultnrr<targetposition-2teamnrr
                // range=(resultnrr<tagetposition-2teamnrr)
                const result=calculateRespForAboveposition(param)
                return res.status(200).json({result})
            }
        }
    
        
    }
    else{
        if(oppositionTeam.team===targetPositionTeam.team)
        {
            //1.solve quadratic
        }
        else
        {
            //linear
        }
    }
    // const nrr=calculateNrr(param)
}