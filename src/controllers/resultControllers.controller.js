
const pointTable = require('../data/pointTable.json')
const { convertToDecimal } = require('../utils/result.utils')
const {generateResult}=require('../services/generateResult.service')




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
        
        //Extract request body parameter
        const { yourTeam, oppositionTeam, over, position, runs, tossResult } = req.body

        //Parse request parameter to appropriate types
        const firstInningRuns = parseInt(runs)
        const exactOvers = parseFloat(over)
        const targetPosition = parseInt(position)

        //Find current position of selected team in the sorted point table
        const selectedTeamCurrentPosition=sortedPointTable.findIndex(item=>item.team===yourTeam)+1

        //Validate target position
        if(targetPosition>=selectedTeamCurrentPosition)
        {
            return res.status(200).json({msg:"You Can Only Select Position Above Selected Team Position."})
        }

        // Extract target position team and selected team details
        const targetPositionTeam = sortedPointTable[targetPosition - 1]
        const selectedTeam = sortedPointTable.find(item => item.team === yourTeam)
        selectedTeamPointsAfterWinning=selectedTeam.pts+2

        // Validate if selected team can reach the target position after winning
        if(selectedTeamPointsAfterWinning<targetPositionTeam.pts)
        {
            return res.status(200).json({msg:`You Can't Reach At Position ${targetPosition}`})
        }

        // Convert overs to decimal number
        const decimalOvers = convertToDecimal(over)

        // Prepare arguments for result generation
        const generateResultArgs = { 
            sortedPointTable,
            selectedTeam, 
            oppositionTeam, 
            targetPositionTeam, 
            firstInningRuns,
            exactOvers,
            decimalOvers, 
            targetPosition,
            tossResult }

        //Generate ressult 
        const response = generateResult(generateResultArgs)

        // Send result as JSON response
        return res.status(200).json({ msg: response })
    } catch (error) {
        // Handle errors and send appropriate response
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({ error: error.message })
    }
}