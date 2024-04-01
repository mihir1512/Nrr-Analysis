
const{calculateNrr}=require('./calculateNrr')
const{convertToDecimal}=require('./decimalConversion')
const{solveInequality}=require('./solveInequality')
const{convertToExactOver}=require('./exactOverConversion')

exports.solveResultForFirstCase=(param)=>{
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

    const obj2={a,b,c,d,e,f:sortedData[position-2].nrr,g,h,i,j,k,tossResult,oppositionTeam,targetPositionTeam,check:false}
    const obj1={a,b,c,d,e,f,g,h,i,j,k,tossResult,oppositionTeam,targetPositionTeam,check:true}
   

    if(position-2>=0  && sortedData[position-2].pts==targetPositionTeam.pts)
    {

        if(tossResult==='bowling')
            { 
                    let y=solveInequality(obj1)
                    if(y>k){y=k}
                    const higherOver=convertToExactOver(y)
                    let x=solveInequality(obj2)
                    const lowerOver=convertToExactOver(x)

                    x=convertToDecimal(lowerOver)    
                    y=convertToDecimal(higherOver)  

                    console.log(/x/,x);
                    const higherNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+x,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)
                    const lowerNrr=calculateNrr(favouriteTeamRuns+b+1,favouriteTeamOvers+y,favouriteTeamAgainstRuns+b,favouriteTeamAgainstOvers+k)

                    console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                    console.log(/lowerOver/,lowerOver,/higherOver/,higherOver);

                const resp=`${favouriteTeam.team} need to chase ${b+1} runs between ${lowerOver} and ${higherOver} overs.Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}`
                return resp
            }
            else{
                let y=solveInequality(obj1)
                y=Math.floor(y)
                if(y>=b){y=b-1}
                let x=Math.ceil(solveInequality(obj2))
                const higherNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+x,favouriteTeamAgainstOvers+k)
                const lowerNrr=calculateNrr(favouriteTeamRuns+b,favouriteTeamOvers+k,favouriteTeamAgainstRuns+y,favouriteTeamAgainstOvers+k)

                console.log(/lowerNrr/,lowerNrr,/higherNrr/,higherNrr);
                console.log(/lowerRun/,x,/higherRun/,y);
                const lowerRun=x
                const higherRun=y
                const resp=`If ${favouriteTeam.team} score ${b} runs in ${exactOver},${favouriteTeam.team} need to restrict ${oppositionTeam} between ${lowerRun} to ${higherRun} runs in ${exactOver} overs.Revised NRR for ${favouriteTeam.team} will be between ${lowerNrr} to ${higherNrr}.`
                return resp
            }
    }
}


