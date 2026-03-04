import { max, min } from './vector.js'
import { axisX, axisY, axisZ } from './axis.js'
import { Vector } from './vector.js'
/**
     * this file defines boxes for use in ray collision bounding boxes. This type of box 
     * does not draw anything and is never meant to. To draw a box, use a cube! :) 
     */

export function boxForShapes(shapes) {
    
    if (shapes.length == 0) {
        return new Box()
    }
    let box = shapes[0].boundingBox()
    for (let shape of shapes) {
        box = box.extend(shape.boundingBox())
    }
    return box

}
export function boxForTriangles(shapes) {
    if (shapes.length == 0) {
        return new Box()
    }
    // console.log(shapes[0].box)
    let box = shapes[0].box
    // console.log(box)
    for (let shape of shapes) {
        // console.log(shape)

        box = box.extend(shape.boundingBox())
    }
    return box

}
export function boxForVectors(points) {
    // takes an array of p5 vector objects of verts 

    if (points.length == 0) {
        /// return empty box? 
        // this means just one vert so not much of a box to produce

    }
    let min = points[0]
    let max = points[0]
    for (let vert of points) {
        min = min.min(vert)
        max = max.max(vert)
    }
}



export class Box {
    constructor(min, max) {
        this.min = min
        this.max = max
    }


    anchor(anchor) {
        let num = this.size()
        num = num.mult(anchor)
        return this.min.add(num)
    }
    center() {
        return this.anchor(new Vector(.5, .5, .5))
    }
    size() {
        return this.max.sub(this.min)
    }
    contains(b) {
        let a = this
        return a.min.x <= b.x && a.max.x >= b.x && a.min.y <= b.y && a.max.y >= b.y && a.min.z <= b.z && a.max.z >= b.z

    }
    extend(b) {
        let a = this
        return new Box(a.min.min(b.min), a.max.max(b.max))
    }
    intersect(ray) {
        
        let x1 = (this.min.x - ray.origin.x) / ray.direction.x
        let y1 = (this.min.y - ray.origin.y) / ray.direction.y
        let z1 = (this.min.z - ray.origin.z) / ray.direction.z
        let x2 = (this.max.x - ray.origin.x) / ray.direction.x
        let y2 = (this.max.y - ray.origin.y) / ray.direction.y
        let z2 = (this.max.z - ray.origin.z) / ray.direction.z
        if (x1 > x2) {

            let temp = x1
            x1 = x2
            x2 = temp
            // x1, x2 = x2, x1
        }
        if (y1 > y2) {
            let temp = y1
            y1 = y2
            y2 = temp
            // y1, y2 = y2, y1
        }
        if (z1 > z2) {
            let temp = z1
            z1 = z2
            z2 = temp
            // z1, z2 = z2, z1
        }
        let t1 = max(max(x1, y1), z1)
        let t2 = min(min(x2, y2), z2)
        // console.log(t1, t2, "t1 and t2 at box.inttersect")
        return [t1, t2]


    }
    partition(axis, point) {// returns left or right for bvh tree
        let b = this
        let left = false
        let right = false
        // console.log(axis, point, this)
        switch (true) {
            case axis == axisX:
                left = b.min.x <= point
                right = b.max.x >= point
                break
            case axis == axisY:
                left = b.min.y <= point
                right = b.max.y >= point
                break

            case axis == axisZ:
                left = b.min.z <= point
                right = b.max.z >= point
                break

        }
        return [left, right]

    }
}
