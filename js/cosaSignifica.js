/* Inicializacion variables del juego */
var maxPalabras = 10;
var avance = 1;
var correctas = 0;
var erroneas = 0;
var nivel = 0
var niveles = [dictA1,dictA2,dictB1,dictB2];
var WORDS=[];
var cantWords=0;

$(document).ready(function(){
    
    /* Inicializacion pantalla principal */
    $('#menuNivel').hide();
    $('#juego').hide();
    $('#finJuego').hide();
    $('#correctas').html(`Giuste: ${correctas}`);
    $('#erroneas').html(`Svagliate: ${erroneas}`);
    $('#avance').html(`Parola ${avance}/${maxPalabras}`);

    /* Cambiar pantalla para seleccionar nivel */
    $('#btn-start').click(function(){
        
        $('#menuPrincipal').fadeOut('slow',function(){
            $('#menuNivel').fadeIn();
        });
    });
    
    /* Comenzar juego con nivel seleccionado */
    $('.btn-start-nivel').click(function(){
        nivel = parseInt($(this).val());

        /* Obtener las palabras del nivel elegido y cargarlas */
        WORDS = niveles[nivel-1];
        cantWords = WORDS.length;
        showWord();

        $('#menuNivel').fadeOut(function(){
            $('#juego').fadeIn();
        });
        
    });

    /* Al pulsar una palabra */
    $('.btn-op').click(function(){
        /* Mostrar color seleccion si es correcta o no */
        var value = $(this).val();
        if(value==posCorrecta){
            audioCorrecta.play();
            $(this).addClass('btn-success');
            correctas++;
        }
        else{
            audioIncorrecta.play();
            $(this).addClass('btn-danger');
            $(`#btn-op${posCorrecta}`).addClass('btn-success');
            erroneas++;
        }

        /* Trancision a siguiente palabra (con retardo para ver los colores)*/
        $('.btn-op').prop('disabled',true);
        
        /* Ver valor de avance para mostrar pantalla de fin o siguiente palabra */
        setTimeout(function(){
            $('#juego').fadeOut("slow",function(){
                showWord();
                $('.btn-op').prop('disabled',false);
                avance++;
                $('#avance').html(`Parola ${avance}/${maxPalabras}`);

                if(avance <= maxPalabras){
                    /*El juego continua a la siguiente palabra*/
                    $('#juego').fadeIn("slow");
                }
                else{
                    /*Se muestra la pantalla con el resultado final y boton volver a intentar*/
                    $('#finJuego').fadeIn("slow");
                    /* Modificar los contadores de puntaje */
                    $('#correctas').html(`Giuste: ${correctas}`);
                    $('#erroneas').html(`Svagliate: ${erroneas}`);
                    if(correctas < 5){
                        $('#msjFinal').html(`Devi ancora migliorare, forza!`);
                    }
                    else if(correctas < 10){
                        $('#msjFinal').html(`Hai risposto bene quasi tutte le parole, continua così!`);
                    }
                    else{
                        $('#msjFinal').html(`Non hai sbagliato nessuna parola, bravissimo!`);
                    }
                    
                }
            });
        },1000)
        
    });

    /*Al reiniciar el juego despues de terminar la partida*/
    $('#btn-restart').click(function(){
        location.reload();
    });
});


/* Funcion para mostrar la palabra y las tres definciones*/
function showWord(){
    //Resetea estilo botones para nueva palabra
    $('.btn-op').removeClass('btn-success');
    $('.btn-op').removeClass('btn-danger');

    //Obtener palabra
    idWord = getRandomInt(cantWords);
    //Obtener palabras falsas, a mostrar definiciones incorrectas
    idWord_falsa_1 =  getRandomInt(cantWords);
    idWord_falsa_2 =   getRandomInt(cantWords);

    while(idWord_falsa_1 == idWord || idWord_falsa_2 == idWord || idWord_falsa_1 == idWord_falsa_2){
        idWord_falsa_1 =  getRandomInt(cantWords);
        idWord_falsa_2 =   getRandomInt(cantWords);        
    }

    //Palabra a usar
    word = WORDS[idWord]['word'];
    definition = WORDS[idWord]['definition1'].split('|')[0];

    //Palabras fake
    word1f = WORDS[idWord_falsa_1]['word']
    definition1f = WORDS[idWord_falsa_1]['definition1'].split('|')[0];
 
    word2f = WORDS[idWord_falsa_2]['word']
    definition2f = WORDS[idWord_falsa_2]['definition1'].split('|')[0];

    //Coloco las palabras en el juego
    pos = [0,1,2]
    posCorrecta = getRandomInt(3) //Obtiene una posicion random para poner la correcta

    //Palabra a buscar
    $('#palabra').html(word)
    $(`#btn-op${posCorrecta}`).html(definition)

    //Elimino la posicion donde esta la defincion correcta
    pos.splice(posCorrecta,1);

    //Coloco las definiciones fake
    $(`#btn-op${pos[0]}`).html(definition1f)
    $(`#btn-op${pos[1]}`).html(definition2f)
}

/*Funciones auxiliares*/
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}