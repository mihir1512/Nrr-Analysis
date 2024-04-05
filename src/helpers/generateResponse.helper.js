const{convertToExactOver}=require("./exactOverConversion.helper")
const{convertToDecimal}=require("./decimalConversion.helper")


const calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers))
}

exports.generateResponse=(param)=>{
    let {tossResult,x,y,exactOver,b,k,favouriteTeam,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstOvers,favouriteTeamAgainstRuns,oppositionTeam,position}=param
    if (tossResult === 'bowling') {
        if (y > k) { y = k }
        if(!(y>=0)) return `You Can't Reach At Position ${position}`
        if(x < 0) { x = 0 }
        else if(x>=k)return `You Can't Reach At Position ${position}`
        const higherOver = convertToExactOver(y, "lower")   
        const lowerOver = convertToExactOver(x)
        x = convertToDecimal(lowerOver)
        y = convertToDecimal(higherOver)

        //Calculate Range Of NRR
        const higherNrr = calculateNrr(favouriteTeamRuns + b + 1, favouriteTeamOvers + x, favouriteTeamAgainstRuns + b, favouriteTeamAgainstOvers + k).toFixed(3)
        const lowerNrr = calculateNrr(favouriteTeamRuns + b + 1, favouriteTeamOvers + y, favouriteTeamAgainstRuns + b, favouriteTeamAgainstOvers + k).toFixed(3)

        const resp = `${favouriteTeam.team} need to chase ${b + 1} runs between ${lowerOver} and ${higherOver} overs.Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}`
        return resp
    }
    else {
        y = Math.floor(y)
        if (y >= b) { y = b - 1 }
        if(!(y>=0)) return `You Can't Reach At Position ${position}`
        if(x < 0) { x = 0 }
        else if(x>=b)return `You Can't Reach At Position ${position}`
         x = Math.ceil(x)
       //Calculate Range Of NRR
        const higherNrr = calculateNrr(favouriteTeamRuns + b, favouriteTeamOvers + k, favouriteTeamAgainstRuns + x, favouriteTeamAgainstOvers + k).toFixed(3)
        const lowerNrr = calculateNrr(favouriteTeamRuns + b, favouriteTeamOvers + k, favouriteTeamAgainstRuns + y, favouriteTeamAgainstOvers + k).toFixed(3)

        const lowerRun = x
        const higherRun = y
        const resp = `If ${favouriteTeam.team} score ${b} runs in ${exactOver} over,${favouriteTeam.team} need to restrict ${oppositionTeam} between ${lowerRun} to ${higherRun} runs in ${exactOver} overs.Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}.`
        return resp
    }
}