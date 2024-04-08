// Function to calculate Net Run Rate (NRR)
exports.calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    // Calculate Net Run Rate (NRR) by subtracting opponent's runs per over from own runs per over
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
    // Calculate fractional part of overs in terms of balls
    const floatBalls = ((over - parseFloat(Math.floor(over).toFixed(3)))) * 6;

    // Determine whether to round up or down based on typeNrr
    if (typeNrr === "higher") {
         const integerBalls = Math.ceil(floatBalls);
         if (integerBalls === 6) return Math.floor(over) + 1; // If y equals 6, increment the whole part
        // Construct exact over by combining whole part and fractional part
         const exactOver = parseFloat(`${Math.floor(over)}.${integerBalls}`);
         return exactOver;
    }
    else {
         const integerBalls = Math.floor(floatBalls);
         if (integerBalls === 6) return Math.floor(over) + 1; // If y equals 6, increment the whole part
        // Construct exact over by combining whole part and fractional part
         const exactOver = parseFloat(`${Math.floor(over)}.${integerBalls}`);
         return exactOver;
    }
}

// Function to solve quadratic equation
//If we have quadratic equation like ax^2 + bx + c
//xSquareCoefficient=a
//xCoefficient=b
//constant =c
exports.solveQuadratic = (xSquareCoefficient, xCoefficient, constant) => {
    // Calculate the discriminant
    const discriminant = xCoefficient * xCoefficient - 4 * xSquareCoefficient * constant;

    if (discriminant > 0) {
        // Two real and distinct roots
        const primaryRoot = (-xCoefficient + Math.sqrt(discriminant)) / (2 * xSquareCoefficient);
        const secondaryRoot = (-xCoefficient - Math.sqrt(discriminant)) / (2 * xSquareCoefficient);
        return [primaryRoot, secondaryRoot];
    } else if (discriminant === 0) {
        // One real root (double root)
        const root = -xCoefficient / (2 * xSquareCoefficient);
        return [root];
    } else {
        // Complex roots
        const realPart = -xCoefficient / (2 * xSquareCoefficient);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * xSquareCoefficient);
        const root1 = `${realPart.toFixed(2)} + ${imaginaryPart.toFixed(2)}i`;
        const root2 = `${realPart.toFixed(2)} - ${imaginaryPart.toFixed(2)}i`;
        return [root1, root2];
    }
}
