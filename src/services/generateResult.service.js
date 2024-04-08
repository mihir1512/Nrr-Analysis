const { convertToDecimal } = require('../utils/result.utils')
const { solveInequality } = require('../helpers/solveInequality.helper')
const { generateResponse } = require("../helpers/generateResponse.helper")

// Exporting the function generateResult
exports.generateResult = (param) => {
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

    // Getting data for target position team
    const targetPositionTeamRuns = parseInt(targetPositionTeam.for.split('/')[0])
    const targetPositionTeamOvers = convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    const targetPositionAgainstRuns = parseInt(targetPositionTeam.against.split('/')[0])
    const targetPositionAgainstOvers = convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))

    // Getting data for selected team
    const selectedTeamForRuns = parseInt(selectedTeam.for.split('/')[0])
    const selectedTeamForOvers = convertToDecimal(parseFloat(selectedTeam.for.split('/')[1]))
    const selectedTeamAgainstRuns = parseInt(selectedTeam.against.split('/')[0])
    const selectedTeamAgainstOvers = convertToDecimal(parseFloat(selectedTeam.against.split('/')[1]))

    // Getting data for the team above the target position team
    // if team above targget position team doesn't exist then we set null as value
    const isAboveTargetPositionTeamExist = (targetPosition - 2 >= 0) ? true : false
    const aboveTargetPositionTeam = isAboveTargetPositionTeamExist ? sortedPointTable[targetPosition - 2] : null
    const aboveTargetPositionTeamForRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.for.split('/')[0]) : null
    const aboveTargetPositionTeamForOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.for.split('/')[1])) : null
    const aboveTargetPositionTeamAgainstRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.against.split('/')[0]) : null
    const aboveTargetPositionTeamAgainstOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.against.split('/')[1])) : null

    // Common arguments for solveInequality function
    const solveInequalityCommonArgs = {
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

    // Common arguments for generateResponse function
    const generateResponeCommonArgs = {
        firstInningRuns,
        decimalOvers,
        tossResult,
        exactOvers,
        selectedTeam,
        selectedTeamForRuns,
        selectedTeamForOvers,
        selectedTeamAgainstRuns,
        selectedTeamAgainstOvers,
        oppositionTeam,
        targetPosition
    }

    // Logic for handling different cases
    if (targetPositionTeam.pts === selectedTeam.pts) {
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts) {
            // Case 1: If target position team and selected team have the same points and the team above them also has the same points
            //in  this case if selectedTeam win then selectedTeam will reach position above target position so selectedTeam can't reach 
            // target position
            const response = `${selectedTeam.team} can't reach at position ${position}`
            return response
        }
        else if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts + 2) {
            // Case 2: If target position team and selected team have the same points but the team above them has 2 points more
            //In this case if selected win then it will have same points as teamAboveTargetPosition
            //So if selectedTeam have nrr greater then aboveTargetPositionTeam nrr then selectedTeam wiil reach at aboveTargetPositionTeam position 
            //so our higherNrr should be less then above target position team nrr
           

            //calculate  enequality equation for higherRunsOrOvers
            const higherRunsOrOvers = (tossResult === "bowling") ? decimalOvers : firstInningRuns - 1
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = aboveTargetPositionTeamForRuns
            solveInequalityArgs.comparedTeamForOvers = aboveTargetPositionTeamForOvers
            solveInequalityArgs.comparedTeamAgainstRuns = aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = (aboveTargetPositionTeam.team === oppositionTeam) ? false : true

            //calculate  enequality equation for lowerRunsOrovers
            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)
            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)
            return response.msg
        }
        else {
            // Case 3: If target position team and selected team have the same points and no team above them has the same points
            //In this case selectedTeam just need to win so we are getting as lowestRunsorOvers and highestRunsOrOvers posiible to win the match to caclualte higherNrr and lowerNrr
            const higherRunsOrOvers = (tossResult === "bowling") ? decimalOvers : firstInningRuns - 1
            const lowerRunsOrOvers = 0
            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)
            return response.msg
        }
    }
    else if (targetPositionTeam.team === oppositionTeam) {
        //in this case limitNNrr is dynamically determined
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === targetPositionTeam.pts) {
            // Case 4: If target position team is the opposition team and the team above them has the same points
            //In this case we have targetPositionteam points same as team above target position 
            //so or higherNrr should be lessthen aboveTargetPostion team nrr
            // lowerNrr should be greater then targetPositionteam nrr so that selected team can reach target position
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown = true

            //solve Enequality equation for calculating lowerRundOrOvers
            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)

            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = targetPositionTeamRuns
            solveInequalityArgs.comparedTeamForOvers = targetPositionTeamOvers
            solveInequalityArgs.comparedTeamAgainstRuns = targetPositionAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = false

            //solve Enequality equation for calculating higherRunsOrOvers
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)

            //if below target position team exist and selected team lowerNrr after match  is less than below target team nrr then we have to make sure that it is greater then below target position team nrr so that we can reach at target position
            //So we have to calculate lowerNrr again keeping limitNrr as below target position team nrr
            const isbelowTargetPositionTeamExist = (targetPosition < sortedPointTable.length) ? true : false
            const belowTargetPositionTeam = isbelowTargetPositionTeamExist ? sortedPointTable[targetPosition] : null

            if (isbelowTargetPositionTeamExist && belowTargetPositionTeam.team != selectedTeam.team && targetPositionTeam.pts === belowTargetPositionTeam.pts && response.hasOwnProperty("lowerNrr") && belowTargetPositionTeam.nrr >= response.lowerNrr) {
                if (response.higherNrr < belowTargetPositionTeam.nrr) {
                    return `${selectedTeam.team} can't Reach At position ${targetPosition}`
                }
                solveInequalityArgs.limitNrr = belowTargetPositionTeam.nrr
                solveInequalityArgs.isLimitNrrKnown = true
                const higherRunsOrOvers = solveInequality(solveInequalityArgs)
                generateResponeArgs.higherRunsOrOvers = higherRunsOrOvers
                const res = generateResponse(generateResponeArgs)
                return res.msg
            }
            return response.msg
        }
        else {
            // Case 5: If target position team is the opposition team and no team above them has the same points
            //In this case higherNrr can be as highest as possible so we are taking 0 for lowerRunsOrOvers
            // And lowerNrr should be grater then target position team nrr so that selectedTeam can reach at
            //target position 
            const lowerRunsOrOvers = 0
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = targetPositionTeamRuns
            solveInequalityArgs.comparedTeamForOvers = targetPositionTeamOvers
            solveInequalityArgs.comparedTeamAgainstRuns = targetPositionAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = false

            //solve Enequality equation for calculating higherRunsOrOvers
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)

            //if below target position team exist and selected team lowerNrr after match  is less than below target team nrr then we have to make sure that it is greater then below target position team nrr so that we can reach at target position
            //So we have to calculate lowerNrr again keeping limitNrr as below target position team nrr
            const isbelowTargetPositionTeamExist = (targetPosition < sortedPointTable.length) ? true : false
            const belowTargetPositionTeam = isbelowTargetPositionTeamExist ? sortedPointTable[targetPosition] : null

            if (isbelowTargetPositionTeamExist && belowTargetPositionTeam.team != selectedTeam.team && targetPositionTeam.pts === belowTargetPositionTeam.pts && response.hasOwnProperty("lowerNrr") && belowTargetPositionTeam.nrr >= response.lowerNrr) {
                if (response.higherNrr < belowTargetPositionTeam.nrr) {
                    return `${selectedTeam.team} can't Reach At position ${targetPosition}`
                }
                solveInequalityArgs.limitNrr = belowTargetPositionTeam.nrr
                solveInequalityArgs.isLimitNrrKnown = true
                const higherRunsOrOvers = solveInequality(solveInequalityArgs)
                generateResponeArgs.higherRunsOrOvers = higherRunsOrOvers
                const res = generateResponse(generateResponeArgs)
                return res.msg
            }
            return response.msg
        }
    }
    else {
        //in this case we already know limitNrr
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === targetPositionTeam.pts) {
            // Case 6: If target position team is not the opposition team and the team above them has the same points
            //In this case aboveTargetPositionTeam and targetPosition team have same points 
            // so our higherNRrr should be less then aboveTargetPositionTeam nrr so that we can reach at target position team
            //Our lowerNrr should be greater then targetPositionTeam nrr
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = aboveTargetPositionTeamForRuns
            solveInequalityArgs.comparedTeamForOvers = aboveTargetPositionTeamForOvers
            solveInequalityArgs.comparedTeamAgainstRuns = aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = (oppositionTeam === aboveTargetPositionTeam.team) ? false : true

            //solve Enequality equation for calculating lowerRunsOrOvers
            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)

            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown = true

            //solve Enequality equation for calculating higherRunsOrOvers
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)
            return response.msg
        }
        else {
            // Case 7: If target position team is not the opposition team and no team above them has the same points
            //In this case selectedTeam just need to win so we are getting as lowestRunsorOvers and highestRunsOrOvers posiible to win the match to caclualte higherNrr and lowerNrr
            const lowerRunsOrOvers = 0
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown = true
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)
            return response.msg
        }
    }
}
