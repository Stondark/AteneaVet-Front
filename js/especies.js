const STRING_URL = "http://localhost:3001/api/1.0/";

const table = document.getElementById("table-especies");
const caption_table = document.getElementById("description-table");
const num_table = document.getElementById("num-table");
const add_btn = document.getElementById("add-btn");


// Insert especie 
async function insertEspecie(info) {
  try {
    const response = await fetch(`${STRING_URL}insertEspecie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: info
    });
    const data = await response.json();

    if (!data.success) {
      let str = JSON.stringify(data.errors);
      throw new Error(str);
    }

    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Edit especie

async function updateEspecieById(info, id) {
  try {
    const response = await fetch(`${STRING_URL}updateEspecieById/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: info
    });
    const data = await response.json();

    if (!data.success) {
      let str = JSON.stringify(data.errors);
      throw new Error(str);
    }

    return data.data;
  } catch (error) {
    console.log(`Se produjo un error ${error}`);
    throw error;
  }
}

async function deleteEspecieById(id){
  try {
    const response = await fetch(`${STRING_URL}deleteEspecieById/${id}`,
      {
        method: "DELETE",
      }
    );
    let data_res = await response.json();

    if (!data_res.success) {
      throw new Error(data_res.success);
    }
    return data_res;
  } catch (error) {
    console.log(`Se produjo un error ${error}`);
  }
}

// Get all especies

async function getAllEsp() {
  try {
    const response = await fetch(`${STRING_URL}getAllEspecies` ,
      {
        method: "GET",
      }
    );
    let data_res = await response.json();

    if (!data_res.success) {
      throw new Error(data_res.success);
    }
    return data_res;
  } catch (error) {
    console.log(`Se produjo un error ${error}`);
  }
}

async function getEspecieById(id){
  try {
    const response = await fetch(`${STRING_URL}getEspeciesById/${id}`,
      {
        method: "GET",
      }
    );
    let data_res = await response.json();

    if (!data_res.success) {
      throw new Error(data_res.success);
    }
    return data_res;
  } catch (error) {
    console.log(`Se produjo un error ${error}`);
  }
}

async function deleteEspecieAlert(id) {
  await Swal.fire({
    title: '¿Seguro que quiere eliminar este registro?',
    showDenyButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteEspecieById(id);
      await Swal.fire('Se eliminó el registro', '', 'success');
      location.reload();
    } else if (result.isDenied) {
      Swal.fire('El registro no se eliminó', '', 'error');
    }
  })
}


async function EditEsp(data){
  await Swal.fire({
    title: "Editar especie",
    html:
      '<input id="name" class="swal2-input" placeholder="Nombre">' +
      '<select id="clasificacion" class="swal2-select" ><option value="" disabled="" selected>Seleccione una clasificación</option></select>' +
      '<input id="esperanza" class="swal2-input" placeholder="Esperanza de vida">' +
      '<input id="peso" class="swal2-input" placeholder="Peso promedio">',
    focusConfirm: false,

    didOpen: async () => {
      const getClas = await getAllClasificacion();
      poblateSelect(getClas, 'clasificacion');
      
      document.getElementById('name').value = data.nombre;
      document.getElementById('clasificacion').value = data.clasificacion_animales.id;
      document.getElementById('esperanza').value = data.esperanza_vida;
      document.getElementById('peso').value = data.peso_promedio;
    },
    preConfirm: async () =>{
      let name = document.getElementById('name').value;
      let clasificacion = document.getElementById('clasificacion').value;
      let esperanza = document.getElementById('esperanza').value;
      let peso = document.getElementById('peso').value;

      let bodyContent = JSON.stringify({
            "nombre": name,
            "clasificacion": clasificacion,
            "esperanza_vida": esperanza,
            "peso_promedio": peso
      });
           
      try {
        await updateEspecieById(bodyContent, data.id_especie);
        location.reload();
      } catch (error) {
        console.log(error);
        await Swal.fire('Ocurrió un error al editar', '', 'error');
      }
      
    }
  });
}


async function addAllEsp() {
  let especies_get = await getAllEsp();
  let especies = especies_get.data;
  especies.forEach((especie) => {
    const fila = table.insertRow();
    fila.insertCell().innerText = especie.id_especie;
    fila.insertCell().innerText = especie.nombre;
    fila.insertCell().innerText = especie.clasificacion_animales.nombre_clasificacion;
    fila.insertCell().innerText = especie.esperanza_vida;
    fila.insertCell().innerText = especie.peso_promedio;

    let editarBtn = document.createElement('button');
    editarBtn.innerText = 'Editar';
    editarBtn.setAttribute('class', 'btn btn-warning btn-sm');

    editarBtn.addEventListener('click', async () => {
      let especie_id = await getEspecieById(especie.id_especie);
      await EditEsp(especie_id.data);
    });

    fila.insertCell().appendChild(editarBtn);

    let eliminarBtn = document.createElement('button');
    eliminarBtn.innerText = 'Eliminar';
    eliminarBtn.setAttribute('class', 'btn btn-danger btn-sm');
    eliminarBtn.addEventListener('click', async () => {
      await deleteEspecieAlert(especie.id_especie);
    });
    
    fila.insertCell().appendChild(eliminarBtn);

  });

  let num_esp = Object.keys(especies).length;
  num_table.innerText = num_esp;
}


addAllEsp()
  .then((data) => {
  })
  .catch((error) => {
    console.log(error);
  });

// Get all clasificacion

async function getAllClasificacion() {
  try {
    const response = await fetch(`${STRING_URL}getAllClasificacion`, {
      method: "GET",
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.success);
    }

    return data.data;
  } catch (error) {
    console.log(`Se produjo un error ${error}`);
  }
}

function poblateSelect(json, field) {
  let field_id = document.getElementById(field);
  json.forEach((data) => {
    let option_clasificacion = document.createElement("option");
    option_clasificacion.value = data.id;
    option_clasificacion.text = data.nombre_clasificacion;
    field_id.appendChild(option_clasificacion);
  });
}

// Add especie
add_btn.addEventListener("click", async () => {
  await Swal.fire({
    title: "Añadir especie",
    html:
      '<input id="name" class="swal2-input" placeholder="Nombre">' +
      '<select id="clasificacion" class="swal2-select" ><option value="" disabled="" selected>Seleccione una clasificación</option></select>' +
      '<input id="esperanza" class="swal2-input" placeholder="Esperanza de vida">' +
      '<input id="peso" class="swal2-input" placeholder="Peso promedio">',
    focusConfirm: false,
    didOpen: async () => {
      const getClas = await getAllClasificacion();
      poblateSelect(getClas, 'clasificacion');
    },
    preConfirm: async () =>{
      let name = document.getElementById('name').value;
      let clasificacion = document.getElementById('clasificacion').value;
      let esperanza = document.getElementById('esperanza').value;
      let peso = document.getElementById('peso').value;

      let bodyContent = JSON.stringify({
        "data": [
          {
            "nombre": name,
            "clasificacion": clasificacion,
            "esperanza_vida": esperanza,
            "peso_promedio": peso
          }
        ]
      });
      
      try {
        await insertEspecie(bodyContent);
        location.reload();
      } catch (error) {
        console.log(error);
        await Swal.fire('Ocurrió un error al insertar', '', 'error');
      }

    }
  });
});
