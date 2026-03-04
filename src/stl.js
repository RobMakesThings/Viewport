

import { Mesh } from "./mesh.js"
import { Triangle } from "./triangle.js"
import { Vector } from "./vector.js"


/**https://github.com/amandaghassaei/stl-parser/blob/main/src/stl-parser.ts
 * 
 */
/*
from https://en.wikipedia.org/wiki/STL_(file_format)
UINT8[80]    – Header                 - 80 bytes
UINT32       – Number of triangles    - 04 bytes
foreach triangle                      - 50 bytes
    REAL32[3] – Normal vector         - 12 bytes
    REAL32[3] – Vertex 1              - 12 bytes
    REAL32[3] – Vertex 2              - 12 bytes
    REAL32[3] – Vertex 3              - 12 bytes
    UINT16    – Attribute byte count  - 02 bytes
end
*/

/**
 * Loads a model from binary STL file
 * @param {String} path 
 * @returns {Mesh}
 */
export async function loadBinaryStl(path) {

    const response = await fetch(path)

    const arrayBuffer = await response.arrayBuffer()

    let faceCount = new Uint8Array(arrayBuffer)[80] // header ends at 80 
    const buffer = new DataView(arrayBuffer)
    console.log(buffer)
    let offset = 84
    let triDataLength = 12 * 4 + 2///each tri is 50 bytes
    let tris = []
    for (let i = 0; i < faceCount; i++) {
        let tri = []

        for (let j = 1; j <= 3; j++) {
            const vertexStart = start + j * 12
            let vert = new Vector()
            vert.x = buffer.getFloat32(vertexStart, true)
            vert.y = buffer.getFloat32(vertexStart + 4, true)
            vert.z = buffer.getFloat32(vertexStart + 8, true)
            tri.push(vert)
        }
        tri = new Triangle(tri[0], tri[1], tri[2])

        tris.push(tri)

    }
    // console.log(tris)

    return new Mesh(tris)

}
/**
 * exports selected mesh as STL
 * @param {Mesh} mesh to be output 
 * 
 */
export function saveBinaryStl(mesh) {
    let size = mesh.triangles.length*50+84
    let buffer = new DataView(new ArrayBuffer(size))


    /// write header, write verts to buffer 
    buffer.setUint32(80, mesh.triangles.length, true)
    let offset = 84
    let triDataLength = 12 * 4 + 2///each tri is 50 bytes
    for (let i = 0; i < mesh.triangles.length; i++) {

        let start = offset + (i * triDataLength)/////start at 84+50*i to loop though each tri skipping normal

        let tri = mesh.triangles[i]
        for (let j = 1; j <= 3; j++) {
            /// should probably write normals to the file, but eh, nah
            const vertexStart = start + j * 12
            let vert
            if(j==1)vert= tri.v1
            if(j==2)vert = tri.v2
            if (j==3)vert = tri.v3//this aint pretty but it a works a
            console.log(tri)
            buffer.setFloat32(vertexStart,vert.x,true)
            buffer.setFloat32(vertexStart+4,vert.y,true)
            buffer.setFloat32(vertexStart+8,vert.z,true)


        }


    }
    const blob = new Blob([buffer], { type: 'application' });

    // 2. Create an anchor element
    const link = document.createElement("a");

    // 3. Create a URL for the blob and set it as the download target
    link.href = URL.createObjectURL(blob);
    link.download = "model.stl";

    // 4. Trigger the download
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

}
/**
 * Loads a model from text STL file
 * @param {String} path 
 * @returns {Mesh}
 */
export async function loadTextSTL(path) {
    const response = await fetch(path).then(r => r.text())
    const lines = response.split('\n');
    let tris = []
    let tri = []

    for (let line of lines) {
        let parts = line.trim().split(/\s+/)

        if (parts[0] == "vertex") {
            let vert = new Vector(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]))
            tri.push(vert)
            if (tri.length == 3) {
                tris.push(new Triangle(tri[0], tri[1], tri[2]))
                tri = []
            }

        }
    }
    return new Mesh(tris)

}