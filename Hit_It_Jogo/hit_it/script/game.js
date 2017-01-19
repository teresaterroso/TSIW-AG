$(function () {

    /*****************************************/
    /*                  CONFIG               */
    /*****************************************/

    //verifica a origem do dispositivo para apresentar uma mensagem de incompatibilidade
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|IPAD/i.test(navigator.userAgent)) {
        $('body').empty(); //limpa o body
        $('body').css("background-color", "white"); //limpa a background
        $('body').append('<h1 class="text-center">Jogo disponível apenas para computador!</h1>'); //mensagem 
    } else {
        //variáveis de responsividade da página
        var pageWidth = screen.width * 0.78; //aplica ao tamanho da screen um valor fixo de ajuste para a largura
        var pageHeight = screen.height * 0.74; //aplica ao tamanho da screen um valor fixo de ajuste para a comprimento
        var buttonWidth = screen.width * 0.156 //aplica ao tamanho do botão um valor fixo de ajuste para a largura
        var buttonHeight = screen.height * 0.097 //aplica ao tamanho do botão um valor fixo de ajuste para a o comprimento
        var btnFontSize = (screen.width / screen.height) / 0.044; //aplica à fonte do botão um valor fixo de ajuste
        var tblFontSize = (screen.width / screen.height) / 0.035; //aplica à fonte da tabela um valor fixo de ajuste
        var lblFontSize = (screen.width / screen.height) / 0.059; //aplica à fonte da label um valor fixo de ajuste
        var sltFontSize = (screen.width / screen.height) / 0.098; //aplica à fonte do select um valor fixo de ajuste
        var selectHeight = screen.height * 0.046; //aplica ao tamanho da screen um valor fixo de ajuste para o comprimento do select
        var canvasZoom = screen.width * 0.052; //zoom a aplicar ao canvas(browser) para responsividade do jogo

        $('#body').css("background-image", "url('images/menu/background.png')"); //coloca background completo
        $('#body2').css("background-image", "url('images/menu/background_2.png')"); //coloca background completo
        $('body').css("background-size", pageWidth + "px" + " " + pageHeight + "px"); //altera o tamanho da background 
        $('.btn').css("width", buttonWidth + "px"); //altera a largura do botão
        $('.btn').css("height", buttonHeight + "px"); //altera o comprimento do botão
        $('.btn').css("font-size", btnFontSize + "px"); //altera a font do botão
        $('.label').css("font-size", sltFontSize + "px"); //altera a font da label
        $('select').css("width", buttonWidth + "px"); //altera a largura do select
        $('select').css("height", selectHeight + "px"); //altera o comprimento do select
        $('select').css("font-size", sltFontSize + "px"); //altera a font do select
        $('input').css("width", buttonWidth + "px"); //altera a largura do input
        $('input').css("height", selectHeight + "px"); //altera o comprimento do input
        $('input').css("font-size", sltFontSize + "px"); //altera a font do input
        $('#btn_jogar_2').css("height", selectHeight + "px"); //altera a largura do botão de jogar
        $('#btn_jogar_2').css("font-size", sltFontSize + "px"); //altera a font do botão de jogar
        $('#ajuda').css("font-size", btnFontSize * 1.5 + "px"); //altera a font do símbolo de ajuda
        $('.zoom').css('zoom', canvasZoom + "%"); //altera o zoom
        var pxContador = ($(window).width() - pageWidth) / 2; //posição inicial do contador de tempo
        $('#contador').css('left', pxContador); //coloca o contador de tempo no início do canvas 2
        $('#ajuda').css('left', $(window).width() - pxContador - 20); //coloca o símbolo de ajuda no fim do canvas 2
        $('.table th').css("font-size", btnFontSize / 2 + "px"); //altera a font da tabela de pontuações

        //bloqueia o enter/space para evitar bug (gerar números aleatórios)
        $('html').bind('keypress', function (e) { //enter
            if (e.keyCode == 13) {
                return false;
            }
        });
        $('html').bind('keyup', function (e) { //space
            if (e.keyCode == 32) {
                return false;
            }
        });
        $('html').bind('keydown', function (e) { //space
            if (e.keyCode == 32) {
                return false;
            }
        });

        //variáveis iniciais
        var nomeJogador; //nome do jogador
        var modo; //modo de jogo
        var nomeBoneco; //nome do boneco
        var dificuldade; //dificuldade do jogo
        var nomeDificuldade; //nome da dificuldade do jogo
        var pontuacoes = []; //array que guarda as pontuações

        //ao clicar no botão jogar da página index redireciona para a página index2
        $('#btn_jogar').click(function () {
            location.href = 'index2.html';
        });

        //restaurar para o array de pontuações, os dados da localStorage
        function restaurarLocalStorage() {
            pontuacoes = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var y = JSON.parse(localStorage.getItem(key));
                pontuacoes.push(y);
            }
        }
        if (localStorage.length != 0) {
            restaurarLocalStorage();
        }

        //ordena de forma decrescente pelo tempo o array de pontuações
        pontuacoes.sort(function (a, b) {
            return a.tempo - b.tempo
        })
        var estadoPontuacao = false; // verifica se contém pontuações (boolean)
        //função que cria a tabela no html das pontuações obtidas
        function mostrarPontuacoes() {
            if (pontuacoes.length > 0) {
                var str;
                str = "<table class='table text-center'>"; //classe da tabela (bootstrap)
                str += "<tr><th>Nome</th><th>Modo</th><th>Dificuldade</th><th>Tempo (segundos)</th></tr>"; //cabeçalho da tabela
                for (var i = 0; i < pontuacoes.length; i++) {
                    str += "<tr><td>" + pontuacoes[i]["nome"] + "</td><td>" + pontuacoes[i]["modo"] + "</td><td>" + pontuacoes[i]["dificuldade"] + "</td><td>" + pontuacoes[i]["tempo"] + "</td></tr>"; //dados das pontuações
                }
                str += "</table>";
                var tableReady = str; //guarda o texto de construção/código html
                var tableContainer = document.getElementById("div_tabela");
                tableContainer.innerHTML = tableReady; //cria na div 'div_tabela' a tabela das pontuações
            } else {
                estadoPontuacao = true;
                sweetAlert("Oops...", "Sem pontuações!", "error"); //mensagem de erro caso não tenha pontuações guardadas
            }
        }

        //ao clicar no botão pontuação
        $('#btn_pontuacao').click(function () {
            mostrarPontuacoes();
            if (estadoPontuacao == false) {
                $('#body').css("background-image", "url('images/menu/background_3.png')"); //coloca background completo //background sem logo hit it
                $('#div_botoes').empty(); //limpa a div que contém os botões
                $("#div_tabela").append("<div id='div_btn_menu'><button id='btn_menu' type='button' class='btn center-block'>MENU</button></br</div>") //cria um botão para voltar ao menu inicial
                $('.btn').css("width", buttonWidth + "px"); //altera a largura do botão 
                $('.btn').css("height", buttonHeight + "px"); //altera o comprimento do botão
                $('.btn').css("font-size", btnFontSize + "px"); //altera a font do botão
                //ao carregar no botão de menu volta à página index (inicial)
                $('#btn_menu').click(function () {
                    location.href = 'index.html';
                });
            }

        });

        //ao clicar no botão de créditos
        $('#btn_creditos').click(function () { //ao carregar no botão 'créditos' mostra os créditos do jogo
            swal("Hit It", "Criado por: André Gouveia & João Santos")
        });

        //ao carregar no botão jogar do menu secundário
        $("#btn_jogar_2").click(function () {
            if ($('#nomeJogador').val().length != 0) { //verifica se o nome do jogador foi preenchido
                nomeJogador = $('#nomeJogador').val(); //nome do jogador escrito no input 'nomeJogador'
                modo = parseInt($('#selectModo option:selected').val()); //modo de jogo selecionado
                nomeBoneco = $('#selectBoneco option:selected').val(); //boneco selecionado
                dificuldade = parseInt($('#selectDificuldade option:selected').val()); //modo de jogo selecionado
                nomeDificuldade = $("#selectDificuldade>option:selected").text() //nome do modo de jogo selecionado
                $("body").css('background-image', 'url("")'); //limpa a imagem do background;
                $("body").css('background-color', 'white'); //coloca a cor do background a branco;
                $("form").css('visibility', 'hidden'); //esconde o menu secundário
                $("#myCanvas").css('visibility', 'visible'); //ativa a visibilidade do canvas1
                $("#myCanvas2").css('visibility', 'visible'); //ativa a visibilidade do canvas2
                $("#ajuda").css('visibility', 'visible'); //ativa do símbolo ajuda

                /*****************************************/
                /*                  CANVAS               */
                /*****************************************/

                var canvas = document.getElementById('myCanvas'); //canvas 1
                var canvas2 = document.getElementById('myCanvas2'); //canvas 2
                if (canvas.getContext && canvas2.getContext) {
                    var ctx = canvas.getContext('2d');
                    var ctx2 = canvas2.getContext('2d');
                    //cor do background da página conforme boneco escolhido
                    var background;
                    switch (nomeBoneco) {
                        case "darth_vader":
                            $("body").css('background-color', 'black'); //cor do background
                            background = 'black';
                            break;
                        case "donald":
                            $("body").css('background-color', '#a3dff9'); //cor do background
                            background = '#a3dff9';
                            break;
                        case "elsa":
                            $("body").css('background-color', '#e2f2fc'); //cor do background
                            background = '#e2f2fc';
                            break;
                        case "minnie":
                            $("body").css('background-color', '#efb3b3'); //cor do background
                            background = '#efb3b3';
                            break;
                        case "superman":
                            $("body").css('background-color', '#192132'); //cor do background
                            background = '#192132';
                            break;
                    }
                    //var's do teclado
                    var rightKey = false; //seta do lado direito
                    var leftKey = false; //seta do lado esquerdo
                    var upKey = false; //seta para cima
                    var downKey = false; //seta para baixo
                    //var's do boneco
                    var dxBoneco = 50; //dimensão do boneco em x
                    var dyBoneco = 80; //dimensão do boneco em y
                    var pxBoneco = canvas.width / 2 - (dxBoneco / 2); //posição inicial x
                    var pyBoneco = canvas.height - dyBoneco; //posição inicial y
                    var pxSpriteBoneco = 0; //posição da sprite do boneco em x
                    var pySpriteBoneco = 0; //posição da sprite do boneco em y
                    //var's dos retângulos
                    var retangulos = []; //array dos retângulos
                    var numRect = 10; //número de retângulos -> limita os números do jogo
                    var pxrect = 150; //posição inicial do retângulo em x
                    var pyrect = 50; //posição inicial do retângulo em y
                    //var's dos números
                    var dxNum = 80; //dimensão do número em x
                    var dyNum = 115; //dimensão do número em y
                    var pxSpriteNum = 0; //posição da sprite do número em x
                    var pySpriteNum = 0; //posição da sprite do número em y
                    var pxArraySpriteNum = []; //guarda num array as posições em x do sprite dos números
                    for (var i = 0; i < numRect; i++) {
                        pxArraySpriteNum.push(pxSpriteNum);
                        pxSpriteNum += 80;
                    }
                    //funções do teclado
                    function ArrowPressed(evt) { //tecla pressionada
                        if (evt.keyCode == 39) { //seta do lado direito
                            rightKey = true;
                        }
                        if (evt.keyCode == 37) { //seta do lado esquerdo
                            leftKey = true;
                        }
                        if (evt.keyCode == 38) { //seta para cima
                            upKey = true;
                        }
                        if (evt.keyCode == 40) { //seta para baixo
                            downKey = true;
                        }
                    }

                    function ArrowReleased(evt) { //tecla libertada
                        if (evt.keyCode == 39) { //seta do lado direito
                            //coloca a sprite na posição default
                            pxSpriteBoneco = 0;
                            pySpriteBoneco = 0;
                            rightKey = false;
                        }
                        if (evt.keyCode == 37) { //seta do lado esquerdo
                            //coloca a sprite na posição default
                            pxSpriteBoneco = 0;
                            pySpriteBoneco = 0;
                            leftKey = false;
                        }
                        if (evt.keyCode == 38) { //seta para cima
                            //coloca a sprite na posição default
                            pxSpriteBoneco = 0;
                            pySpriteBoneco = 0;
                            upKey = false;
                        }
                        if (evt.keyCode == 40) { //seta para baixo
                            //coloca a sprite na posição default
                            pxSpriteBoneco = 0;
                            pySpriteBoneco = 0;
                            downKey = false;
                        }
                    }
                    //eventos tecla pressionada e libertada
                    window.addEventListener('keydown', ArrowPressed);
                    window.addEventListener('keyup', ArrowReleased);
                    //definição do objeto retângulo 
                    function Retangulo(pxrect, pyrect, dx, dy, cor, id) {
                        this.pxrect = pxrect; //posição inicial em x
                        this.pyrect = pyrect; //posição inicial em y
                        this.dx = dx; //largura
                        this.dy = dy; //comprimento
                        this.cor = cor; //cor do retangulo
                        this.id = id; //id do retangulo
                        this.desenha = true; //boolean para verificar posteriormente se deve desenhar o retângulo
                        //método para desenhar os retangulos com imagens (recurso a sprites utilizando o drawImage)
                        this.desenhaRetangulo = function (pxSpriteNum) {
                            if (this.desenha) {
                                ctx.fillStyle = this.cor; //especifica a cor
                                ctx.fillRect(this.pxrect, this.pyrect, this.dx, this.dy, this.id); //desenha o retângulo
                                ctx.drawImage(imgNumeros[this.id - 1], pxSpriteNum, pySpriteNum, dxNum, dyNum, this.pxrect, this.pyrect, dxNum, dyNum); //método de desenhar a imagem dos números (recurso a sprite)
                            }
                        }
                    }
                    //imagem do boneco
                    var imgBoneco = new Image();
                    imgBoneco.src = 'images/bonecos/' + nomeBoneco + '/spritesheet_boneco.png'; //url da sprite do boneco escolhido
                    $("#myCanvas").css('background-image', "url('images/bonecos/" + nomeBoneco + "/background.png')"); //url do background associado ao boneco escolhido
                    //imagem dos números
                    var imgNumeros = []; //array que guarda as imagens dos números
                    //guarda no array o src das imagens de acordo com o boneco selecionado
                    for (var i = 0; i < numRect; i++) {
                        imgNumeros[i] = new Image();
                        imgNumeros[i].src = 'images/bonecos/' + nomeBoneco + '/spritesheet_numeros.png'; //url da sprite dos números do boneco escolhido
                    }
                    //gerar aleatóriamente os id's de forma a evitar números repetidos
                    var id;
                    //obtém um valor aleatório do 1 ao 10 sem repetição
                    function getID() {
                        var max = 10;
                        id = [];
                        for (var i = 0; i < max; i++) {
                            var temp = Math.floor(Math.random() * max) + 1
                            if (id.indexOf(temp) == -1) {
                                id.push(temp);
                            } else {
                                i--;
                            }
                        }
                    }
                    getID();
                    //adição dos retângulos em posições fixas, não havendo sobreposição entre retângulos e permitindo id's aleatórios
                    for (var i = 1; i <= numRect; i++) {
                        if (i < 4) {
                            retangulos.push(new Retangulo(pxrect, pyrect, dxNum, dyNum, 'transparent', id[i - 1]));
                            pxrect += 550;
                        } else if (i < 7) {
                            pxrect += 400;
                            pyrect = 300;
                            if (i == 4) {
                                pxrect = 300;
                            }
                            retangulos.push(new Retangulo(pxrect, pyrect, dxNum, dyNum, 'transparent', id[i - 1]));
                        } else if (i < 11) {
                            pxrect += 350;
                            pyrect = 550;
                            if (i == 7) {
                                pxrect = 180;
                            }
                            retangulos.push(new Retangulo(pxrect, pyrect, dxNum, dyNum, 'transparent', id[i - 1]));
                        }
                    }
                    //variáveis de verificação/contadoras no modo de jogo (pares, impares, crescente e decrescente) para guardar iterações
                    var arrayCont = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var contCerto = 0;
                    var contCerto2 = numRect + 1;
                    var contCertoCheck = 0;
                    //variáveis de verificação de vida (game over)
                    var contErrado = 0;
                    var contErradoCheck = 0;
                    //função de bloqueio/repulsa do boneco (efeito nas colisões)
                    function bloqueioBoneco() {
                        if (upKey) {
                            upKey = false;
                            pyBoneco += 20;
                        }
                        if (downKey) {
                            downKey = false;
                            pyBoneco -= 20;
                        }
                        if (rightKey) {
                            rightKey = false;
                            pxBoneco -= 20;
                        }
                        if (leftKey) {
                            leftKey = false;
                            pxBoneco += 20;
                        }
                        if (upKey && rightKey) {
                            upKey = false;
                            rightKey = false;
                            pxBoneco -= 20;
                            pyBoneco += 20;
                        }
                        if (upKey && leftKey) {
                            upKey = false;
                            leftKey = false;
                            pxBoneco += 20;
                            pyBoneco += 20;
                        }
                        if (downKey && leftKey) {
                            downKey = false;
                            leftKey = false;
                            pxBoneco += 20;
                            pyBoneco -= 20;
                        }
                        if (downKey && rightKey) {
                            downKey = false;
                            rightKey = false;
                            pxBoneco -= 20;
                            pyBoneco -= 20;
                        }
                    }
                    //alerta de número errado
                    function msgErrado() {
                        swal({
                            title: "Número errado!",
                            timer: 1000,
                            showConfirmButton: false,
                            type: "error"
                        });
                        bloqueioBoneco();
                    }
                    //alerta de parabéns ao ganhar o jogo
                    function msgParabens() {
                        swal({
                            title: "Ganhaste!",
                            type: "success",
                            timer: 3000,
                            showConfirmButton: false
                        });
                        bloqueioBoneco();
                    }
                    //alerta de game over ao perder o jogo
                    function msgPerdeu() {
                        swal({
                            title: "Perdeste!",
                            type: "error",
                            timer: 3000,
                            showConfirmButton: false
                        });
                        bloqueioBoneco();
                    }
                    //colocar os retangulos corretos num canvas abaixo (tipo scoreboard)
                    var scoreboard = []; //array temporário para iterar na função 'desenharScoreboard'
                    var pxScoreboard; //posição inicial em x retângulo com o número correto
                    var pyScoreboard = 0; //posição inicial em y retângulo com o número correto
                    if (modo == 1 || modo == 2) { //se escolher modo 1 ou 2 (pares ou impares) ajusta os 5 números ao canvas (alinhar)
                        pxScoreboard = 550; //posição inicial em x se for o modo 1 ou 2 (5 números)
                    } else if (modo == 3 || modo == 4) { //se escolher modo 3 ou 4 (crescente ou decrescente) ajusta os 10 números ao canvas (alinhar)
                        pxScoreboard = 350; //posição inicial em x se for o modo 3 ou 4 (10 números)
                    }
                    var arrayNumId = []; //array que guarda os valores de 1 a 10 (servirá para fazer o refresh dos números na dificuldade 'hardcore' e 'extreme hardcore)
                    for (i = 1; i <= numRect; i++) {
                        arrayNumId.push(i);
                    }
                    //função shuffle que baralha as posições do array definido
                    function shuffle(array) {
                        var j, x, i;
                        for (i = array.length; i; i--) {
                            j = Math.floor(Math.random() * i);
                            x = array[i - 1];
                            array[i - 1] = array[j];
                            array[j] = x;
                        }
                    }
                    //desenha a scoreboard num 2º canvas
                    function desenharScoreboard() {
                        for (i = 0; i < scoreboard.length; i++) {
                            ctx2.fillStyle = 'transparent'; //cor do retângulo transparente
                            ctx2.fillRect(pxScoreboard, pyScoreboard, dxNum, dyNum); //desenha o retângulo da scoreboard
                            ctx2.drawImage(imgNumeros[scoreboard[i] - 1], pxArraySpriteNum[scoreboard[i] - 1], pySpriteNum, dxNum, dyNum, pxScoreboard, pyScoreboard, dxNum, dyNum); //desenha a imagem do(s) número(s) acertado(s) anteriormente
                            var index = arrayNumId.indexOf(scoreboard[i]); //procura o valor que vai para a scoreboard
                            arrayNumId.splice(index, 1); //remove do array que contém os números o valor que vai para a scoreboard
                            scoreboard.splice(i, 1); //remove do array temporário a posição atual de iteração
                            pxScoreboard += 80; //incrementa o valor 80 à váriável de posição inicial em x
                        }
                    }
                    //imagem do coração (vidas)
                    var pxArrayCoracoes = []; //array que contém as posições em x dos corações
                    var coracao = new Image();
                    coracao.src = 'images/vidas/heart.png'; //url do coração (vida)
                    pxCoracao = 0; //posição inicial em x do coração
                    pyCoracao = 0; //posição inicial em y do coração
                    dxCoracao = 25; //largura do coração
                    dyCoracao = 25; //comprimento do coração
                    numVidas = dificuldade; //o número de vidas é igual ao valor da dificuldade (definido no html - value)
                    var desenha = true; //boolean para verificar se deve desenhar as vidas
                    //adiciona ao array das posições em x, o valor de px incrementando 30 ao mesmo, a cada interação
                    for (i = 0; i < 5; i++) {
                        pxArrayCoracoes.push(pxCoracao);
                        pxCoracao += 30;
                    }
                    //desenha no 2º canvas as vidas
                    function desenharVidas(num) {
                        for (i = 0; i < num; i++) {
                            ctx2.fillStyle = 'transparent';
                            ctx2.fillRect(pxArrayCoracoes[i], pyCoracao, dxCoracao, dyCoracao); //desenha o retângulo que contém a vida
                            ctx2.drawImage(coracao, pxArrayCoracoes[i], pyCoracao); //desenha as vidas com recurso a sprite
                        }
                    }
                    //cria um retângulo da cor do background, para limpar o coração
                    function limparVidas(num) {
                        for (i = 0; i < numVidas; i++) {
                            ctx2.fillStyle = background; //cor do background
                            ctx2.fillRect(pxArrayCoracoes[numVidas - num], pyCoracao, (dxCoracao + numVidas) * num, dyCoracao); //desenha o retângulo
                        }
                    }
                    //ajuda
                    var nomeModo; //nome do modo de jogo
                    var msgAjuda; //mensagem da pista
                    //associação do modo de jogo escolhido ao seu nome e à ajuda (mensagem)
                    switch (modo) {
                        case 1:
                            nomeModo = 'Números Pares';
                            msgAjuda = 'Escolhe os números pares entre 1 e 10';
                            break;
                        case 2:
                            nomeModo = 'Números Ímpares';
                            msgAjuda = 'Escolhe os números ímpares entre 1 e 10';
                            break;
                        case 3:
                            nomeModo = 'Números Crescentes';
                            msgAjuda = 'Ordena os números de forma crescente de 1 a 10';
                            break;
                        case 4:
                            nomeModo = 'Números Decrescentes';
                            msgAjuda = 'Ordena os números de forma decrescente de 10 a 1';
                            break;
                    }
                    //alerta com o nome do modo escolhido e a mensagem relativa à ajuda
                    $("#ajuda").hover(function () {
                        swal(nomeModo, msgAjuda);
                    });

                    //função que movimenta os números para a direita e esquerda (efeito nas dificuldades 'média', 'difícil', 'hardcore' e 'extreme hardcore')
                    function movimentoNum(dificuldade) {
                        for (var i = 0; i < retangulos.length; i++) {
                            if (dificuldade == 3) {
                                if (dir) {
                                    retangulos[i].pxrect++;
                                } else {
                                    retangulos[i].pxrect--;
                                }
                            } else if (dificuldade == 1 || dificuldade == 2) {
                                if (dir) {
                                    retangulos[i].pxrect += 7;
                                } else {
                                    retangulos[i].pxrect -= 7;
                                }
                            }
                        }
                    }
                    //tempo (contador)
                    var timerVar = setInterval(countTimer, 1000);
                    var totalSeconds = 1;

                    function countTimer() {
                        $('#contador').text(totalSeconds);
                        ++totalSeconds;
                    }
                    countTimer();
                    //adiciona ao array os dados da pontuação do jogo (nome, modo, dificuldade e tempo)
                    function gravarPontuacao() {
                        pontuacoes.push({
                            nome: nomeJogador,
                            modo: nomeModo,
                            dificuldade: nomeDificuldade,
                            tempo: totalSeconds
                        });
                        clearInterval(timerVar); //limpa o interval
                        $('#contador').text(""); //limpa o contador
                    }
                    //grava o array das pontuações no localStorage
                    function gravarLocalStorage() {
                        // Check browser support
                        if (typeof (Storage) !== "undefined") {
                            // Store
                            for (var i = 0; i < pontuacoes.length; i++) {
                                localStorage.setItem(i.toString(), JSON.stringify(pontuacoes[i]));
                            }
                        } else {
                            sweetAlert("Error", "Sorry, your browser does not support Web Storage...", "error");
                        }
                    }

                    /*****************************************/
                    /*                 ANIMAÇÃO              */
                    /*****************************************/

                    var nFrame = 0; //nframe para movimentar os números
                    var nFrameNumRandom = 0; //nframe para mudar números
                    var dir = true; //boolean para garantir mudança de direção
                    function Boneco() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa o canvas
                        ctx.drawImage(imgBoneco, pxSpriteBoneco, pySpriteBoneco, dxBoneco, dyBoneco, pxBoneco, pyBoneco, dxBoneco, dyBoneco); //desenha o boneco (recurso a sprite)
                        if (desenha) { //verifica se deve desenhar as vidas (caso chegue ao game over, não desenha)
                            desenharVidas(numVidas); //desenha as vidas (corações)
                            limparVidas(contErrado); //limpar as vidas (corações)
                        }
                        //desenha os números (recurso a sprite)
                        for (var i = 0; i < retangulos.length; i++) {
                            retangulos[i].desenhaRetangulo(pxArraySpriteNum[retangulos[i].id - 1]);
                        }
                        if (dificuldade == 3) { //efeitos para a dificuldade 'média'
                            nFrame++;
                            if (nFrame % 100 == 0) {
                                dir = !dir;
                            }
                            movimentoNum(dificuldade); //movimenta os números para a direita e esquerda
                        } else if (nomeDificuldade == 'Hardcore' || nomeDificuldade == 'Extreme Hardcore') { //efeitos para a dificuldade 'hardcore' e 'extreme hardcore'
                            nFrame++;
                            nFrameNumRandom++;
                            if (nFrame % 15 == 0) {
                                dir = !dir;
                            }
                            var valorFrames;
                            if (nomeDificuldade == 'Hardcore') {
                                valorFrames = 300; //mudança de números rápida
                            } else if (nomeDificuldade == 'Extreme Hardcore') {
                                valorFrames = 100; //mudança de números mais rápida
                            }
                            movimentoNum(dificuldade); //movimenta os números para a direita e esquerda
                            shuffle(arrayNumId); //baralha o arrayNumId (que contém os números em jogo)
                            var pRectTemp = []; //array que guarda as posições do array 'retangulos' para iterar sobre elas, com o objetivo de atualizar o número
                            if (nFrameNumRandom == valorFrames) { //efetua a mudança de números de x em x frames definidas pela dificuldade
                                for (var i = 0; i < retangulos.length; i++) {
                                    if (retangulos[i].desenha == true) { //verifica os retângulos em jogo
                                        retangulos[i].desenha = false; //apaga os retângulos em jogo
                                        pRectTemp.push(i); //guarda as posições dos retângulos em jogo do array 'retangulos'
                                        for (var j = 0; j < pRectTemp.length; j++) {
                                            retangulos[pRectTemp[j]].id = arrayNumId[j]; //modifica o id dos retângulos em jogo de acordo com o shuffle efetuado (mudar o id, muda o número no jogo)
                                            retangulos[pRectTemp[j]].desenha = true; //volta a desenhar o retãngulo com o número diferente, na mesma posição
                                        }
                                    }
                                }
                                nFrameNumRandom = 0; //retoma as frames a 0
                            }
                        } else if (dificuldade == 2) { //efeitos para a dificuldade 'difícil'
                            nFrame++;
                            if (nFrame % 15 == 0) {
                                dir = !dir;
                            }
                            movimentoNum(dificuldade); //movimenta os números para a direita e esquerda
                        }
                        var boneco = new Retangulo(pxBoneco, pyBoneco, dxBoneco, dyBoneco, 'transparent'); //varíavel do boneco (retângulo) para ajustar colisões com os números
                        //atualiza posição do boneco e respetiva posição da sprite consoante a tecla pressionada
                        if (upKey && pyBoneco > 0) {
                            pxSpriteBoneco = 50;
                            pySpriteBoneco = 0;
                            pyBoneco -= 5;
                        }
                        if (downKey && pyBoneco < canvas.height - dyBoneco) {
                            pxSpriteBoneco = 100;
                            pySpriteBoneco = 0;
                            pyBoneco += 5;
                        }
                        if (leftKey && pxBoneco > 0) {
                            pxSpriteBoneco = 150;
                            pxBoneco -= 5;
                        }
                        if (rightKey && pxBoneco < canvas.width - dxBoneco) {
                            pxSpriteBoneco = 200;
                            pxBoneco += 5;
                        }
                        if (upKey && rightKey) {
                            pxSpriteBoneco = 0;
                            pySpriteBoneco = 80;
                        }
                        if (upKey && leftKey) {
                            pxSpriteBoneco = 50;
                            pySpriteBoneco = 80;
                        }
                        if (downKey && leftKey) {
                            pxSpriteBoneco = 100;
                            pySpriteBoneco = 80;
                        }
                        if (downKey && rightKey) {
                            pxSpriteBoneco = 150;
                            pySpriteBoneco = 80;
                        }
                        //colisões do boneco (retângulo) com os números (retângulos)
                        for (i = 0; i < retangulos.length; i++) {
                            if (pxBoneco + dxBoneco < retangulos[i].pxrect) {
                                retangulos[i].cor = 'transparent'; //coloca a cor do retângulo a transparente
                            } else if (pxBoneco > retangulos[i].pxrect + retangulos[i].dx) {
                                retangulos[i].cor = 'transparent'; //coloca a cor do retângulo a transparente
                            } else if (pyBoneco + dyBoneco < retangulos[i].pyrect) {
                                retangulos[i].cor = 'transparent'; //coloca a cor do retângulo a transparente
                            } else if (pyBoneco > retangulos[i].pyrect + retangulos[i].dy) {
                                retangulos[i].cor = 'transparent'; //coloca a cor do retângulo a transparente
                            } else {
                                //modos de jogo
                                switch (modo) {
                                    case 1: //números pares
                                        //se for par apaga o número e desenha esse número na scoreboard
                                        if (retangulos[i].id % 2 == 0) {
                                            if (arrayCont[i] == 0) {
                                                retangulos[i].desenha = false;
                                                scoreboard.push(retangulos[i].id);
                                                desenharScoreboard();
                                                contCertoCheck = 1;
                                                arrayCont.splice(i, 1, 1);
                                            }
                                            //se não for par, aparece o 'sweetalert' criado na função 'msgErrado'
                                        } else if (retangulos[i].id % 2 != 0) {
                                            contErradoCheck = 1;
                                            msgErrado(); //'sweetalert'
                                        }
                                        contCerto += contCertoCheck;
                                        contCertoCheck = 0;
                                        contErrado += contErradoCheck;
                                        contErradoCheck = 0;
                                        //se atingir os 5 números acertados acaba o jogo, utilizando o 'sweetalert' criado na função 'msgParabens' e faz refresh da página
                                        if (contCerto == 5) {
                                            contCerto = 0;
                                            gravarPontuacao(); //coloca os dados (nome, modo e tempo) num array 
                                            gravarLocalStorage(); //grava o array na localStorage
                                            msgParabens(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        //se atingir o nº de vidas indicado na dificuldade acaba o jogo, utilizando o 'sweetalert' criado na função 'msgPerdeu' e faz refresh da página
                                        else if (contErrado == numVidas) {
                                            desenha = false;
                                            contErrado = 0;
                                            msgPerdeu(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        break;
                                    case 2: // números impares
                                        //se for ímpar apaga o número e desenha esse número na scoreboard
                                        if (retangulos[i].id % 2 != 0) {
                                            if (arrayCont[i] == 0) {
                                                retangulos[i].desenha = false;
                                                scoreboard.push(retangulos[i].id);
                                                desenharScoreboard();
                                                contCertoCheck = 1;
                                                arrayCont.splice(i, 1, 1);
                                            }
                                            //se não for ímpar, aparece o 'sweetalert' criado na função 'msgErrado'
                                        } else if (retangulos[i].id % 2 == 0) {
                                            contErradoCheck = 1;
                                            msgErrado(); //'sweetalert'
                                        }
                                        contCerto += contCertoCheck;
                                        contCertoCheck = 0;
                                        contErrado += contErradoCheck;
                                        contErradoCheck = 0;
                                        //se atingir os 5 números acertados acaba o jogo, utilizando o 'sweetalert' criado na função 'msgParabens' e faz refresh da página
                                        if (contCerto == 5) {
                                            contCerto = 0;
                                            gravarPontuacao(); //coloca os dados (nome, modo e tempo) num array 
                                            gravarLocalStorage(); //grava o array na localStorage
                                            msgParabens(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        //se atingir o nº de vidas indicado na dificuldade acaba o jogo, utilizando o 'sweetalert' criado na função 'msgPerdeu' e faz refresh da página
                                        else if (contErrado == numVidas) {
                                            desenha = false;
                                            contErrado = 0;
                                            msgPerdeu(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        break;
                                    case 3: //números crescentes
                                        //se acertar no número crescente apaga o número e desenha esse número na scoreboard
                                        if (retangulos[i].id - 1 == contCerto) {
                                            if (arrayCont[i] == 0) {
                                                retangulos[i].desenha = false;
                                                scoreboard.push(retangulos[i].id);
                                                desenharScoreboard();
                                                contCertoCheck = 1;
                                                arrayCont.splice(i, 1, 1);
                                            }
                                            //se não acertar no número crescente, aparece o 'sweetalert' criado na função 'msgErrado'
                                        } else if (retangulos[i].id - 1 > contCerto) {
                                            contErradoCheck = 1;
                                            msgErrado(); //'sweetalert'
                                        }
                                        contCerto += contCertoCheck;
                                        contCertoCheck = 0;
                                        contErrado += contErradoCheck;
                                        contErradoCheck = 0;
                                        //se atingir os 10 números acertados acaba o jogo, utilizando o 'sweetalert' criado na função 'msgParabens' e faz refresh da página
                                        if (contCerto == 10) {
                                            contCerto = 0;
                                            gravarPontuacao(); //coloca os dados (nome, modo e tempo) num array 
                                            gravarLocalStorage(); //grava o array na localStorage
                                            msgParabens(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        //se atingir o nº de vidas indicado na dificuldade acaba o jogo, utilizando o 'sweetalert' criado na função 'msgPerdeu' e faz refresh da página
                                        else if (contErrado == numVidas) {
                                            desenha = false;
                                            contErrado = 0;
                                            msgPerdeu(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        break;
                                    case 4: //números decrescentes
                                        //se acertar no número decrescente apaga o número e desenha esse número na scoreboard
                                        if (retangulos[i].id + 1 == contCerto2) {
                                            if (arrayCont[i] == 0) {
                                                //apagar numero
                                                retangulos[i].desenha = false;
                                                scoreboard.push(retangulos[i].id);
                                                desenharScoreboard();
                                                contCertoCheck = -1;
                                                arrayCont.splice(i, 1, 1);
                                            }
                                            //se não acertar no número decrescente, aparece o 'sweetalert' criado na função 'msgErrado'
                                        } else if (retangulos[i].id + 1 < contCerto2) {
                                            contErradoCheck = 1;
                                            msgErrado(); //'sweetalert'
                                        }
                                        contCerto2 += contCertoCheck;
                                        contCertoCheck = 0;
                                        contErrado += contErradoCheck;
                                        contErradoCheck = 0;
                                        //se atingir os 10 números acertados acaba o jogo, utilizando o 'sweetalert' criado na função 'msgParabens' e faz refresh da página
                                        if (contCerto2 == 1) {
                                            contCerto2 = 11;
                                            gravarPontuacao(); //coloca os dados (nome, modo e tempo) num array 
                                            gravarLocalStorage(); //grava o array na localStorage
                                            msgParabens(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        //se atingir o nº de vidas indicado na dificuldade acaba o jogo, utilizando o 'sweetalert' criado na função 'msgPerdeu' e faz refresh da página
                                        else if (contErrado == numVidas) {
                                            desenha = false;
                                            contErrado = 0;
                                            msgPerdeu(); //'sweetalert'
                                            window.setTimeout("location.href='index.html'", 2000); //volta ao menu principal
                                        }
                                        break;
                                }
                            }
                        }
                        //nova frame
                        window.requestAnimationFrame(Boneco);
                    }
                    Boneco();
                }
            } else { //caso o nome do jogador não seja inserido aparece uma 'sweetalert' a informar o jogador
                swal({
                        title: "Insira um nome!",
                        timer: 1000,
                        showConfirmButton: false,
                        type: "error"
                    },
                    function () {
                        location.reload(); //refresh após fechar a 'sweetalert'
                    });
            }
        });
    }
});