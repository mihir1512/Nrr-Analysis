
exports.calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers))
}

exports.convertToDecimal = (over) => {
    const decimalOvers = (((over - parseFloat(Math.floor(over)).toFixed(1)) * 10) + (parseInt(over) * 6)) / 6
    return decimalOvers
}

exports.convertToExactOver = (over, typeOver = "higher") => {

    const x = ((over - parseFloat(Math.floor(over)).toFixed(3))) * 6

    if (typeOver === "higher") {
         const y = Math.ceil(x)
         if (y == 6) return Math.floor(over) + 1
         const exactOver = parseFloat(`${Math.floor(over)}.${y}`)
         return exactOver
    }
    else {
         const y = Math.floor(x)
         if (y == 6) return Math.floor(over) + 1
         const exactOver = parseFloat(`${Math.floor(over)}.${y}`)
         return exactOver
    }

}

exports. solveQuadratic=(a, b, c) =>{
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


