const apiBase = "http://127.0.0.1:8000";  // Asegúrate de que tu API esté corriendo en esta URL

    function loadSalarios() {
        fetch(`${apiBase}/salarios`)
            .then(response => response.json())
            .then(data => {
                let html = "<h2>Lista de Salarios</h2>";
                html += "<table><tr><th>ID</th><th>Profesión</th><th>Edad</th><th>Salario</th><th>Lenguajes</th></tr>";
                data.forEach(salario => {
                    let lenguajes = salario.Lenguajes_Maneja.trim(); // Eliminar espacios extra
                    if (lenguajes.length > 30) { // Limitar a 30 caracteres
                        lenguajes = lenguajes.substring(0, 27) + "..."; // Agregar puntos suspensivos
                    }

                    html += `<tr>
                                <td>${salario.id}</td>
                                <td>${salario.Profesion}</td>
                                <td>${salario.Edad}</td>
                                <td>${salario.Salario_Total} ${salario.Moneda}</td>
                                <td>${lenguajes}</td>
                            </tr>`;
                });
                html += "</table>";
                document.getElementById("content").innerHTML = html;
            })
            .catch(error => console.error("Error cargando los salarios:", error));
    }

    function buscarPorExperiencia() {
        let experiencia = prompt("Ingrese los años de experiencia mínima:");
        if (experiencia !== null) {
            fetch(`${apiBase}/experiencia?experience=${experiencia}`)
                .then(response => response.json())
                .then(data => {
                    let html = `<h2>Salarios con al menos ${experiencia} años de experiencia</h2>`;
                    if (data.length === 0) {
                        html += "<p>No se encontraron resultados.</p>";
                    } else {
                        html += "<table><tr><th>ID</th><th>Profesión</th><th>Años Experiencia</th><th>Salario</th></tr>";
                        data.forEach(salario => {
                            html += `<tr>
                                        <td>${salario.id}</td>
                                        <td>${salario.Profesion}</td>
                                        <td>${salario.Años_Experiencia_Laboral}</td>
                                        <td>${salario.Salario_Total} ${salario.Moneda}</td>
                                    </tr>`;
                        });
                        html += "</table>";
                    }
                    document.getElementById("content").innerHTML = html;
                })
                .catch(error => console.error("Error en la consulta:", error));
        }
    }

    function consultarChatbot() {
        let query = prompt("Ingrese un lenguaje de programación o palabra clave:");
        if (query !== null) {
            fetch(`${apiBase}/chatbot?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    let html = `<h2>Resultados del Chatbot</h2><p>${data.resultados}</p>`;
                    if (data.salarios.length === 0) {
                        html += "<p>No se encontraron salarios relacionados.</p>";
                    } else {
                        html += "<table><tr><th>ID</th><th>Lenguajes</th><th>Salario</th></tr>";
                        data.salarios.forEach(salario => {
                            let lenguajes = salario.Lenguajes_Maneja.trim(); // Eliminar espacios extra
                            if (lenguajes.length > 30) { // Limitar a 30 caracteres
                                lenguajes = lenguajes.substring(0, 27) + "..."; // Agregar puntos suspensivos
                            }
                            html += `<tr>
                                        <td>${salario.id}</td>
                                        <td>${lenguajes}</td>
                                        <td>${salario.Salario_Total} ${salario.Moneda}</td>
                                    </tr>`;
                        });
                        html += "</table>";
                    }
                    document.getElementById("content").innerHTML = html;
                })
                .catch(error => console.error("Error en la consulta:", error));
        }
    }