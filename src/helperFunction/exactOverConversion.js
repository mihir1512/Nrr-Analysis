exports.convertToExactOver=(over)=>{
    const x=Math.ceil(((over-Math.floor(over)).toFixed(3))*6)
    console.log(/kkk/,x);
    if(x==6)return Math.floor(over)+1
    const exactOver=parseFloat(`${Math.floor(over)}.${x}`)
    return exactOver

    
}