

exports.calculateNrr = (forRuns, forOvers, againstRuns, againstOvers) => {
    return ((forRuns / forOvers) - (againstRuns / againstOvers))
}