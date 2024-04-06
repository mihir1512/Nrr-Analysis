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
            const response = `You can't reach at position ${position}`
            return response
        }
        else if (isAboveTargetPositionTeamExist && aboveTargetPositionTeam.pts === selectedTeam.pts + 2) {
            // Case 2: If target position team and selected team have the same points but the team above them has 2 points more
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
            // Case 3: If target position team and selected team have the same points and no team above them has the same points
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
            // Case 4: If target position team is the opposition team and the team above them has the same points
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
                    return `Selected Team can't Reach At position ${targetPosition}`
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
            // Case 6: If target position team is not the opposition team and the team above them has the same points
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
            // Case 7: If target position team is not the opposition team and no team above them has the same points
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
