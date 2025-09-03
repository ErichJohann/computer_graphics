function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(31,120,180);
	translate(width/2,height/2);
	
	const r = 200;
	const rm = 100;
	var n = 16;
	const a = TWO_PI/n;
	fill(224,236,244);
	ellipse(200, 0, 250, 350);
	ellipse(0, -200, 350, 250);
	ellipse(0, 200, 350, 250);
	ellipse(-200, 0, 250, 350);
	fill(31,120,180);
	noStroke()
	circle(0,0,500);
	fill(255, 237, 160)
	beginShape()
	var x = 0;
	var y = 0;
	//odd --> vertex on inner part
	//even --> pointy vertex outside
	for(var i=0;i<n;i++){
		if(i%2 == 0){
			x = r * cos(i*a);
			y = r * sin(i*a);
		}else{
			x = rm * cos(i*a);
			y = rm * sin(i*a);
		}
		vertex(x,y);
	}
	endShape(CLOSE);
}