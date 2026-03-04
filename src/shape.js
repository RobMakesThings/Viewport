
import { Box } from "./box.js"
import { noHit } from "./hit.js"
import { Matrix } from "./matrix.js"
import { Paths } from "./path.js"
import { Vector } from "./vector.js"


export class EmptyShape{
    constructor(){

    }
    compile(){}
    boundingBox(){
        return new Box(new Vector(), new Vector())
    }
    contains(v,f){
        return false
    }
    intersect(r){
        return noHit
    }
    paths(){
        return null
    }
}



/**
 * 
 * Add any shape to this to move it around with a matrix. 
 * @example 
 * let matrix = Translate(new Vector(0,0,5))// move 5 units up
 * cube = new TransformedShape(shape, matrix)
 *  (Shape, Matrix)
 * @param Shape
 * @param {Matrix}
 */
export class TransformedShape{
   
    constructor(shape, matrix, inverse = matrix.inverse()){
        this.shape= shape
        this.matrix =matrix
        this.inverse = inverse
    }
    boundingBox(){
        return this.matrix.mulBox(this.shape.boundingBox())
    }
    contains(v,f){

        return this.shape.contains(this.inverse.mulPosition(v),f)
    }
    intersect(ray){
        
        return this.shape.intersect(this.inverse.mulRay(ray))
    }
    paths(){
        return this.shape.paths().transform(this.matrix)
    }
    
}