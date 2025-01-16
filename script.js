function CalcularAmortiguamiento() {
    // Obtener los valores de los inputs
    var masa = parseFloat(document.getElementById('masa').value);
    var k = parseFloat(document.getElementById('k').value);
    var c = parseFloat(document.getElementById('c').value);

    // Verificar que los valores sean válidos
    if (isNaN(masa) || isNaN(k) || isNaN(c)) {
        alert("Por favor ingresa la masa, la constante de rigidez y el coeficiente de amortiguamiento.");
        return;
    }

    // Calcular la frecuencia natural sin amortiguamiento (ω₀ = sqrt(k / m))
    var omega0 = Math.sqrt(k / masa);

    // Calcular el coeficiente de amortiguamiento crítico (cc = 2 * sqrt(k * m))
    var cCritico = 2 * Math.sqrt(k * masa);

    // Determinar el tipo de amortiguamiento
    var tipoAmortiguamiento;
    var omegaK = null; // Frecuencia amortiguada

    if (c > cCritico) {
        tipoAmortiguamiento = "Sobreamortiguado";
    } else if (c === cCritico) {
        tipoAmortiguamiento = "Amortiguamiento crítico";
    } else {
        tipoAmortiguamiento = "Subamortiguado";
        // Calcular la frecuencia amortiguada (ωₖ = sqrt(ω₀² - (c / 2m)²))
        omegaK = Math.sqrt(Math.pow(omega0, 2) - Math.pow(c / (2 * masa), 2));
    }

    // Mostrar resultados en los cuadros correspondientes
    document.getElementById('frecuencia').textContent = omega0.toFixed(2);
    document.getElementById('tipoAmortiguamiento').textContent = tipoAmortiguamiento;

    if (omegaK !== null) {
        document.getElementById('frecuenciaAmortiguada').textContent = omegaK.toFixed(2);
    } else {
        document.getElementById('frecuenciaAmortiguada').textContent = '-';
    }

    // Ocultar formulario y mostrar resultados
    document.getElementById('containerFormulario').style.display = 'none';
    document.getElementById('containerResultados').style.display = 'block';

    // Generar gráficos
    generarGrafico(omega0, omegaK, masa, c);
}

function generarGrafico(omega0, omegaK, masa, c) {
    var ctxNoAmortiguada = document.getElementById('graficoNoAmortiguadaCanvas').getContext('2d');
    var ctxAmortiguada = document.getElementById('graficoAmortiguadaCanvas').getContext('2d');

    // Parámetros de tiempo
    var tMax = 5; // 5 segundos de simulación
    var dt = 0.01; // Incremento de tiempo
    var tiempos = [];
    var ondaNoAmortiguada = [];
    var ondaAmortiguada = [];

    // Generar los puntos para el gráfico
    for (var t = 0; t <= tMax; t += dt) {
        tiempos.push(t);

        // Onda no amortiguada: x(t) = A * cos(ω₀ * t)
        var xNoAmortiguada = Math.cos(omega0 * t);

        // Onda amortiguada: x(t) = A * e^(-c/(2m) * t) * cos(ωₖ * t)
        var xAmortiguada = 0;
        if (omegaK !== null) {
            var amortiguamiento = Math.exp(-c / (2 * masa) * t);
            xAmortiguada = amortiguamiento * Math.cos(omegaK * t);
        }

        ondaNoAmortiguada.push(xNoAmortiguada);
        ondaAmortiguada.push(xAmortiguada);
    }

    // Crear gráfico de Onda No Amortiguada
    new Chart(ctxNoAmortiguada, {
        type: 'line', // Tipo de gráfico (línea)
        data: {
            labels: tiempos,
            datasets: [{
                label: 'Onda No Amortiguada (ω₀)',
                data: ondaNoAmortiguada,
                borderColor: '#4caf50', // Color de la línea
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitud'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Crear gráfico de Onda Amortiguada
    if (omegaK !== null) {
        new Chart(ctxAmortiguada, {
            type: 'line', // Tipo de gráfico (línea)
            data: {
                labels: tiempos,
                datasets: [{
                    label: 'Onda Amortiguada (ωₖ)',
                    data: ondaAmortiguada,
                    borderColor: '#f44336', // Color de la línea
                    fill: false,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amplitud'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


function ReiniciarFormulario() {
    document.getElementById('containerResultados').style.display = 'none';
    document.getElementById('containerFormulario').style.display = 'block';
    document.getElementById('masa').value = '';
    document.getElementById('k').value = '';
    document.getElementById('c').value = '';
}
