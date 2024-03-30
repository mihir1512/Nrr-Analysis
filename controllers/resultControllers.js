const pointTable=require('../src/pointTable.json')


exports.fetchTeams=(req,res)=>{
    try {
        const teams=pointTable.map(item=>item.team)
        return res.status(200).json(teams)
    } catch (error) {
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}

exports.getResult=(req,res)=>{
    try {
        
        return res.status(200).json({msg:'result'})
    } catch (error) {
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}