function setup() {
	createCanvas(windowWidth, windowHeight);
	sun = new Planet(0,0,100,"#ffff00",0);
	mercury = new Planet(60,0,8,"#A49D7C", 0.03);
	venus = new Planet(75,0,12,"#CBB440", -0.02);
	earth = new Planet(100, 0 , 15, "#0000FF", 0.01);
	moon = new Planet(-12, 0, 5, "#aaaaaa", -0.05);
	mars = new Planet(125,0,10,"#D24600", 0.009);
	jupiter = new Planet(200, 0, 30, "#fff7bc", 0.008);
	saturn = new Planet(240,0,25,"#DCD627", 0.007);
	uranus = new Planet(280,0,20,"#B0E1DD", -0.006);
	neptune = new Planet(320,0,18,"#2D3BBC", 0.005);
}
 
class Planet{
	constructor(dis,ang,r,cor,vel){
	this.dis = dis;
	this.ang = ang;
	this.r = r;
	this.cor = cor;
	this.vel = vel;
	}
	orbit(){
		this.ang += this.vel;
		rotate(this.ang);
	}
	materialize(){
		translate(this.dis, 0);
		fill(this.cor);
		circle(0,0,this.r);
	}
}
 
function draw() {
	background(0,50);
	translate(width/2,height/2);
	sun.materialize();
	push();push();push();push();push();push();push();
	mercury.orbit();
	mercury.materialize();
	pop();
	venus.orbit();
	venus.materialize();
	pop();
	earth.orbit();
	earth.materialize();
	moon.orbit();
	moon.materialize();
	pop();
	mars.orbit();
	mars.materialize();
	pop();
	jupiter.orbit();
	jupiter.materialize();
	pop();
	saturn.orbit();
	saturn.materialize();
	pop();
	uranus.orbit();
	uranus.materialize();
	pop();
	neptune.orbit();
	neptune.materialize();
}