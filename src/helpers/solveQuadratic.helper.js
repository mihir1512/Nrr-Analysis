

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