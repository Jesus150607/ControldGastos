var tPresupuesto = parseFloat(localStorage.getItem("presupuesto")) || 0;
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var divPresupuesto = document.querySelector('#divPresupuesto');
var presupuesto = document.querySelector('#presupuesto');
var btnpresupuesto = document.querySelector('#btnPresupuesto');
var divGastos = document.querySelector('#divGastos');
var totalPresupuesto = document.querySelector("#totalPresupuesto");
var totalDisponible = document.querySelector("#totalDisponible");
var totalGastos = document.querySelector("#totalGastos");
var progress = document.querySelector("#progress");
var tGastos = 0;
var disponible = 0;
var indiceGasto;

const inicio = () => {
    if (tPresupuesto > 0) {
        divPresupuesto.classList.remove("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.add("d-none");
        divGastos.classList.add("d-block");
        totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
        mostrarGastos();
    } else {
        divPresupuesto.classList.remove("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.add("d-block");
        divGastos.classList.add("d-none");
    }
}

btnpresupuesto.onclick = () => {
    tPresupuesto = parseFloat(presupuesto.value);
    if (isNaN(tPresupuesto) || tPresupuesto <= 0) {
        Swal.fire({ title: "ERROR!", text: "PRESUPUESTO DEBE SER MAYOR A 0", icon: "error" });
        return;
    }
    localStorage.setItem('presupuesto', tPresupuesto);
    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");
    totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
    mostrarGastos();
}

const guardarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.querySelector("#descripcion").value;
    let costo = parseFloat(document.querySelector("#costo").value);
    let categoria = document.querySelector("#categoria").value;

    if (isNaN(costo) || costo <= 0) {
        Swal.fire({ title: "ERROR!", text: "COSTO DEL GASTO DEBE SER MAYOR A 0", icon: "error" });
        return;
    }

    if (costo > disponible) {
        Swal.fire({ title: "ERROR!", text: "EL COSTO EXCEDE EL SALDO DISPONIBLE", icon: "error" });
        return;
    }

    const gasto = { descripcion, costo, categoria };
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    mostrarGastos();
}

const mostrarGastos = (filtroCategoria = 'todos') => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gastosFiltrados = gastos;

    if (filtroCategoria !== 'todos') {
        gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtroCategoria);
    }

    let gastosHTML = '';
    let index = 0;
    tGastos = 0;

    gastosFiltrados.forEach(gasto => {
        gastosHTML += 
            `<div class="card text-center w-60 m-auto mt-3 shadow p-2">
                <div class="row">
                    <div class="col"><br><img src="img/${gasto.categoria}.jpeg" alt="Sin imagen" class="imgCategoria"></div>
                    <div class="col text-start">
                        <p><b>Descripcion:</b><small> ${gasto.descripcion}</small></p>
                        <p><b>Costo:</b><small>$ ${parseFloat(gasto.costo).toFixed(2)}</small></p>
                    </div>
                    <div class="col">
                        <button class="btn btn-danger" onclick="eliminarG(${index})"><i class="bi bi-trash3-fill"></i></button>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editarGasto" onclick="mostarG(${index})"><i class="bi bi-pencil-square"></i></button>
                    </div>
                </div>  
            </div>`;
        tGastos += parseFloat(gasto.costo);
        index++;
    });

    document.getElementById("listaGasto").innerHTML = gastosHTML;
    pintarDatos();
}

document.querySelector("#filtrarCategoria").addEventListener("change", (e) => {
    mostrarGastos(e.target.value);
});

function eliminarG(index) {
    Swal.fire({
        title: "¿Seguro de eliminar el gasto?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            gastos.splice(index, 1);
            localStorage.setItem("gastos", JSON.stringify(gastos));
            mostrarGastos();
            Swal.fire("Gasto Eliminado", "", "success");
        }
    });
}

function mostarG(index) {
    indiceGasto = index;
    var gasto = gastos[index];

    document.querySelector("#edescripcion").value = gasto.descripcion;
    document.querySelector("#ecosto").value = gasto.costo;
    document.querySelector("#ecategoria").value = gasto.categoria;
    pintarDatos();
}

var actualizarG = document.getElementById("actualizar");

actualizarG.onclick = () => {
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gasto = gastos[indiceGasto];

    gasto.descripcion = document.getElementById("edescripcion").value;
    gasto.costo = parseFloat(document.getElementById("ecosto").value);
    gasto.categoria = document.getElementById("ecategoria").value;

    if (isNaN(gasto.costo) || gasto.costo <= 0) {
        Swal.fire({ title: "ERROR!", text: "COSTO DEL GASTO DEBE SER MAYOR A 0", icon: "error" });
        return;
    }

    // Verificar el nuevo costo antes de actualizar
    if (gasto.costo > disponible + tGastos - (gastos[indiceGasto]?.costo || 0)) {
        Swal.fire({ title: "ERROR!", text: "EL COSTO EXCEDE EL SALDO DISPONIBLE", icon: "error" });
        return;
    }

    gastos[indiceGasto] = gasto;
    localStorage.setItem("gastos", JSON.stringify(gastos));
    mostrarGastos();
};

const reset = () => {
    Swal.fire({
        title: "¿Seguro de resetear el sistema?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
    location.reload();
            Swal.fire("Gasto Eliminado", "", "success");
        }
    });
}
    
}

const pintarDatos = () => {
    var tPresupuesto = parseFloat(localStorage.getItem("presupuesto")) || 0;
    disponible = tPresupuesto - tGastos;
    //let porcentaje = (tPresupuesto > 0) ? (tGastos / tPresupuesto) * 100 : 0;
let porcentaje=100-((tGastos/tPresupuesto)*100);
    // Asegúrate de que porcentaje sea un valor válido
    porcentaje = isNaN(porcentaje) || porcentaje < 0 ? 0 : porcentaje;

    totalGastos.innerHTML = `$ ${tGastos.toFixed(2)}`;
    totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
    totalDisponible.innerHTML = `$ ${disponible.toFixed(2)}`;

    // Actualiza el progreso circular
    if (progress) {
        progress.setAttribute('value', porcentaje);
    }
}
