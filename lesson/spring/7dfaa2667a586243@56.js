import define1 from "./5dbd84c109b51b78@69.js";

function _1(md){return(
md`# WebGL Util: ViewHandler`
)}

function _viewHandlerDemo(viewHandler,cube)
{
  viewHandler(cube, cube.updateView);
  return cube;
}


function _3(md){return(
md`**Description:**

\`ViewHandler(canvas, callback)\` is a function that manages the view position in a WebGL context using spherical coordinates, allowing for interactive control of the camera's position within the 3D scene. The function registers key events, mouse events, and the mouse wheel event to modify the view matrix (\`view\`).

**Parameters:**

- \`canvas\`: The canvas element where WebGL context for which the view handling is being configured.
- \`callback(x,y,z)\`: An user defined function to be called whenever the camera position should be changed..

**Functionality:**

- The view position is controlled using spherical coordinates, consisting of a \`radius\`, \`theta\` angle (horizontal rotation), and \`phi\` angle (vertical rotation).
- **Radius Control:**
  - The distance from the view position to the origin can be adjusted by:
    - Pressing the \`+\` key to increase the radius (zoom out).
    - Pressing the \`-\` key to decrease the radius (zoom in).
    - Scrolling the mouse wheel to change the radius.
  - Pressing the \`0\` key resets the radius to its default value and also resets the \`theta\` and \`phi\` angles to their default positions.
- **Theta Control:**
  - Horizontal movement of the camera (rotation around the vertical axis) is controlled by:
    - Dragging the mouse horizontally.
    - Using the left and right arrow keys.
- **Phi Control:**
  - Vertical movement of the camera (rotation around the horizontal axis) is controlled by:
    - Dragging the mouse vertically.
    - Using the up and down arrow keys.

**Usage:**

This function is intended for WebGL applications requiring interactive camera control, such as 3D visualizations or games. By handling user input, \`ViewHandler\` provides a flexible and intuitive way to navigate within a 3D scene.
`
)}

function _viewHandler(){return(
function viewHandler(canvas, callback) {
  
  let theta = 0.6;
  let phi = Math.PI/2;
  let radius = 8;
  let angleIncrement = 0.1;
  let radiusIncrement = 0.2;
  let minRadius = 0.2;
  let maxRadius = 20;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  function updateMatrix() {
    if(theta < -Math.PI/2) {
      theta = -Math.PI/2;
    }
    if(theta > Math.PI/2) {
      theta = Math.PI/2;
    }
    if(radius < minRadius) {
      radius = minRadius;
    }
    if(radius > maxRadius) {
      radius = maxRadius;
    }
    
    let x = radius * Math.cos(theta) * Math.cos(phi);
    let y = radius * Math.sin(theta);
    let z = radius * Math.cos(theta) * Math.sin(phi);
    callback(x,y,z);
  }
  
  canvas.setAttribute("tabindex","0");
  
  canvas.addEventListener('keydown', function(event) {
    event.preventDefault();
    switch (event.key) {
        case 'ArrowUp':
            theta += angleIncrement;
            break;
        case '0':
            radius = 8;
            theta = 0.6;
            phi = Math.PI/2;
            break;
        case 'ArrowDown':
            theta -= angleIncrement;
            break;
        case 'ArrowLeft':
            phi += angleIncrement;
            break;
        case 'ArrowRight':
            phi -= angleIncrement;
            break;
        case '+':
            radius -= radiusIncrement;
            break;
        case '-':
            radius += radiusIncrement;
            break;
        default:
          return;
    }
    updateMatrix();
  });

  canvas.addEventListener('mousedown', ev => {
    isDragging = true;
    previousMousePosition.x = ev.offsetX;
    previousMousePosition.y = ev.offsetY;
  });
  
  canvas.addEventListener('touchstart', ev => {
    ev.preventDefault();
    isDragging = true;
    previousMousePosition.x = ev.targetTouches[0].clientX;
    previousMousePosition.y = ev.targetTouches[0].clientY;
  });
  
  canvas.addEventListener('mouseup', () => { isDragging = false });
  
  canvas.addEventListener('touchend', () => { isDragging = false });
  
  canvas.addEventListener('mousemove', ev => { 
    if(isDragging) {
      let dmx = ev.offsetX - previousMousePosition.x;
      let dmy = ev.offsetY - previousMousePosition.y;
      phi += dmx * angleIncrement * 0.1;
      theta += dmy * angleIncrement * 0.1;
      previousMousePosition.x = ev.offsetX;
      previousMousePosition.y = ev.offsetY;
      updateMatrix();
    }
  });
  
  canvas.addEventListener('touchmove', ev => { 
    ev.preventDefault();
    if(isDragging) {
      let dmx = ev.targetTouches[0].clientX - previousMousePosition.x;
      let dmy =  ev.targetTouches[0].clientY - previousMousePosition.y;
      phi += dmx * angleIncrement * 0.1;
      theta += dmy * angleIncrement * 0.1;
      previousMousePosition.x = ev.targetTouches[0].clientX;
      previousMousePosition.y =  ev.targetTouches[0].clientY;
      updateMatrix();
    }
  });
  
  canvas.addEventListener('wheel', ev => {
    ev.preventDefault();
    radius -= ev.deltaY * 0.01;
    updateMatrix();
  });

  updateMatrix();
}
)}

function _5(md){return(
md`## External Libraries`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewHandlerDemo")).define("viewHandlerDemo", ["viewHandler","cube"], _viewHandlerDemo);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewHandler")).define("viewHandler", _viewHandler);
  main.variable(observer()).define(["md"], _5);
  const child1 = runtime.module(define1);
  main.import("simpleCubeCanvas", "cube", child1);
  return main;
}
