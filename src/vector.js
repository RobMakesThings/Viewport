import { lerp } from "./util.js"


/**
 * 
 * @returns  new  Vector with Random x,y, and z  normalized between 0-1
 */
export function randomUnitVector() {
    for (; ;) {
        let x = Math.random() * 2 - 1
        let y = Math.random() * 2 - 1
        let z = Math.random() * 2 - 1
        if (x * x + y * y + z * z > 1) {
            continue
        }
        return new Vector(x, y, z).normalize()

    }


}
export function min(a, b) {
    return Math.min(a, b)
}
export function max(a, b) {
    return Math.max(a, b)
}
/**
     * Takes 3 params for the positions of the vector , default values zero. 
     * All operations are NOT done in place, they return new vectors. 
     * @param {float} x 
     * @param {float} y 
     * @param {float} z 
     */
export class Vector {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z

    }
    lerp(lerpTo,factor){
        let lerpFrom = this
        return new Vector(lerp(this.x,lerpTo.x,factor),lerp(this.y,lerpTo.y,factor),lerp(this.z,lerpTo.z,factor))

    }
    /**
     * 
     * @returns the length of the vector 
     */
    
    length() {
        let a = this
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
    }
    /**
     * 
     * @param {Vector} b is the point to check distance to  
     * @returns distance as float 
     */
    distance(b) {
        let a = this
        a = a.sub(b)

        return a.length()

    }
    /**
     * 
     * @returns {Number}The length of the curren vector
     */
    lengthSquared() {
        let a = this
        return a.x * a.x + a.y * a.y + a.z * a.z
    }

    /**
     * 
     * @param {Vector} b 
     * @returns {Number}
     */
    distanceSquared(b) {

        return this.sub(b).lengthSquared()
    }
    /**
     * dot product @see {@link https://en.wikipedia.org/wiki/Dot_product}
     * @param {Vector} b 
     * @returns {Number}
     */
    dot(b) {
        let a = this
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z)
    }
    /**
     * 
     * @param {Vector} b 
     * @returns {Vector}
     */
    cross(b) {
        let a = this
        let x = a.y * b.z - a.z * b.y
        let y = a.z * b.x - a.x * b.z
        let z = a.x * b.y - a.y * b.x
        return new Vector(x, y, z)
    }
    /**
     * 
     * @returns {Vector} Vector between 0 and 1 
     */
    normalize() {
        let a = this
        let d = a.length()
        return new Vector(a.x / d, a.y / d, a.z / d)
    }
    /**
     * 
     * @param {Vector} b 
     * @returns {Vector}
     */
    add(b) {
        let a = this
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z)
    }
    /**
     * 
     * @param {Vector} b 
     * @returns {Vector}
     */
    sub(b) {
        let a = this

        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z)
    }
    /**
     * 
     * @param {Vector} b 
     * @returns {Vector}
     */
    mult(b) {
        let a = this
        return new Vector(a.x * b.x, a.y * b.y, a.z * b.z)
    }
    /**
     * 
     * @param {Vector} b 
     * @returns {Vector}
     */
    div(b) {
        let a = this
        return new Vector(a.x / b.x, a.y / b.y, a.z / b.z)
    }
    /**
     * 
     * @param {Float} b 
     * @returns {Vector}
     */
    addScalar(b) {
        let a = this
        return new Vector(a.x + b, a.y + b, a.z + b)
    }
    /**
     * 
     * @param {Float} b 
     * @returns {Vector}
     */
    subScalar(b) {
        let a = this
        return new Vector(a.x - b, a.y - b, a.z - b)
    }
    /**
     * 
     * @param {Float} b 
     * @returns {Vector}
     */
    mulScalar(b) {
        let a = this
        return new Vector(a.x * b, a.y * b, a.z * b)
    }
    /**
     * 
     * @param {Float} b 
     * @returns {Vector}
     */
    divScalar(b) {
        let a = this
        return new Vector(a.x / b, a.y / b, a.z / b)
    }
    min(b) {
        let a = this
        return new Vector(min(a.x, b.x), min(a.y, b.y), min(a.z, b.z))
    }
    max(b) {
        let a = this
        return new Vector(max(a.x, b.x), max(a.y, b.y), max(a.z, b.z))
    }
    minAxis() {
        let a = this
        let x = abs(a.x)
        let y = abs(a.y)
        let z = abs(a.z)
        switch (true) {
            case (x <= y && x <= z):
                return new Vector(1, 0, 0)
            case (y <= x && y <= z):

                return new Vector(0, 1, 0)

            default:
                return new Vector(0, 0, 1)
        }

    }
    /**
     * 
     * @returns whatever vector is lowest 
     */
    minComponent() {
        let a = this
        return min(min(a.x, a.y), a.z)
    }
    /**
     * 
     * @param {Vector} v 
     * @param {Number} w 
     * @returns {Vector}
     */
    segmentDistance(v, w) {
        let p = this

        let l2 = v.distanceSquared(w)

        if (l2 == 0) {
            return p.distance(v)
        }
        let t = p.sub(v).dot(w.sub(v)) / l2
        if (t < 0) {
            return p.distance(v)

        }
        if (t > 1) {
            return p.distance(w)
        }
        return v.add(w.sub(v).mulScalar(t)).distance(p)
    }
}