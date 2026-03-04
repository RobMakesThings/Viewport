
import { Scene, Vector,FunctionLines,Box } from "../src/viewport.js";



let scene = new Scene()
let n = 0
let center = new Vector(1.1, 0, 0)
let up = new Vector(0, 0, 1)
let eye = new Vector(3, 0, 3)


let func = (x,y)=>{return -13/(x*x+y*y)}

let box = new Box(new Vector(-2,-2,-4),new Vector(2,2,2))
scene.add(new FunctionLines(func,box,1))
let h = 1024
let w = 1024
let fovy = 50
console.log(scene)
let paths = scene.render(eye, center, up, w, h, fovy, 0.01, 100,0.01)
console.log(paths)
console.log(scene, 2)
// paths.pathsToSVG(paths,h,w)
const sketch = (sketch) => {


    let s = sketch
    sketch.setup = () => {
        sketch.createCanvas(w, h);
    };

    sketch.draw = () => {
        s.background(255);
        s.stroke(0)
        s.noFill()
        for (let path of paths.paths) {
            s.push()
            s.beginShape()
            s.translate(w / 2, h / 2)
            s.scale(1, -1)

            s.translate(-w / 2, -h / 2)

            for (let vert of path.verts) {
                s.vertex(vert.x, vert.y)

            }
            s.endShape()
            s.pop()
        }
        s.noLoop()
    };
};

let myp5 = new p5(sketch, 'p5sketch');
