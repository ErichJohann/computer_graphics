function setup() {
	createCanvas(600, 600);
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


function koch(A,B,lv){
	if(lv <= 0){
		line(A.x, A.y, B.x, B.y);
	}else{
		let C = combina(A, B, 1/3);
		let D = combina(A, B, 2/3);
		let E = roda(C, D, -PI/3);
		koch(A, C, lv-1);
		koch(C, E, lv-1);
		koch(E, D, lv-1);
		koch(D, B, lv-1);
	}
}


function draw() {
	background(200);
	let p1 = {x: 10, y: height/2};
	let p2 = {x: width-10, y: height/2};
	let level = ~~(3*(sin(frameCount*0.05)+1));
	koch(p1, p2, level);
}