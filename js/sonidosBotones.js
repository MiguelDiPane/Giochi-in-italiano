const audioBtnClick = new Audio('sounds/clic-button.wav');
const audioCorrecta = new Audio('sounds/palabra-correcta.wav');
const audioIncorrecta = new Audio('sounds/palabra-erronea.wav');

$(document).ready(function(){
    //Selecciona botones y etiquetas a para agregar el evento de sonido al pulsar
    $('button, a').click(function(){
        audioBtnClick.play();
    });
});