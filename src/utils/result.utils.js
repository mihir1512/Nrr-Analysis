// Function to calculate Net Run Rate (NRR)
exports.calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers));
}

// Function to convert overs to decimal format
exports.convertToDecimal = (over) => {
    // Calculate decimal overs from fractional and whole parts
    const decimalOvers = (((over - parseFloat(Math.floor(over).toFixed(1))) * 10) + (parseInt(over) * 6)) / 6;
    return decimalOvers;
}

// Function to convert overs to exact over format
exports.convertToExactOver = (over, typeNrr = "higher") => {
    const x = ((over - parseFloat(Math.floor(over).toFixed(3)))) * 6;

    // Determine whether to round up or down based on typeNrr
    if (typeNrr === "higher") {
         const y = Math.ceil(x);
         if (y == 6) return Math.floor(over) + 1; // If y equals 6, increment the whole part
         const exactOver = parseFloat(`${Math.floor(over)}.${y}`);
         return exactOver;
    }
    else {
         const y = Math.floor(x);
         if (y == 6) return Math.floor(over) + 1; // If y equals 6, increment the whole part
         const exactOver = parseFloat(`${Math.floor(over)}.${y}`);
         return exactOver;
    }
}

// Function to solve quadratic equation
exports.solveQuadratic = (a, b, c) => {
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
