

exports.convertToDecimal=(over)=>{
    const decimalOvers=(((over-Math.floor(over)).toFixed(1)*10)+(parseInt(over)*6))/6
     return decimalOvers
}