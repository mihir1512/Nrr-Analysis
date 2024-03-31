const { param } = require('../routes/resultRoutes');
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
    const decimalOvers=(((over-Math.floor(over)).toFixed(1)*10)+(parseInt(over)*6))/6
    // console.log(/decimal/,decimalOvers);
    return decimalOvers
}

const convertToExactOver=(over)=>{
    const exactOver=parseFloat(`${Math.floor(over)}.${Math.ceil(((over-Math.floor(over)).toFixed(3))*6)}`)
    // console.log(/exactOver/,exactOver);
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

const calculateNrr=(forRuns,forOvers,againstRuns,againstOvers)=>{
    return((forRuns/forOvers)-(againstRuns/againstOvers))
}

const solveInequality=(param)=>{
    const {a,b,c,d,e,f,g,h,i,j,k,tossResult,oppositionTeam,targetPositionTeam,check}=param
    // console.log(/f/,f);

    if(tossResult==='bowling')
    {
        if(oppositionTeam===targetPositionTeam.team && check)  
        {
            const A=(((e+k)*(g+b))+((h+k)*(d+b)))
            const B=((c*(e+k)*(g+b))+(j*(e+k)*(g+b))-((e+k)*(i+b+1)*(h+k))+(j*(h+k)*(d+b))-((h+k)*(a+b+1)*(e+k))+(c*(h+k)*(d+b)))
            const C=((j*c*(e+k)*(g+b))-(c*(e+k)*(i+b+1)*(h+k))-(j*(h+k)*(a+b+1)*(e+k))+(j*c*(h+k)*(d+b)))

            const x=solveQuadratic(A,B,C);
            return convertToExactOver(x[0])
        } 
        else
        {
            const x=(((a+b+1)*(e+k))-(d*c)-(b*c)-(k*f*c)-(f*c*e))/((k*f)+(f*e)+d+b)
            // console.log(/lkj/,x);
            return convertToExactOver(x)
        }
        
    }
    if(tossResult==="batting")
    {
        if(oppositionTeam===targetPositionTeam.team && check)  
        {
            const x=(((h+k)*(j+k)*(a+b)*(e+k))+((c+k)*(e+k)*(i+b)*(h+k))-(d*(h+k)*(j+k)*(c+k))-(g*(c+k)*(e+k)*(j+k)))/(((c+k)*(e+k)*(j+k))+((h+k)*(j+k)*(c+k)))
            return x
            
        } else{
            const x=((((a+b)*(e+k)-(f*(c+k)*(e+k)))/(c+k))-d)
            return x
        }
    }
}

const calculateRespForAboveposition=(param)=>{
    let {favouriteTeam,oppositionTeam,targetPositionTeam,runs:b,tossResult,exactOver,decimalOvers:k,position,sortedData}=param

    let desiredTeamNrr=f=targetPositionTeam.nrr

    let targetPositionTeamRuns=g=parseInt(targetPositionTeam.for.split('/')[0])
    let tagetPositionTeamOvers=h=convertToDecimal(parseFloat(targetPositionTeam.for.split('/')[1]))
    let targetPositionAgainstRuns=i=parseInt(targetPositionTeam.against.split('/')[0])
    let targetPositionAgainstOvers=j=convertToDecimal(parseFloat(targetPositionTeam.against.split('/')[1]))
    
    let favouriteTeamRuns=a=parseInt(favouriteTeam.for.split('/')[0])
    let favouriteTeamOvers=c=convertToDecimal(parseFloat(favouriteTeam.for.split('/')[1]))
    let favouriteTeamAgainstRuns=d=parseInt(favouriteTeam.against.split('/')[0])
    let favouriteTeamAgainstOvers=e=convertToDecimal(parseFloat(favouriteTeam.against.split('/')[1]))

    if(favouriteTeam.pts===targetPositionTeam.pts )
    {
        if(position-2>=0 && sortedData[position-2].pts==favouriteTeam.pts+2)
        {           
            const obj={a,b,c,d,e,f:sortedData[position-2].nrr,g,h,i,j,k,tossResult,oppositionTeam,targetPositionTeam,check:false}
            const x=solveInequality(obj)
            if(tossResult==='bowling')
            {
                const dbOver=convertToDecimal(x)
                const higherNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+dbOver,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)
                const lowerNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+20,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)

                console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                const lowerOver=x
                const higherOver=convertToExactOver(k)
                const resp=`->If ${favouriteTeam.team} need to chase ${b+1} runs between ${lowerOver} and ${higherOver} overs.
                -> Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}`
                return resp
            }
            else{
                const runs=x
                const higherNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+x,favouriteTeamAgainstOvers+k)
                const lowerNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+b-1,favouriteTeamAgainstOvers+k)

                console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                const lowerRun=Math.ceil(x)
                const higherRuns=b-1
                const resp=`o If ${favouriteTeam.team} score ${b} runs in ${exactOver},${favouriteTeam.team} need to
                restrict ${oppositionTeam} between ${lowerRun} to ${higherRuns} runs in ${exactOver}.
                o Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}.`
                return resp
            }
            
           
        }
    }
   
}

const resultForAbovePosition=(param,req,res)=>{
        const {favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position,sortedData,exactOver}=param
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
            else if(position-2>=0 && sortedData[position-2].pts==favouriteTeam.pts+2)
            {
                if(sortedData[position-2].nrr<=favouriteTeam.nrr)
                {
                    return res.status(200).json({msg:`Your team can't reach at position ${position}`})
                }
                else
                {
                    // resultnrr<targetposition-2teamnrr
                    // range=(resultnrr<tagetposition-2teamnrr)
                    const result=calculateRespForAboveposition(param)
                    return res.status(200).json({result})
                }
            }
            else{
                //just need to win
                // range
            }
            
            // const nrr=calculateNrr(param)
            
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
        // const nrr=calculateNrr(param)
}

exports.getResult=(req,res)=>{
    try {
        
        const sortedData=pointTable.sort(compareFn)
        let {yourTeam,oppositionTeam,over,position,runs,tossResult}=req.body
        runs=parseInt(runs)
        over=parseFloat(over)
        const targetPositionTeam=sortedData[position-1]
        const favouriteTeam=sortedData.find(item=>item.team===yourTeam)

       
        const decimalOvers=convertToDecimal(over)
        const bodyObj={favouriteTeam,oppositionTeam,targetPositionTeam,runs,tossResult,decimalOvers,position,sortedData,exactOver:over}
        const currentPosition= sortedData.findIndex(item => item.team=== favouriteTeam.team)+1;
        // console.log(currentPosition);
        if(position<currentPosition)
        {
        const result=resultForAbovePosition(bodyObj,req,res)
        }
        else if(position===currentPosition)
        {

        }
        else{

        }

        // return res.status(200).json(targetPositionTeam)
    } catch (error) {
        console.log(error);
        console.log(`[Error]-[${error.message}]`);
        return res.status(500).json({error:error.message})
    }
}