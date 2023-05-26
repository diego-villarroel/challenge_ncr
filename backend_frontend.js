app();
/**
 * Función principal que contiene toda la lógica de la aplicación
 */
function app () {
    let url = "https://api.npoint.io/97d89162575a9d816661";

    // Se hace la llamada que trae los datos, se filtra los datos para los requerimientos del cliente, muestra todos los datos según los mismos requerimientos y se ejecutan los eventos necesarios para la funcionalidad de la aplicación.
    $.ajax({
        method: 'get',
        url: url,
        beforeSend: function(){
            $('#main_loading').removeClass('d-none');
        },
        success: function(result){
            // Filtro
            for (let i = 0; i < result.cuentas.length; i ++){
                if(result.cuentas[i].moneda != 'u$s' && result.cuentas[i].moneda != '$'){
                    result.cuentas.splice(i,1);
                }
                if(result.cuentas[i].tipo_letras.toUpperCase() != 'CC' && result.cuentas[i].tipo_letras.toUpperCase() != 'CA'){
                    result.cuentas.splice(i,1);
                }
                if(!parseInt(result.cuentas[i].n)) {
                    result.cuentas.splice(i,1);
                }
        
            }
            // Muestra contenido de la aplicacion
            $('#main_loading').addClass('d-none');
            setContent(result.cuentas);
            // Llama a los eventos de la aplicación
            appEvents();
        }
    })
}

/**
 * Función que genera el contenido de las páginas y las cards.
 * 
 * @param {array} cards  
 * @returns {void}
 */
function setContent (cards){
    // Definición de plantillas y variables auxiliares
    let page_start = '<div id="page_';
    let page_end = '</div>'
    // 
    let card_next_start = '<div class="card col col-3 mx-3 my-3 next_page text-center" data-page="';
    let card_next_end = '"> Mas opciones >> </div>';
    let card_prev_start = '<div class="card col col-3 mx-3 my-3 prev_page text-center" data-page="';
    let card_prev_end = '">Opciones anteriores << </div>';
    let frontend = '<h2 class="text-center">Seleccione la cuenta a Consulta</h2>';
    // 
    let count_page = 0;
    let aux_count = 0;
    let end = 0;
    // Creación de la vista
    frontend += page_start + count_page + '" class="row justify-content-center">'
    for ( let i = 0; i < cards.length; i++ ) {
        // Agrega card de OPCIONES ANTERIORES
        if ( end != 0 ) {
            aux_count = 0;
            end = 0;
            frontend += card_prev_start;
            frontend += count_page;
            frontend += card_prev_end;
            frontend += setCardsContent(cards[i-1]);
        }
        // Agrega card de OPCIONES SIGUIENTES, según si es la primera página o las siguientes
        if ( aux_count == 5 && count_page == 0 ){
            frontend += card_next_start + '0';
            frontend += card_next_end;
            count_page ++;
            end ++;
            frontend += page_end;
            frontend += page_start + count_page + '" class="row justify-content-center d-none">';
        } else if ( aux_count == 4 && count_page != 0 ) {
            frontend += card_next_start + count_page;
            frontend += card_next_end;
            count_page ++;
            end ++;
            frontend += page_end;
            frontend += page_start + count_page + '" class="row justify-content-center d-none">';
        }
        // Evalua variable auxiliar cuando comienza una nueva página
        if ( end == 0 ) {
            aux_count ++;
            frontend += setCardsContent(cards[i]);
        }
    }
    // Se agrega el contenido total de la aplicación en el contenedor
    $('#app_container').html(frontend);
}

/**
 * Función que crea el contenido de cada card de una cuenta
 * 
 * @param {object} content
 * @returns {string}
 */
function setCardsContent (content){
    // Definición de plantillas
    let card_start = '<div class="card col col-3 mx-3 my-3 cuenta" ';
    let card_saldo = 'data-saldo="';
    let card_moneda = '" data-moneda="'
    let card_tipo_cuenta = '" data-tipo-cuenta="'
    let card_numero = '" data-numero="'
    let card_end = '</div>';
    let card = '';
    // Transforma el dato según las especificaciónes del cliente
    if (content.tipo_letras.toUpperCase() == 'CC' ) {
        content.tipo_letras = 'Cuenta Corriente';
    } else {
        content.tipo_letras = 'Caja de Ahorro';
    }
    // Creación del contenido de una card
    card += card_start;
    card += card_saldo + content.saldo;
    card += card_moneda + content.moneda;
    card += card_tipo_cuenta + content.tipo_letras;
    card += card_numero + content.n;
    card += '"><p class="text-center">'+content.tipo_letras+'</p>';
    card += '<p class="text-center">Nº '+content.n+'</p>';
    card += card_end;
    // 
    return card
}

/**
 * Función que lee todos los eventos necesarios para la aplicación.
 */
function appEvents() {
    // Evento que lee el click en una card de cuenta
    $('.cuenta').on('click',function(){
        let saldo = String($(this).data('saldo'));
        saldo = saldo.replace('-','');
        saldo = saldo.replace('-','');
        saldo = 'Saldo de la cuenta: ' + saldo;
        // 
        let moneda = ($(this).data('moneda') == '$') ? 'Pesos' : 'Dolares';
        let tipo_cuenta = 'Tipo de cuenta: ' + $(this).data('tipo-cuenta') + ' en ' + moneda;
        // 
        let numero = 'Número de cuenta: '+ $(this).data('numero');
        // 
        $('#saldo').empty().html(saldo);
        $('#tipo_cuenta').empty().html(tipo_cuenta);
        $('#numero').empty().html(numero);
        // 
        $('#app_container').addClass('d-none');
        $('#select_content').removeClass('d-none');
    });
    // Evento que lee el botón de salir
    $('#salir').on('click',function(){
        $('#app_container').removeClass('d-none');
        $('#select_content').addClass('d-none');
    });
    // Evento que lee el botón de OPCIONES SIGUIENTES
    $('.next_page').on('click',function(){
        let page = $(this).data('page');
        $('#page_'+page).addClass('d-none');
        page ++;
        $('#page_'+page).removeClass('d-none');
    });
    // Evento que lee el botón de OPCIONES ANTERIORES
    $('.prev_page').on('click',function(){
        let page = $(this).data('page');
        $('#page_'+page).addClass('d-none');
        page --;
        $('#page_'+page).removeClass('d-none');
    });
}