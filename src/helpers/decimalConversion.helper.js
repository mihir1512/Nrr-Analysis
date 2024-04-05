

exports.convertToDecimal = (over) => {
    const decimalOvers = (((over - parseFloat(Math.floor(over)).toFixed(1)) * 10) + (parseInt(over) * 6)) / 6
    return decimalOvers
}