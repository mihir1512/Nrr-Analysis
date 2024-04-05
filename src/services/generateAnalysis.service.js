const { calculateNrr } = require('../helpers/calculateNrr.helper')
const { convertToDecimal } = require('../helpers/decimalConversion.helper')
const { solveInequality } = require('../helpers/solveInequality.helper')
const { convertToExactOver } = require('../helpers/exactOverConversion.helper')
const {generateResponse}=require("../helpers/generateResponse.helper")


exports.generateAnalysis = (param) => {
    let {
        favouriteTeam,
        oppositionTeam,
        targetPositionTeam,
        runs: b,
        tossResult,
        exactOver,
        decimalOvers: k,
        position,
        sortedData } = param

    let desiredTeamNrr = f = targetPositionTeam.nrr

    //geeting target position team Data
    const targetPositionTeamRuns = parseInt(targetPositionTeam.for.split('/')[0])
    const targetPositionTeamOvers = convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    const targetPositionAgainstRuns = parseInt(targetPositionTeam.against.split('/')[0])
    const targetPositionAgainstOvers = convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    //getting slected team data
    const favouriteTeamRuns = parseInt(favouriteTeam.for.split('/')[0])
    const favouriteTeamOvers = convertToDecimal(parseFloat(favouriteTeam.for.split('/')[1]))
    const favouriteTeamAgainstRuns = parseInt(favouriteTeam.against.split('/')[0])
    const favouriteTeamAgainstOvers = convertToDecimal(parseFloat(favouriteTeam.against.split('/')[1]))

    let inequalityObj1, inequalityObj2

    inequalityObj1 = {
        a: favouriteTeamRuns,
        b,
        c: favouriteTeamOvers,
        d: favouriteTeamAgainstRuns,
        e: favouriteTeamAgainstOvers,
        k,
        tossResult,
        oppositionTeam,
        targetPositionTeam,
    }

    if(targetPositionTeam.pts===favouriteTeam.pts)
    {
        if(position-2>=0 && sortedData[position-2].pts=== favouriteTeam.pts)
        {
            console.log(/case1/);
            const response=`You can't reach at position ${position}`
            return response
        }
        else if(position-2>=0 && sortedData[position-2].pts===favouriteTeam.pts+2)
        {
            console.log(/case2/);
            let y=(tossResult==="bowling") ? k : b-1

            inequalityObj1.f=sortedData[position-2].nrr
            inequalityObj1.g=parseInt(sortedData[position - 2].for.split('/')[0])
            inequalityObj1.h=convertToDecimal(parseFloat(sortedData[position - 2].for.split('/')[1]))
            inequalityObj1.i=parseInt(sortedData[position - 2].against.split('/')[0])
            inequalityObj1.j=convertToDecimal(parseFloat(sortedData[position - 2].against.split('/')[1]))
            inequalityObj1.check=(sortedData[position-2].team===oppositionTeam) ? true : false

            let x = solveInequality(inequalityObj1)
        
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else
        {
            console.log(/case3/);
            let y=(tossResult==="bowling") ? k : b-1
            let x=0

            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }
    else if(targetPositionTeam.team===oppositionTeam)
    {
        if(position-2>=0 && sortedData[position-2].pts===targetPositionTeam.pts)
        {
            console.log(/case4/);
            inequalityObj1.f=sortedData[position-2].nrr
            inequalityObj1.check=false
            let x= solveInequality(inequalityObj1)
          
            inequalityObj1.f=targetPositionTeam.nrr
            inequalityObj1.g=targetPositionTeamRuns
            inequalityObj1.h=targetPositionTeamOvers
            inequalityObj1.i=targetPositionAgainstRuns
            inequalityObj1.j=targetPositionAgainstOvers
            inequalityObj1.check=true
            let y=solveInequality(inequalityObj1)       
      
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else{
            console.log(/case5/);
            let x=0
            inequalityObj1.f=targetPositionTeam.nrr
            inequalityObj1.g=targetPositionTeamRuns
            inequalityObj1.h=targetPositionTeamOvers
            inequalityObj1.i=targetPositionAgainstRuns
            inequalityObj1.j=targetPositionAgainstOvers
            inequalityObj1.check=true
            let y=solveInequality(inequalityObj1)  
          
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }
    else if(targetPositionTeam.team!=oppositionTeam)
    {
        if(position-2>=0 && sortedData[position-2].pts===targetPositionTeam.pts)
        {
            console.log(/case6/);
            inequalityObj1.f=sortedData[position-2].nrr
            inequalityObj1.g=parseInt(sortedData[position - 2].for.split('/')[0])
            inequalityObj1.h=convertToDecimal(parseFloat(sortedData[position - 2].for.split('/')[1]))
            inequalityObj1.i=parseInt(sortedData[position - 2].against.split('/')[0])
            inequalityObj1.j=convertToDecimal(parseFloat(sortedData[position - 2].against.split('/')[1]))
            inequalityObj1.check= (oppositionTeam===sortedData[position-2].team) ? true : false

            let x=solveInequality(inequalityObj1)
            
            inequalityObj1.f=targetPositionTeam.nrr
            inequalityObj1.check=false

            let y=solveInequality(inequalityObj1)
            
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else{
            console.log(/case7/);
            let x=0
            inequalityObj1.f=targetPositionTeam.nrr
            inequalityObj1.check=false
            let y=solveInequality(inequalityObj1)
            if(!(y>=0)) return `You Can't Reach At Position ${position}`

            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }



    

}