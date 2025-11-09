import define1 from "./7dfaa2667a586243@56.js";

function _1(md){return(
md`# Webgl Utils`
)}

function _appLoop(){return(
function appLoop(canvas, app) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("WebGL unsupported");
  Promise.resolve(app.setup ? app.setup(gl) : null)
    .then(()=>{
      const flistExec = () => {
        app.draw(gl);
        window.requestAnimationFrame(flistExec);
      }
      window.requestAnimationFrame(flistExec);      
    })
  ;
  return canvas;
}
)}

function _createProgram(){return(
function createProgram(gl, shaders, location) {
  location = location || {}
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

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i=0; i < numAttribs; i++) {
    const attribInfo = gl.getActiveAttrib(program, i);
    const index = gl.getAttribLocation(program, attribInfo.name);
    location[attribInfo.name] = index;
  }  
  return program;
}
)}

function _loadTexture(){return(
function loadTexture(gl, img) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  return texture;
}
)}

function _diceTexture(FileAttachment,loadTexture){return(
async function diceTexture(gl) {
  let img = await (await FileAttachment("dice.png")).image();
  return loadTexture(gl, img);
}
)}

function _worldTexture(FileAttachment,loadTexture){return(
async function worldTexture(gl) {
  let img = await (await FileAttachment("world.png")).image();
  return loadTexture(gl, img);
}
)}

function _textures(loadTexture,diceTexture,worldTexture){return(
{ load: loadTexture, dice: diceTexture, world: worldTexture }
)}

function _gl_utils(appLoop,createProgram,viewHandler,textures)
{ 
  return { appLoop, createProgram, viewHandler, textures }
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["dice.png", {url: new URL("./files/2040bc195e6ef487311eef189aae91509230f8563d0092e51eae29be9cc5afa0f0244f4ae4f275a47387637fb84c9c042bd80aa0e0a275980f9f564ca490e13f.png", import.meta.url), mimeType: "image/png", toString}],
    ["world.png", {url: new URL("./files/1afc46f03148dfa8e6bcfe5ce0d3a1c2b829ef299db0aac1265bebba1b9a3d2d62d929cbe1930b30a3ef86a1fb5b203dfc0dfe06a058a041439a0140d4fb69db.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("appLoop")).define("appLoop", _appLoop);
  main.variable(observer("createProgram")).define("createProgram", _createProgram);
  main.variable(observer("loadTexture")).define("loadTexture", _loadTexture);
  main.variable(observer("diceTexture")).define("diceTexture", ["FileAttachment","loadTexture"], _diceTexture);
  main.variable(observer("worldTexture")).define("worldTexture", ["FileAttachment","loadTexture"], _worldTexture);
  const child1 = runtime.module(define1);
  main.import("viewHandler", child1);
  main.variable(observer("textures")).define("textures", ["loadTexture","diceTexture","worldTexture"], _textures);
  main.variable(observer("gl_utils")).define("gl_utils", ["appLoop","createProgram","viewHandler","textures"], _gl_utils);
  return main;
}
