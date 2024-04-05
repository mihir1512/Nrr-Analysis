const { calculateNrr } = require('../helpers/calculateNrr.helper')
const { convertToDecimal } = require('../helpers/decimalConversion.helper')
const { solveInequality } = require('../helpers/solveInequality.helper')
const { convertToExactOver } = require('../helpers/exactOverConversion.helper')
const {generateResponse}=require("../helpers/generateResponse.helper")


exports.generateAnalysis = (param) => {
    let {
        sortedPointTable,
        selectedTeam,
        oppositionTeam,
        targetPositionTeam,
        firstInningRuns,
        exactOvers,
        decimalOvers,
        targetPosition,
        tossResult
         } = param


    //geeting target position team Data
    const targetPositionTeamRuns = parseInt(targetPositionTeam.for.split('/')[0])
    const targetPositionTeamOvers = convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    const targetPositionAgainstRuns = parseInt(targetPositionTeam.against.split('/')[0])
    const targetPositionAgainstOvers = convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    //getting selected team data
    const selectedTeamForRuns = parseInt(selectedTeam.for.split('/')[0])
    const selectedTeamForOvers = convertToDecimal(parseFloat(selectedTeam.for.split('/')[1]))
    const selectedTeamAgainstRuns = parseInt(selectedTeam.against.split('/')[0])
    const selectedTeamAgainstOvers = convertToDecimal(parseFloat(selectedTeam.against.split('/')[1]))
    //geeting above target position team data
    const isAboveTargetPositionTeamExist= (targetPosition-2>=0) ? true : false
    const aboveTargetPositionTeam= isAboveTargetPositionTeamExist ? sortedPointTable[targetPosition-2] : null
    const aboveTargetPositionTeamForRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.for.split('/')[0]) : null
    const aboveTargetPositionTeamForOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.for.split('/')[1])) : null
    const aboveTargetPositionTeamAgainstRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.against.split('/')[0]) : null
    const aboveTargetPositionTeamAgainstOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.against.split('/')[1])) : null

    const solveInequalityArgs = {
        selectedTeamForRuns,
        selectedTeamForOvers,
        selectedTeamAgainstRuns,
        selectedTeamAgainstOvers,
        firstInningRuns,
        decimalOvers,
        tossResult,
        oppositionTeam,
        targetPositionTeam,
    }

    if(targetPositionTeam.pts===favouriteTeam.pts)
    {
        if(isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts)
        {
            console.log(/case1/);
            const response=`You can't reach at position ${position}`
            return response
        }
        else if(isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts===selectedTeam.pts+2)
        {
            console.log(/case2/);
            const higherRunsOrOvers=(tossResult==="bowling") ? decimalOvers : firstInningRuns-1

            solveInequalityArgs.f=aboveTargetPositionTeam.nrr
            solveInequalityArgs.g=aboveTargetPositionTeamForRuns
            solveInequalityArgs.h=aboveTargetPositionTeamForOvers
            solveInequalityArgs.i=aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.j=aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown=(aboveTargetPositionTeam.team===oppositionTeam) ? false : true

            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)
        
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else
        {
            console.log(/case3/);
            const higherRunsOrOvers=(tossResult==="bowling") ? decimalOvers : firstInningRuns-1
            const lowerRunsOrOvers=0

            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }
    else if(targetPositionTeam.team===oppositionTeam)
    {
        if(isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts===targetPositionTeam.pts)
        {
            console.log(/case4/);
            solveInequalityArgs.f=aboveTargetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown=true
            const lowerRunsOrOvers= solveInequality(solveInequalityArgs)
          
            solveInequalityArgs.f=targetPositionTeam.nrr
            solveInequalityArgs.g=targetPositionTeamRuns
            solveInequalityArgs.h=targetPositionTeamOvers
            solveInequalityArgs.i=targetPositionAgainstRuns
            solveInequalityArgs.j=targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown=false
            const higherRunsOrOvers=solveInequality(solveInequalityArgs)       
      
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else{
            console.log(/case5/);
            const  lowerRunsOrOvers=0
            solveInequalityArgs.f=targetPositionTeam.nrr
            solveInequalityArgs.g=targetPositionTeamRuns
            solveInequalityArgs.h=targetPositionTeamOvers
            solveInequalityArgs.i=targetPositionAgainstRuns
            solveInequalityArgs.j=targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown=false
            const higherRunsOrOvers=solveInequality(solveInequalityArgs)  
          
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }
    else if(targetPositionTeam.team!=oppositionTeam)
    {
        if(isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts===targetPositionTeam.pts)
        {
            console.log(/case6/);
            solveInequalityArgs.f=aboveTargetPositionTeam.nrr
            solveInequalityArgs.g=aboveTargetPositionTeamForRuns
            solveInequalityArgs.h=aboveTargetPositionTeamForOvers
            solveInequalityArgs.i=aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.j=aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = (oppositionTeam===aboveTargetPositionTeam.team) ? false : true

            const lowerRunsOrOvers=solveInequality(solveInequalityArgs)
            
            solveInequalityArgs.f=targetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown=true

            const higherRunsOrOvers=solveInequality(solveInequalityArgs)
            
            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
        else{
            console.log(/case7/);
            const lowerRunsOrOvers=0
            solveInequalityArgs.f=targetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown=true
            const higherRunsOrOvers=solveInequality(solveInequalityArgs)
            // if(!(y>=0)) return `You Can't Reach At Position ${position}`

            const response=generateResponse({x,y,b,k,tossResult,exactOver,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers,oppositionTeam,position})
            return response
        }
    }



    

}