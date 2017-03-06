var scene, camera, renderer, jupiterMesh, light, light2, light3;

var rotationFlag = true;
var stars, particle;

var textureJupiter = new THREE.TextureLoader().load("textures/jupiter/jupitermap.jpg");
var textureShadow = new THREE.TextureLoader().load("textures/jupiter/jupiterbump.jpg");

var angle = (Math.PI * 3.13) / 180;

var jupiterPivot = new THREE.Object3D();

//
// menu
//


var gui = new DAT.GUI();

var obj = { 
	verSistemaSolar:function()
	{ 
		window.open("../solarsystem.html", "_self", false)
	},
	aproximaMercurio:function()
	{ 
		window.open("mercury.html", "_self", false)
	},
	aproximaVenus:function()
	{ 
		window.open("venus.html", "_self", false)
	},
	aproximaTerra:function()
	{ 
		window.open("earth.html", "_self", false)
	},
	aproximaMarte:function()
	{ 
		window.open("mars.html", "_self", false)
	},
	aproximaJupiter:function()
	{ 
		
	},
	aproximaSaturno:function()
	{ 
		window.open("saturn.html", "_self", false)
	},
	aproximaUrano:function()
	{ 
		window.open("uranus.html", "_self", false)
	},
	aproximaNeptuno:function()
	{ 
		window.open("neptune.html", "_self", false)
	},
	aproximaPlutao:function()
	{ 
		window.open("pluto.html", "_self", false)
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


window.onload = function init(){

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.z = 3;
document.body.appendChild( renderer.domElement );

light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,3,5);
scene.add(light);

light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(10,-2,5);
scene.add(light2);

light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(-10,2,5);
scene.add(light3);


var geometry   = new THREE.SphereGeometry(0.7, 32, 32)
var material  = new THREE.MeshPhongMaterial( {wireframe: false,
                                             color: 0xffffff,
                                             map: textureJupiter,
                                             bumpMap: textureShadow,
                                             bumpScale: 0.01});
jupiterMesh = new THREE.Mesh(geometry, material);
jupiterPivot.add(jupiterMesh);
jupiterPivot.rotation.z= angle;


scene.add(jupiterPivot);

// starfield
generateStars();
    
render()

}


function render() {
requestAnimationFrame(render);
if ( rotationFlag )
	{
    jupiterMesh.rotation.y += 0.001194; //escala n/10000 em km/s
	}
   renderer.render(scene, camera);
};

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
	stars.scale.set(1, 1, 1);
	scene.add(stars);
}

document.addEventListener('keydown', function(e) {
   var key = e.keyCode || e.which;
   switch (e.keyCode) {
		case 89: // Y key
		rotationFlag ? rotationFlag = false : rotationFlag = true;
		break;
	}
}, false);