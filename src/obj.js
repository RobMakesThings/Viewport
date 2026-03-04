
import { Triangle, } from "./triangle.js";
import { Vector } from "./vector.js";
import { Mesh } from "./mesh.js";

/**
 * 
 * @param {String} path to obj file "./file.obj"
 * @returns {Mesh}
 */
export async function loadOBJ(path) {
    const response = await fetch(path).then(r=>r.text())

/**
 * Takes A path to an obj
 */
    const vertices = [];
    const faces = [];
    const lines = response.split('\n');
    // const faceIndices = [];
    let tris = []

    for (const line of lines) {
        const parts = line.trim().split(/\s+/);

        if (parts[0] === 'v') {
            // Vertex
            vertices.push(new Vector(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
            ));
        } else if (parts[0] === 'f') {
            // Face (supports f v1 v2 v3 or f v1/vt1/vn1 v2/vt2/vn2 ...)
            const faceIndices = [];
            for (let i = 1; i < parts.length; i++) {
                const vertexIndex = parseInt(parts[i].split('/')[0])-1 ; // OBJ is 1-indexed
                faceIndices.push(vertexIndex);
            }
            // faces.push(faceIndices);

            for (let i = 1; i < faceIndices.length - 1; i++) {

                let i1 = 0
                let i2 = i
                let i3 = i + 1
                // console.log(vertices[faceIndices[i1]],vertices[faceIndices[i2]],faceIndices[faces[i3]],faces[i1])

                let tri = new Triangle(vertices[faceIndices[i1]], vertices[faceIndices[i2]], vertices[faceIndices[i3]])
                tris.push(tri)
            }
        }

    }


    // console.log(tris)
    return new Mesh(tris);
}