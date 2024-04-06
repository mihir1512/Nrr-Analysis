const{convertToExactOver,convertToDecimal}=require("../utils/result.utils")


const calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers))
}

exports.generateResponse=(param)=>{
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
    }=param
    if (tossResult === 'bowling') {
        const higherOverParam= (higherRunsOrOvers > decimalOvers) ? decimalOvers :higherRunsOrOvers

        if(!(higherOverParam>=0)) return {msg:`You Can't Reach At Position ${targetPosition}`}
        const lowerOverParam= (lowerRunsOrOvers < 0) ? 0 :lowerRunsOrOvers
        if(lowerOverParam >= decimalOvers)return {msg:`You Can't Reach At Position ${targetPosition}`}
        
        const higherOver = convertToExactOver(higherOverParam, "lower")   
        const lowerOver = convertToExactOver(lowerOverParam)
        const decimalLowerOver = convertToDecimal(lowerOver)
        const decimalHigherOver = convertToDecimal(higherOver)

        //Calculate Range Of NRR
        const higherNrr = calculateNrr(selectedTeamForRuns + firstInningRuns + 1, selectedTeamForOvers + decimalLowerOver, selectedTeamAgainstRuns + firstInningRuns, selectedTeamAgainstOvers + decimalOvers).toFixed(3)
        const lowerNrr = calculateNrr(selectedTeamForRuns + firstInningRuns + 1, selectedTeamForOvers + decimalHigherOver, selectedTeamAgainstRuns + firstInningRuns, selectedTeamAgainstOvers + decimalOvers).toFixed(3)

        const resp = {
            msg:`${selectedTeam.team} need to chase ${firstInningRuns + 1} runs between ${lowerOver} and ${higherOver} overs.Revised NRR for ${selectedTeam.team} will be between ${lowerNrr} to ${higherNrr}`,
            lowerNrr,
            higherNrr
        }
        return resp
    }
    else {
        const higherFloorRuns = Math.floor(higherRunsOrOvers)
        const higherRunParam= (higherFloorRuns >= firstInningRuns) ? firstInningRuns-1 : higherFloorRuns
        if(!(higherRunParam>=0)) return {msg:`You Can't Reach At Position ${targetPosition}`}

        const lowerRunParam= (lowerRunsOrOvers < 0) ? 0 : lowerRunsOrOvers
        if(lowerRunParam >= firstInningRuns)return {msg:`You Can't Reach At Position ${targetPosition}`}
        const lowerCeilRuns = Math.ceil(lowerRunParam)

        const lowerRun = lowerCeilRuns
        const higherRun = higherRunParam
       //Calculate Range Of NRR
        const higherNrr = calculateNrr(selectedTeamForRuns + firstInningRuns, selectedTeamForOvers + decimalOvers, selectedTeamAgainstRuns + lowerRun, selectedTeamAgainstOvers + decimalOvers).toFixed(3)
        const lowerNrr = calculateNrr(selectedTeamForRuns + firstInningRuns, selectedTeamForOvers + decimalOvers, selectedTeamAgainstRuns + higherRun, selectedTeamAgainstOvers + decimalOvers).toFixed(3)

     
        const resp ={ 
            msg:`If ${selectedTeam.team} score ${firstInningRuns} runs in ${exactOvers} over,${selectedTeam.team} need to restrict ${oppositionTeam} between ${lowerRun} to ${higherRun} runs in ${exactOvers} overs.Revised NRR for ${selectedTeam.team} will be between ${lowerNrr} to ${higherNrr}.`,
            lowerNrr,
            higherNrr
        }
        return resp
    }
}