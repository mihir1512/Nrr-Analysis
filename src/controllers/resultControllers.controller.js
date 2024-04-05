
const pointTable = require('../data/pointTable.json')
const { convertToDecimal } = require('../helpers/decimalConversion.helper')
const { generateResult } = require('../services/generateResult.service')
const {generateAnalysis}=require('../services/generateAnalysis.service')




exports.fetchTeams = (req, res) => {
    try {
        const teams = pointTable.map(item => item.team)
        console.log(`[Teams]-[${JSON.stringify(teams)}]`);
        return res.status(200).json(teams)
    } catch (error) {
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({ error: error.message })
    }
}

//To sort teams point wise 
const compareFn = (item1, item2) => {
    if (item1.pts === item2.pts) {
        return item2.nrr - item1.nrr
    }
    return item2.pts - item1.pts
}

exports.getResult = (req, res) => {
    try {
        //sort teams according to point and NRR
        const sortedData = pointTable.sort(compareFn)
        let { yourTeam, oppositionTeam, over, position, runs, tossResult } = req.body
        runs = parseInt(runs)
        over = parseFloat(over)
        position = parseInt(position)
        const targetPositionTeam = sortedData[position - 1]
        const favouriteTeam = sortedData.find(item => item.team === yourTeam)

        //conversion of balls to decimal number
        const decimalOvers = convertToDecimal(over)

        const bodyObj = { favouriteTeam, oppositionTeam, targetPositionTeam, runs, tossResult, decimalOvers, position, sortedData, exactOver: over }

        //Generate ressult 
        const response = generateAnalysis(bodyObj)
        return res.status(200).json({ msg: response })
    } catch (error) {
        console.log(error);
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({ error: error.message })
    }
}