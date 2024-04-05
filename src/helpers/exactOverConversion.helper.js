exports.convertToExactOver = (over, check = "higher") => {

     const x = ((over - parseFloat(Math.floor(over)).toFixed(3))) * 6
     let y
     if (check === "higher") {
          y = Math.ceil(x)
     }
     else {
          y = Math.floor(x)
     }
     if (y == 6) return Math.floor(over) + 1
     const exactOver = parseFloat(`${Math.floor(over)}.${y}`)
     return exactOver

}
