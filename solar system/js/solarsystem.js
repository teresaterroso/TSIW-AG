var scene, camera, renderer, light;
var geometry, material;

var orbitFlag = true;
var rotationFlag = true;

var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto;
var moon, earthClouds, saturnRings, uranusRings;
var stars, particle;

//
// helper functions
//

var ORBIT_SCALE = 25000;
function au ( n )
{
	return n * ORBIT_SCALE;
}

var RADIUS_SCALE = 20;
function bodyRadius( n )
{
	return n * RADIUS_SCALE;
}

var TRANSLATION_SCALE = 5000;
function orbitVelocity( n )
{
	return n / TRANSLATION_SCALE;
}

var ROTATION_SCALE = 100;
function rotationVelocity( n )
{
	return n / ROTATION_SCALE;
}

function toRad( n ) // convert to radian
{
	return n * Math.PI/180;
}

function toDeg( n ) // convert to degree
{
	return (n * 180) / Math.PI;
}

//
// constants
//

// radius km

const sunRadius = bodyRadius(347.85);
const mercuryRadius = bodyRadius(2.4);
const venusRadius = bodyRadius(6.05);
const earthRadius = bodyRadius(6.375);
const moonRadius = bodyRadius(1.737);
const cloudRadius = bodyRadius(6.5);
const marsRadius = bodyRadius(3.4);
const jupiterRadius = bodyRadius(71.4);
const saturnRadius = bodyRadius(60.33);
const saturnRingInnerRadius = bodyRadius(67);
const saturnRingOuterRadius = bodyRadius(140);
const uranusRadius = bodyRadius(25.9);
const uranusRingInnerRadius = bodyRadius(38);
const uranusRingOuterRadius = bodyRadius(98);
const neptuneRadius = bodyRadius(24.75);
const plutoRadius = bodyRadius(1.65);

// distance UA (unidade astronómica)

const mercuryDistance = au(0.39);
const venusDistance = au(0.72);
const earthDistance = au(1);
const moonDistanceToEarth = 350; //au(0.00000257)
const marsDistance = au(1.52);
const jupiterDistance = au(5.20);
const saturnDistance = au(9.52);
const uranusDistance = au(19.21);
const neptuneDistance = au(30.09);
const plutoDistance = au(39.75);

// rotation velocity km/s

const sunRotationVel = rotationVelocity(1.99);
const mercuryRotationVel = rotationVelocity(0.003);
const venusRotationVel = -rotationVelocity(0.002);
const earthRotationVel = rotationVelocity(0.47);
const marsRotationVel = rotationVelocity(0.24);
const jupiterRotationVel = rotationVelocity(11.94);
const saturnRotationVel = rotationVelocity(9.87);
const uranusRotationVel = -rotationVelocity(2.59);
const neptuneRorationVel = rotationVelocity(2.68);
const plutoRotationVel = -rotationVelocity(0.012);

// orbit velocities km/s

const mercuryOrbitVel = orbitVelocity(47.87);
const venusOrbitVel = orbitVelocity(35.02);
const earthOrbitVel = orbitVelocity(29.78);
const moonOrbitVel = orbitVelocity(1.02);
const marsOrbitVel = orbitVelocity(24.08);
const jupiterOrbitVel = orbitVelocity(13.07);
const saturnOrbitVel = orbitVelocity(9.69);
const uranusOrbitVel = orbitVelocity(6.81);
const neptuneOrbitVel = orbitVelocity(5.43);
const plutoOrbitVel = orbitVelocity(4.67);

// axial tilt 

const mercuryAxialTilt = toRad(0.03);
const venusAxialTilt = toRad(2.64);
const earthAxialTilt = toRad(23.44);
const moonAxialTilt = toRad(6.68);
const marsAxialTilt = toRad(25.19);
const jupiterAxialTilt = toRad(3.13);
const saturnAxialTilt = toRad(26.73);
const uranusAxialTilt = toRad(82.23);
const neptuneAxialTilt = toRad(28.32);
const plutoAxialTilt = toRad(57.47);

// sun pivot

var sunPivot = new THREE.Object3D();

// pivots for rotating around the sun

var mercurySunPivot = new THREE.Object3D();
var venusSunPivot = new THREE.Object3D();
var earthSunPivot = new THREE.Object3D();
var marsSunPivot = new THREE.Object3D();
var jupiterSunPivot = new THREE.Object3D();
var saturnSunPivot = new THREE.Object3D();
var uranusSunPivot = new THREE.Object3D();
var neptuneSunPivot = new THREE.Object3D();
var plutoSunPivot = new THREE.Object3D();

// pivots for axial tilts

var mercuryPivot = new THREE.Object3D();
var venusPivot = new THREE.Object3D();
var earthPivot = new THREE.Object3D();
var marsPivot = new THREE.Object3D();
var jupiterPivot = new THREE.Object3D();
var saturnPivot = new THREE.Object3D();
var uranusPivot = new THREE.Object3D();
var neptunePivot = new THREE.Object3D();
var plutoPivot = new THREE.Object3D();

// other pivot points

var moonPivot = new THREE.Object3D();

// controlling camera

var mouseX = 0, mouseY = 0;
var cameraY = 0, cameraX = 0;

//
// textures
//

var sunTexture = new THREE.TextureLoader().load("js/textures/sun/sun.jpg");

var mercuryTexture = new THREE.TextureLoader().load("js/textures/mercury/mercurymap.jpg");
var venusTexture = new THREE.TextureLoader().load("js/textures/venus/venusmap.jpg");
var earthTexture = new THREE.TextureLoader().load("js/textures/earth/earthmap.jpg");
var marsTexture = new THREE.TextureLoader().load("js/textures/mars/marsmap.jpg");
var jupiterTexture = new THREE.TextureLoader().load("js/textures/jupiter/jupitermap.jpg");
var saturnTexture = new THREE.TextureLoader().load("js/textures/saturn/saturnmap.jpg");
var uranusTexture = new THREE.TextureLoader().load("js/textures/uranus/uranusmap.jpg");
var neptuneTexture = new THREE.TextureLoader().load("js/textures/neptune/neptunemap.jpg");
var plutoTexture = new THREE.TextureLoader().load("js/textures/pluto/plutomap.jpg");

var cloudsTexture = new THREE.TextureLoader().load("js/textures/earth/earthclouds.jpg");
var moonTexture = new THREE.TextureLoader().load("js/textures/moon/moonmap.jpg")
var saturnRingsTexture = new THREE.TextureLoader().load("js/textures/saturn/saturnringcolor.png");
var uranusRingsTexture = new THREE.TextureLoader().load("js/textures/uranus/uranusringcolor.png");

//
// bumpmaps & alphamaps
//

var mercuryBump = new THREE.TextureLoader().load("js/textures/mercury/mercurybump.jpg");
var venusBump = new THREE.TextureLoader().load("js/textures/venus/venusbump.jpg");
var earthBump = new THREE.TextureLoader().load("js/textures/earth/earthbump.jpg");
var marsBump = new THREE.TextureLoader().load("js/textures/mars/marsbump.jpg");
var jupiterBump = new THREE.TextureLoader().load("js/textures/jupiter/jupiterbump.jpg");
var saturnBump = new THREE.TextureLoader().load("js/textures/saturn/mercurymap.jpg");
var uranusBump = new THREE.TextureLoader().load("js/textures/uranus/uranusbump.jpg");
var neptuneBump = new THREE.TextureLoader().load("js/textures/neptune/neptunebump.jpg");
var plutoBump = new THREE.TextureLoader().load("js/textures/pluto/plutobump.jpg");

var moonBump = new THREE.TextureLoader().load("js/textures/moon/moonBump.jpg");
var saturnRingAlphaMap = new THREE.TextureLoader().load("js/textures/saturn/saturnringtransparencymap.png");
var uranusRingAlphaMap = new THREE.TextureLoader().load("js/textures/uranus/uranusringtransparencymap.png");

//
// menu
//


var gui = new DAT.GUI();

var obj = { 
	verSistemaSolar:function()
	{ 
		
	},
	aproximaMercurio:function()
	{ 
		window.open("js/mercury.html", "_self", false)
	},
	aproximaVenus:function()
	{ 
		window.open("js/venus.html", "_self", false)
	},
	aproximaTerra:function()
	{ 
		window.open("js/earth.html", "_self", false)
	},
	aproximaMarte:function()
	{ 
		window.open("js/mars.html", "_self", false)
	},
	aproximaJupiter:function()
	{ 
		window.open("js/jupiter.html", "_self", false)
	},
	aproximaSaturno:function()
	{ 
		window.open("js/saturn.html", "_self", false)
	},
	aproximaUrano:function()
	{ 
		window.open("js/uranus.html", "_self", false)
	},
	aproximaNeptuno:function()
	{ 
		window.open("js/neptune.html", "_self", false)
	},
	aproximaPlutao:function()
	{ 
		window.open("js/pluto.html", "_self", false)
	},
};

gui.add(obj,'verSistemaSolar').name("Visão geral do Sistema Solar");
gui.add(obj,'aproximaMercurio').name("Ver Mercúrio");
gui.add(obj,'aproximaVenus').name("Ver Venus");
gui.add(obj,'aproximaTerra').name("Ver Terra");
gui.add(obj,'aproximaMarte').name("Ver Marte");
gui.add(obj,'aproximaJupiter').name("Ver Júpiter");
gui.add(obj,'aproximaSaturno').name("Ver Saturno");
gui.add(obj,'aproximaUrano').name("Ver Urano");
gui.add(obj,'aproximaNeptuno').name("Ver Neptuno");
gui.add(obj,'aproximaPlutao').name("Ver Plutão");


//
// init
//


window.onload = function init()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000000 );
	scene.add(camera);
	
	camera.position.z = 50000;

	var listener = new THREE.AudioListener();
	camera.add( listener );
	
	var audioLoader = new THREE.AudioLoader();

	// ambient music
	var ambient = new THREE.Audio( listener );
	audioLoader.load( 'solarsystem.mp3', function( buffer ) {
		ambient.setBuffer( buffer );
		ambient.setLoop(true);
		ambient.setVolume(0.1);
		ambient.play();
	});

	// starfield
	generateStars();

	//
	// celestial bodies
	//

	drawSun(); // sun
	drawMercury(); // mercury
	drawVenus(); // venus
	drawEarth(); // earth
	drawMars(); // mars
	drawJupiter(); // jupiter
	drawSaturn(); // saturn
	drawUranus(); // uranus
	drawNeptune(); // neptune
	drawPluto(); // pluto

	//
	// lights
	//

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0, 0, 1000 );
	scene.add( directionalLight );

	//
	// axis helper
	//

	//var axisHelper = new THREE.AxisHelper( 1500 );
	//scene.add( axisHelper );

	//
	// add render to page
	//

	camera.lookAt(sun.position);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	document.body.appendChild(renderer.domElement);
	animation();
}

//
// animation
//

function animation()
{
	requestAnimationFrame(animation);
		
	// TRANSLATIONS
	if ( orbitFlag )
	{
		mercurySunPivot.rotation.y += mercuryOrbitVel; // controls Mercury translation speed around the Sun
		venusSunPivot.rotation.y += venusOrbitVel; // controls Venus translation speed around the Sun
		earthSunPivot.rotation.y += earthOrbitVel; // controls Earth translation speed around the Sun
		moonPivot.rotation.y += moonOrbitVel; // controls Moon translation speed around Earth
		marsSunPivot.rotation.y += marsOrbitVel; // controls Mars translation speed around the Sun
		jupiterSunPivot.rotation.y += jupiterOrbitVel; // controls Jupiter translation speed around the Sun
		saturnSunPivot.rotation.y += saturnOrbitVel; // controls Saturn translation speed around the Sun
		uranusSunPivot.rotation.y += uranusOrbitVel; // controls Uranus translation speed around the Sun
		neptuneSunPivot.rotation.y += neptuneOrbitVel; // controls Neptune translation speed around the Sun
		plutoSunPivot.rotation.y += plutoOrbitVel; // controls Pluto translation speed around the Sun
	}

	// ROTATIONS
	if ( rotationFlag )
	{
		sun.rotation.y += 0.002; //sunRotationVel; // controls Sun rotation speed around itself
		mercury.rotation.y += mercuryRotationVel; // controls Mercury rotation speed around itself
		venus.rotation.y += -venusRotationVel; // controls Venus rotation speed around itself
		earth.rotation.y += earthRotationVel; // controls Earth rotation speed around itself
		earthClouds.rotation.y += earthRotationVel * 2; // controls Earth clouds rotation speed around itself
		mars.rotation.y += marsRotationVel; // controls Mars rotation speed around itself
		jupiter.rotation.y += jupiterRotationVel; // controls Jupiter rotation speed around itself
		saturn.rotation.y += saturnRotationVel; // controls Saturn rotation speed around itself
		uranus.rotation.y += -uranusRotationVel; // controls Uranus rotation speed around itself
		neptune.rotation.y += neptuneRorationVel; // controls Neptune rotation speed around itself
		pluto.rotation.y += plutoRotationVel; // controls Pluto rotation speed around itself
	}
	

	// stabiliza axial tilts
	mercuryPivot.rotation.y = -mercurySunPivot.rotation.y;
	venusPivot.rotation.y = -venusSunPivot.rotation.y;
	earthPivot.rotation.y = -earthSunPivot.rotation.y;
	marsPivot.rotation.y = -marsSunPivot.rotation.y;
	jupiterPivot.rotation.y = -jupiterSunPivot.rotation.y;
	saturnPivot.rotation.y = -saturnSunPivot.rotation.y;
	uranusPivot.rotation.y = -uranusSunPivot.rotation.y;
	neptunePivot.rotation.y = -neptuneSunPivot.rotation.y;
	plutoPivot.rotation.y = -plutoSunPivot.rotation.y;

	// camera movements
	camera.position.y =  cameraY * 3;
	camera.position.x =  -cameraX * 3;

	renderer.render(scene, camera);
}

//
// draw
//

function drawSun()
{
	geometry = new THREE.SphereGeometry(sunRadius, 80, 80);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: sunTexture});
	sun = new THREE.Mesh(geometry, material);
	scene.add(sunPivot);
	sunPivot.add(sun);
	
	// add planet pivots to sun pivot
	sunPivot.add(mercurySunPivot);
	sunPivot.add(venusSunPivot);
	sunPivot.add(earthSunPivot);
	sunPivot.add(marsSunPivot);
	sunPivot.add(jupiterSunPivot);
	sunPivot.add(saturnSunPivot);
	sunPivot.add(uranusSunPivot);
	sunPivot.add(neptuneSunPivot);
	sunPivot.add(plutoSunPivot);
}

function drawMercury()
{
	geometry = new THREE.SphereGeometry(mercuryRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: mercuryTexture,
										  bumpMap: mercuryBump,
										  bumpScale: 0.04});
	mercury = new THREE.Mesh(geometry, material);

	mercurySunPivot.add(mercuryPivot);
	mercuryPivot.position.x = mercuryDistance; // position of mercury from sun
	mercuryPivot.rotation.z = mercuryAxialTilt; // axis tilt
	mercuryPivot.add(mercury);
}

function drawVenus()
{
	geometry = new THREE.SphereGeometry(venusRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: venusTexture,
										  bumpMap: venusBump,
										  bumpScale: 0.04});
	venus = new THREE.Mesh(geometry, material);

	venusSunPivot.add(venusPivot);
	venusPivot.position.x = venusDistance; // position of venus from sun
	venusPivot.rotation.z = venusAxialTilt; // axis tilt
	venusPivot.add(venus);
}

function drawEarth()
{
	geometry = new THREE.SphereGeometry(earthRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: earthTexture,
										  bumpMap: earthBump,
										  bumpScale: 0.04 });
	earth = new THREE.Mesh(geometry, material);

	earthSunPivot.add(earthPivot);
	earthPivot.position.x = earthDistance; // position of earth from sun
	earthPivot.rotation.z = earthAxialTilt; // axis tilt
	earthPivot.add(earth);
	//earthPivot.add(earth);
	//earth.position.x = earthDistance; // position of earth from sun
	//earth.rotation.z = earthAxialTilt; // axis tilt

	// earth clouds
	geometry = new THREE.SphereGeometry(cloudRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
											alphaMap: cloudsTexture,
											side: THREE.DoubleSide,
											transparent: true,
											depthWrite: false,
	});

	earthClouds = new THREE.Mesh(geometry, material);
	earth.add(earthClouds);

	// moon
	geometry = new THREE.SphereGeometry(moonRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: moonTexture,
										  bumpMap: moonBump,
										  bumpScale: 0.04 });
	moon = new THREE.Mesh(geometry, material);

	earth.add(moonPivot);
	moonPivot.position.x = moonDistanceToEarth; // position of moon from earth
	moonPivot.rotation.z = moonAxialTilt; // axis tilt
	//moon.rotation.x = earthAxialTilt + toRad(5);
	moonPivot.add(moon);

}

function drawMars()
{
	geometry = new THREE.SphereGeometry(marsRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: marsTexture,
										  bumpMap: marsBump,
										  bumpScale: 0.04});
	mars = new THREE.Mesh(geometry, material);

	marsSunPivot.add(marsPivot);
	marsPivot.position.x = marsDistance; // position of mars from sun
	marsPivot.rotation.z = marsAxialTilt; // axis tilt
	marsPivot.add(mars);
}

function drawJupiter()
{
	geometry = new THREE.SphereGeometry(jupiterRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: jupiterTexture,
										  bumpMap: jupiterBump,
										  bumpScale: 0.04});
	jupiter = new THREE.Mesh(geometry, material);

	jupiterSunPivot.add(jupiterPivot);
	jupiterPivot.position.x = jupiterDistance; // position of jupiter from sun
	jupiterPivot.rotation.z = jupiterAxialTilt; // axis tilt
	jupiterPivot.add(jupiter);
}

function drawSaturn()
{
	geometry = new THREE.SphereGeometry(saturnRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: saturnTexture,
										  bumpMap: saturnBump,
										  bumpScale: 0.04});
	saturn = new THREE.Mesh(geometry, material);

	saturnSunPivot.add(saturnPivot);
	saturnPivot.position.x = saturnDistance; // position of saturn from sun
	saturnPivot.rotation.z = saturnAxialTilt; // axis tilt
	saturnPivot.add(saturn);

	// saturn's rings
	geometry = new THREE.RingGeometry( saturnRingInnerRadius, saturnRingOuterRadius, 50, 2, 0, Math.PI * 2);
	material = new THREE.MeshBasicMaterial({wireframe: false,
                                               color: 0xffffff,
                                               side: THREE.DoubleSide,
                                               map: saturnRingsTexture,
                                               alphaMap: saturnRingAlphaMap,
                                               transparent: true});
	saturnRings = new THREE.Mesh( geometry, material );

	saturn.add(saturnRings)
	saturnRings.rotation.x = toRad(90);
}

function drawUranus()
{
	geometry = new THREE.SphereGeometry(uranusRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: uranusTexture,
										  bumpMap: uranusBump,
										  bumpScale: 0.04});
	uranus = new THREE.Mesh(geometry, material);

	uranusSunPivot.add(uranusPivot);
	uranusPivot.position.x = uranusDistance; // position of saturn from sun
	uranusPivot.rotation.z = uranusAxialTilt; // axis tilt
	uranusPivot.add(uranus);

	// uranus's rings
	geometry = new THREE.RingGeometry( uranusRingInnerRadius, uranusRingOuterRadius, 50, 2, 0, Math.PI * 2);
	material = new THREE.MeshBasicMaterial({wireframe: false,
                                               color: 0xffffff,
                                               side: THREE.DoubleSide,
                                               map: uranusRingsTexture,
                                               alphaMap: uranusRingAlphaMap,
                                               transparent: true});
	uranusRings = new THREE.Mesh( geometry, material );

	uranus.add(uranusRings)
	uranusRings.rotation.x = toRad(90);
}

function drawNeptune()
{
	geometry = new THREE.SphereGeometry(neptuneRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: neptuneTexture,
										  bumpMap: neptuneBump,
										  bumpScale: 0.04});
	neptune = new THREE.Mesh(geometry, material);

	neptuneSunPivot.add(neptunePivot);
	neptunePivot.position.x = neptuneDistance; // position of saturn from sun
	neptunePivot.rotation.z = neptuneAxialTilt; // axis tilt
	neptunePivot.add(neptune);
}

function drawPluto()
{
	geometry = new THREE.SphereGeometry(plutoRadius, 16, 16);
	material = new THREE.MeshPhongMaterial({
										  wireframe: false,
										  color: 0xffffff,
										  map: plutoTexture,
										  bumpMap: plutoBump,
										  bumpScale: 0.04});
	pluto = new THREE.Mesh(geometry, material);

	plutoSunPivot.add(plutoPivot);
	plutoPivot.position.x = plutoDistance; // position of saturn from sun
	plutoPivot.rotation.z = plutoAxialTilt; // axis tilt
	plutoPivot.add(pluto);
}

//
// starfield
//

function generateStars()
{
	geometry = new THREE.Geometry();
	material = new THREE.PointsMaterial({
									color: 0xbbbbbb,
									opacity: 0.6,
									size: 1,
									sizeAttenuation: false
									});
	for ( var i = 0; i < 2000; i++ )
	{
	particle = new THREE.Vector3();
	particle.x = Math.random()*2-1;
	particle.y = Math.random()*2-1;
	particle.z = Math.random()*2-1;
	particle.multiplyScalar(3000);
	geometry.vertices.push(particle);
	}

	stars = new THREE.Points(geometry, material);
	stars.scale.set(50, 50, 50);
	scene.add(stars);
}

//
// event listeners
//

document.addEventListener('mousemove', function(e) 
{
	cameraY = parseInt(e.offsetY);
	cameraX = parseInt(e.offsetX);
});

document.addEventListener('mouseclick', function(e)
{

});

document.addEventListener('keydown', function(e) {
   var key = e.keyCode || e.which;
   switch (e.keyCode) {
		case 84: // T key
		orbitFlag ? orbitFlag = false : orbitFlag = true;
		break;
		case 89: // Y key
		rotationFlag ? rotationFlag = false : rotationFlag = true;
		break;
	}
}, false);
