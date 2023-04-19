const table = document.getElementById('table-especies');

function addAllEsp(data) {
    let especies = data.data;
    console.log(especies);
    especies.forEach(
        (especie) => {
            const fila = table.insertRow()
            fila.insertCell().innerText = especie.id_especie;
            fila.insertCell().innerText = especie.nombre;
            fila.insertCell().innerText = especie.clasificacion_animales.nombre_clasificacion
            ;
            fila.insertCell().innerText = especie.esperanza_vida;
            fila.insertCell().innerText = especie.peso_promedio;
        });
}


async function getAllEsp() {
  try {
    await fetch("http://localhost:3000/getAllEspecies", {
      method: "GET",
    })
    .then((res) => res.json())
    .then((response) => {
        if(response.success){
            addAllEsp(response);
            

        }

    });
  } catch (error) {
    console.log(error)
  }
}


getAllEsp();
