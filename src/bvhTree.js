import { boxForShapes } from './box.js'
import { min} from './vector.js'

import { noHit } from './hit.js'
import { axisNone,axisX,axisY,axisZ } from './axis.js'
import { median } from './util.js'

export class Tree {
    /**
     * Defines bounding volume heirarchy tree for faster collision processing. 
     * if a ray hits doesnt hit a bounding box it will hit not hit anything else. 
     * @param {Array} shapes t
     */
    constructor(shapes) {
        this.box = boxForShapes(shapes)
        this.root = new Node(shapes)
        this.root.split()



    }

    intersect(ray) {
        let [tmin, tmax] = this.box.intersect(ray)
        // console.log(`tmin:${tmin}, tmax:${tmax}`,this.box)
        if ((tmax < tmin) ||( tmax <= 0)) {
            
            return noHit
        }
        // console.log('tree intersect should be going deeper',this.box.intersect(ray))

        return this.root.intersect(ray, tmin, tmax)

    }
}

export class Node {
    /**
     * Defines a node inside a BVH Tree
     * at some point i would love to like put some of these functions into web workers or something
     * @param {Array} shapes 
     */
    constructor(shapes=null) {
        this.axis = axisNone
        this.point = 0
        this.shapes = shapes
        this.left = null
        this.right = null

    }
    
    intersect(ray, tmin, tmax) {
        let node = this
        let tsplit
        let leftFirst
        // console.log(node)
        let axis =  node.axis
        // console.log(axis, "axis First")

        switch (true) {

           
            case axis ==axisNone:
                return node.intersectShapes(ray)
            case  axis ==axisX:

                tsplit = (node.point - ray.origin.x)
                tsplit = tsplit / ray.direction.x
                leftFirst = (ray.origin.x < node.point) || ((ray.origin.x == node.point) && (ray.direction.x <= 0))
                break
            case axis ==axisY:

                tsplit = (node.point - ray.origin.y) / ray.direction.y
                leftFirst = (ray.origin.y < node.point) || ((ray.origin.y == node.point )&& (ray.direction.y <= 0))
                break

            case axis ==axisZ:

                tsplit = (node.point - ray.origin.z) / ray.direction.z
                leftFirst = (ray.origin.z < node.point) || ((ray.origin.z == node.point )&& (ray.direction.z <= 0))
                break

            }
        let first = new Node()
       let  second = new Node()
        if(leftFirst){
            
            first = node.left
            second = node.right

        }
        else{

            first= node.right
            second = node.left
        }

        if ((tsplit>tmax)||(tsplit<=0)){
            return first.intersect(ray,tmin,tmax)
        }
        else if(tsplit<tmin){
            return second.intersect(ray,tmin,tmax)
        }
        else{
            let h1 = first.intersect(ray,tmin,tsplit)
            if (h1.t<=tsplit){
                return h1
            }
            let h2 = second.intersect(ray,tsplit,min(tmax,h1.t))
            if (h1.t<=h2.t){
                return h1
            }
            else{
                return h2 
            }
        }
    }
    intersectShapes(ray){
        let hit = noHit
        
        let node = this
        for(let shape of node.shapes){
            let h = shape.intersect(ray)

            if(h.t<hit.t){
                hit = h 

            }

        }
        return hit 
    }
    partitionScore(axis,point){
        let node = this
        let left = 0
        let right = 0
        for (let shape of node.shapes){
            let box = shape.boundingBox()
            let [l,r]=box.partition(axis,point)
           
            if (l){
                left++
            }
            if (r){
                right++
            }
           
        }
         if(left>=right){
                return left 
            }
            else{
                return right
            }
    
    }

    partition(size, axis,point){/// do not remove size, its a break. not used here but elsewhere? 
        let node = this
        let left = []
        let right = []
        for (let shape of node.shapes){

            let box =shape.boundingBox()
            let [l,r]=box.partition(axis,point)

            if (l){
                left.push(shape)
            }
            if(r){
                right.push(shape)
            }
        }   
        
        return [left, right]


    }
    split(depth){
        let node = this
        if(node.shapes.length<4){
            return
        }

        let xs = []
        let ys = []
        let zs =[]
        
        for(let shape of node.shapes){
            let box = shape.boundingBox()
            // console.log(box,shape)
            xs.push(box.min.x)
            xs.push(box.max.x)
            ys.push(box.min.y)
            ys.push(box.max.y)
            zs.push(box.min.z)
            zs.push(box.max.z)
        }
     

        xs.sort(function(a,b){return a - b})/// i cannot but can f**king belive js sorts this way. at least 3 hours oof me being dumb here. 
        ys.sort(function(a,b){return a - b})
        zs.sort(function(a,b){return a - b})

        let mx = median(xs)
        let my = median(ys)
        let mz = median(zs)
        let best =Math.floor(node.shapes.length*.85)
        let bestAxis = axisNone
        let bestPoint = 0.0
       

        let sx = node.partitionScore(axisX,mx)
 
        if(sx<best){
            best = sx
            bestAxis= axisX
            bestPoint = mx

        }
        let sy = node.partitionScore(axisY,my)
        if(sy<best){
            best = sy
            bestAxis= axisY
            bestPoint = my
            
        }
        let sz = node.partitionScore(axisZ,my)
        if(sz<best){
            best = sz
            bestAxis= axisZ
            bestPoint = mz
            
        }
        if(bestAxis==axisNone){
            return
        }
        let [l, r]=node.partition(best,bestAxis,bestPoint)
        node.axis=bestAxis
        node.point=bestPoint
        node.left = new Node(l)
        node.right = new Node(r)
        node.left.split(depth+1)
        node.right.split(depth+1)
        node.shapes = null
    }

}

