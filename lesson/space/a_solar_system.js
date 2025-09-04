function setup() {
	createCanvas(windowWidth, windowHeight);
}

let a = 0
function draw() {
	background(0);
	translate(width/2, height/2);
	fill("#ffff00")
	circle(0,0,100)
	
	//saves translate state
	push()
	rotate(a) //rotates around the sun on width/2, height/2
	translate(100,0) //blue planet becomes the center
	fill("#0000ff")
	circle(0,0,12)	
	
	rotate(-2*a) // rotates around blue planet
	translate(10,0)
	fill("#aaaaaa")
	circle(0,0,5)
	pop() //recovers state
	
	//rotates around the sun on width/2, height/2
	rotate(0.5 * a)
	translate(200,0)
	fill("#fff7bc")
	circle(0,0,30)
	
	a += 0.01
}