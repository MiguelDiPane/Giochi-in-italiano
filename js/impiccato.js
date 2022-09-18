class Game{
    //Metodos
    startGame(){
        this.vidas = 6;
        this.letrasUsadas = [];
        //Obtener palabra aleatoria
        this.idWord = this.getRandomInt(dictB2.length);
        this.word = dictB2[this.idWord]['word'];
        this.wordSinAcento = this.word.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        this.definition = dictB2[this.idWord]['definition1'].split('|')[0];
        
        console.log(this.word)
        console.log(this.wordSinAcento)
        
        //Cantidad de guiones
        this.cantGuiones = this.word.length; 
        this.controlExactas = [];

        //Dibujar guiones y inicializar control de exactas
        for(let i=0;i<this.cantGuiones;i++){
            $('#palabra').append(`<h1 type="text" id="${i}">_</h1>`);
            this.controlExactas.push(false);
        }

        //Dibujar persona de marco
        this.drawShadowPerson();
    }

    verifyLetter(letra){
        //Verificar que no he usado la letra
        if(!this.letrasUsadas.includes(letra)){
            //Guardar como letra usada
            let msj = `<h5>Hai usato le lettere: </h5>`;
            this.letrasUsadas.push(letra);
            for(let i=0;i<this.letrasUsadas.length;i++){
                msj += `<span>${this.letrasUsadas[i]}</span>`;
            }            
            $('#letrasUsadas').html(msj);

            //Verificar letra
            if(this.wordSinAcento.includes(letra)){
                //Reproducir sonido letra correcta
                audioCorrecta.play();

                //Buscar todas las apariciones de la letra
                let indices=[];
                let idx = this.wordSinAcento.indexOf(letra);
                while(idx != -1){
                    //Busca la siguiente una posicion despues
                    indices.push(idx);
                    idx = this.wordSinAcento.indexOf(letra,idx+1);
                }

                //Escribir letras en los guiones correspondientes
                for(let i=0;i<indices.length;i++){
                    //con this.word[indices[i]] pone la letra aunque tenga acento
                    $(`#${indices[i]}`).html(this.word[indices[i]]);
                }
            }
            else{
                //Reproducir sonido letra incorrecta
                audioIncorrecta.play();

                //No se encontro la letra, se resta una vida
                let canvas = document.getElementById("canvas");
                if (canvas.getContext("2d")) { // Check HTML5 canvas support
                    let context = canvas.getContext("2d");
            
                    //Configuracion del monigote fantasmas
                    context.strokeStyle = 'red';
                    context.fillStyle = "red";
                    context.lineWidth = 2;
                
                    //Draw body part
                    switch (this.vidas) {
                        case 1:
                            this.drawLeg(context,'right');
                            break;
                        case 2:
                            this.drawLeg(context,'left');
                            break;   
                        case 3:
                            this.drawArm(context,'right');
                            break;
                        case 4:
                            this.drawArm(context,'left');
                            break;
                        case 5:
                            this.drawBody(context);
                            break;
                        case 6:
                            this.drawHead(context);
                            break;                
                        default:
                            break;
                    }
                }
                this.vidas--;
            }
        }
        else{
            //Ya uso la letra, mostrar advertencia
            $("input").addClass('background-warning');
        }
    }

    verifyWord(){
        //Verificar si perdio o adivino todas las letras
        let i=0;
        let esta = true;
        let end = false;
        while(i<this.word.length && esta){
            esta = this.letrasUsadas.includes(this.wordSinAcento[i]);
            i++;
        }
        if(esta==true || this.vidas<=0){
            let mensajeFinal = esta==true ? 'Hai vinto!' : 'Hai perso!';
            this.endGame(mensajeFinal);
            end = true;
        }
        return end;
    }

    endGame(mensajeFinal){
        $('#palabraFinal').html(this.word);
        $('#definicion').html(this.definition);
        let msjText = $('#mensajeFinal');
        let clase = mensajeFinal.includes('vinto') ? 'text-success' : 'text-danger';
        msjText.html(mensajeFinal);
        msjText.addClass(clase)
    }

    /*Metodos auxiliares*/
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    drawHead(context){
        let center = this.getCenterPoint();

        //head
        context.beginPath();
        context.arc(center.x, 25, 20, 0, Math.PI * 2, true); // draw circle for head
        context.stroke();

        //mouth
        context.beginPath();
        context.arc(center.x, 25, 10, 0, Math.PI, false); // draw semicircle for smiling
        context.stroke();

        // eyes
        context.beginPath();
        context.arc(center.x - 10, 20, 3, 0, Math.PI * 2, true); // draw left eye
        context.fill();
        context.arc(center.x + 10, 20, 3, 0, Math.PI * 2, true); // draw right eye
        context.fill();
    }

    drawBody(context){
        let center = this.getCenterPoint();
        context.beginPath();
        context.moveTo(center.x, 45);
        context.lineTo(center.x, 100);
        context.stroke();
    }

    drawArm(context,arm){
        let center = this.getCenterPoint();
        context.beginPath();

        if(arm=='left'){
            context.moveTo(center.x, 45);
            context.lineTo(center.x - 20, 80);
        }
        else if(arm=='right'){
            context.moveTo(center.x, 45);
            context.lineTo(center.x + 20, 80);          
        }
        context.stroke(); 
    }

    drawLeg(context,leg){
        let center = this.getCenterPoint();
        context.beginPath();

        if(leg=='left'){
            context.moveTo(center.x, 100);
            context.lineTo(center.x - 30, 160);
        }
        else if(leg=='right'){
            context.moveTo(center.x, 100);
            context.lineTo(center.x + 30, 160);            
        }
        context.stroke(); 
    }


    drawShadowPerson(){
        let canvas = document.getElementById("canvas");
        if (canvas.getContext("2d")) { // Check HTML5 canvas support
            let context = canvas.getContext("2d");
            //Limpiar canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            //Configuracion del monigote fantasma
            context.strokeStyle = '#efefef';
            context.lineWidth = 2;
            context.fillStyle = "#efefef";

            context.setLineDash([4, 3]);/*dashes are 5px and spaces are 3px*/

            this.drawHead(context,true);
            this.drawBody(context);
            this.drawArm(context,'left');
            this.drawArm(context,'right');
            this.drawLeg(context,'left');
            this.drawLeg(context,'right');

            context.setLineDash([]); //Reset dash line

            //Dibujar estructura
            context.strokeStyle = 'black';
            context.lineWidth = 4;
            
            context.beginPath();
            context.moveTo(0, canvas.height-5);
            context.lineTo(80, canvas.height-5); 
            context.moveTo(40, canvas.height-5);
            context.lineTo(40, 5);
            context.lineTo(canvas.width/2, 5);
            context.stroke(); 

        }
    }

    getCenterPoint(){
        let canvas = document.getElementById("canvas");
        let point = {x: canvas.width / 2,
                    y: canvas.height / 2};
        return point;
    }
}

$(document).ready(function(){
    //Configuraciones iniciales
    const juego = new Game();
    $('#juego').hide();
    $('#finalJuego').hide();
    
    //Mostrar juego al pulsar iniciar
    $('#btn-start').click(function(){
        $('#menuPrincipal').fadeOut(function(){
            $('#juego').fadeIn();
            juego.startGame();
        });
    });

    //Al enviar una letra
    $('form').submit(function(evt){
        evt.preventDefault();
        $("input").removeClass('background-warning');
        let letra = $('#inputLetra').val().toLowerCase();

        if(letra!=''){
            juego.verifyLetter(letra);
        }
        end = juego.verifyWord();
        if(end){
            $('#juego').fadeOut(function(){
                $('#finalJuego').fadeIn();
            });
        }
    });

    //Reinciar juego
    $('#btn-restart').click(function(){
        $('#finalJuego').fadeOut(function(){
            //Resetear juego
            $('#palabra').empty();
            $('#letrasUsadas').empty();
            $('#inputLetra').val('');
            $('#menuPrincipal').fadeIn();
        });
    });

    //Limpiar el input al hacer clic
    $('input').click(function(){
        $(this).val('');
    });

});




