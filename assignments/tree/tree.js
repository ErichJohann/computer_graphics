let angle;

function setup() {
	createCanvas(600, 600);
}

//{!1} Each branch now receives its length as an argument.
function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  //{!1} Each branch’s length shrinks by one-third.
  len *= 0.67;
  //{!1} Exit condition for the recursion!
  if (len > 2) {
    push();
    rotate(angle);
    //{!1} Subsequent calls to branch() include the length argument.
    branch(len);
    pop();

    push();
    rotate(-angle);
    branch(len);
    pop();
  }
}

function draw() {
  background(0);
  // Map the angle to range from 0° to 90° (HALF_PI) according to mouseX.
  angle = map(mouseX, 0, width, 0, HALF_PI);
  // Start the tree from the bottom of the canvas.
  translate(width / 2, height);
  stroke(255);
  strokeWeight(2);
  branch(100);
}