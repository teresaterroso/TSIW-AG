window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    var videoFacil = document.getElementById("videoFacil");
    var videoMedio = document.getElementById("videoMedio");
    var videoDificil = document.getElementById("videoDificil");
    if (canvas.getContext) {


        var ctx = canvas.getContext('2d');

        //SONS
        var wrong = new Audio('sound/wrong.mp3');
        wrong.loop = false;
        wrong.volume = 0.15;
        var correct = new Audio('sound/correct.mp3');
        correct.loop = false;
        correct.volume = 0.2;
        var multup = new Audio('sound/multup.mp3');
        multup.loop = false;
        multup.volume = 0.2;
        var multdown = new Audio('sound/multdown.mp3');
        multdown.loop = false;
        multdown.volume = 0.2;
        var intro = new Audio('sound/musica8bit.mp3');
        intro.loop = true;
        intro.volume = 0.15;

        //VIDEO VOLUME
        videoFacil.volume = 0.15;
        videoMedio.volume = 0.15;
        videoDificil.volume = 0.15;


        //IMAGENS
        var wrongImg = new Image();
        wrongImg.src = "img/wrong2.png";
        var sprite = new Image();
        sprite.src = "img/sprite.png";
        var errado = new Image();
        errado.src = "img/errado.png";
        var soundON = new Image();
        soundON.src = "img/soundON.png";
        var soundOFF = new Image();
        soundOFF.src = "img/soundOFF.png";

        //PONTOS
        var pontos = 0;
        var multiplicador = 1;
        var aumentaMultiplicador = 0;
        ctx.textBaseline = 'middle';
        ctx.font = "30px Lucida Console";

        //FALHA
        var localFalha = 0;
        var tempoFalha = 0;
        var fail = false;

        //SPRITE
        var frameIndex = 0;
        var spriteTime = 0;
        var spriteSpeed = 0;

        //LOGOTIPO
        var blink = true;
        var blinkTime = 0;
        var blinkAnimation = false;
        var numBlink = 0;

        var fingertap = ["F", "i", "n", "g", "e", "r", "T", "a", "p"];
        var numLetra = 0;
        var texto = "";
        var adicionar = true;

        //TECLAS
        var teclaID1 = 73;
        var teclaID2 = 74;
        var teclaID3 = 78;
        var teclaID4 = 32;
        var teclaNome1 = "I";
        var teclaNome2 = "J";
        var teclaNome3 = "N";
        var teclaNome4 = "|__|";
        var teclaMudar = 0;

        //GRADIENTE
        var rg = ctx.createLinearGradient(375, 100, 875, 100);
        rg.addColorStop(0.1, "purple");
        rg.addColorStop(0.2, "violet");
        rg.addColorStop(0.3, "pink");
        rg.addColorStop(0.4, "red");
        rg.addColorStop(0.5, "orange");
        rg.addColorStop(0.6, "yellow");
        rg.addColorStop(0.7, "lime");
        rg.addColorStop(0.8, "green");
        rg.addColorStop(0.9, "aqua");
        rg.addColorStop(1, "blue");

        //OUTROS
        var notas = new Array();
        var tempo;

        var velocidade = 0;
        var quantidade = 0;

        var leave = false;

        var sound = true;

        var dificuldade = "";


        //DESENHO DAS LINHAS PERCORRIDAS PELAS NOTAS
        function linhas() {

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.fillStyle = "lightblue";
            ctx.fillRect(0, 444, 1280, 69);
            ctx.moveTo(0, 444);
            ctx.lineTo(1280, 444);
            ctx.moveTo(0, 513);
            ctx.lineTo(1280, 513);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillRect(0, 513, 1280, 69);
            ctx.moveTo(0, 513);
            ctx.lineTo(1280, 513);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillRect(0, 582, 1280, 69);
            ctx.moveTo(0, 582);
            ctx.lineTo(1280, 582);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillRect(0, 651, 1280, 69);
            ctx.moveTo(0, 651);
            ctx.lineTo(1280, 651);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(1175, 444);
            ctx.lineTo(1175, 720);
            ctx.stroke();

            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.strokeRect(0, 444, 1280, 276);

        }

        //CRIACAO DO MENU INICIAL
        function menuInicial() {

            intro.play();

            ctx.textAlign = "center";
            ctx.lineWidth = 5;
            ctx.fillStyle = "rgb(32,32,32)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);



            ctx.strokeStyle = "white";
            ctx.fillStyle = "green";
            ctx.fillRect(513, 270, 255, 89);
            ctx.strokeRect(513, 270, 255, 89);
            ctx.fillStyle = "orange";
            ctx.fillRect(513, 391, 255, 89);
            ctx.strokeRect(513, 391, 255, 89);
            ctx.fillStyle = "red";
            ctx.fillRect(513, 511, 255, 89);
            ctx.strokeRect(513, 511, 255, 89);

            ctx.fillStyle = "white";
            ctx.font = "30px Lucida Console";
            ctx.fillText("Escolha uma dificuldade para começar:", canvas.width / 2, 210);
            ctx.fillText("Fácil", canvas.width / 2, 314);
            ctx.fillText("Médio", canvas.width / 2, 435);
            ctx.fillText("Difícil", canvas.width / 2, 555);


            ctx.fillStyle = rg;

            ctx.font = "italic bold 100px Century Gothic";
            ctx.fillText("FingerTap", canvas.width / 2, 100);

            ctx.lineWidth = 1;
            ctx.fillStyle = "black";
            ctx.strokeStyle = "white";
            ctx.fillRect(5, 665, 210, 50);
            ctx.strokeRect(5, 665, 210, 50);
            ctx.font = "20px Lucida Console";
            ctx.fillStyle = "white";

            ctx.fillText("Como jogar", 110, 690);

            if (blinkAnimation == false) {
                numBlink = 0;
                adicionar = true;
                numLetra = 0;
                texto = "";
                blinkAnimation = true;
                blinkTitle();
            }


            window.addEventListener('click', somIntro);
            window.addEventListener('click', escolhaDificuldade);
            window.addEventListener('click', comoJogarEvent);

        }

        //ANIMACOES DO TITULO
        function blinkTitle() {



            ctx.fillStyle = "rgb(32,32,32)";
            ctx.fillRect(0, 0, 1280, 170);

            if (sound == true) {
                ctx.drawImage(soundON, 1232, 0);
            }
            else {
                ctx.drawImage(soundOFF, 1232, 0);
            }


            if (numBlink == 3) {
                if (adicionar == true) {
                    texto += fingertap[numLetra];
                    adicionar = false;
                }

                ctx.fillStyle = rg;
                ctx.textAlign = "left";
                ctx.font = "italic bold 100px Century Gothic";
                ctx.fillText(texto, 396, 100);

                if (blinkTime == 15) {
                    blinkTime = 0;
                    numLetra++;
                    adicionar = true;
                }
                blinkTime++;

                if (numLetra == fingertap.length) {
                    numBlink = 0;
                    numLetra = 0;
                    texto = "";
                }

            }
            else {
                if (blink == true) {

                    ctx.fillStyle = rg;
                    ctx.textAlign = "left";
                    ctx.font = "italic bold 100px Century Gothic";
                    ctx.fillText("FingerTap", 396, 100);

                    if (blinkTime == 60) {
                        blink = false;
                        blinkTime = 0;
                    }

                }

                if (blink == false && blinkTime == 10) {
                    blink = true;
                    numBlink++;
                }
                blinkTime++;

            }


            if (blinkAnimation == true)
                window.requestAnimationFrame(blinkTitle);

        }

        //MENU COMO JOGAR
        function comoJogar() {


            ctx.textAlign = "center";
            ctx.fillStyle = "rgb(32,32,32)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "30px Lucida Console";
            ctx.fillStyle = "white";
            ctx.fillText("Como Jogar:", canvas.width / 2, 210);
            ctx.font = "20px Lucida Console";
            ctx.fillText("Carregue na tecla representada no quadrado", canvas.width / 2, 250);
            ctx.fillText("quando este esteja a passar na linha vertical", canvas.width / 2, 280);
            ctx.fillText("perto do final da pista.", canvas.width / 2, 310);
            ctx.fillText("|___| = Barra de Espaços", canvas.width / 2, 350);

            ctx.font = "30px Lucida Console";
            ctx.fillText("Teclas:", canvas.width / 2, 450);
            ctx.font = "20px Lucida Console";
            ctx.fillText("1º Linha = " + teclaNome1, canvas.width / 2, 490);
            ctx.fillText("2º Linha = " + teclaNome2, canvas.width / 2, 530);
            ctx.fillText("3º Linha = " + teclaNome3, canvas.width / 2, 570);
            ctx.fillText("4º Linha = " + teclaNome4, canvas.width / 2, 610);
            ctx.fillStyle = "black";
            ctx.fillRect(770, 475, 100, 30);
            ctx.fillRect(770, 515, 100, 30);
            ctx.fillRect(770, 555, 100, 30);
            ctx.fillRect(770, 595, 100, 30);
            ctx.fillRect(5, 665, 210, 50);
            ctx.strokeRect(5, 665, 210, 50);
            ctx.fillStyle = "white";
            ctx.fillText("MUDAR", 820, 490);
            ctx.fillText("MUDAR", 820, 530);
            ctx.fillText("MUDAR", 820, 570);
            ctx.fillText("MUDAR", 820, 610);
            ctx.fillText("Menu Principal", 110, 690);

            window.addEventListener('click', voltarMenu);
            window.addEventListener('click', mudarTeclaEvent);


        }

        //CRIACAO DAS NOTAS DO JOGO
        function iniciar(vel, quant) {
            if (dificuldade == "facil") {
                videoFacil.currentTime = 0;
                videoFacil.play();
            }
            else if (dificuldade == "medio") {
                videoMedio.currentTime = 0;
                videoMedio.play();
            }
            else if (dificuldade == "dificil") {
                videoDificil.currentTime = 0;
                videoDificil.play();
            }

            window.removeEventListener('click', somIntro);
            window.removeEventListener('click', comoJogarEvent);
            window.addEventListener('keydown', pressione);
            intro.currentTime = 0;

            pontos = 0;
            multiplicador = 1;
            aumentaMultiplicador = 0;
            fail = false;
            timer = 0;
            ctx.lineWidth = 3;
            leave = false;
            quantidade = quant;
            velocidade = vel;
            frameIndex = 0;
            spriteTime = 0;

            notas.length = 0;


            //VARIAVEIS PARA QUADRADO

            //TAMANHO
            var tamX = 59;
            var tamY = 59;


            var localY = [449, 518, 587, 656];
            var tempoIn = 0;

            for (var i = 0; i < quantidade; i++) {
                var posY = localY[Math.floor(Math.random() * localY.length)];
                var key = 0;
                switch (posY) {
                    case 449: key = teclaID1;
                        break;
                    case 518: key = teclaID2;
                        break;
                    case 587: key = teclaID3;
                        break;
                    case 656: key = teclaID4;
                        break;
                }
                tempoIn = tempoIn + (Math.floor((Math.random() * 100) + 40));
                notas.push(new Nota(5, posY, tempoIn, key, tamX, tamY));
            }

            window.addEventListener('click', sair);
            desenho();

        }

        //FUNCAO DO OBJETO NOTA
        function Nota(x, y, tInicial, tecla, tX, tY) {
            this.x = x;
            this.y = y;
            this.tInicial = tInicial;
            this.tecla = tecla;
            this.tX = tX;
            this.tY = tY;

            this.desenhaNota = function () {
                if (tInicial < timer) {
                    //FAZER OS QUADRADOS
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    ctx.fillRect(this.x, this.y, this.tX, this.tY);
                    ctx.fillStyle = "white";
                    ctx.textAlign = 'center';
                    ctx.font = "30px Verdana";
                    //VERIFICAR A LETRA A COLOCAR
                    switch (tecla) {
                        case teclaID1: ctx.fillText(teclaNome1, this.x + this.tX / 2, this.y + this.tY / 2);
                            break;
                        case teclaID2: ctx.fillText(teclaNome2, this.x + this.tX / 2, this.y + this.tY / 2);
                            break;
                        case teclaID3: ctx.fillText(teclaNome3, this.x + this.tX / 2, this.y + this.tY / 2);
                            break;
                        case teclaID4: ctx.fillText(teclaNome4, this.x + this.tX / 2, this.y + this.tY / 2);
                            break;
                    }

                }


            }

            this.atualizaNota = function (i) {
                //COLOCAR AS NOTAS NO TEMPO RESPETIVO
                if (tInicial <= timer) {
                    if (this.x >= 1175) {
                        wrong.play();
                        if (multiplicador > 1) {
                            multdown.play();
                        }
                        multiplicador = 1;
                        aumentaMultiplicador = 0;


                        //EXECUTAR CODIGO DE FALHA
                        localFalha = this.y;
                        fail = true;
                        falhou();
                    }

                    //SE SAIR FORA DO CANVAS
                    if (this.x >= canvas.width) {

                        //REMOVER NOTA DO ARRAY

                        notas.splice(i, 1);


                    }
                    else if (this.x < canvas.width) {
                        this.x += velocidade;

                    }


                }

            }
            this.press = function (evt, i) {

                if (evt.keyCode == tecla) {

                    //REMOVE DO ARRAY
                    notas.splice(i, 1);

                    //AUMENTA OS PONTOS
                    pontos = pontos + (1 * multiplicador);
                    aumentaMultiplicador++;
                    correct.play();
                    //AUMENTAR O MULTIPLICADOR
                    if (aumentaMultiplicador == 5) {
                        multiplicador++;
                        multup.play();
                        aumentaMultiplicador = 0;
                    }


                }

                else {
                    multiplicador = 1;
                    aumentaMultiplicador = 0;
                    multdown.play();
                }



            }


        }

        //REFRESH DO VIDEO DE ACORDO COM A DIFICULDADE
        function refreshVideo() {
            if (dificuldade == "facil") {
                var $videoFacil = videoFacil;
                if (!$videoFacil.paused && !$videoFacil.ended) {
                    ctx.drawImage($videoFacil, 0, 0);
                }
            }
            else if (dificuldade == "medio") {
                var $videoMedio = videoMedio;
                if (!$videoMedio.paused && !$videoMedio.ended) {
                    ctx.drawImage($videoMedio, 0, 0);
                }
            }
            else if (dificuldade == "dificil") {
                var $videoDificil = videoDificil;
                if (!$videoDificil.paused && !$videoDificil.ended) {
                    ctx.drawImage($videoDificil, 0, 0);
                }
            }


        }

        //REFRESH DO SPRITE
        function refreshSprite() {
            if (fail == false) {
                ctx.drawImage(sprite, frameIndex * 150, 0, 150, 109, 75, 320, 150, 109);
                ctx.drawImage(sprite, frameIndex * 150, 0, 150, 109, 1070, 320, 150, 109);
                spriteTime++;
                if (spriteTime == spriteSpeed) {
                    frameIndex++;
                    spriteTime = 0;
                }
                if (frameIndex == 8) {
                    frameIndex = 0;
                }
            } else {
                ctx.drawImage(errado, 75, 320);
                ctx.drawImage(errado, 1070, 320);
            }

        }

        //FUNCAO PRINCIPAL DE ANIMACAO DO JOGO
        function desenho() {

            if (leave == false) {
                linhas();

                timer = timer + (velocidade / 2);

                for (var i = 0; i < notas.length; i++) {
                    notas[i].desenhaNota();
                }

                for (var i = 0; i < notas.length; i++) {
                    notas[i].atualizaNota(i);
                }

                refreshVideo();
                refreshSprite();
                falhou();

                //ATUALIZAR OS PONTOS

                ctx.fillStyle = "black";
                ctx.fillRect(300, 380, 680, 64);
                ctx.fillStyle = "white";
                ctx.textAlign = 'left';
                ctx.font = "20px Lucida Console";
                ctx.fillText("Pontos: ", 400, 415);
                ctx.fillText("Multiplicador(" + aumentaMultiplicador + "/5): ", 660, 415);
                ctx.font = "30px Lucida Console";
                ctx.fillText(pontos, 500, 415);
                ctx.fillText(multiplicador + "x", 915, 415);
                ctx.fillStyle = "white";
                ctx.fillRect(640, 380, 1, 64);

                //BOTAO SAIR
                ctx.lineWidth = 1;
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, 150, 70);
                ctx.strokeRect(0, 0, 150, 70);
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText("SAIR", 75, 33);

                //QUANDO NAO HOUVER MAIS NOTAS
                if (notas.length == 0) {
                    leave = true;
                    gameOver();
                }


                window.requestAnimationFrame(desenho);
            }

        }

        //FALHA DE UMA TECLA
        function falhou() {
            if (fail == true) {
                //COLOCAR O X DURANTE 0.5s
                ctx.drawImage(wrongImg, 1200, localFalha);
                tempoFalha++;
                if (tempoFalha == 30) {
                    fail = false;
                    tempoFalha = 0;
                }
            }

        }

        //FIM DO JOGO
        function gameOver() {

            if (dificuldade == "facil") {
                videoFacil.pause();
            }
            else if (dificuldade == "medio") {
                videoMedio.pause();
            }
            else if (dificuldade == "dificil") {
                videoDificil.pause();
            }
            //ESCREVER GAME OVER
            ctx.fillStyle = "rgb(32,32,32)";
            ctx.strokeStyle = "white";
            ctx.fillRect(390, 170, 500, 350);
            ctx.strokeRect(390, 170, 500, 350);
            ctx.textAlign = 'center';
            ctx.fillStyle = "white";
            ctx.font = "70px Lucida Console";
            ctx.fillText("GAME OVER", 640, 222);
            //PONTUACAO
            ctx.font = "50px Lucida Console";
            ctx.fillText(pontos, 640, 352);
            ctx.font = "25px Lucida Console";
            ctx.fillText("Pontuação Final:", 640, 292);

            //BOTAO MENU INICIAL

            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.lineWidth = 5;
            ctx.fillRect(493, 400, 300, 90);
            ctx.strokeRect(493, 400, 300, 90);
            ctx.fillStyle = "white";
            ctx.fillText("MENU INICIAL", 640, 445);

            //ADICIONAR EVENTLISTENER PARA CLICK DO RATO NO RESET
            window.addEventListener('click', reset)

            window.removeEventListener('keydown', pressione);
        }


        //EVENTOS

        function reset(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            //VERIFICAR POSICAO DO CLICK
            if (x >= 493 && y >= 400 && x <= 793 && y <= 490) {

                if (dificuldade == "facil") {
                    videoFacil.pause();
                }
                else if (dificuldade == "medio") {
                    videoMedio.pause();
                }
                else if (dificuldade == "dificil") {
                    videoDificil.pause();
                }

                //REMOVER EVENTLISTENER
                window.removeEventListener('click', reset)
                //INICIAR
                menuInicial();


            }

        }

        function sair(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;


            //VERIFICAR POSICAO DO CLICK
            if (x >= 0 && y >= 0 && x <= 150 && y <= 70) {
                //REMOVER EVENTLISTENER
                window.removeEventListener('click', sair);
                window.removeEventListener('keydown', pressione);
                leave = true;

                if (dificuldade == "facil") {
                    videoFacil.pause();
                }
                else if (dificuldade == "medio") {
                    videoMedio.pause();
                }
                else if (dificuldade == "dificil") {
                    videoDificil.pause();
                }

                //INICIAR
                menuInicial();


            }
        }

        function escolhaDificuldade(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;



            if (x >= 513 && y >= 270 && x <= 768 && y <= 359) {
                dificuldade = "facil";
                spriteSpeed = 20;
                blinkAnimation = false;
                intro.pause();
                iniciar(3, 25);
                window.removeEventListener('click', escolhaDificuldade);
            }
            else if (x >= 513 && y >= 391 && x <= 768 && y <= 480) {
                dificuldade = "medio";
                spriteSpeed = 15;
                blinkAnimation = false;
                intro.pause();
                iniciar(5, 50);
                window.removeEventListener('click', escolhaDificuldade);

            }
            else if (x >= 513 && y >= 511 && x <= 768 && y <= 600) {
                dificuldade = "dificil";
                spriteSpeed = 10;
                blinkAnimation = false;
                intro.pause();
                iniciar(7, 75);
                window.removeEventListener('click', escolhaDificuldade);
            }
        }

        function pressione(evt) {
            //DETETAR PRESSIONE DO TECLADO
            for (var i = 0; i < notas.length; i++) {
                if (notas[i].x <= 1175 && notas[i].x + 59 >= 1175) {
                    notas[i].press(evt, i);
                }

            }

        }

        function somIntro(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            if (x >= 1232 && y >= 0 && x <= canvas.width && y <= 48) {
                if (intro.volume == 0.15) {
                    intro.volume = 0;
                    sound = false;
                }
                else if (intro.volume == 0) {
                    intro.volume = 0.15;
                    sound = true;
                }
            }
        }

        function voltarMenu(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            if (x >= 5 && y >= 665 && x <= 215 && y <= 715) {
                window.removeEventListener('click', voltarMenu);
                menuInicial();
            }
        }

        function mudarTecla(evt) {
            if (teclaMudar == 1) {

                teclaID1 = evt.keyCode;
                if (evt.keyCode == 32) {
                    teclaNome1 = "|__|";
                }
                else {
                    teclaNome1 = String.fromCharCode(evt.keyCode);
                }


            } else if (teclaMudar == 2) {

                teclaID2 = evt.keyCode;
                if (evt.keyCode == 32) {
                    teclaNome2 = "|__|";
                }
                else {
                    teclaNome2 = String.fromCharCode(evt.keyCode);
                }

            } else if (teclaMudar == 3) {

                teclaID3 = evt.keyCode;
                if (evt.keyCode == 32) {
                    teclaNome3 = "|__|";
                }
                else {
                    teclaNome3 = String.fromCharCode(evt.keyCode);
                }

            } else if (teclaMudar == 4) {

                teclaID4 = evt.keyCode;
                if (evt.keyCode == 32) {
                    teclaNome4 = "|__|";
                }
                else {
                    teclaNome4 = String.fromCharCode(evt.keyCode);
                }
                console.log(teclaNome1)

            }
            window.removeEventListener('keydown', mudarTecla);
            comoJogar();
        }

        function mudarTeclaEvent(e) {

            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;



            if (x >= 770 && y >= 475 && x <= 870 && y <= 505) {

                ctx.fillStyle = "black";
                ctx.fillRect(440, 350, 400, 70);
                ctx.font = "30px Lucida Console";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("Pressione uma tecla", canvas.width / 2, 385);
                teclaMudar = 1;
                window.removeEventListener('click', voltarMenu);
                window.removeEventListener('click', mudarTeclaEvent);
                window.addEventListener('keydown', mudarTecla);


            } else if (x >= 770 && y >= 515 && x <= 870 && y <= 545) {

                ctx.fillStyle = "black";
                ctx.fillRect(440, 350, 400, 70);
                ctx.font = "30px Lucida Console";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("Pressione uma tecla", canvas.width / 2, 385);
                teclaMudar = 2;
                window.removeEventListener('click', voltarMenu);
                window.removeEventListener('click', mudarTeclaEvent);
                window.addEventListener('keydown', mudarTecla);


            } else if (x >= 770 && y >= 555 && x <= 870 && y <= 585) {

                ctx.fillStyle = "black";
                ctx.fillRect(440, 350, 400, 70);
                ctx.font = "30px Lucida Console";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("Pressione uma tecla", canvas.width / 2, 385);
                teclaMudar = 3;
                window.removeEventListener('click', voltarMenu);
                window.removeEventListener('click', mudarTeclaEvent);
                window.addEventListener('keydown', mudarTecla);


            } else if (x >= 770 && y >= 595 && x <= 870 && y <= 625) {

                ctx.fillStyle = "black";
                ctx.fillRect(440, 350, 400, 70);
                ctx.font = "30px Lucida Console";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("Pressione uma tecla", canvas.width / 2, 385);
                teclaMudar = 4;
                window.removeEventListener('click', voltarMenu);
                window.removeEventListener('click', mudarTeclaEvent);
                window.addEventListener('keydown', mudarTecla);


            }

        }

        function comoJogarEvent(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            if (x >= 5 && y >= 665 && x <= 215 && y <= 715) {

                window.removeEventListener('click', escolhaDificuldade);
                window.removeEventListener('click', comoJogarEvent);
                comoJogar();
            }
        }


        menuInicial();




    }
}