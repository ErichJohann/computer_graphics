import define1 from "./7dfaa2667a586243@56.js";

function _1(md){return(
md`# Esfera Núvem de Pontos`
)}

function _simpleCubeCanvas(glm,createWebGLCanvas,width,revolutionGeometry,viewHandler)
{
  let a = 0.01
  let projection = glm.mat4.create();
  let model = glm.mat4.create();
  let view = glm.mat4.create();
  let canvas = createWebGLCanvas(width,400,gl=>{
    let rev = revolutionGeometry(gl);
    glm.mat4.lookAt(view,[0,0,10],[0,0,0],[0,1,0]);
    glm.mat4.perspective(projection,(45*Math.PI)/180,width/400,0.1,100);
    gl.enable(gl.DEPTH_TEST); 
    gl.clearColor(0.2,0.2,0.2,1.0);
    
    return () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      glm.mat4.rotateX(model,model,a);
      glm.mat4.rotateY(model,model,a+0.2);
      rev({model, view, projection});  
    }
  });
  canvas.updateView = (x,y,z) => {
      glm.mat4.lookAt(view,[x,y,z],[0,0,0],[0,1,0]);
  };
  viewHandler(canvas, canvas.updateView);
  return canvas;
}


function _position(nuvemPontos,esfera){return(
nuvemPontos(esfera())
)}

function _nuvemPontos(){return(
function nuvemPontos(f,m,n) {
  m = m || 50;
  n = n || 50;
  let pontos = new Float32Array(m*n*3);
  let k = 0;
  for(let i = 0; i < m; i++) {
    let u = i / (m-1); //u e v variam de 0 a 1
    for(let j = 0; j < n; j++) {
      let v = j / (n-1);
      let [x, y, z] = f(u,v);
      pontos[k++] = x;
      pontos[k++] = y;
      pontos[k++] = z;
    }
  }
  return pontos;
}
)}

function _esfera(){return(
function esfera(r, d) {
  r = r || 2; //se não informar o raio, será 2
  d = d || 4;
  return (u,v) => {
    let theta =  2*u*Math.PI; //u e v variam de 0 a 1 
    let x = r * v * Math.cos(theta);
    let y = r *v* r*v;
    let z = r * v * Math.sin(theta);
    return [ x, y, z ]; //retorna um ponto da esfera
  }
}
)}

function _revolutionGeometry(createProgram,vertexShader,fragmentShader,position){return(
function revolutionGeometry(gl) {
  
  const prog = createProgram(gl, [
    [ gl.VERTEX_SHADER, vertexShader ],
    [ gl.FRAGMENT_SHADER, fragmentShader ]
  ]);
  
  let a_position = gl.getAttribLocation(prog,"a_position");
  
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(a_position);

  let position_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,position_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,position,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

  return (uniforms) => {
    gl.bindVertexArray(vao);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"model"),false,uniforms.model);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"view"),false,uniforms.view);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"projection"),false,uniforms.projection);     
    gl.drawArrays(gl.POINTS,0,position.length/3);    
  }
}
)}

function _vertexShader(){return(
`
  in vec3 a_position;

  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 projection;
  
  void main(void) {
      gl_PointSize = 1.0;
      gl_Position = projection * view * model * vec4(a_position,1.0f);
  }
`
)}

function _fragmentShader(){return(
`
  out vec4 color;

  void main(void) {
    color = vec4(1.0, 1.0, 1.0, 1.0);
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
  main.variable(observer("simpleCubeCanvas")).define("simpleCubeCanvas", ["glm","createWebGLCanvas","width","revolutionGeometry","viewHandler"], _simpleCubeCanvas);
  main.variable(observer("position")).define("position", ["nuvemPontos","esfera"], _position);
  main.variable(observer("nuvemPontos")).define("nuvemPontos", _nuvemPontos);
  main.variable(observer("esfera")).define("esfera", _esfera);
  main.variable(observer("revolutionGeometry")).define("revolutionGeometry", ["createProgram","vertexShader","fragmentShader","position"], _revolutionGeometry);
  main.variable(observer("vertexShader")).define("vertexShader", _vertexShader);
  main.variable(observer("fragmentShader")).define("fragmentShader", _fragmentShader);
  main.variable(observer("createWebGLCanvas")).define("createWebGLCanvas", _createWebGLCanvas);
  main.variable(observer("createProgram")).define("createProgram", _createProgram);
  main.variable(observer("glm")).define("glm", _glm);
  const child1 = runtime.module(define1);
  main.import("viewHandler", child1);
  return main;
}
