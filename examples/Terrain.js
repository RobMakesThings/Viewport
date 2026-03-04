

import { Scene, Vector,Paths, constrain, Path,TerrainPlane } from "../src/viewport.js";
let colors = ["#d21ed8","#f00000","#ff5e00"]


let center = new Vector(0, 0, 0)
let up = new Vector(0, 0, 1)
let eye = new Vector(5, 0, 20)


let scene = new Scene()


let paths
let w = 800

let h = 200
let fovy = 80
console.log(scene)
// scene.ortho(true)


console.log(paths)
console.log(scene, 2)
// paths.pathsToSVG(paths,h,w)
const sketch = (sketch) => {


    let s = sketch
    sketch.setup = () => {
        sketch.createCanvas(w, h);
        let save = function () { paths.pathsToSVG(paths, h, w) }

        let saveButton = s.createButton("Save")
        saveButton.position(0, h)
        saveButton.mousePressed(save)

        const terrain = new TerrainPlane(
            new Vector(0, -50, 0), up, 150, 40, 40,

            (x, y) => {

                const scale = .18;
                let n = s.noise((x - w) * scale +
                    .15, (y - h) * scale) * 6.8;
                n = constrain(n, 0, 3.8)
                return n
            });

        scene.add(terrain)
         paths = scene.render(eye, center, up, w, h, fovy, 0.01, 100, 0.01)
    };

    sketch.draw = () => {
        s.background(255);
        s.stroke(0)
        s.noFill()
        for (let path of paths.paths) {
            s.push()
            s.beginShape()
            s.translate(w / 2, h / 2)///im not sure why we really have to go back and forth here, but i think we do. 

            s.scale(1, -1)

            s.translate(-w / 2, -h / 2)
                ;
            // while (path.type === "paths"){
            //     path = path.paths
            // }
            // console.log(path.paths[0].paths[0].verts);

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


Path.prototype.toSVG =function(color,path = this) {

        let coords = ''
        for (let v of this.verts) {

            coords += `${v.x},${v.y} `
        }
        const points = coords
        console.log(color)
        return `<polyline stroke="${color}" fill="none" points="${points}" />`;
    }
Paths.prototype.pathsToSVG =function (paths = this.paths, width, height) {
        const lines = [];

        // Open the SVG tag
        lines.push(`<svg width="${width}" height="${height}" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">`);
        // Add the coordinate system transformation (flips Y-axis to be bottom-up)
        lines.push(`  <g transform="translate(0,${height}) scale(1,-1)">`);
        // console.log(paths.paths)
        // Iterate through each individual path

        for (const path of paths.paths) {
            // We reuse the toSVG function from the previous step
        let col = colors[Math.floor(Math.random()*colors.length)]

            
            // console.log(path)
            lines.push(`${path.toSVG(col)}`);
        }

        // Close tags
        lines.push("</g>");
        lines.push("</svg>");

        this.saveSVGToFile(lines.join("\n"))
    }