import { PI } from "./common.js"


export function median(items){
    let n = items.length 

    switch (true){
        case n==0 :
            return 0 
        case (n%2==1):
            return items[Math.floor(n / 2)]
        default:

            let a = items[(n/2)-1]
            let b = items[n/2]
            // console.log(a, b,"a and b in median"); // Equivalent to fmt.Println

            return ((a+b)/2)

    }
}


export function remap(value, low1,high1,low2,high2){
    return(low2+(value-low1)*(high2-low2)/(high1-low1))
}
export function radians(degrees){
    return degrees*PI/180
}
export function degrees(radians){
    return radians *180/PI
}
///stolen from https://github.com/processing/p5.js/blob/v1.11.11/src/math/calculation.js#L332
export function constrain(n, low , high){
    return Math.max(Math.min(n, high), low)
}
export function lerp(start , stop ,amt){
    return amt * (stop - start) + start
}