let pontos = [];
let selecionado = null;

function setup() {
	createCanvas(600, 600);
	pontos = [
		createVector(10, height-10),
		createVector(10, height/2),
		createVector(width-10, height/2),
		createVector(width-10, height-10)
	];
}


function ponto(A){
	circle(A.x, A.y, 10);
}


function combina(A, B, t){
	return {x: (1-t) * A.x + t*B.x,
				 y: (1-t) * A.y + t*B.y};
}


function linha(p1,p2){
	line(p1.x, p1.y, p2.x, p2.y);
}


function draw() {
	let [p1, p2, p3, p4] = pontos;
	background(200);
	noFill();
	beginShape();
	stroke(180);
	linha(p1, p2);
	linha(p2, p3);
	linha(p3, p4);
	stroke(0);
	let t;
	for(t=0; t<=1;t+=0.05){
		A = combina(p1,p2,t);
		B = combina(p2,p3,t);
		C = combina(p3,p4,t);
		D = combina(A, B, t);
		E = combina(B, C, t);
		F = combina(D, E, t);
		vertex(F.x,F.y);
	}
	vertex(pontos[pontos.length-1].x, pontos[pontos.length-1].y);
	endShape();
	desenhaPontos();
}


function desenhaPontos(){
	let vmouse = createVector(mouseX,mouseY);
	selecionado = null;
	//noStroke();
	
	for(let p of pontos){
		if(vmouse.dist(p) < 10){
			selecionado = p;
			fill("#ff0000");
		}
		else{
			fill("#ffffff");
		}
		ponto(p);
	}
}


function mouseDragged(){
	if(selecionado){
		selecionado.set(mouseX, mouseY);
	}
}