function setup() {
	createCanvas(600, 600);
	p1 = {x: 10, y: height-50};
	p2 = {x: width-10, y: height-50};
	p3 = roda(p1,p2,-PI/3);
}

function combina(A, B, t){
	return {
		x: (1-t) * A.x + t*B.x,
		y: (1-t) * A.y + t*B.y
	};
}

function roda(A, B, ang){
	return{
		x: ((B.x-A.x)*cos(ang) - (B.y-A.y)*sin(ang))+A.x,
		y: ((B.x-A.x)*sin(ang) + (B.y-A.y)*cos(ang))+A.y
	}
}

function triforce(a,b,c,lv){
	if(lv <= 0){
		fill("gold");
		beginShape();
		vertex(a.x,a.y);
		vertex(b.x,b.y);
		vertex(c.x,c.y);
		endShape(CLOSE);
	}else{
		let d = combina(a,b,0.5);
		let e = combina(b,c,0.5);
		let f = combina(c,a,0.5);
		
		triforce(a,d,f,lv-1);
    triforce(d,b,e,lv-1);
    triforce(f,e,c,lv-1);
	}
}

function draw() {
	background(70);
	let level = ~~map(mouseX, 0, width, 0, 8, true);
	fill(0);
	beginShape();
	vertex(p1.x, p1.y);
	vertex(p2.x, p2.y);
	vertex(p3.x, p3.y);
	endShape(CLOSE);
	triforce(p1,p2,p3,level);
}