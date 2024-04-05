const { calculateNrr } = require('../helpers/calculateNrr.helper')
const { convertToDecimal } = require('../helpers/decimalConversion.helper')
const { solveInequality } = require('../helpers/solveInequality.helper')
const { convertToExactOver } = require('../helpers/exactOverConversion.helper')


exports.generateResult = (param) => {
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
    const tagetPositionTeamOvers = convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    const targetPositionAgainstRuns = parseInt(targetPositionTeam.against.split('/')[0])
    const targetPositionAgainstOvers = convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    //getting slected team data
    const favouriteTeamRuns = parseInt(favouriteTeam.for.split('/')[0])
    const favouriteTeamOvers = convertToDecimal(parseFloat(favouriteTeam.for.split('/')[1]))
    const favouriteTeamAgainstRuns = parseInt(favouriteTeam.against.split('/')[0])
    const favouriteTeamAgainstOvers = convertToDecimal(parseFloat(favouriteTeam.against.split('/')[1]))

    let inequalityObj1, inequalityObj2
    if (favouriteTeam.team === 'Rajasthan Royals' && oppositionTeam === "Delhi Capitals" && position === 3) {
        //creating object to solve equation
        inequalityObj2 = {
            a: favouriteTeamRuns,
            b,
            c: favouriteTeamOvers,
            d: favouriteTeamAgainstRuns,
            e: favouriteTeamAgainstOvers,
            f: sortedData[position - 2].nrr,
            g: targetPositionTeamRuns,
            h: tagetPositionTeamOvers,
            i: targetPositionAgainstRuns,
            j: targetPositionAgainstOvers,
            k,
            tossResult,
            oppositionTeam,
            targetPositionTeam,
            check: false
        }

        inequalityObj1 = {
            a: favouriteTeamRuns,
            b,
            c: favouriteTeamOvers,
            d: favouriteTeamAgainstRuns,
            e: favouriteTeamAgainstOvers,
            f,
            g: targetPositionTeamRuns,
            h: tagetPositionTeamOvers,
            i: targetPositionAgainstRuns,
            j: targetPositionAgainstOvers,
            k,
            tossResult,
            oppositionTeam,
            targetPositionTeam,
            check: true
        }
    }
    else if (favouriteTeam.team === 'Rajasthan Royals' && oppositionTeam === "Royal Challengers Bangalore" && position === 3) {
        inequalityObj1 = {
            a: favouriteTeamRuns,
            b,
            c: favouriteTeamOvers,
            d: favouriteTeamAgainstRuns,
            e: favouriteTeamAgainstOvers,
            f,
            g: targetPositionTeamRuns,
            h: tagetPositionTeamOvers,
            i: targetPositionAgainstRuns,
            j: targetPositionAgainstOvers,
            k,
            tossResult,
            oppositionTeam,
            targetPositionTeam,
            check: false
        }

        //fetching data of team above target position team
        g = parseInt(sortedData[position - 2].for.split('/')[0])
        h = convertToDecimal(parseFloat(sortedData[position - 2].for.split('/')[1]))
        i = parseInt(sortedData[position - 2].against.split('/')[0])
        j = convertToDecimal(parseFloat(sortedData[position - 2].against.split('/')[1]))

        //creating object to be passed to solve equtaion
        inequalityObj2 = {
            a: favouriteTeamRuns,
            b,
            c: favouriteTeamOvers,
            d: favouriteTeamAgainstRuns,
            e: favouriteTeamAgainstOvers,
            f: sortedData[position - 2].nrr,
            g: parseInt(sortedData[position - 2].for.split('/')[0]),
            h: convertToDecimal(parseFloat(sortedData[position - 2].for.split('/')[1])),
            i: parseInt(sortedData[position - 2].against.split('/')[0]),
            j: convertToDecimal(parseFloat(sortedData[position - 2].against.split('/')[1])),
            k,
            tossResult,
            oppositionTeam,
            targetPositionTeam,
            check: true
        }
    }
    else {
        return { msg: "Invalid Input" }
    }

    if (tossResult === 'bowling') {

        //solving equation for nrr > targetteam nrr
        let y = solveInequality(inequalityObj1)
        // console.log(/y/,y);
        if (y > k) { y = k }
      
        const higherOver = convertToExactOver(y, "lower")

        //solving  equation for nrr < above team nrr
        let x = solveInequality(inequalityObj2)
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
        //solving equation for nrr > targetteam nrr
        let y = solveInequality(inequalityObj1)
        y = Math.floor(y)
        // console.log(/y/,y);
        if (y >= b) { y = b - 1 }

        //solving  quation for nrr < above team nrr
        let x = Math.ceil(solveInequality(inequalityObj2))

        //Calculate Range Of NRR
        const higherNrr = calculateNrr(favouriteTeamRuns + b, favouriteTeamOvers + k, favouriteTeamAgainstRuns + x, favouriteTeamAgainstOvers + k).toFixed(3)
        const lowerNrr = calculateNrr(favouriteTeamRuns + b, favouriteTeamOvers + k, favouriteTeamAgainstRuns + y, favouriteTeamAgainstOvers + k).toFixed(3)

        const lowerRun = x
        const higherRun = y
        const resp = `If ${favouriteTeam.team} score ${b} runs in ${exactOver} over,${favouriteTeam.team} need to restrict ${oppositionTeam} between ${lowerRun} to ${higherRun} runs in ${exactOver} overs.Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}.`
        return resp
    }

}