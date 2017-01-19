

var timer;
var timer2;
function load() {
      var canvas = document.getElementById("myCanvas");
      var canvas2 = document.getElementById("myCanvas2");
      var canvas3 = document.getElementById("myCanvas3");


      if (canvas.getContext && canvas2.getContext && canvas3.getContext) {
            var ctx = canvas.getContext("2d");
            var ctx2 = canvas2.getContext("2d");
            var ctx3 = canvas3.getContext("2d");

            var numQuadrado = 12;
            var delta = 50;
            var quadrados = [];
            var selecionados = [];

            var palavrasH = [];
            var palavrasV = [];
            var palavrasH1 = ["MAO", "CABECA", "OLHOS", "BOCA", "ORELHA"];
            var palavrasV1 = ["PERNA", "NARIZ", "PULMOES", "CORACAO", "BRACO"];
            var palavrasH2 = ["CAO", "GATO", "LEAO", "MACACO", "GIRAFA"];
            var palavrasV2 = ["URSO", "PANDA", "COELHO", "GOLFINHO", "TUBARAO"];
            var palavrasH3 = ["LARANJA", "UVAS", "PESSEGO", "ABACAXI", "KIWI"];
            var palavrasV3 = ["PERA", "MACA", "MORANGO", "BANANA", "LIMAO"];

            // variaveis globais para facilitar
            var selx = 0
            var sely = 0
            var selfx = 0
            var selfy = 0
            // variaveis para definirmos as posiçoes iniciais e finais para ler as letras
            var posi = 0
            var posf = 0
            var posiy = 0
            var posfy = 0



            var items = [
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
                  ["", "", "", "", "", "", "", "", "", "", "", ""],
            ];



            var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var imagensH = [];
            var numImagesLoaded = 0;
            var numImagesToLoad = 0;
            var letrasAleatoria = Math.floor((Math.random() * 3) + 1);

            // o jogo começa aqui
            iniciar();


            // função que vai o jogo, é esta função que vai definir quais as palavras a serem selecionadas
            function iniciar() {
                  console.log(letrasAleatoria);
                  if (letrasAleatoria == 1) {
                        palavrasH = palavrasH1.slice();
                        palavrasV = palavrasV1.slice();
                  } else if (letrasAleatoria == 2) {
                        palavrasH = palavrasH2.slice();
                        palavrasV = palavrasV2.slice();
                  } else if (letrasAleatoria == 3) {
                        palavrasH = palavrasH3.slice();
                        palavrasV = palavrasV3.slice();
                  }

                  atualizarImagem()
            }


            // funçao atualizarImagem, esta função vai percorrer o array das palavras para depois as carregar as imagens correspondente através da função loadImage
            function atualizarImagem() {
                  var y = 0
                  for (var i = 0; i < palavrasH.length; i++) {
                        var txt = palavrasH[i]

                        loadImage(10, y, txt);
                        y += 120;
                  }
                  y = 0
                  for (var i = 0; i < palavrasV.length; i++) {
                        var txt = palavrasV[i]
                        loadImage(150, y, txt);
                        y += 120;
                  }

            }




            // esta função vai carregar as imagens para um array de imagens para depois estas serem desenhadas pela funçao loadOneByOne
            function loadImage(x, y, name) {
                  var x1 = x
                  var y1 = y;
                  imagensH[numImagesToLoad] = new Image();
                  imagensH[numImagesToLoad].src = "img/" + letrasAleatoria + "/" + name + ".png";
                  imagensH[numImagesToLoad++].onload = function () {


                        loadOneByOne(x1, y1);


                  }




            }


            function loadOneByOne(x, y) {

                  numImagesLoaded++;

                  if (numImagesLoaded == palavrasH.length) {
                        //setInterval(anima, 1000 / fps);
                        init();
                  }

                  console.log(x, y);
                  ctx2.drawImage(imagensH[numImagesLoaded - 1], x, y, 100, 100);



            }



            //  função que desenha a grelha com a sopa de letras
            function init() {


                  var dx = 0;
                  var dy = 0;
                  // inserir quadrados num array bidemensional
                  for (var i = 0; i < numQuadrado; i++) {
                        for (var j = 0; j < numQuadrado; j++) {
                              quadrados.push(new quadrado(dx, dy))
                              dx += delta;
                        }
                        dx = 0;
                        dy += delta;

                  }

                  inserirPalavrasNoArray();
                  addGrid();
                  puzzle();
            }
            //init();

            // funçao que vai selecionar as palavras caso o utilizador tenha acertado
            function selecionado(selx, sely, selfx, selfy) {
                  this.x = selx;
                  this.y = sely;
                  this.fx = selfx;
                  this.fy = selfy;
                  this.color = "rgba(255,145,0,0.5)"
                  this.desenhaselecionado = function () {
                        ctx.beginPath();
                        ctx.fillStyle = this.color;
                        ctx.fillRect(this.x, this.y, this.fx, this.fy)
                        ctx.fill();
                  }

            }

            // função que vai desenhar os quadrados da sopa de letras
            function quadrado(x, y) {
                  this.x = x;
                  this.y = y;
                  this.text = "";
                  this.color = "black";
                  this.desenhaQuadrado = function () {
                        ctx.beginPath();
                        ctx.strokeRect(this.x, this.y, 50, 50)
                        ctx.stroke();
                        ctx.font = "20px sans-serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = this.color
                        ctx.fillText(this.text, this.x + 25, this.y + 25);
                        ctx.fill()
                  }
            }

            //mx e my: coordenados do rato
            quadrado.prototype.isInside = function (mx, my) {
                  // verificar se mx pertence [x,x + 50] e my pertence [y,y + 50]
                  return (mx >= this.x) && (mx <= this.x + 50) && (my >= this.y) && (my <= this.y + 50)
            }

            // selecionar os quadrados
            function mouseDown(e) {
                  // obtem as coordenadas do rato dentro do canvas
                  var mouseX = e.pageX - canvas.offsetLeft;
                  var mouseY = e.pageY - canvas.offsetTop;
                  // verifica se o rato encontra posicionado em algum rectângulo
                  for (var i = 0; i < quadrados.length; i++) {
                        if (quadrados[i].isInside(mouseX, mouseY)) {
                              // variaveis globais para facilitar
                              selx = quadrados[i].x;
                              posx = i;
                              sely = quadrados[i].y;
                              posiy = i;
                        }
                  }
                  canvas.addEventListener("mousemove", mouseMove);
            } // fim mouseDown
            canvas.addEventListener("mousedown", mouseDown);


            function mouseMove(e) {
                  // obtem as coordenadas do rato dentro do canvas
                  var mouseX = e.pageX - canvas.offsetLeft;
                  var mouseY = e.pageY - canvas.offsetTop;
                  // verifica se o rato encontra posicionado em algum rectângulo
                  for (var i = 0; i < quadrados.length; i++) {
                        if (quadrados[i].isInside(mouseX, mouseY)) {
                              quadrados[i].color = "red"
                        }
                  }
            }

            function mouseUp(e) {
                  // obtem as coordenadas do rato dentro do canvas
                  var mouseX = e.pageX - canvas.offsetLeft;
                  var mouseY = e.pageY - canvas.offsetTop;
                  // limpar o mousemove
                  canvas.removeEventListener("mousemove", mouseMove);
                  // verifica se o rato encontra posicionado em algum rectângulo
                  for (var i = 0; i < quadrados.length; i++) {
                        // limpar o mousemove
                        quadrados[i].color = "black"
                        // verifica a orientação do movimento do rato, tanto da esquerda para a direito ( e inverso), tanto da cima para baixo ( e inverso)
                        if (quadrados[i].isInside(mouseX, mouseY)) {

                              // essquerda para direira
                              if (quadrados[i].x > selx) {

                                    selfx = quadrados[i].x - selx + 50;
                                    selfy = quadrados[i].y - sely + 50;
                                    posf = i;

                                    if (ler_letrasH(posx, posf) == true) {

                                          selecionados.push(new selecionado(selx, sely, selfx, selfy))
                                    }

                              }
                              //direita para esquerda
                              else if (quadrados[i].x < selx) {


                                    selfx = (selx - quadrados[i].x) + 50;
                                    selfy = quadrados[i].y - sely + 50;
                                    posf = i

                                    if (ler_letrasH(posf, posx) == true) {
                                          selecionados.push(new selecionado(quadrados[i].x, sely, selfx, selfy))
                                    }


                              }
                              // cima para baixo
                              else if (quadrados[i].y < sely) {
                                    selfx = quadrados[i].x - selx + 50;
                                    selfy = (sely - quadrados[i].y) + 50;

                                    posfy = i
                                    if (ler_letrasV(posfy, posiy) == true) {
                                          selecionados.push(new selecionado(selx, quadrados[i].y, selfx, selfy))
                                    }
                              }
                              //baixo para cima
                              else if (sely < quadrados[i].y && quadrados[i].x == selx) {
                                    selfx = quadrados[i].x - selx + 50;
                                    selfy = quadrados[i].y - sely + 50;

                                    posfy = i
                                    if (ler_letrasV(posiy, posfy) == true) {
                                          selecionados.push(new selecionado(selx, sely, selfx, selfy))
                                    }
                              }



                        }
                  }
                  // desenhar os rectangulos criados após mouseup

            }

            canvas.addEventListener("mouseup", mouseUp);




            //função que desenha grelha
            function addGrid() {
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                  ctx.beginPath()

                  // desenhar quadrados no canvas
                  for (var i = 0; i < selecionados.length; i++) {
                        selecionados[i].desenhaselecionado();
                        if (selecionados.length == 10) {
                              clearInterval(timer);

                              document.getElementById("myCanvas").style.display = "none";
                              document.getElementById("myCanvas2").style.display = 'none';
                              document.getElementById("myCanvas3").style.display = '';
                              document.getElementById("novoJogo").style.display = '';
                              document.getElementById("desistir").style.display = 'none';
                              
                              timer2 = window.setInterval(animar, 1000 / 100);


                        }
                  }
                  for (var i = 0; i < quadrados.length; i++) {
                        //for (var j = 0; j < numQuadrado; j++) {
                        quadrados[i].desenhaQuadrado();

                  }



            }

            // desenhar os rectangulos criados


            function puzzle() {
                  //INSERIR PALAVRAS NO array
                  // imprimir as palavras na grid
                  var puzzleString = '';
                  for (var i = 0; i < items.length; i++) {
                        var row = items[i];
                        for (var j = 0, width = row.length; j < width; j++) {
                              if (row[j] != '') {
                                    quadrados[12 * i + j].text = row[j]
                              }
                        }
                  }




                  //preencher os espaços vazios no array de letras
                  for (var i = 0; i < items.length; i++) {
                        var row = items[i];
                        for (var j = 0, width = row.length; j < width; j++) {
                              if (!items[i][j]) {
                                    var randomLetter = Math.floor(Math.random() * letters.length);
                                    items[i][j] = letters[randomLetter];
                                    quadrados[12 * i + j].text = letters[randomLetter]
                              }
                        }
                  }


            }

            function inserirPalavrasNoArray() {
                  // inserir  palavras horizontais

                  for (var i = 0; i < palavrasH.length; i++) {
                        var verifica = false;
                        var res = palavrasH[i].split("");

                        while (verifica == false) {
                              var tamPalavra = palavrasH[i].length;
                              var posPalavraJ = Math.round(Math.random() * (11 - tamPalavra));
                              var posPalavraI = Math.round(Math.random() * 11);

                              // ciclo para verificar se posição é posivel, vai percorrer o array de item e verifica se os quadrados estão vazios
                              if (items[posPalavraI][posPalavraJ] == "" && items[posPalavraI][posPalavraJ + tamPalavra] == "") {
                                    for (var j = 0; j < tamPalavra; j++) {
                                          items[posPalavraI][posPalavraJ] = res[j];
                                          posPalavraJ++;
                                    }
                                    verifica = true;
                              }
                        }
                  }


                  // inserir palavras verticais

                  for (var i = 0; i < palavrasV.length; i++) {
                        var verifica = false;
                        var res = palavrasV[i].split("");

                        while (verifica == false) {

                              var tamPalavra = palavrasV[i].length;
                              var posPalavraI = Math.round(Math.random() * (11 - tamPalavra));
                              var posPalavraJ = Math.round(Math.random() * 11);
                              var cont = 0;
                              var z = 0;

                              //  // ciclo para verificar se posição é posivel, vai percorrer o array de item e verifica se os quadrados estão vazios ou se a letra é igual numa certa posição
                              for (var k = posPalavraI; k < posPalavraI + tamPalavra; k++) {

                                    if (items[k][posPalavraJ] == "" || res[z] == items[k][posPalavraJ]) {
                                          cont++;
                                          console.log("letra:" + res[z] + "palavra:" + items[k][posPalavraJ])
                                          z++;


                                    }
                              }
                              // se no ciclo for o cont for igual ao tamanho da palavra siginifica que é possivel inserir a palavra na vertical, caso contrario volta a fazer tudo de novo.
                              if (cont == tamPalavra) {
                                    console.log("entre")
                                    for (var j = 0; j < tamPalavra; j++) {
                                          for (var k = posPalavraI; k < posPalavraI + tamPalavra; k++) {

                                                items[k][posPalavraJ] = res[j];
                                                j++;
                                          }
                                    }
                                    verifica = true;
                              }
                        }
                  }


            }

            // função que vai ler as palavras  horizontais
            function ler_letrasH(pos_inicial, pos_final) {
                  var texto = "";
                  var flag = false;
                  // ciclo que vai juntar as letras selecionas
                  for (var i = 0; i < quadrados.length; i++) {
                        if (i >= pos_inicial && i <= pos_final) {
                              texto += quadrados[i].text;
                        }
                  }
                  // ciclo para verificar se as letras juntadas anteriormente, formam uma palavra correta 
                  for (var i = 0; i < palavrasH.length; i++) {
                        if (palavrasH[i] == texto) {
                              palavrasH.splice(i, 1);
                              flag = true;
                              // se a palavra estiver certa, temos de remover a imagem associada á palavra
                              if (flag = true) {
                                    var x;
                                    var texto2 = texto += ".png";
                                    var pal;
                                    for (var i = 0; i < imagensH.length; i++) {
                                          if (imagensH[i] != undefined) {
                                                x = imagensH[i].src.split("/");
                                          }
                                          if (x[x.length - 1] == texto2) {

                                                imagensH.splice(i, 1);

                                          }

                                    }

                              }
                        }
                  }

                  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                  atualizarImagem();

                  return flag;
            }
            // função que vai ler as palavras  verticais
            function ler_letrasV(pos_inicial, pos_final) {
                  var texto = "";
                  var flag = false;
                  // ciclo que vai juntar as letras selecionas
                  for (var i = 0; i < quadrados.length; i++) {
                        if (i >= pos_inicial && i <= pos_final) {
                              texto += quadrados[i].text;
                              i = i + 11;
                        }
                  }
                  // ciclo para verificar se as letras juntadas anteriormente, formam uma palavra correta 
                  for (var i = 0; i < palavrasV.length; i++) {
                        if (palavrasV[i] == texto) {
                              palavrasV.splice(i, 1);
                              flag = true;
                              // se a palavra estiver certa, temos de remover a imagem associada á palavra
                              if (flag = true) {
                                    var x;
                                    var texto2 = texto += ".png";
                                    var pal;
                                    for (var i = 0; i < imagensH.length; i++) {
                                          if (imagensH[i] != undefined) {
                                                x = imagensH[i].src.split("/");
                                          }
                                          if (x[x.length - 1] == texto2) {

                                                imagensH.splice(i, 1);

                                          }

                                    }

                              }
                        }
                  }
                  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                  atualizarImagem();
                  return flag;
            }

            timer = window.setInterval(addGrid, 1000 / 10);



            // FOGUETES DE FIM 

            var foguetes = [];
            // edit from here

            function particula(x, y, color, i) {
                  this.x = x;
                  this.y = y;
                  this.raio = 2;
                  this.color = color
                  this.ang = 360 / 50;
                  this.i = i;

                  this.desenha_particula = function () {
                        ctx3.beginPath();
                        ctx3.arc(this.x, this.y, this.raio, 0, 2 * Math.PI)
                        ctx3.fill();
                  }
                  this.actualiza_particula = function () {
                        this.x += Math.cos(this.ang * this.i) * Math.random() * 3;
                        this.y += Math.sin(this.ang * this.i) * Math.random() * 3;

                  }
            }

            function foguete() {
                  this.x = Math.round(Math.random() * canvas.width);
                  this.raio = 5;
                  this.y = canvas.height;
                  this.dy = -5;
                  this.g = 0.05;
                  this.color = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
                  this.particulas = [];
                  this.estado = false;
                  this.cont = 0;
                  this.desenha_foguete = function () {
                        this.cont += 1;
                        ctx3.beginPath();

                        ctx3.fillStyle = this.color;
                        ctx3.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
                        ctx3.fill();
                  }

                  this.actualiza_foguete = function () {
                        if (this.dy < 0) {
                              this.y += this.dy;
                              this.dy += this.g;

                        }
                        else if (this.estado == false) {

                              this.estado = true;
                        }

                        if (this.estado == true) {
                              for (var i = 0; i < 50; i++) {
                                    this.particulas.push(new particula(this.x, this.y, this.color, i));
                              }
                              this.estado = null;

                        }
                        if (this.estado == null) {
                              for (var i = 0; i < 50; i++) {
                                    this.particulas[i].desenha_particula();
                                    this.particulas[i].actualiza_particula();
                              }
                        }

                  }
            } // fim foguete
            function add_foguete() {
                  for (var i = 0; i < 1; i++) {
                        foguetes.push(new foguete());
                  }
            }
            add_foguete();
            
            function animar() {
                  //ctx.clearRect(0,0,canvas.width,canvas.height);
                  ctx3.fillStyle = "rgba(109,203,66,0.2)"
                  ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
                  ctx3.fill();



                  for (var i = 0; i < foguetes.length; i++) {

                        foguetes[i].desenha_foguete();
                        foguetes[i].actualiza_foguete();


                  }

                  if (foguetes.length == 5)
                        foguetes.splice(0, 1);

                  if (foguetes[foguetes.length - 1].cont == 100)
                        add_foguete()


            } // fim animar







      }

}

function novoJogo() {
      clearInterval(timer);
      clearInterval(timer2);
      load();
      document.getElementById("myCanvas").style.display = '';
      document.getElementById("myCanvas2").style.display = '';
      document.getElementById("myCanvas3").style.display = 'none';
      document.getElementById("creditos").style.display = 'none';
      document.getElementById("desistir").style.display = '';
      document.getElementById("novoJogo").style.display = 'none';
      document.getElementById("logo").style.display = 'none';


}
function creditos() {
      document.getElementById("inicio").style.display = '';
      document.getElementById("creditos").style.display = '';
      document.getElementById("myCanvas3").style.display = 'none';
      document.getElementById("myCanvas").style.display = 'none';
      document.getElementById("myCanvas2").style.display = 'none';
      document.getElementById("desistir").style.display = 'none';
      document.getElementById("novoJogo").style.display = 'none';
      document.getElementById("logo").style.display = 'none';



}
function firstPage() {

      document.getElementById("creditos").style.display = 'none';
      document.getElementById("myCanvas3").style.display = 'none';
      document.getElementById("myCanvas").style.display = 'none';
      document.getElementById("myCanvas2").style.display = 'none';
      document.getElementById("desistir").style.display = 'none';
      document.getElementById("logo").style.display = '';
      document.getElementById("inicio").style.display = 'none';

}