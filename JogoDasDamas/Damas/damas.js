var scene, camera, renderer, clock, raycaster, overlayRenderer, overlayCamera, overlayScene ;
var geometry, meshCubo, meshPeca, controls, selection = null, plane=null;
var offset = new THREE.Vector3(), objects=[];
var scale = 3;
var overlay, object;
var boardPos = new THREE.Vector3(-scale*3.5, -scale*3.5 ,-1); // Define posição do tabuleiro
var tabuleiro = [];
var pecasBrancas = [];
var pecasPretas = [];

var board_data=[
  "* * * * ",
  " * * * *",
  "* * * * ",
  "        ",
  "        ",
  " # # # #",
  "# # # # ",
  " # # # #"
]; //matriz para implementar as peças no seu devido lugar

var Jogadas=[
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
]; // matriz para verificar se há obrigatoriadade de comer


var turno = 1; //variavel para definir o turno

var lado = ""; //variavel para definir o lado em que tem que se comer

var nome;
var novapos;

var flag = false; //bandeira para verificar se é obrigado a comer

var board;
var nomefinal; // variavel para guardar o nome que esta a ser jogada


var obrigadoComer = false;
var pecaJogar = "";

var posicaoLinha = 0;
var posicaoColuna = 0;

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}


window.onload = function init() {

  scene = new THREE.Scene();

  board = new THREE.Object3D();



  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set(0, -17, 20);
  camera.up = new THREE.Vector3(0,0,1);
  camera.lookAt(new THREE.Vector3(0, 0, 3));

  // Orbit controls para manupulação da câmara
  controls = new THREE.OrbitControls(camera);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.maxDistance = 150;


  //musica de fundo

  var listener = new THREE.AudioListener();
	camera.add( listener );

  var audioLoader = new THREE.AudioLoader();
  var sound = new THREE.Audio( listener );
				audioLoader.load( 'sounds/Musica.mp3', function( buffer ) {
					sound.setBuffer( buffer );
					sound.setLoop(true);
					sound.setVolume(0.5);
					sound.play();
				});



  geometry = new THREE.BoxGeometry(scale, scale, scale);

  var imageURL = "pecapreta.jpg";
  var texture = new THREE.TextureLoader().load(imageURL);

  var casaBranca = new THREE.MeshLambertMaterial( { color: 0xFFFFFFF} );
  var casaPreta = new THREE.MeshLambertMaterial( { color: 0x696969} );
  var pecaPreta = new THREE.MeshLambertMaterial( {color: 0xFFFFFFF, map: texture });

  //desenhar o campo
  for(var i= 0; i < board_data.length; i++)
  {
    for(var j = 0; j < board_data[i].length; j++)
    {
      if((i+j)%2 != 0)
      {
        meshCubo = new THREE.Mesh(geometry, casaBranca);
        var novoCubo = meshCubo.clone();
        novoCubo.position.set(j*scale,i*scale,0);
        board.add(novoCubo);
      }
      else
      {
        meshCubo = new THREE.Mesh(geometry, casaPreta);
        var novoCubo = meshCubo.clone();
        novoCubo.position.set(j*scale,i*scale,0);
        board.add(novoCubo);
      }
      novoCubo.name = "casa" + i + j;
      tabuleiro.push(novoCubo);
    }
  }
  board.position.copy(boardPos);
  scene.add(board);


  //desenhar as peças
  var loader = new THREE.JSONLoader();
  loader.load('peca.json', function (geometry) {
    geometry.computeMorphNormals();
    meshPeca = new THREE.Mesh(geometry, casaBranca);
    meshPeca.scale.set(3,3, 7);
    meshPeca.rotation.x = Math.PI;


    for(var i= 0; i < board_data.length; i++)
    {
      for(var j = 0; j < board_data[i].length; j++)
      {
        if(board_data[i][j] == "*")
        {
          var novaPeca = meshPeca.clone();
          novaPeca.name = "pecaB#" + i+"#"+j;
          novaPeca.position.set(j*scale, i*scale, 1);
          board.add(novaPeca);
          pecasBrancas.push(novaPeca);
        }
        if(board_data[i][j] == "#")
        {
          meshPeca = new THREE.Mesh(geometry, pecaPreta);
          meshPeca.scale.set(3,3, 7);
          meshPeca.rotation.x = Math.PI;
          var novaPeca = meshPeca.clone();
          novaPeca.name = "pecaP#" + i+"#"+j;
          novaPeca.position.set(j*scale, i*scale, 1);
          board.add(novaPeca);
          pecasPretas.push(novaPeca);
        }
      }
    }
  });
  //adicionar o plano ao tabuleiro
  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(24+2, 24+2, 0, 10),
                         new THREE.MeshBasicMaterial({color: 0xff0000, visible: false,
                                                      opacity:0.2, transparent:true}));
  // plane.position.z+=1;
  scene.add(plane);


  var light2 = new THREE.SpotLight(0xffffff);
  //Position the light out from the scene, pointing at the origin
  light2.position.set(10, 20, 0);



  board.add(light2);


  var light3 = new THREE.SpotLight(0xffffff, -1);
  //Position the light out from the scene, pointing at the origin
  light3.position.set( 70, 100, 50 );

   board.add(light3);


  //add a directional light to show off the object
  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  //Position the light out from the scene, pointing at the origin
  light.position.set(0.3, 0.6, 1);
  scene.add(light);


  // Eventos do rato
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);


  clock=new THREE.Clock();
  raycaster= new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x43CD80, 3);

  document.body.appendChild( renderer.domElement );


  //OVERLAY
  overlayScene = new THREE.Scene();

  overlay = document.createElement( 'div' );
  overlay.style.width = '100px';
  overlay.style.height = '100x';
  overlay.style.opacity = 0.0;
  //overlay.style.padding = "2px";
  overlay.style.color = "black";
  overlay.style.background = "red";

  object = new THREE.CSS2DObject(overlay);
  object.position.set(-80, 0, 20);

  overlayScene.add(object);

  overlayCamera = new THREE.OrthographicCamera(-100, 100, -100, 100, -10, 10);

  overlayRenderer = new THREE.CSS2DRenderer(); // Renderer CSS 2D (também existe 3D)
  overlayRenderer.setSize( window.innerWidth, window.innerHeight );
  overlayRenderer.domElement.style.position = 'absolute';
  overlayRenderer.domElement.style.top = 0;
  document.body.appendChild( overlayRenderer.domElement );


  animate();

}

function onDocumentMouseDown(event) {
  // posição do rato
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Obter vector 3D (mundo) a partir da posição do rato usando a função 'unproject'
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  vector.unproject(camera);

  // Definir a posição do raycaster
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );


  if(turno == 1)
  {
    // Procura todos os objectos das peças brancas intersectados
    var intersects = raycaster.intersectObjects(pecasBrancas);

    if (intersects.length > 0) {
      // Disable camera controls
      controls.enabled = false;

      // define selection para o primero objecto intersectado
      selection = intersects[0].object;

//       if(obrigadoComer && selection.name != pecaJogar)
//       {
//         selection = null;
//       }



      //console.log("Name:" + selection.name + " Type: "+selection.type);

      // Calcula offset do click
      var intersects = raycaster.intersectObject(plane);
      offset.copy(intersects[0].point).sub(plane.position);
    }
  }
  else
  {
    // Procura todos os objectos das peças brancas intersectados
    var intersects = raycaster.intersectObjects(pecasPretas);

    if (intersects.length > 0) {
      // Disable camera controls
      controls.enabled = false;

      // define selection para o primero objecto intersectado
      selection = intersects[0].object;

      //console.log("Name:" + selection.name + " Type: "+selection.type);

      // Calcula offset do click
      var intersects = raycaster.intersectObject(plane);
      offset.copy(intersects[0].point).sub(plane.position);
    }
  }






}

function onDocumentMouseMove(event) {
  event.preventDefault();

  // posição do rato
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Obter vector 3D (mundo) a partir da posição do rato usando a função 'unproject'
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  vector.unproject(camera);

  // Definir a posição do raycaster
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );


  if (selection) {

    // No caso de um objecto estar seleccionado
    // Verificar a posição em que o plano é intersectado

    var intersects = raycaster.intersectObject(plane);
    // Reposicionar o object basedo no ponto onde o plano é intersectado
    selection.position.copy(intersects[0].point.sub(boardPos));
    novapos = intersects[0].point;
  }
  /*   else {
            // Caso não hajam objectos seleccionados (movimento normal do rato)
            // Actualizar a posição e orientar o plano caso seja necessário
            var intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
              plane.position.copy(intersects[0].object.position);
              plane.lookAt(camera.position);
            }
          } */

}




function onDocumentMouseUp(event) {

  var res; //variavel para dividir o nome da peça selecionada
  var linha; //variavel para receber a linha da peça
  var coluna; //variavel para receber a coluna da peça
  var novaLinha; // variavel para receber a nova linha da peça
  var novaColuna; // variavel para receber a nova coluna da peça

  if(!selection) return;

  //dividir o nome da peça selecionada para obter a linha e a coluna da mesma
  res = selection.name.split("#");
  linha = res[1];
  coluna = res[2];
  nomefinal = res[0];

  //Calcular as posições obtidas ao largar a peça na nova posição
  novaLinha =  selection.position.y / 3;
  novaColuna =  selection.position.x / 3;
  novaLinha = Math.round(novaLinha, 2);
  novaColuna = Math.round(novaColuna, 2);

  linha = parseInt(linha);
  coluna = parseInt(coluna);

  //reniciar array onde se verifica se é obrigado a comer
  reniciarArray();

  //Verificar turno 1
  if(turno == 1)
  {
    if(verificarNome(res[0]))
    {
      verificarComerDama(linha, coluna);
      verificarArray();
      //console.log(Jogadas);
      if(flag)
      {
        ComerDama(linha, coluna, novaLinha, novaColuna);
      }
      JogadaDama(linha, coluna, novaLinha, novaColuna, res[0]);
    }
    else{

      VerificarComer();
      verificarArray();
      //console.log(board_data);
      //console.log(Jogadas);


      if(flag)
      {
        Comer(linha, coluna, novaLinha, novaColuna);
      }
      else{


        if(novaLinha == linha + 1   && (novaColuna == coluna +1 || novaColuna == coluna - 1))
        {
          if(board_data[novaLinha][novaColuna] == "*" || board_data[novaLinha][novaColuna] == "#" )
          {
            selection.position.set(coluna*scale, linha*scale, 1);
            overlay.style.opacity = 0.5;
          }
          else
          {
            JogadaNormal(linha, coluna, novaLinha, novaColuna, res[0]);
            overlay.style.opacity = 0.0;
          }
        }
        else
        {
          selection.position.set(coluna*scale, linha*scale, 1);
          overlay.style.opacity = 0.5;
          overlay.innerHTML = "Jogue apenas uma casa!"
        }
      }

    }


  }
  else
  {

    VerificarComer();
    verificarArray();
    //console.log(board_data);
    //console.log(Jogadas);

    if(flag)
    {
      Comer(linha, coluna, novaLinha, novaColuna);
    }
    else{
      if(novaLinha == linha - 1   && (novaColuna == coluna +1 || novaColuna == coluna - 1))
      {
        if(board_data[novaLinha][novaColuna] == "*" || board_data[novaLinha][novaColuna] == "#" )
        {

          selection.position.set(coluna*scale, linha*scale, 1);
        }
        else
        {
          JogadaNormal(linha, coluna, novaLinha, novaColuna, res[0]);
        }
      }
      else
      {
        selection.position.set(coluna*scale, linha*scale, 1);
        overlay.innerHTML = "Jogue apenas uma casa!"
      }
    }

  }
  // Reactivar os controlos da câmara
  controls.enabled = true;
  selection = null;




}
//Função que vai verificar se existe um peça adversária a frente das peças do jogador em questão
function VerificarComer()
{
  var linha1 = 0;
  var colunaDireita = 0;
  var colunaEsquerda = 0;
  var simboloOriginal = "";
  var simboloSegundo = "";
  var sinalLinha;
  var numeroLinha;


  if(turno == 1)
  {
    simboloOriginal = "*";
    simboloSegundo = "#";
    sinalLinha = 1;
    numeroLinha = 8;

  }
  else
  {
    simboloOriginal = "#";
    simboloSegundo = "*";
    sinalLinha = -1;
    numeroLinha = -1;
  }

  for(var i = 0; i < board_data.length; i++)
  {
    for(var j = 0; j < board_data[i].length; j++)
    {
      if(board_data[i][j] == simboloOriginal)
      {
        linha1 = i + sinalLinha;
        colunaEsquerda = j - sinalLinha;
        colunaDireita = j + sinalLinha;
        if(linha1 != numeroLinha)
        {
        if(board_data[linha1][colunaDireita] == simboloSegundo)
        {
          lado = "dir";
          CasaVazia(linha1+ sinalLinha, colunaDireita + sinalLinha);
        }
        if(board_data[linha1][colunaEsquerda] == simboloSegundo)
        {
          lado = "esq";
          CasaVazia(linha1+ sinalLinha, colunaEsquerda- sinalLinha);
        }
        //         else if(board_data[linha1][colunaEsquerda] == simboloSegundo && board_data[linha1][colunaDireita] == simboloSegundo)
        //         {
        //           console.log("entrou - 3");
        //           lado = "ambos";
        //           CasaVazia(linha1, j, colunaDireita, colunaEsquerda);
        //         }
      }
     }

    }
  }
}

//tentativa de criação do metodo para verificar se a dama era obrigada a comer!!
function verificarComerDama(linha, coluna)
{
   var colunaDireita = 0;
  var colunaEsquerda = 0;
  var simboloOriginal = "";
  var simboloSegundo = "";
  var sinalLinha;
  var numeroLinha;
   if(turno == 1)
  {
    simboloOriginal = "*";
    simboloSegundo = "#";
    sinalLinha = 1;
    numeroLinha = 8;

  }
  else
  {
    simboloOriginal = "#";
    simboloSegundo = "*";
    sinalLinha = -1;
    numeroLinha = -1;
  }
  var contador = 0;
  if(linha == 7)
  {
    if(board_data[linha][coluna] == simboloOriginal)
    {
      for(var i = 0; i < board_data[0].length; i++)
      {
        contador++;
        if(coluna % 2 == 0)
        {

          if(coluna == 1)
          {
            if(contador == 1)
            {
              colunaDireita = coluna + sinalLinha;
              colunaEsquerda = coluna -sinalLinha;
            }
            else
            {
              colunaDireita = coluna +sinalLinha;
            }
          }
          else{
              if(contador <= 3)
              {
                colunaDireita = coluna + sinalLinha;
                colunaEsquerda = coluna -sinalLinha;
              }
              else
              {
                colunaDireita = coluna +sinalLinha;
              }
          }

        }
        else{
          if(coluna == 5)
          {

            if(contador <= 3)
            {

              colunaDireita = coluna + sinalLinha;
              colunaEsquerda = coluna -sinalLinha;

              if(board_data[linha][colunaDireita] == simboloSegundo)
              {
                 CasaVazia(linha+ sinalLinha, colunaDireita + sinalLinha);
              }
               if(board_data[linha][colunaEsquerda] == simboloSegundo)
              {
                 CasaVazia(linha+ sinalLinha, colunaEsquerda - sinalLinha);
              }
            }
            else
            {
              colunaEsquerda = coluna -sinalLinha;
              if(board_data[linha][colunaEsquerda] == simboloSegundo)
              {
                 CasaVazia(linha+ sinalLinha, colunaEsquerda - sinalLinha);
              }
            }
          }
          else{
            colunaEsquerda = coluna - sinalLinha;
          }


        }
        linha--;
      }


    }
  }
}

//tentativa de criação de uma função para a dama comer
function ComerDama(linha, coluna, novaLinha, novaColuna)
{
  var nome;
  var simbolo;
  var letra;
  var inicioNome;


  if(turno == 1)
  {
    simbolo = "*";
    letra = "P";


  }
  else
  {
    letra = "B"
    simbolo = "#";
  }

/*   if(verificarNomePeca(linha, coluna, casaA, linhax)){
    inicioNome = "damapeca";
  }
  else{
    inicioNome = "peca";
  } */

  if(novaLinha-linha == novaColuna -coluna)
  {


  selection.position.set(novaColuna*scale, novaLinha*scale, 1);

  var selectedObject = board.getObjectByName("peca" + letra + "#" + (posicaoLinha+1) + "#" + (posicaoColuna+1));

  selectedObject.visible = false;
  selectedObject.name="#" + novaLinha + "#" + novaColuna;
  board_data[posicaoLinha] = board_data[posicaoLinha].replaceAt(posicaoColuna,' ');
  board_data[linha] = board_data[linha].replaceAt(coluna,' ');
  board_data[novaLinha] = board_data[novaLinha].replaceAt(novaColuna, simbolo);

  verificarLimites(novaLinha, novaColuna, nomefinal);


  /*     nome = nomefinal + "#" + novaLinha + "#" + novaColuna;
  console.log(nome);
  selection.name = nome; */
  flag = false;

    if(VerifcarJogadaDupla(novaLinha, novaColuna))
    {

      obrigadoComer = true;
      pecaJogar = nome;
    }
    else{
      obrigadoComer = false;
      if(turno == 1)
      {
        turno = 2;
      }
      else
      {
        turno = 1;
      }
    }
  }
  else
  {
    selection.position.set(coluna*scale, linha*scale, 1);
    overlay.style.opacity = 0.5;

  }



}


//Função para verificar se existe possibilidade de comer duas vezes na mesma jogada
function VerifcarJogadaDupla(novaLinha, novaColuna)
{
  var simboloOriginal = "";
  var simboloSegundo = "";
  var sinalLinha = 0;
  var colunaDireita;
  var colunaEsquerda;

  if(turno == 1)
  {
    simboloOriginal = "*";
    simboloSegundo = "#";
    sinalLinha = 1;

  }
  else
  {
    simboloOriginal = "#";
    simboloSegundo = "*";
    sinalLinha = -1;
  }


  novaLinha +=  sinalLinha;
  colunaEsquerda = novaColuna - sinalLinha;
  colunaDireita = novaColuna + sinalLinha;
  if(novaLinha < 7 && novaLinha > 0){
    if(board_data[novaLinha][colunaDireita] == simboloSegundo)
    {
      console.log("entrou - 1");
      lado = "dir";
      if(CasaVazia(novaLinha+ sinalLinha, colunaDireita + sinalLinha))
        return true;
    }
      if(board_data[novaLinha][colunaEsquerda] == simboloSegundo)
    {
      console.log("entrou - 2");
      lado = "esq";
      if(CasaVazia(novaLinha+ sinalLinha, colunaEsquerda- sinalLinha))
        return true;

    }
  }
    return false;
}

//Função que vai permitir ao jogador comer
function Comer(linha, coluna, novaLinha, novaColuna) {

  var casa;
  var casaA;
  var sentido;
  var linhax;
  var simbolo;

  if(turno == 1)
  {
    simbolo = "#";
    sentido = 2;
    linhax = 1;

    if(novaColuna-coluna > 0)
    {
      casa = 2;
      casaA = 1;
    }
    else
    {
      casa = -2;
      casaA = -1;
    }
  }
  else
  {
    simbolo = "*";
    sentido = -2;
    linhax = -1;
    if(novaColuna-coluna > 0)
    {
      casa = 2;
      casaA = 1;
    }
    else
    {
      casa = -2;
      casaA = -1;
    }

  }

  if((novaLinha-linha == sentido && Math.abs(novaColuna-coluna) == 2) &&
     (board_data[novaLinha][novaColuna] == " ") &&
     (board_data[linha + (novaLinha-linha)/2][coluna + (novaColuna-coluna)/2] == simbolo)){
    EsconderPeca(linha, coluna, novaLinha, novaColuna, casa, casaA, linhax);
    overlay.style.opacity = 0.0;
  }
  else
  {
    selection.position.set(coluna*scale, linha*scale, 1);
    overlay.innerHTML = "&Eacute; obrigado a comer"
    overlay.style.opacity = 0.5;
  }


  /*   console.log(linhax);

  if(novaLinha == linha + sentido && novaColuna == coluna + casa)
  {
    if(Jogadas[novaLinha][novaColuna] == '1')
    {

      EsconderPeca(linha, coluna, novaLinha, novaColuna, casa, casaA, linhax);
    }
  } */

}


//Função que vai alterar na matriz a posição da peça, e esconder a que foi comida
function EsconderPeca(linha, coluna, novaLinha, novaColuna, casa, casaA, linhax)
{

  var nome;
  var simbolo;
  var letra;
  var inicioNome;


  if(turno == 1)
  {
    simbolo = "*";
    letra = "P";


  }
  else
  {
    letra = "B"
    simbolo = "#";
  }

  if(verificarNomePeca(linha, coluna, casaA, linhax)){
    inicioNome = "damapeca";
  }
  else{
    inicioNome = "peca";
  }

  selection.position.set(novaColuna*scale, novaLinha*scale, 1);
  var selectedObject = board.getObjectByName(inicioNome + letra + "#" + (linha+linhax) + "#" + (coluna + casaA));
  selectedObject.visible = false;
  selectedObject.name="#" + novaLinha + "#" + novaColuna;
  board_data[linha+linhax] = board_data[linha+linhax].replaceAt(coluna+casaA,' ');
  board_data[linha] = board_data[linha].replaceAt(coluna,' ');
  board_data[novaLinha] = board_data[novaLinha].replaceAt(novaColuna, simbolo);

  verificarLimites(novaLinha, novaColuna, nomefinal);


  /*     nome = nomefinal + "#" + novaLinha + "#" + novaColuna;
  console.log(nome);
  selection.name = nome; */
  flag = false;

    if(VerifcarJogadaDupla(novaLinha, novaColuna))
    {

      obrigadoComer = true;
      pecaJogar = nome;
    }
    else{
      obrigadoComer = false;
      if(turno == 1)
      {
        turno = 2;
        camera.position.set(0, 17, 20);

      }
      else
      {
        turno = 1;
        camera.position.set(0, -17, 20);
      }
    }





}

//Função que vai verificar o nome da peça que esta jogar, que pode ser dama ou peça normal
function verificarNomePeca(linha, coluna, casaA, linhax){
  var x;
  var y = [];

  if(turno == 2){
    for(var i = 0; i < pecasBrancas.length; i++){
      x = pecasBrancas[i].name;
      y = x.split("#");
      if ((linha+linhax) == y[1] && (coluna + casaA) == y[2]){
        if(y[0] == "damapecaB"){
        return true;
        }
      }
    }
  }
  else {
    for(var i = 0; i < pecasPretas.length; i++){
      x = pecasPretas[i].name;
      y = x.split("#");
      if ((linha+linhax) == y[1] && (coluna + casaA) == y[2]){
         if(y[0] == "damapecaP"){
        return true;
        }
      }
    }

  }
 return false;

}


//esta função vai verificar se o jogador conseguiu fazer dama
function verificarLimites(novaLinha, novaColuna, res)
{
  var nome = "";
  if(novaLinha == 0 || novaLinha == 7)
  {
    nome = "dama" + nomefinal + "#" + novaLinha + "#" + novaColuna;
    selection.scale.set(3,3,11);
    selection.name = nome;
    //console.log("ENTROU DAMA - " + selection.name);
    selection = null;

  }
  else
  {
    nome = res +"#" + novaLinha + "#" + novaColuna;
    console.log(nome);
    selection.name = nome;
  }


}

//Esta função verifica se a frente da peça adversária esta um espaço em branco, para assim o jogador poder comer a peça
function CasaVazia(linha, coluna)
{
  //   if(turno == 1)
  //   {
  //     linha1 += 1;
  //     colunaDireita += 1;
  //     colunaEsquerda -= 1;
  //   }
  //   else
  //   {
  //     linha1 -= 1;
  //     colunaDireita -= 1;
  //     colunaEsquerda += 1;
  //   }
  //   if(lado == "ambos")
  //   {

  //     if( board_data[linha1][colunaEsquerda] == " " &&  board_data[linha1][colunaDireita] == " ")
  //     {
  //       console.log("entrou - 1");
  //       Jogadas[linha1] = Jogadas[linha1].replaceAt(colunaDireita,'1');
  //       Jogadas[linha1] = Jogadas[linha1].replaceAt(colunaEsquerda,'1');
  //     }
  //   }
  //   else if(lado == "dir")
  //   {
  //     if(board_data[linha1][colunaDireita] == " ")
  //     {
  //       console.log("entrou - 2");
  //       Jogadas[linha1] = Jogadas[linha1].replaceAt(colunaDireita,'1');
  //     }
  //   }
  //   else if(lado == "esq")
  //   {
  //     if(board_data[linha1][colunaEsquerda] == " ")
  //     {
  //       console.log("entrou - 3");
  //       Jogadas[linha1] = Jogadas[linha1].replaceAt(colunaEsquerda,'1');
  //     }
  //   }
  if(linha>=0 && linha <board_data.length && coluna>=0 && coluna<board_data[0].length)
  {
    if(board_data[linha][coluna]==" "){
      Jogadas[linha] = Jogadas[linha].replaceAt(coluna,'1');
      posicaoLinha = linha;
      posicaoColuna = coluna;
      return true;
    }
  }
  return false;

}
//Função que vai verificar o nome da peça
function verificarNome(nome)
{
  var nometemp = "";
  if(turno == 1)
  {
    nometemp = "damapecaB";
  }
  else
  {
    nometemp = "damapecaP";
  }
  if(nome == nometemp)
  {
    return true;
  }
  else
  {
    return false;
  }
}

//Jogada normal do jogo

function JogadaNormal(linha, coluna, novaLinha, novaColuna, res)
{
  flag = false;
  var simbolo = '';
  if(turno == 1)
  {
    simbolo = '*';
    camera.position.set(0, 17, 20);
    turno = 2;
  }
  else
  {
    simbolo = '#';
    camera.position.set(0, -17, 20);
    turno = 1;
  }
  board_data[linha] = board_data[linha].replaceAt(coluna,' ');
  board_data[novaLinha] = board_data[novaLinha].replaceAt(novaColuna, simbolo);
  selection.position.set(novaColuna*scale, novaLinha*scale, 1);
  verificarLimites(novaLinha, novaColuna, res);
  //nome = res + "#" + novaLinha + "#" + novaColuna;
  //selection.name = nome;



}

//Jogada da dama
function JogadaDama(linha, coluna, novaLinha, novaColuna, res)
{

  if(Math.abs(novaLinha - linha) == Math.abs(novaColuna - coluna))
  {
    if(turno == 1)
    {
      simbolo = '*';
      turno = 2;
    }
    else
    {
      simbolo = '#';
      turno = 1;
    }

    board_data[linha] = board_data[linha].replaceAt(coluna,' ');
    board_data[novaLinha] = board_data[novaLinha].replaceAt(novaColuna, simbolo);
    nome = res + "#" + novaLinha + "#" + novaColuna;
    selection.name = nome;
    selection.position.set(novaColuna*scale, novaLinha*scale, 1);
  }
  else
  {
    selection.position.set(coluna*scale, linha*scale, 1);

  }
}


function reniciarArray()
{
  Jogadas=[
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
  ];
}

function verificarArray()
{

  for(var i = 0; i < Jogadas.length; i++)
  {
    for(var j = 0; j < Jogadas[i].length; j++)
    {
      if(Jogadas[i][j] == '1')
      {
        flag = true
      }
    }
  }
}



function novoJogo()
{
  board_data=[
    "* * * * ",
    " * * * *",
    "* * * * ",
    "        ",
    "        ",
    " # # # #",
    "# # # # ",
    " # # # #"
  ];
  turno = 1;
  pecasBrancas = [];
  pecasPretas = [];

}

//Função que vai verificar se há peças em que o jogador é obrigado a comer;

function animate() {

  // Obtem intervado de tempo entre animações e actualiza controlos
  var delta = clock.getDelta();
  controls.update(delta);

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  overlayRenderer.render(overlayScene, overlayCamera);

}
