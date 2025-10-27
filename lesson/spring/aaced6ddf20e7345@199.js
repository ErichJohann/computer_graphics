import define1 from "./7dfaa2667a586243@56.js";

function _1(md){return(
md`# Mola`
)}

function _2(md){return(
md`[Link para Revisão](https://cefetrjbr-my.sharepoint.com/:f:/g/personal/02584479745_cefet-rj_br/EnN-0x81W45CpcyKmbi80l8BWy1l3VR-4huL44HNYnde7Q?e=sIHfFw)`
)}

function _3(glm,createWebGLCanvas,width,revolutionGeometry,viewHandler)
{
  let projection = glm.mat4.create();
  let model = glm.mat4.create();
  let view = glm.mat4.create();
  let frameCount = 0;
  let canvas = createWebGLCanvas(width,400,gl=>{
    let rev = revolutionGeometry(gl);
    glm.mat4.lookAt(view,[0,0,10],[0,0,0],[0,1,0]);
    glm.mat4.perspective(projection,(45*Math.PI)/180,width/400,0.1,100);
    gl.enable(gl.DEPTH_TEST); 
    gl.clearColor(0.2,0.2,0.2,1.0);
    
    return () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      let s = 0.1+3*(Math.sin(0.1*frameCount)+1.0)/2;
      glm.mat4.fromScaling(model,[1,s,1]);
      rev({model, view, projection,s});
      frameCount++;
    }
  });
  canvas.updateView = (x,y,z) => {
      glm.mat4.lookAt(view,[x,y,z],[0,0,0],[0,1,0]);
  };
  viewHandler(canvas, canvas.updateView);
  return canvas;
}


function _position(nuvemPontos,paraboloide){return(
nuvemPontos(paraboloide())
)}

function _positionMola(linha,mola){return(
linha(mola())
)}

function _nuvemPontos(){return(
function nuvemPontos(f,m,n) {
  m = m || 50;
  n = n || 50;
  let pontos = new Float32Array(m*n*3);
  let k = 0;
  for(let i = 0; i < m; i++) {
    let u = i / (m-1);
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

function _linha(paraboloide){return(
function linha(f,n=1000) {
  let pontos = new Float32Array(n*3);
  let k = 0;
  for(let i = 0; i < n; i++) {
    let t = i / (n-1);
    let [x, y, z] = f(t);
    pontos[k++] = x;
    pontos[k++] = y;paraboloide
    pontos[k++] = z;
  }
  return pontos;
}
)}

function _esfera(){return(
function esfera(r) {
  r = r || 2;
  return (u,v) => {
    let theta = u*Math.PI-(Math.PI/2);
    let phi = 2*v*Math.PI;
    let x = r * Math.cos(theta) * Math.cos(phi);
    let y = r * Math.sin(theta);
    let z = r * Math.cos(theta) * Math.sin(phi);
    return [ x, y, z ];
  }
}
)}

function _mola(){return(
function mola(r=2,voltas=10,h=3) {
  return (t) => {
    r = (1 - t);
    let theta = t * voltas * 2 * Math.PI;
    let x = r * Math.cos(theta);
    let y = t * h;
    let z = r * Math.sin(theta);
    return [ x, y, z ];
  }
}
)}

function _paraboloide(){return(
function paraboloide(r) {
  r = r || 2;
  return (u,v) => {
    let rs = r*u;
    let theta = 2*v*Math.PI;
    let x = rs*Math.cos(theta);
    let y = rs*rs;
    let z = rs*Math.sin(theta);
    return [ x, y, z ];
  }
}
)}

function _revolutionGeometry(createProgram,vertexShader,fragmentShader,positionMola){return(
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
  gl.bufferData(gl.ARRAY_BUFFER,positionMola,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

  return (uniforms) => {
    gl.bindVertexArray(vao);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"model"),false,uniforms.model);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"view"),false,uniforms.view);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"projection"),false,uniforms.projection);
    gl.uniform1f(gl.getUniformLocation(prog,"s"),uniforms.s);
    gl.drawArrays(gl.LINE_STRIP,0,positionMola.length/3);    
  }
}
)}

function _vertexShader(){return(
`
  in vec3 a_position;

  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 projection;
  uniform float s;
  
  void main(void) {
//      float s = 0.5f;
      gl_PointSize = 1.0;
      gl_Position = projection * view * vec4(a_position.x, a_position.y*s, a_position.z, 1.0f);
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
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["glm","createWebGLCanvas","width","revolutionGeometry","viewHandler"], _3);
  main.variable(observer("position")).define("position", ["nuvemPontos","paraboloide"], _position);
  main.variable(observer("positionMola")).define("positionMola", ["linha","mola"], _positionMola);
  main.variable(observer("nuvemPontos")).define("nuvemPontos", _nuvemPontos);
  main.variable(observer("linha")).define("linha", ["paraboloide"], _linha);
  main.variable(observer("esfera")).define("esfera", _esfera);
  main.variable(observer("mola")).define("mola", _mola);
  main.variable(observer("paraboloide")).define("paraboloide", _paraboloide);
  main.variable(observer("revolutionGeometry")).define("revolutionGeometry", ["createProgram","vertexShader","fragmentShader","positionMola"], _revolutionGeometry);
  main.variable(observer("vertexShader")).define("vertexShader", _vertexShader);
  main.variable(observer("fragmentShader")).define("fragmentShader", _fragmentShader);
  main.variable(observer("createWebGLCanvas")).define("createWebGLCanvas", _createWebGLCanvas);
  main.variable(observer("createProgram")).define("createProgram", _createProgram);
  main.variable(observer("glm")).define("glm", _glm);
  const child1 = runtime.module(define1);
  main.import("viewHandler", child1);
  return main;
}
