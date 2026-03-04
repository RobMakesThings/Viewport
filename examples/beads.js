import { Scene, Vector, OutlineSphere , HSphere } from "../src/viewport.js";
import { remap } from "../src/util.js";

let eye = new Vector(8, 8, 80)
let center = new Vector(0, 0, 0)
let up = new Vector(0, 0, 1)


let scene = new Scene()


for(let a= 0;a<50;a++){
    let n =250
    let xs = lowPassNoise(n,.3,8)
    let ys = lowPassNoise(n,.3,4)
    let zs = lowPassNoise(n,.3,4)
    let ss = lowPassNoise(n,.3,4)
    let position = new Vector(0,0,0)
    for (let i = 0; i<n;i++){
        // console.log(position)
        let r = remap(Math.random(),0,1,.04,.08)
        let sphere = new OutlineSphere(position,r,eye,up)
        if(Math.random()<.1){
            sphere = new HSphere(position,r,20)
        }
        scene.add(sphere)
        let s = (ss[i]+1)/2*.1+.01
        let v = new Vector(xs[i],ys[i],zs[i]).normalize().mulScalar(s)
        position = position.add(v)
    }

}

let h = 1200
let w = 900
let fovy = 20
let paths = scene.render(eye, center, up, w, h, fovy, 0.01, 1000,0.01)
// paths.pathsToSVG(paths,h,w)
// paths.pathsToSVG(paths,h,w)
const sketch = (sketch) => {


    let s = sketch
    sketch.setup = () => {
        sketch.createCanvas(w, h);
        let save = function (){paths.pathsToSVG(paths,h,w)}

        let saveButton = s.createButton("Save")
        saveButton.position(0,h)
        saveButton.mousePressed( save)

    };

    sketch.draw = () => {
        s.background(255);
        s.stroke(0)
      
        // let paths = scene.render(eye, center, up, w, h, fovy, 0.01, 1000, 0.1)
console.log(paths)

        for (let path of paths.paths) {
            s.push()
            s.beginShape()
            s.translate(w / 2, h / 2)
            // s.rotate(s.PI/3)
            s.scale(1, -1)

            s.translate(-w / 2, -h / 2)

            // s.scale(1,-1)
            // s.rotate()
            for (let vert of path.verts) {
                s.vertex(vert.x, vert.y)

            }
            s.endShape()
            s.pop()
        }
        s.noLoop()
    };
    sketch.keyPressed = () => {
        if (sketch.key === "s") {
            s.saveGif("mySketch", 3);
        }
        if (sketch.key === "a") {
            s.save();
        }
    }
};

let myp5 = new p5(sketch, 'p5sketch');

function NormalizeArray(values, a,b){
    let result = Array(values.length).fill(0)
    let lo = values[0]
    let hi = values[0]
    for (let x of values){
        lo = Math.min(lo,x)
        hi = Math.max(hi,x)
    }
    for (let i = 0;i<values.length;i++){
        let x = values[i]
        let p = (x-lo)/(hi-lo)
        result[i]=a+p*(b-a)
    }
    return result

}
function lowPass(values ,alpha){
    let result = Array(values.length).fill(0)
    let  y =0
    for(let i= 0 ; i<values.length;i++){
        let x = values[i]
        y-=alpha*(y-x)
        result[i]= y
    }
    return result


}
function lowPassNoise(n,alpha , iterations){
    let result = Array(n).fill(0)
    for (let i = 0 ; i<result.length;i++){
        result[i]=Math.random()
    }
    for (let i = 0 ; i<iterations;i++){
        result = lowPass(result,alpha)

    }
    result = NormalizeArray(result,-1,1)
    return result



}