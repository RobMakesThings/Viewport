export class Ray{

    constructor(origin,direction){
        this.origin = origin
    
        this.direction =direction

    }
    position(t){
        return this.origin.add(this.direction.mulScalar(t))

    }
}