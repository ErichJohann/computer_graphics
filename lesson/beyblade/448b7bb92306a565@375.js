function _1(md){return(
md`# Bezier Editor`
)}

function _curva(editorBezier){return(
editorBezier(300,300)
)}

function _button(Inputs){return(
Inputs.button("Reset")
)}

function _4(curva){return(
curva
)}

function _5(button,$0)
{
  button;
  ($0).reset();
  return 0;
}


function _editorBezier(DOM,p5,Editor,Bezier,Event,invalidation){return(
function editorBezier(w,h) {
  let editor, bezier;
  const element = DOM.element('div');
  const instance = new p5(sketch => {
    sketch.setup = function() { 
      let c = sketch.createCanvas(w, h);
      c.style("visibility", "visible")
      editor = new Editor();
      editor.configure(w/2,h/4,w-10,10,w-10,h/2,w/2,h-10);
      bezier = new Bezier(editor.points);
    };
    sketch.draw = function() {
      sketch.background("#eee");
      sketch.stroke("#333");
      sketch.line(sketch.width/2,0,sketch.width/2,sketch.height);
      sketch.line(0,sketch.height/2,sketch.width,sketch.height/2);
      if(bezier.draw(sketch)) {
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
      editor.draw(sketch);
    }
  }, element);

  element.reset = () => {
      editor.configure(w/2,h/4,w-10,10,w-10,h/2,w/2,h-10);
  }

  Object.defineProperty(element, "value", {
    get() {
      return { vertex: bezier.points, normal: bezier.normals };
    },
    set(v) {
    }
  });

  invalidation.then(() => instance.remove());
  return element;
}
)}

function _Editor(p5){return(
class Editor {
  constructor() {
    this.radius = 8;
    this.max = 4;
    this.selectedPoint = null;
    this.points = [];
  }

  configure(xa,ya,xb,yb,xc,yc,xd,yd) {
    this.points[0] = new p5.Vector(xa,ya);
    this.points[1] = new p5.Vector(xb,yb);
    this.points[2] = new p5.Vector(xc,yc);
    this.points[3] = new p5.Vector(xd,yd);
  }
  
  draw(sketch) {
    let mousePoint = sketch.createVector(sketch.mouseX,sketch.mouseY);
    if(sketch.mouseIsPressed) {
      if(this.selectedPoint) {
        let mx = sketch.constrain(sketch.mouseX,0,sketch.width);
        let my = sketch.constrain(sketch.mouseY,0,sketch.height);
        this.selectedPoint.set(mx,my);
      } else {
        for(let p of this.points) {
          if(mousePoint.dist(p)<this.radius) {
            this.selectedPoint = p;
            break;
          }
        }
        if(!this.selectedPoint && this.points.length < this.max) {
          this.selectedPoint = mousePoint;
          this.points.push(this.selectedPoint);
        }      
      }
    } else {
      this.selectedPoint = null;
    }
    sketch.push(); 
    for(let p of this.points) {
      sketch.stroke("#000");
      if(mousePoint.dist(p) < this.radius) {
        sketch.fill("#f00");
      } else {
        sketch.fill("#fff");
      }
      sketch.circle(p.x,p.y,this.radius);
    }
    sketch.pop();
  }
}
)}

function _Bezier(){return(
class Bezier {
  
  constructor(points) {
    this.steps = 20;
    this.controlPoints = points;
    this.prevControlPoints = null;
    this.points = new Float32Array((this.steps+1)*2);
    this.normals = new Float32Array((this.steps+1)*2);
  }
  
  update(sketch) {
    if(this.controlPoints.length == 4) {
      if(!this.prevControlPoints || this.controlPoints.some((cp,i)=>!this.prevControlPoints[i].equals(cp))){
        let [A,B,C,D] = this.controlPoints;
        for(let i=0; i<=this.steps; i++) {
          let t = i/this.steps;
          let tdt = t+0.01;
          let x = sketch.map(sketch.bezierPoint(A.x,B.x,C.x,D.x,t),0,sketch.width,-1,1);
          let y = sketch.map(sketch.bezierPoint(A.y,B.y,C.y,D.y,t),0,sketch.height,1,-1);
          let xdx = sketch.map(sketch.bezierPoint(A.x,B.x,C.x,D.x,tdt),0,sketch.width,-1,1);
          let ydy = sketch.map(sketch.bezierPoint(A.y,B.y,C.y,D.y,tdt),0,sketch.height,1,-1);
          this.points[2*i] = x;
          this.points[2*i+1] = y;
          let n = sketch.createVector(-(ydy-y),(xdx-x)).normalize();
          this.normals[2*i] = n.x;
          this.normals[2*i+1] = n.y;
        }
        this.prevControlPoints = this.controlPoints.map(p=>p.copy());
        return true;
      }
    }
    return false;
  }

  draw(sketch) {
    sketch.push();
    let resp = this.update(sketch);
    sketch.stroke("#000");
    sketch.noFill();
    sketch.beginShape();
    for(let i=0; i<this.points.length; i+=2) {
      let x = sketch.map(this.points[i],-1,1,0,sketch.width);
      let y = sketch.map(this.points[i+1],-1,1,sketch.height,0);
      sketch.vertex(x,y);
    }
    for(let i=this.points.length-2; i>=0; i-=2) {
      let x = sketch.map(-this.points[i],-1,1,0,sketch.width);
      let y = sketch.map(this.points[i+1],-1,1,sketch.height,0);
      sketch.vertex(x,y);
    }
    sketch.endShape(sketch.CLOSE);

    // Normals
    for(let i=0; i<this.points.length; i+=2) {
      let x = sketch.map(this.points[i],-1,1,0,sketch.width);
      let y = sketch.map(this.points[i+1],-1,1,sketch.height,0);
      let nx = sketch.map(this.points[i]+this.normals[i],-1,1,0,sketch.width);
      let ny = sketch.map(this.points[i+1]+this.normals[i+1],-1,1,sketch.height,0);
      sketch.stroke("#f00");
      sketch.fill("#f00");
      sketch.circle(x,y,3);
      let v = sketch.createVector(nx-x,ny-y).normalize();
      sketch.line(x,y,x+(v.x*15),y+(v.y*15));
      sketch.beginShape();
      sketch.vertex(x+(v.x*10+v.y*3),y+(v.y*10-v.x*3));
      sketch.vertex(x+(v.x*10-v.y*3),y+(v.y*10+v.x*3));
      sketch.vertex(x+(v.x*15),y+(v.y*15));
      sketch.endShape(sketch.CLOSE);
    }
    sketch.pop();
    return resp;
  }
  
}
)}

function _p5(require){return(
require('https://unpkg.com/p5@1.2.0/lib/p5.js')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof curva")).define("viewof curva", ["editorBezier"], _curva);
  main.variable(observer("curva")).define("curva", ["Generators", "viewof curva"], (G, _) => G.input(_));
  main.variable(observer("viewof button")).define("viewof button", ["Inputs"], _button);
  main.variable(observer("button")).define("button", ["Generators", "viewof button"], (G, _) => G.input(_));
  main.variable(observer()).define(["curva"], _4);
  main.variable(observer()).define(["button","viewof curva"], _5);
  main.variable(observer("editorBezier")).define("editorBezier", ["DOM","p5","Editor","Bezier","Event","invalidation"], _editorBezier);
  main.variable(observer("Editor")).define("Editor", ["p5"], _Editor);
  main.variable(observer("Bezier")).define("Bezier", _Bezier);
  main.variable(observer("p5")).define("p5", ["require"], _p5);
  return main;
}
