function _1(md){return(
md`# Simple WebGL Cube`
)}

function _simpleCubeCanvas(glm,createWebGLCanvas,width,cubeGeometry)
{
  let projection = glm.mat4.create();
  let model = glm.mat4.create();
  let view = glm.mat4.create();
  let canvas = createWebGLCanvas(width,400,gl=>{
    let cube = cubeGeometry(gl);
    glm.mat4.lookAt(view,[3,3,3],[0,0,0],[0,1,0]);
    glm.mat4.perspective(projection,(45*Math.PI)/180,width/400,0.1,100);
    gl.enable(gl.DEPTH_TEST); 
    gl.clearColor(0.4,0.4,0.4,1.0);
    
    return () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      cube({model, view, projection});  
    }
  });
  canvas.updateView = (x,y,z) => {
      glm.mat4.lookAt(view,[x,y,z],[0,0,0],[0,1,0]);
  };
  return canvas;
}


function _cubeGeometry(createProgram,vertexShader,fragmentShader){return(
function cubeGeometry(gl) {

  const RED    = [ 1.0, 0.0, 0.0 ];
  const YELLOW = [ 1.0, 1.0, 0.0 ];
  const GREEN  = [ 0.0, 1.0, 0.0 ];
  const CYAN   = [ 0.0, 1.0, 1.0 ];
  const BLUE   = [ 0.0, 0.0, 1.0 ];
  const PURPLE = [ 1.0, 0.0, 1.0 ];
  
  const [ A,B,C,D,E,F,G,H ] = [
    [ -1.0, -1.0, 1.0 ],
    [ 1.0, -1.0, 1.0 ],
    [ 1.0, 1.0, 1.0 ],
    [ -1.0, 1.0, 1.0 ],
    [ -1.0, -1.0, -1.0 ],
    [ 1.0, -1.0, -1.0 ],
    [ 1.0, 1.0, -1.0 ],
    [ -1.0, 1.0, -1.0 ],
  ];

  const position = new Float32Array([
    ...A, ...B, ...C, ...D,
    ...B, ...F, ...G, ...C,
    ...F, ...E, ...H, ...G,
    ...E, ...A, ...D, ...H,
    ...D, ...C, ...G, ...H,
    ...E, ...F, ...B, ...A
  ]);

  const color = new Float32Array([
    ...RED, ...RED, ...RED, ...RED,
    ...BLUE, ...BLUE, ...BLUE, ...BLUE,
    ...GREEN, ...GREEN, ...GREEN, ...GREEN,
    ...YELLOW, ...YELLOW, ...YELLOW, ...YELLOW,
    ...CYAN, ...CYAN, ...CYAN, ...CYAN,
    ...PURPLE, ...PURPLE, ...PURPLE, ...PURPLE,
  ]);

  const index = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19, 
    20, 21, 22, 20, 22, 23
  ]);

  const prog = createProgram(gl, [
    [ gl.VERTEX_SHADER, vertexShader ],
    [ gl.FRAGMENT_SHADER, fragmentShader ]
  ]);
  
  let a_position = gl.getAttribLocation(prog,"a_position");
  let a_color = gl.getAttribLocation(prog,"a_color");
  
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(a_position);
  gl.enableVertexAttribArray(a_color);

  let position_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,position_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,position,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

  let color_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,color_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,color,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

  let index_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_vbo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index,gl.STATIC_DRAW);

  return (uniforms) => {
    gl.bindVertexArray(vao);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"model"),false,uniforms.model);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"view"),false,uniforms.view);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"projection"),false,uniforms.projection);     
    gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);    
  }
}
)}

function _vertexShader(){return(
`
  in vec3 a_position;
  in vec3 a_color;

  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 projection;

  out vec3 v_color;
  
  void main(void) {
      v_color = a_color; 
      gl_Position = projection * view * model * vec4(a_position,1.0f);
  }
`
)}

function _fragmentShader(){return(
`
  in vec3 v_color;
  out vec4 color;

  void main(void) {
    color = vec4(v_color, 1.0);
  }
`
)}

function _createWebGLCanvas(){return(
function createWebGLCanvas(width, height, drawFactory) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("WebGL unsupported");
  const draw = drawFactory(gl);
  const f = () => {
    draw();
    window.requestAnimationFrame(f);
  };
  window.requestAnimationFrame(f);
  return canvas;
}
)}

function _createProgram(){return(
function createProgram(gl, shaders) {
  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, "#version 300 es\nprecision highp float;\n"+source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  const program = gl.createProgram();
  for(let [shaderType, shaderSource] of shaders) {
    gl.attachShader(program, createShader(shaderType, shaderSource));
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("cannot link program");
  return program;
}
)}

function _glm(){return(
import("https://unpkg.com/gl-matrix?module")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("simpleCubeCanvas")).define("simpleCubeCanvas", ["glm","createWebGLCanvas","width","cubeGeometry"], _simpleCubeCanvas);
  main.variable(observer("cubeGeometry")).define("cubeGeometry", ["createProgram","vertexShader","fragmentShader"], _cubeGeometry);
  main.variable(observer("vertexShader")).define("vertexShader", _vertexShader);
  main.variable(observer("fragmentShader")).define("fragmentShader", _fragmentShader);
  main.variable(observer("createWebGLCanvas")).define("createWebGLCanvas", _createWebGLCanvas);
  main.variable(observer("createProgram")).define("createProgram", _createProgram);
  main.variable(observer("glm")).define("glm", _glm);
  return main;
}
