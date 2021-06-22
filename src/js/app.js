
let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [ ]

}
document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){

    mostrarServicios()

    //Resalta el Div segun el tab
    mostrarSeccion();

    //Oculta o muestra una sección segun el tab
    cambiarSeccion()

    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error
    mostrarResumen();

    //Almacena el nombre de la cita
    nombreCita();

    //Alamcena la fecha de la cita
    fechaCita();

    //Deshabilita fecha menores a hoy
    deshabilitarFechaAnterior();
    
    horaCita();
 
}

function mostrarSeccion() {

    //eliminar mostrar-seccion de la seccion anterior
    const SeccionAnterior = document.querySelector('.mostrar-seccion');
    if( SeccionAnterior ){
        SeccionAnterior.classList.remove('mostrar-seccion')
    }

    //Eliminar la clase actual del tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if( tabAnterior ){
        tabAnterior.classList.remove('actual');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //resalta el tag actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach(enlace => {

        enlace.addEventListener('click', e =>{

            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
            
        })
        
    });
}

async function mostrarServicios() {

    try {

        const url = "http://localhost:3000/servicios.php";
        const resultado = await fetch(url);
        const db = await resultado.json();

        //Generar el HTML
        db.forEach(servicio => {

            const {id, nombre, precio } = servicio;

            //DOM Scripting

            //Generar Nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

             //Generar Precio
             const precioServicio = document.createElement('P');
             precioServicio.textContent = `$${precio} `;
             precioServicio.classList.add('precio-servicio');

             //Generar contenedor de servicio
             const servicioDiv = document.createElement('DIV')
             servicioDiv.classList.add('servicio');
             servicioDiv.dataset.IdServicio = id;

             //Seleccionar un servicio
            servicioDiv.onclick = seleccionarServicio;

             //Inyectar precio y nombre a servicioDiv
             servicioDiv.appendChild(nombreServicio);
             servicioDiv.appendChild(precioServicio);

             //Inyectar al DOM
            const listadoServicios = document.querySelector('#servicios')
            listadoServicios.appendChild(servicioDiv);

    
        });
        
    } catch (error) {
        console.log(error)
    }

}

function seleccionarServicio(e) {

    let elemento;
    //Forzar click al div
    if(e.target.tagName === 'P'){
       elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }


    if(elemento.classList.contains('seleccionado')){

        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.IdServicio);

        eliminarServicio(id);
        
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.IdServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextSibling.textContent,
        }
        //console.log(servicioObj)
        agregarServicio(servicioObj);
    }
    
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){

        pagina++;

        botonesPaginador();
    });
}

function paginaAnterior() {

    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){

        pagina--;

        botonesPaginador();

    });
  
}

function  botonesPaginador(){
    
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
    }
    else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        //vuelve a cargar el resumen
        mostrarResumen();

    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //Cambia seccion
    
}

function mostrarResumen(e) {
    //Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector(".contenido-resumen");

    //Limpiar el html previo
    while(resumenDiv.firstChild){
        
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validación del objeto
    if(Object.values(cita).includes('')){

        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicio: Hora, Fecha o Nombre'

        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen div
        resumenDiv.appendChild(noServicios)

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita'

    //Mostrar resumen
    const nombreCita = document.createElement('P')
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`
    const fechaCita = document.createElement('P')
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`
    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span>Hora: </span>${hora}`

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios'
    headingServicios.classList.add('heading-servicios');

    //iterar el precio
    let cantidad= 0;

    serviciosCita.appendChild(headingServicios)

    //Mostrar los servicios
    servicios.forEach(servicio => {

        const {nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV')
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre

        const PrecioServicio = document.createElement('P');
        PrecioServicio.textContent = precio;
        PrecioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad+= parseInt(totalServicio[1].trim())
        
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(PrecioServicio);

        serviciosCita.appendChild(contenedorServicio)
        
    });

    
    resumenDiv.appendChild(headingCita)
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span>$${cantidad}`

    resumenDiv.appendChild(cantidadPagar);

}

function eliminarServicio(id) {

   //console.log("Eliminando...", id)

   const { servicios } = cita;
   
   cita.servicios = servicios.filter( servicio =>  servicio.id !== id);

   console.log(cita)


}
function agregarServicio(servicioObj) {

    const { servicios } = cita 

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
    
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre')

    nombreInput.addEventListener('input', evt =>{

        const nombreTexto = evt.target.value.trim(); //quita los espacios en blanco
        if(nombreTexto == '' || nombreTexto.length < 3){

            mostrarAlerta('Nombre no valido', 'error');
           
        }
        else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;

            console.log(cita)
        }
        /* console.log(nombreTexto); */
    })
}

function mostrarAlerta(mensaje, type){

    //Si ya hay una alerta no mostrar nuevamente
    const alertaPrevia = document.querySelector('.alerta')

    if(alertaPrevia){
        return;//Corta la ejecución del codigo si ya hay una alerta
    }

    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(type === 'error'){

        alerta.classList.add('error');
        
    }
    const seccionCita = document.querySelector('.formulario');
    seccionCita.appendChild(alerta);

    //eliminar la alert despues de 3s
    setTimeout(() => {
        alerta.remove();
    }, 3000);
    
}

function fechaCita() {

    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', e =>{

        const dia = new Date(e.target.value).getUTCDay();

        if([0, 6].includes(dia)){

            e.preventDefault();
            fechaInput.value = '';
           mostrarAlerta('Findes de semana no son permitidos','error');
        
        }else{

            cita.fecha = fechaInput.value;
            
        }
    })

}

function deshabilitarFechaAnterior() {
    
    const Inputfecha = document.querySelector('#fecha');

    const fechaActual = new Date();

    const year = fechaActual.getFullYear();
    const mes = fechaActual.getMonth()+1;
    const dia = fechaActual.getDate();

    //Formato deseado = AAAA-MM-DD

    const fechaPasada = `${dia}-${mes}-${year}`;

    Inputfecha.min = fechaPasada;

    
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{
        

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18){
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
            
        }else{
            cita.hora = horaCita;
        }
    })
}