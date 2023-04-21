const STRING_URL = "https://ateneavet-back-production.up.railway.app/api/1.0/";

const table = document.getElementById("table-clasificacion");
const num_table = document.getElementById("num-table");
const add_btn = document.getElementById("add-btn");


// Insert especie 
async function insertClasificacion(info) {
  try {
    const response = await fetch(`${STRING_URL}insertClasificacion`, {
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


async function deleteClasificacion(id){
  try {
    const response = await fetch(`${STRING_URL}deleteClasificacionById/${id}`,
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

async function deleteclasificacionAlert(id) {
  await Swal.fire({
    title: '¿Seguro que quiere eliminar este registro?',
    showDenyButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteClasificacion(id);
      await Swal.fire('Se eliminó el registro', '', 'success');
      location.reload();
    } else if (result.isDenied) {
      Swal.fire('El registro no se eliminó', '', 'error');
    }
  })
}

async function addAllClas() {
  let clasificacion_animales = await getAllClasificacion();
  clasificacion_animales.forEach((clasificacion) => {
    const fila = table.insertRow();
    fila.insertCell().innerText = clasificacion.id;
    fila.insertCell().innerText = clasificacion.nombre_clasificacion;

    let eliminarBtn = document.createElement('button');
    eliminarBtn.innerText = 'Eliminar';
    eliminarBtn.setAttribute('class', 'btn btn-danger btn-sm');
    eliminarBtn.addEventListener('click', async () => {
      await deleteclasificacionAlert(clasificacion.id);
    });
    
    fila.insertCell().appendChild(eliminarBtn);

  });

  let num_esp = Object.keys(clasificacions).length;
  num_table.innerText = num_esp;
}


addAllClas()
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

// Add clasificacion
add_btn.addEventListener("click", async () => {
  await Swal.fire({
    title: "Añadir clasificación",
    html:
      '<input id="name" class="swal2-input" placeholder="Nombre de la clasificación">',
    focusConfirm: false,
    preConfirm: async () =>{
      let name = document.getElementById('name').value;
      let bodyContent = JSON.stringify({
        "data": {
            "nombre_clasificacion": name,
        }
      });
      
      try {
        await insertClasificacion(bodyContent);
        location.reload();
      } catch (error) {
        console.log(error);
        await Swal.fire('Ocurrió un error al insertar', '', 'error');
      }

    }
  });
});
