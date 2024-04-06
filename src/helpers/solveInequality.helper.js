const { solveQuadratic } = require('../utils/result.utils')


exports.solveInequality = (param) => {
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

    if (tossResult === 'bowling') {
        //if target postion team and opposition team are same
        if (isLimitNrrKnown === false) {
            const xSquareCoefficient = (
                (
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamForRuns + firstInningRuns)
                ) +
                (
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamAgainstRuns + firstInningRuns)
                )
            )

            const xCoefficient = (
                (
                    selectedTeamForOvers *
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamForRuns + firstInningRuns)
                ) +
                (
                    comparedTeamAgainstOvers *
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamForRuns + firstInningRuns)
                ) -
                (
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamAgainstRuns + firstInningRuns + 1) *
                    (comparedTeamForOvers + decimalOvers)
                ) +
                (
                    comparedTeamAgainstOvers *
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamAgainstRuns + firstInningRuns)
                ) -
                (
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamForRuns + firstInningRuns + 1) *
                    (selectedTeamAgainstOvers + decimalOvers)
                ) +
                (
                    selectedTeamForOvers *
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamAgainstRuns + firstInningRuns)
                )
            )

            const constant = (
                (
                    comparedTeamAgainstOvers * selectedTeamForOvers *
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamForRuns + firstInningRuns)
                ) -
                (
                    selectedTeamForOvers *
                    (selectedTeamAgainstOvers + decimalOvers) *
                    (comparedTeamAgainstRuns + firstInningRuns + 1) *
                    (comparedTeamForOvers + decimalOvers)
                ) -
                (
                    comparedTeamAgainstOvers *
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamForRuns + firstInningRuns + 1) *
                    (selectedTeamAgainstOvers + decimalOvers)
                ) +
                (
                    comparedTeamAgainstOvers * selectedTeamForOvers *
                    (comparedTeamForOvers + decimalOvers) *
                    (selectedTeamAgainstRuns + firstInningRuns)
                )
            )

            const roots = solveQuadratic(xSquareCoefficient, xCoefficient, constant);
            const lowerOrHigherOvers = roots[0]
            return lowerOrHigherOvers
        }
        else {

            const lowerOrHigherOvers = (
                (
                    (
                        (selectedTeamForRuns + firstInningRuns + 1) *
                        (selectedTeamAgainstOvers + decimalOvers)
                    ) -
                    (selectedTeamAgainstRuns * selectedTeamForOvers) -
                    (firstInningRuns * selectedTeamForOvers) -
                    (decimalOvers * limitNrr * selectedTeamForOvers) -
                    (limitNrr * selectedTeamForOvers * selectedTeamAgainstOvers)
                ) /
                (
                    (decimalOvers * limitNrr) +
                    (limitNrr * selectedTeamAgainstOvers) +
                    selectedTeamAgainstRuns + firstInningRuns
                )
            )

            return lowerOrHigherOvers

        }
    }
    if (tossResult === "batting") {
        //if target position team and opposition team are same
        if (isLimitNrrKnown === false) {
            const lowerOrHigherRuns = (
                (
                    (
                        (comparedTeamForOvers + decimalOvers) *
                        (comparedTeamAgainstOvers + decimalOvers) *
                        (selectedTeamForRuns + firstInningRuns) *
                        (selectedTeamAgainstOvers + decimalOvers)
                    ) +
                    (
                        (selectedTeamForOvers + decimalOvers) *
                        (selectedTeamAgainstOvers + decimalOvers) *
                        (comparedTeamAgainstRuns + firstInningRuns) *
                        (comparedTeamForOvers + decimalOvers)
                    ) -
                    (
                        selectedTeamAgainstRuns *
                        (comparedTeamForOvers + decimalOvers) *
                        (comparedTeamAgainstOvers + decimalOvers) *
                        (selectedTeamForOvers + decimalOvers)
                    ) -
                    (
                        comparedTeamForRuns *
                        (selectedTeamForOvers + decimalOvers) *
                        (selectedTeamAgainstOvers + decimalOvers) *
                        (comparedTeamAgainstOvers + decimalOvers)
                    )
                ) /
                (
                    (
                        (selectedTeamForOvers + decimalOvers) *
                        (selectedTeamAgainstOvers + decimalOvers) *
                        (comparedTeamAgainstOvers + decimalOvers)
                    ) +
                    (
                        (comparedTeamForOvers + decimalOvers) *
                        (comparedTeamAgainstOvers + decimalOvers) *
                        (selectedTeamForOvers + decimalOvers)
                    )
                )
            )
            return lowerOrHigherRuns
        } else {
            const lowerOrHigherRuns = (
                (
                    (
                        (selectedTeamForRuns + firstInningRuns) *
                        (selectedTeamAgainstOvers + decimalOvers) -
                        (
                            limitNrr *
                            (selectedTeamForOvers + decimalOvers) *
                            (selectedTeamAgainstOvers + decimalOvers)
                        )
                    ) /
                    (selectedTeamForOvers + decimalOvers)
                ) -
                (
                    selectedTeamAgainstRuns
                )
            )
            return lowerOrHigherRuns
        }
    }
}