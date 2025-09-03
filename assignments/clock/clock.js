//made on openprocessing 
function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(100);
	translate(width/2, height/2)
	watch = 300
	stroke(0,0,0)
	strokeWeight(3);
	circle(0, 0, watch);
	
	//set hours marks
	for(i = 0; i<12; i++){
		x = map(i, 0, 12, 0, TWO_PI);
		stroke(0,0,0);
		strokeWeight(1);
		line(0, 0, cos(x - HALF_PI) * (watch/2) , sin(x - HALF_PI) * (watch/2));
	}
	strokeWeight(0);
	circle(0,0, watch - 50)
	
	//set minute pointer
	m = map(minute(), 0, 60, 0, TWO_PI)
	stroke(0,0,0)
	strokeWeight(3);
	line(0, 0, cos(m - HALF_PI) * (watch/2.1) , sin(m - HALF_PI) * (watch/2.1))
	
	//set hour pointer
	h = map((hour() * 60) + minute(), 0, 720, 0, TWO_PI)
	stroke(255,0,0)
	line(0, 0, cos(h - HALF_PI) * (watch/3.5) , sin(h - HALF_PI) * (watch/3.5))
	
	//set seconds pointer
	sec = map(second(), 0, 60, 0, TWO_PI)
	stroke(0,0,0)
	strokeWeight(2)
	line(0, 0, cos(sec - HALF_PI) * (watch/2.1) , sin(sec - HALF_PI) * (watch/2.1))
}