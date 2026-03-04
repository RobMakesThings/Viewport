
import './viewport.js'
import { Path, Paths } from './path.js'
import { Ray } from './ray.js'
import { EmptyShape } from './shape.js'

const intersection = 0
const difference = 1

/**
     * 
 * 
 * Intersects the first shape with everything after
 * @param  {Shape | Primitives} shapes 
 * @returns {BooleanShape}
 */
export function newIntersection(...shapes) {
    return newBooleanShape(intersection, shapes)
}
/**
 * Subtracts following shapes from the first shape in the list
 * @param  {Shapes | Primitives} shapes 
 * @returns {BooleanShape}
 */
export function newDifference(...shapes) {
    return newBooleanShape(difference, shapes)

}
export function newBooleanShape(op, shapes) {
    if (shapes.length == 0) {
        return new EmptyShape()/// empty shape here... will have to think about this more

    }
    let shape = shapes[0]
    for (let i = 1; i < shapes.length; i++) {

        shape = new BooleanShape(op, shape, shapes[i])
    }
    // console.log(shape)
    return shape
}
export class BooleanShape {
    constructor(op, a, b) {
        this.op = op // operation, what are we doing, adding, subtracting or union
        this.a = a

        this.b = b



    }
    compile() {

    }
    boundingBox() {
        let s = this
        // console.log(this)
        let a = s.a.boundingBox()
        let b = s.b.boundingBox()
        return a.extend(b)
    }
    contains(v, f) {
        let s = this
        f = 1e-3
        switch (s.op) {
            case intersection:
                return s.a.contains(v, f) && s.b.contains(v, f)
            case difference:
                // console.log("dif");
                // console.log(s.a.contains(v, f) , s.b.contains(v, -f),"difference contasins")

                return s.a.contains(v, f) && !s.b.contains(v, -f)
        }
        return false
    }
    intersect(ray) {
        let s = this
        let h1 = s.a.intersect(ray)
        let h2 = s.b.intersect(ray)
        let h = h1.min(h2)
        let v = ray.position(h.t)
        if (!h.ok() || s.contains(v, 0)) {
            return h
        }
        return s.intersect(new Ray(ray.position(h.t + .01), ray.direction))
    }
    paths() {
        let s = this
        let p = s.a.paths()
        // console.log(p.paths.concat(0))
        p.paths = p.paths.concat(...s.b.paths().paths)
        console.log(p)

        p = p.chop(0.01)
        let result = []

        for (let path of p.paths) {
            let newPath = []
            for (let v of path.verts) {
                // console.log(v)
                v = this.Filter(v)

                if (v.contains) {
                    newPath.push(v.v)
                }
                else {
                    if (newPath.length > 1) {
                        result.push(new Path(newPath))
                        newPath = []
                    }
                    newPath = []

                }

            }
            if (newPath.length > 1) {
                result.push(new Path(newPath))
                        newPath = []

            }


        }


        return new Paths(result)
    }
    Filter(v) {

        return { v: v, contains: this.contains(v, 0) }
    }
}
