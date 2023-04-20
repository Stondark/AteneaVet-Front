const table = document.getElementById("table-especies");
const caption_table = document.getElementById("description-table");
const num_table = document.getElementById("num-table");
const add_btn = document.getElementById("add-btn");

// Insert especie 
async function insertEspecie(info) {
  try {
    const response = await fetch("http://localhost:3001/api/1.0/insertEspecie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: info
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



// Get all especies

async function getAllEsp() {
  try {
    const response = await fetch(
      "http://localhost:3001/api/1.0/getAllEspecies",
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

function addAllEsp(data) {
  let especies = data.data;
  especies.forEach((especie) => {
    const fila = table.insertRow();
    fila.insertCell().innerText = especie.id_especie;
    fila.insertCell().innerText = especie.nombre;
    fila.insertCell().innerText =
      especie.clasificacion_animales.nombre_clasificacion;
    fila.insertCell().innerText = especie.esperanza_vida;
    fila.insertCell().innerText = especie.peso_promedio;
  });
}

getAllEsp()
  .then((data) => {
    addAllEsp(data);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all clasificacion

async function getAllClasificacion() {
  try {
    const response = await fetch("http://localhost:3001/api/1.0/getAllClasificacion", {
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
      
      await insertEspecie(bodyContent);

      
    }
  });
});
