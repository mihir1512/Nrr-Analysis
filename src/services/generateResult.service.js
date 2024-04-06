const { convertToDecimal } = require('../utils/result.utils')
const { solveInequality } = require('../helpers/solveInequality.helper')
const { generateResponse } = require("../helpers/generateResponse.helper")


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
    const isAboveTargetPositionTeamExist = (targetPosition - 2 >= 0) ? true : false
    const aboveTargetPositionTeam = isAboveTargetPositionTeamExist ? sortedPointTable[targetPosition - 2] : null
    const aboveTargetPositionTeamForRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.for.split('/')[0]) : null
    const aboveTargetPositionTeamForOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.for.split('/')[1])) : null
    const aboveTargetPositionTeamAgainstRuns = isAboveTargetPositionTeamExist ? parseInt(aboveTargetPositionTeam.against.split('/')[0]) : null
    const aboveTargetPositionTeamAgainstOvers = isAboveTargetPositionTeamExist ? convertToDecimal(parseFloat(aboveTargetPositionTeam.against.split('/')[1])) : null

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

    if (targetPositionTeam.pts === selectedTeam.pts) {
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts) {
            console.log(/case1/);
            const response = `You can't reach at position ${position}`
            return response
        }
        else if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts + 2) {
            console.log(/case2/);
            const higherRunsOrOvers = (tossResult === "bowling") ? decimalOvers : firstInningRuns - 1
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = aboveTargetPositionTeamForRuns
            solveInequalityArgs.comparedTeamForOvers = aboveTargetPositionTeamForOvers
            solveInequalityArgs.comparedTeamAgainstRuns = aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = (aboveTargetPositionTeam.team === oppositionTeam) ? false : true

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
            console.log(/case3/);
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
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === targetPositionTeam.pts) {
            console.log(/case4/);
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.isLimitNrrKnown = true
            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)

            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = targetPositionTeamRuns
            solveInequalityArgs.comparedTeamForOvers = targetPositionTeamOvers
            solveInequalityArgs.comparedTeamAgainstRuns = targetPositionAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = false
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)

            const isbelowTargetPositionTeamExist = (targetPosition < sortedPointTable.length) ? true : false
            const belowTargetPositionTeam = isbelowTargetPositionTeamExist ? sortedPointTable[targetPosition] : null


            if (isbelowTargetPositionTeamExist && belowTargetPositionTeam.team != selectedTeam.team && targetPositionTeam.pts === belowTargetPositionTeam.pts && belowTargetPositionTeam.nrr >= response.lowerNrr) {
                if (response.higherNrr < belowTargetPositionTeam.nrr) {
                    return `You can't Reach At position ${targetPosition}`
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
            console.log(/case5/);
            const lowerRunsOrOvers = 0
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = targetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = targetPositionTeamRuns
            solveInequalityArgs.comparedTeamForOvers = targetPositionTeamOvers
            solveInequalityArgs.comparedTeamAgainstRuns = targetPositionAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = targetPositionAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = false
            const higherRunsOrOvers = solveInequality(solveInequalityArgs)

            const generateResponeArgs = {
                ...generateResponeCommonArgs,
                lowerRunsOrOvers,
                higherRunsOrOvers
            }
            const response = generateResponse(generateResponeArgs)

            const isbelowTargetPositionTeamExist = (targetPosition < sortedPointTable.length) ? true : false
            const belowTargetPositionTeam = isbelowTargetPositionTeamExist ? sortedPointTable[targetPosition] : null


            if (isbelowTargetPositionTeamExist && belowTargetPositionTeam.team != selectedTeam.team && targetPositionTeam.pts === belowTargetPositionTeam.pts && belowTargetPositionTeam.nrr >= response.lowerNrr) {
                if (response.higherNrr < belowTargetPositionTeam.nrr) {
                    return `You can't Reach At position ${targetPosition}`
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
        if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === targetPositionTeam.pts) {
            console.log(/case6/);
            const solveInequalityArgs = { ...solveInequalityCommonArgs }
            solveInequalityArgs.limitNrr = aboveTargetPositionTeam.nrr
            solveInequalityArgs.comparedTeamForRuns = aboveTargetPositionTeamForRuns
            solveInequalityArgs.comparedTeamForOvers = aboveTargetPositionTeamForOvers
            solveInequalityArgs.comparedTeamAgainstRuns = aboveTargetPositionTeamAgainstRuns
            solveInequalityArgs.comparedTeamAgainstOvers = aboveTargetPositionTeamAgainstOvers
            solveInequalityArgs.isLimitNrrKnown = (oppositionTeam === aboveTargetPositionTeam.team) ? false : true

            const lowerRunsOrOvers = solveInequality(solveInequalityArgs)

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
        else {
            console.log(/case7/);
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