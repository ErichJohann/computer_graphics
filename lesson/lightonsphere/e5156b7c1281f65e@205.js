import define1 from "./c65de5b149e36c23@51.js";

function _1(md){return(
md`# Esfera Iluminada`
)}

function _2(html,width,glm,sphereGeometry,gl_utils)
{
  let canvas = html`<canvas width="${width}" height="400"/>`

  let projection = glm.mat4.create();
  let model = glm.mat4.create();
  let view = glm.mat4.create();
  let ident = glm.mat4.create();
  let sphere = null;

  function setup(gl) {
    gl.enable(gl.DEPTH_TEST); 
    gl.clearColor(0.3,0.3,0.3,1.0);
    glm.mat4.perspective(projection,(45*Math.PI)/180,width/400,0.1,100);
    sphere = sphereGeometry(gl);
    gl_utils.viewHandler(canvas,(x,y,z)=>{
      glm.mat4.lookAt(view,[x,y,z],[0,0,0],[0,1,0]);      
    });
  }
  
  function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sphere.draw({model, view, projection});
  }
  
  return gl_utils.appLoop(canvas,{setup,draw});
}


function _sphereGeometry(geraAtributos,esfera,gl_utils,vertexShader,fragmentShader){return(
function sphereGeometry(gl) {

  let atribs = geraAtributos(50,50,esfera(3));

  const prog = gl_utils.createProgram(gl, [
    [ gl.VERTEX_SHADER, vertexShader ],
    [ gl.FRAGMENT_SHADER, fragmentShader ]
  ]);
  
  let a_position = gl.getAttribLocation(prog,"a_position");
  let a_normal = gl.getAttribLocation(prog,"a_normal");
  let a_texture = gl.getAttribLocation(prog,"a_texture");
  
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(a_position);
  gl.enableVertexAttribArray(a_normal);
  gl.enableVertexAttribArray(a_texture);

  let position_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,position_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,atribs.posicoes,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

  let normal_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,normal_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,atribs.normais,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

  let texture_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,texture_vbo);
  gl.bufferData(gl.ARRAY_BUFFER,atribs.textura,gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_texture, 2, gl.FLOAT, false, 0, 0);

  let index_vbo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_vbo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,atribs.indices,gl.STATIC_DRAW);

  function draw(uniforms) {
    gl.bindVertexArray(vao);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"model"),false,uniforms.model);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"view"),false,uniforms.view);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog,"projection"),false,uniforms.projection);     
    gl.drawElements(gl.TRIANGLE_STRIP,atribs.indices.length,gl.UNSIGNED_SHORT,0);    
  }

  return { draw };
}
)}

function _vertexShader(){return(
`
  in vec3 a_position;
  in vec3 a_normal;
  in vec2 a_texture;

  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 projection;

  out vec3 v_normal;
  out vec2 v_texture;
  out vec3 v_fragPos;
  
  void main(void) {
      v_normal = a_normal;
      v_texture = a_texture;
      v_fragPos = vec3(model * vec4(a_position, 1.0));
      gl_Position = projection * view * model * vec4(a_position,1.0f);
  }
`
)}

function _fragmentShader(){return(
`
  in vec3 v_normal;
  in vec2 v_texture;
  in vec3 v_fragPos;
  out vec4 color;

  void main(void) {
    vec3 lightColor = vec3(1.0,1.0,1.0); // Branco
    vec3 objectColor = vec3(1.0,0.0,0.0); // Vermelho
    vec3 lightPos = vec3(10,10,10);

    // Componente ambiente
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * lightColor;

    // Componente Difusa
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(lightPos - v_fragPos);  
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    vec3 result = (ambient+diffuse) * objectColor;

    color = vec4(result, 1.0);
  }
`
)}

function _esfera(){return(
function esfera(r, d) {
  r = r || 2; //se não informar o raio, será 2
  d = d || 5;
  return (u,v) => {
    let theta =  2*u*Math.PI; //u e v variam de 0 a 1 
    let phi = 2*v*Math.PI;
    let x = (r * Math.cos(theta) + d) * Math.cos(phi);
    let y = r * Math.sin(theta);
    let z = (r * Math.cos(theta) + d) * Math.sin(phi);
    return [ x, y, z ]; //retorna um ponto da esfera
  }
}
)}

function _geraIndices(){return(
function geraIndices(M,N) {
  let indices = new Uint16Array(M*(N-1)*2+(N-2)*2);
  let k = 0;
  for(let i=0; i<N-1; i++) {
    if(i>0) {
      // Triângulos degenerados no inicio / fim de uma linha 
      indices[k++] = (i+1)*(M)-1;
      indices[k++] = i*(M);
    }
    for(let j=0; j<M; j++) {
      indices[k++] = i*(M)+j;
      indices[k++] = (i+1)*(M)+j;
    }
  }
  return indices;
}
)}

function _geraPosicoes(){return(
function geraPosicoes(M,N,f) {
  let posicoes = new Float32Array(M*N*3);
  let k = 0;
  for(let i=0; i<M; i++) {
    let u = i/(M-1);
    for(let j=0; j<N; j++) {
      let v = j/(N-1);
      let [x,y,z] = f(u,v);
      posicoes[k++] = x;
      posicoes[k++] = y;
      posicoes[k++] = z;
    }
  }
  return posicoes;
}
)}

function _geraNormais(){return(
function geraNormais(M,N,f) {
  const epsilon = 0.001;
  let normais = new Float32Array(M*N*3);
  let k = 0;
  for(let i=0; i<M; i++) {
    let u = i/(M-1);
    let du = u + epsilon;
    for(let j=0; j<N; j++) {
      let v = j/(N-1);
      let dv = v + epsilon;
      let [x,y,z] = f(u,v);
      let [x1,y1,z1] = f(du,v);
      let [x2,y2,z2] = f(u,dv);
      let [v1x,v1y,v1z] = [x1-x, y1-y, z1-z];
      let [v2x,v2y,v2z] = [x2-x, y2-y, z2-z];
      let [vnx, vny, vnz] = [v1y*v2z-v1z*v2y, v1z*v2x-v1x*v2z, v1x*v2y-v1y*v2x];
      let vlen = Math.sqrt(vnx*vnx+vny*vny+vnz*vnz);
      normais[k++] = vnx/vlen;
      normais[k++] = vny/vlen;
      normais[k++] = vnz/vlen; 
    }
  }
  return normais;
}
)}

function _geraCoordenadasTextura(){return(
function geraCoordenadasTextura(M,N) {
  let coordenadasTextura = new Float32Array(M*N*2);
  let k = 0;
  for(let i=0; i<M; i++) {
    let u = i/(M-1);
    for(let j=0; j<N; j++) {
      let v = j/(N-1);
      coordenadasTextura[k++] = u;
      coordenadasTextura[k++] = v;
    }
  }
  return coordenadasTextura;
}
)}

function _geraAtributos(geraIndices,geraPosicoes,geraNormais,geraCoordenadasTextura){return(
function geraAtributos(M,N,f) {
  return {
    indices: geraIndices(M,N),
    posicoes: geraPosicoes(M,N,f),
    normais: geraNormais(M,N,f),
    textura: geraCoordenadasTextura(M,N)
  }
}
)}

function _glm(){return(
import("https://unpkg.com/gl-matrix?module")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["html","width","glm","sphereGeometry","gl_utils"], _2);
  main.variable(observer("sphereGeometry")).define("sphereGeometry", ["geraAtributos","esfera","gl_utils","vertexShader","fragmentShader"], _sphereGeometry);
  main.variable(observer("vertexShader")).define("vertexShader", _vertexShader);
  main.variable(observer("fragmentShader")).define("fragmentShader", _fragmentShader);
  main.variable(observer("esfera")).define("esfera", _esfera);
  main.variable(observer("geraIndices")).define("geraIndices", _geraIndices);
  main.variable(observer("geraPosicoes")).define("geraPosicoes", _geraPosicoes);
  main.variable(observer("geraNormais")).define("geraNormais", _geraNormais);
  main.variable(observer("geraCoordenadasTextura")).define("geraCoordenadasTextura", _geraCoordenadasTextura);
  main.variable(observer("geraAtributos")).define("geraAtributos", ["geraIndices","geraPosicoes","geraNormais","geraCoordenadasTextura"], _geraAtributos);
  main.variable(observer("glm")).define("glm", _glm);
  const child1 = runtime.module(define1);
  main.import("gl_utils", child1);
  return main;
}
