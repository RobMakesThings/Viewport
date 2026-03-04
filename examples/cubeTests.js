import { Scene, Vector, newTransformedOutlineCylinder,newTransformedOutlineCone } from "../src/viewport.js";


let eye = new Vector(0, 1, 6)
let center = new Vector(0, 0, 0)
let up = new Vector(0, 0, 1)
let h = 500
let w = 500
let fovy = 100

let scene  = new Scene()
let n =2
for (let x = -n; x < n; x++) {
    for (let y = -n; y < n; y++) {
        let p =1*.18+.2
        let dx =.2-.25
        let dy =1-0.4

        let fx = x+dx*5
        let fy = y+dy*3
        let fz =1
        // let cube = new Cube(new Vector(fx - p, fy - p, 0), new Vector(fx + p, fy + p, fz))
        // let cube = new Cylinder(p/3,fx-p,fz) 
        let cube = newTransformedOutlineCylinder(eye,up, new Vector(fx - p, fy - p, 0),new Vector(fx - p, fy - p, fz),p)

        // let cube = new Cone(p,Math.abs(fz))
        // cube = new OutlineCone(p,Math.abs(fz),eye, up)
        let cube1 = newTransformedOutlineCone(eye,up, new Vector(fx - p, fy - p, 0),new Vector(fx - p, fy - p, fz),p)
        // let cube = new OutlinecCylinder(eye, up, fz/10,fx-p,fy+fz)

        // cube = newTransformedOutlineCone(eye,up,d)
        // cube = new TransformedShape(cube,Translate(new Vector(x,y,0)))
        // let cube = new StripedCube(new Vector(fx - p, fy - p, 0), new Vector(fx + p, fy + p, fz), 50, 10, 0, .8, 1, .5)
        // scene.add(cube1)
        
        scene.add(cube)

    }
}


// let cube = new Cube()
let c = -5
let s = .5



console.log(scene)
let paths = scene.render(eye, center, up, w, h, fovy, 0.1, 100, 0.01)
console.log(paths)
// paths.pathsToSVG(paths,h,w)
const sketch = (sketch) => {


    let s = sketch
    sketch.setup = () => {
        sketch.createCanvas(w, h);
    };

    sketch.draw = () => {
        s.background(255);
        s.stroke(0)
        for (let path of paths.paths) {
            s.noFill()
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
};

let myp5 = new p5(sketch, 'p5sketch');
