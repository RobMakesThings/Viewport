import './viewport.js'

import { Box } from './box.js'
import {Vector} from './vector.js'
import { Matrix } from './matrix.js'
import { Hit } from './hit.js'


//hopefully nobody needs to interact with this
export function clipFilter(matrix,eye,scene,v){
let clipBox = new Box(new Vector(-1,-1,-1),new Vector(1,1,1))

        let w = matrix.mulPositionW(v)
       
        if (!scene.visible(eye,v)){
            
            return{w:w,hit:false}
        }
        if(!clipBox.contains(w)){

            return {w:w,hit:false}
        }

        return {w:w,hit:true}
    
    }




