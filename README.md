# Viewport.js

Viewport is a vector-based 3D renderer written in javascript. It is used to produce vector graphics like SVGs depicting 3D scenes.
![image](./examples/assets/img/header.png)


Viewport is a port or translation of [Ln](https://github.com/LoicGoulefert/ln), a 3d line art render engine originally developed by Michael Fogleman and expanded upon by Loic Goulefert written in Go. 

I ported this library to javascript for myself to use and I thought it would be a good way to "learn" some Go. 

This library is intended for plotter artists mostly, but anyone who needs to output an SVG made of lines in a 3D scene could benefit. 


Some primitives can be added in simple line art, or with more complex shading. 
- Sphere ⚽
- Cube, 🎲
- Cone,  🎄
- Cylinder, 🛢️
- Shard -- like a diamond or two pyramids ♦️
- Mesh - Obj and STL support. 

Some utilites are included and required for use such as a simple vector and matrix math. 



[Documentation and a quick guide](https://robmakesthings.github.io/Viewport.js) is available. I tried to document anything an artist would expect to work with. I also put together an "interactive example" sketch to play with. 

Examples are available to in the example directory, but to setup a scene, it only takes a dozen lines of code.  It works with p5.js as a canvas but is mainly designed to output SVG's for later plotting. 



![skyscrapers and shards](./examples/assets/img/example2.png)

![primitives, skyscrapers, nodes](./examples/assets/img/example1.png) 

# Todo list 

- Mesh Primitives
- contains functions on existing non mesh primitives
- Constructive solid geometry with mesh based trees
- good support for colors
- speedups of tree/collision calcs with WASM/web workers
- P5 geometry object compatibility
- line overlap limits. 
- more paths/shading styles 

# Known issues
- Complex scenes/mesh objects hit errors with stack count in chrome. Mesh such as the famous teapot can recreate the. 
- constructive solid geometry is not working correctly. Some paths are duplicated. 


