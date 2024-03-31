const pointTable=require('../src/pointTable.json')


exports.fetchTeams=(req,res)=>{
    try {
        const teams=pointTable.map(item=>item.team)
        console.log(`[Teams]-[${JSON.stringify(teams)}]`);
        return res.status(200).json(teams)
    } catch (error) {
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}

const compareFn=(item1,item2)=>{
    if(item1.pts===item2.pts)
    {
        return item2.nrr-item1.nrr
    }
    return item2.pts-item1.pts
}

const convertToDecimal=(over)=>{
    const balls=(over-Math.floor(over)).toFixed(1)*10
    const decimalOvers=Math.floor(over)+(balls/6)
    // console.log(decimalOvers);
    return decimalOvers
}

const convertToExactOver=(over)=>{
    const exactOver=parseFloat(`${Math.floor(over)}.${Math.ceil(((over-Math.floor(over)).toFixed(3))*6)}`)
    return exactOver
}

function solveQuadratic(a, b, c) {
    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
        // Two real and distinct roots
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [root1, root2];
    } else if (discriminant === 0) {
        // One real root (double root)
        const root = -b / (2 * a);
        return [root];
    } else {
        // Complex roots
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        const root1 = `${realPart.toFixed(2)} + ${imaginaryPart.toFixed(2)}i`;
        const root2 = `${realPart.toFixed(2)} - ${imaginaryPart.toFixed(2)}i`;
        return [root1, root2];
    }
}

// // Example usage:
// const a = 15.981;
// const b = 1946.98;
// const c = -39084.62;
// const roots = solveQuadratic(a, b, c);
// console.log("Roots:", roots);

const calculateNrr=(param)=>{
    const {favouriteTeam,oppositionTeam,targetPositionTeam,runs:b,tossResult,decimalOvers}=param

    const desiredTeamNrr=f=targetPositionTeam.nrr

    const targetPositionTeamRuns=g=parseInt(targetPositionTeam.for.split('/')[0])
    const tagetPositionTeamOvers=h=convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    const targetPositionAgainstRuns=i=parseInt(targetPositionTeam.against.split('/')[0])
    const targetPositionAgainstOvers=j=convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    

    const favouriteTeamRuns=a=parseInt(favouriteTeam.for.split('/')[0])
    const favouriteTeamOvers=c=convertToDecimal(parseFloat(favouriteTeam.for.split('/')[1]))
    const favouriteTeamAgainstRuns=d=parseInt(favouriteTeam.against.split('/')[0])
    const favouriteTeamAgainstOvers=e=convertToDecimal(parseFloat(favouriteTeam.against.split('/')[1]))

    // console.log(/adf/,desiredPositionTeamRuns,desiredPositionTeamOvers,desiredPositionAgainstRuns,desiredPositionAgainstOvers);
    // console.log(/lkj/,favouriteTeamRuns,favouriteTeamOvers,favouriteTeamAgainstRuns,favouriteTeamAgainstOvers);
    if(tossResult==='bowling')
    {
        if(oppositionTeam===targetPositionTeam.team)  
        {
            const A=(((e+20)*(g+b))+((h+20)*(d+b)))
            const B=((c*(e+20)*(g+b))+(j*(e+20)*(g+b))-((e+20)*(i+b+1)*(h+20))+(j*(h+20)*(d+b))-((h+20)*(a+b+1)*(e+20))+(c*(h+20)*(d+b)))
            const C=((j*c*(e+20)*(g+b))-(c*(e+20)*(i+b+1)*(h+20))-(j*(h+20)*(a+b+1)*(e+20))+(j*c*(h+20)*(d+b)))

            const x=solveQuadratic(A,B,C);
            console.log(/x/,x);
        } 
        else
        {
            const x=(((a+b+1)*(e+20))-(d*c)-(b*c)-(20*f*c)-(f*c*e))/((20*f)+(f*e)+d+b)
            console.log(/x/,x,y,convertToExactOver(y));
        }
        
    }
    if(tossResult==="batting")
    {
        const x=((((a+b)*(e+20)-(f*(c+20)*(e+20)))/(c+20))-d)

        console.log(/x/,x);
    }
}

const calculateResult=(param)=>{
        const {favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position}=param
        if(favouriteTeam.pts+2<targetPositionTeam.pts)
        {           
            return res.status(200).json({msg:`Your team can't reach at position ${position}`})
        }
        else if(favouriteTeam.pts===targetPositionTeam.pts )
        {
            if(position-2>=0 && sortedData[position-2].pts===favouriteTeam.pts)
            {
                return res.status(200).json({msg:`Your team can't reach at position ${position}`})
            }
            // const nrr=calculateNrr(param)
            //just need to win
        }
        else if(position-2>=0 && sortedData[position-2].pts===targetPositionTeam.pts)
        {
            // 1.desired position team and opponent team are same
            //    targetPositionTeam.nrr<nrr<position-2.nrr
            if(oppositionTeam.team===targetPositionTeam.team)
            {
                //1.solve quadratic
            }
            else
            {
                //linear
            }
        }
        else{
            if(oppositionTeam.team===targetPositionTeam.team)
            {
                //1.solve quadratic
            }
            else
            {
                //linear
            }
        }
        const nrr=calculateNrr(param)
}

exports.getResult=(req,res)=>{
    try {
        
        const sortedData=pointTable.sort(compareFn)
        const {yourTeam,oppositionTeam,over,position,runs,tossResult}=req.body

        const targetPositionTeam=sortedData[position-1]
        const favouriteTeam=sortedData.find(item=>item.team===yourTeam)

       
        const decimalOvers=convertToDecimal(over)
        const bodyObj={favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position}
        const result=calculateResult(bodyObj)

        return res.status(200).json(targetPositionTeam)
    } catch (error) {
        console.log(error);
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}