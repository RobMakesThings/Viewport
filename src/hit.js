export class Hit {
   
    constructor(shape,t){
        this.shape = shape
        this.t= t

    }
    ok(){
        return this.t <Infinity
    }
    min( b) {
        let a = this
        if(a.t<=b.t){
            return a
        }
        return b
    }
    max( b) {
        let a = this

        if(a.t> b.t){
            return a
        }
        return b
    }

}
export const noHit = new Hit(null, Infinity)