const { solveQuadratic } = require('../utils/result.utils')

// Function to solve the inequality based on given parameters
exports.solveInequality = (param) => {
    // Destructuring parameters 
    const {
        tossResult,
        isLimitNrrKnown,
        decimalOvers,
        limitNrr,
        firstInningRuns,
        selectedTeamForRuns,
        selectedTeamForOvers,
        selectedTeamAgainstRuns,
        selectedTeamAgainstOvers,
        comparedTeamForRuns,
        comparedTeamForOvers,
        comparedTeamAgainstRuns,
        comparedTeamAgainstOvers
    } = param

    // Handling case when the toss result is 'bowling'
    if (tossResult === 'bowling') {
        //If imitNrr is dynamically determined based on the current match conditions
        if (isLimitNrrKnown === false) {
            //If imitNrr is dynamically determined based on the current match conditions
            //we have equation 
            //((selectedTeamForRuns+firstInningRuns+1)/(selectedTeamForOvers+lowerOrHigherOvers)-
            //(selectedTeamAgainstRuns+firstInningRuns)/(selectedTeamAgainstOvers+20)) should less then or grrater then
            //((comparedTeamForRuns+firstInningRuns)/(comparedTeamForOvers+20) - 
            // (comparedTeamAgainstRuns+firstInningRuns)/(comparedTeamAgainstOver+lowerOrHigherOvers)) will give quadratic equation
            // as keeping lowerOrHigherOvers as x
            // Calculating coefficients for quadratic equation
            //If we have quadratic equation like ax^2 + bx + c
            //xSquareCoefficient=a
            //xCoefficient=b
            //constant =c
            const xSquareCoefficient = (
                ((selectedTeamAgainstOvers + decimalOvers) * (comparedTeamForRuns + firstInningRuns)) +
                ((comparedTeamForOvers + decimalOvers) * (selectedTeamAgainstRuns + firstInningRuns))
            )
            const xCoefficient = (
                (selectedTeamForOvers * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamForRuns + firstInningRuns)) +
                (comparedTeamAgainstOvers * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamForRuns + firstInningRuns)) -
                ((selectedTeamAgainstOvers + decimalOvers) * (comparedTeamAgainstRuns + firstInningRuns + 1) * (comparedTeamForOvers + decimalOvers)) +
                (comparedTeamAgainstOvers * (comparedTeamForOvers + decimalOvers) * (selectedTeamAgainstRuns + firstInningRuns)) -
                ((comparedTeamForOvers + decimalOvers) * (selectedTeamForRuns + firstInningRuns + 1) * (selectedTeamAgainstOvers + decimalOvers)) +
                (selectedTeamForOvers * (comparedTeamForOvers + decimalOvers) * (selectedTeamAgainstRuns + firstInningRuns))
            )
            const constant = (
                (comparedTeamAgainstOvers * selectedTeamForOvers * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamForRuns + firstInningRuns)) -
                (selectedTeamForOvers * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamAgainstRuns + firstInningRuns + 1) * (comparedTeamForOvers + decimalOvers)) -
                (comparedTeamAgainstOvers * (comparedTeamForOvers + decimalOvers) * (selectedTeamForRuns + firstInningRuns + 1) * (selectedTeamAgainstOvers + decimalOvers)) +
                (comparedTeamAgainstOvers * selectedTeamForOvers * (comparedTeamForOvers + decimalOvers) * (selectedTeamAgainstRuns + firstInningRuns))
            )
            // Solving quadratic equation to find roots
            const roots = solveQuadratic(xSquareCoefficient, xCoefficient, constant);
            const lowerOrHigherOvers = roots[0]
            return lowerOrHigherOvers
        }
        else {
            // Calculating lower or higher overs based on the limit NRR
            // we have equation 
            //((selectedTeamForRuns+firstInningRuns+1)/(selectedTeamForOvers+lowerOrHigherOvers)-
            //(selectedTeamAgainstRuns+firstInningRuns)/(selectedTeamAgainstOvers+20)) should less then or grrater then
            //limitNrr , here we are making lowerOrHigherOvers as subject
            const lowerOrHigherOvers = (
                (((selectedTeamForRuns + firstInningRuns + 1) * (selectedTeamAgainstOvers + decimalOvers)) -
                    (selectedTeamAgainstRuns * selectedTeamForOvers) - (firstInningRuns * selectedTeamForOvers) -
                    (decimalOvers * limitNrr * selectedTeamForOvers) - (limitNrr * selectedTeamForOvers * selectedTeamAgainstOvers)) /
                ((decimalOvers * limitNrr) + (limitNrr * selectedTeamAgainstOvers) + selectedTeamAgainstRuns + firstInningRuns)
            )
            return lowerOrHigherOvers
        }
    }
    // Handling case when the toss result is 'batting'
    if (tossResult === "batting") {
        // If imitNrr is dynamically determined based on the current match conditions
        if (isLimitNrrKnown === false) {
            //we have equation 
            //((selectedTeamForRuns+firstInningRuns+)/(selectedTeamForOvers+20)-
            //(selectedTeamAgainstRuns+lowerOrHigherRuns)/(selectedTeamAgainstOvers+20)) should less then or grrater then
            //((comparedTeamForRuns+firstInningRuns)/(comparedTeamForOvers+20) - 
            // (comparedTeamAgainstRuns+firstInningRuns)/(comparedTeamAgainstOver+lowerOrHigherOvers)) will give quadratic equation
            // as keeping lowerOrHigherRuns as x

            // Calculating lower or higher runs based on the parameters
            const lowerOrHigherRuns = (
                ((comparedTeamForOvers + decimalOvers) * (comparedTeamAgainstOvers + decimalOvers) * (selectedTeamForRuns + firstInningRuns) * (selectedTeamAgainstOvers + decimalOvers)) +
                ((selectedTeamForOvers + decimalOvers) * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamAgainstRuns + firstInningRuns) * (comparedTeamForOvers + decimalOvers)) -
                (selectedTeamAgainstRuns * (comparedTeamForOvers + decimalOvers) * (comparedTeamAgainstOvers + decimalOvers) * (selectedTeamForOvers + decimalOvers)) -
                (comparedTeamForRuns * (selectedTeamForOvers + decimalOvers) * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamAgainstOvers + decimalOvers))) /
                ((selectedTeamForOvers + decimalOvers) * (selectedTeamAgainstOvers + decimalOvers) * (comparedTeamAgainstOvers + decimalOvers) +
                    (comparedTeamForOvers + decimalOvers) * (comparedTeamAgainstOvers + decimalOvers) * (selectedTeamForOvers + decimalOvers))
            return lowerOrHigherRuns
        } else {
            // we have equation 
            //((selectedTeamForRuns+firstInningRuns)/(selectedTeamForOvers+20)-
            //(selectedTeamAgainstRuns+lowerOrHigherRuns)/(selectedTeamAgainstOvers+20)) should less then or grrater then
            //limitNrr , here we are making lowerOrHigherOvers as subject

            // Calculating lower or higher runs based on the limit NRR
            const lowerOrHigherRuns = (
                (((selectedTeamForRuns + firstInningRuns) * (selectedTeamAgainstOvers + decimalOvers)) -
                    (limitNrr * (selectedTeamForOvers + decimalOvers) * (selectedTeamAgainstOvers + decimalOvers))) / (selectedTeamForOvers + decimalOvers) -
                (selectedTeamAgainstRuns)
            )
            return lowerOrHigherRuns
        }
    }
}
