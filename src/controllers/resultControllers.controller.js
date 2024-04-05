
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
        const sortedPointTable = pointTable.sort(compareFn)
        const { yourTeam, oppositionTeam, over, position, runs, tossResult } = req.body
        const firstInningRuns = parseInt(runs)
        const exactOvers = parseFloat(over)
        const targetPosition = parseInt(position)
        const selectedTeamCurrentPosition=sortedPointTable.findIndex(item=>item.team===yourTeam)
        if(targetPosition>=selectedTeamCurrentPosition)
        {
            return res.status(400).json({msg:"Ypu Can Only Select Position Above You."})
        }
        const targetPositionTeam = sortedPointTable[targetPosition - 1]
        const selectedTeam = sortedPointTable.find(item => item.team === yourTeam)
        selectedTeamPointsAfterWinning=selectedTeam.pts+2
        if(selectedTeamPointsAfterWinning<targetPositionTeam.pts)
        {
            return res.status(200).json({msg:`You Can't Reach At Position ${targetPosition}`})
        }
        //conversion of balls to decimal number
        const decimalOvers = convertToDecimal(over)

        const generateAnalysisArgs = { sortedPointTable,selectedTeam, oppositionTeam, targetPositionTeam, firstInningRuns,exactOvers,decimalOvers, targetPosition,tossResult }

        //Generate ressult 
        const response = generateAnalysis(generateAnalysisArgs)
        return res.status(200).json({ msg: response })
    } catch (error) {
        console.log(error);
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({ error: error.message })
    }
}