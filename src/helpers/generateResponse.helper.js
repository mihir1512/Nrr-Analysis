const { convertToExactOver, convertToDecimal } = require("../utils/result.utils")

// Function to calculate Net Run Rate (NRR)
const calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers))
}

// Exporting the function to generate response
exports.generateResponse = (param) => {
    // Destructuring parameters for easier access
    const {
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
        targetPosition,
        lowerRunsOrOvers,
        higherRunsOrOvers
    } = param

    // Handling case when the toss result is 'bowling'
    if (tossResult === 'bowling') {
        // Calculating higher and lower over parameters
        const higherOverParam = (higherRunsOrOvers > decimalOvers) ? decimalOvers : higherRunsOrOvers
        if (!(higherOverParam >= 0)) return { msg: `${selectedTeam.team} Can't Reach At Position ${targetPosition}` }
        const lowerOverParam = (lowerRunsOrOvers < 0) ? 0 : lowerRunsOrOvers
        if (lowerOverParam >= decimalOvers) return { msg: `${selectedTeam.team} Can't Reach At Position ${targetPosition}` }

        // Converting overs to exact format
        const typeNrr="lower"
        const higherOver = convertToExactOver(higherOverParam, typeNrr)
        const lowerOver = convertToExactOver(lowerOverParam)
        const decimalLowerOver = convertToDecimal(lowerOver)
        const decimalHigherOver = convertToDecimal(higherOver)

        // Calculate range of NRR
        const higherNrr =parseFloat( calculateNrr(selectedTeamForRuns + firstInningRuns + 1, selectedTeamForOvers + decimalLowerOver, selectedTeamAgainstRuns + firstInningRuns, selectedTeamAgainstOvers + decimalOvers).toFixed(3))
        const lowerNrr =parseFloat( calculateNrr(selectedTeamForRuns + firstInningRuns + 1, selectedTeamForOvers + decimalHigherOver, selectedTeamAgainstRuns + firstInningRuns, selectedTeamAgainstOvers + decimalOvers).toFixed(3)
        )
        // Construct response
        const resp = {
            msg: `${selectedTeam.team} need to chase ${firstInningRuns + 1} runs between ${lowerOver} and ${higherOver} overs. Revised NRR for ${selectedTeam.team} will be between ${lowerNrr} to ${higherNrr}`,
            lowerNrr,
            higherNrr
        }
        return resp
    }
    // Handling case when the toss result is 'batting'
    else {
        // Calculating higher and lower run parameters
        const higherFloorRuns = Math.floor(higherRunsOrOvers)
        const higherRunParam = (higherFloorRuns >= firstInningRuns) ? firstInningRuns - 1 : higherFloorRuns
        if (!(higherRunParam >= 0)) return { msg: `${selectedTeam.team} Can't Reach At Position ${targetPosition}` }
        const lowerRunParam = (lowerRunsOrOvers < 0) ? 0 : lowerRunsOrOvers
        if (lowerRunParam >= firstInningRuns) return { msg: `${selectedTeam.team} Can't Reach At Position ${targetPosition}` }
        const lowerCeilRuns = Math.ceil(lowerRunParam)

        const lowerRun = lowerCeilRuns
        const higherRun = higherRunParam

        // Calculate range of NRR
        const higherNrr = parseFloat(calculateNrr(selectedTeamForRuns + firstInningRuns, selectedTeamForOvers + decimalOvers, selectedTeamAgainstRuns + lowerRun, selectedTeamAgainstOvers + decimalOvers).toFixed(3))
        const lowerNrr = parseFloat(calculateNrr(selectedTeamForRuns + firstInningRuns, selectedTeamForOvers + decimalOvers, selectedTeamAgainstRuns + higherRun, selectedTeamAgainstOvers + decimalOvers).toFixed(3))

        // Construct response
        const resp = {
            msg: `If ${selectedTeam.team} score ${firstInningRuns} runs in ${exactOvers} over, ${selectedTeam.team} need to restrict ${oppositionTeam} between ${lowerRun} to ${higherRun} runs in ${exactOvers} overs. Revised NRR for ${selectedTeam.team} will be between ${lowerNrr} to ${higherNrr}.`,
            lowerNrr,
            higherNrr
        }
        return resp
    }
}
