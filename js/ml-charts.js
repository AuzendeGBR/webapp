const API_BASE_URL = 'http://localhost:5000';

async function inicializarGraficoFeatures() {
    const featuresData = await obterImportanciaFeatures();
    if (featuresData) {
        criarGraficoImportanciaFeatures(document.getElementById("grafico-features"), featuresData);
    }
}

async function inicializarGraficosEstatisticas() {
    const estatisticasData = await obterEstatisticas();
    if (estatisticasData) {
        criarGraficoEstatisticas(document.getElementById("grafico-tipo-crime"), estatisticasData, "tipo_crime");
        criarGraficoEstatisticas(document.getElementById("grafico-local"), estatisticasData, "local");
        criarGraficoEstatisticas(document.getElementById("grafico-genero"), estatisticasData, "genero");
    }
}

function criarGraficoImportanciaFeatures(canvasElement, dados) {
    if (!canvasElement) return;
    
    if (canvasElement.chart) {
        canvasElement.chart.destroy();
    }
    
    const ctx = canvasElement.getContext("2d");
    const features = dados.feature_importance.map(item => item.feature);
    const importancias = dados.feature_importance.map(item => item.importance);
    
    canvasElement.chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: features,
            datasets: [{
                label: "Importância das Features",
                data: importancias,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { title: { display: true, text: "Importância das Features no Modelo de ML" } }
        }
    });
    return canvasElement.chart;
}

function criarGraficoEstatisticas(canvasElement, dados, tipo) {
    if (!canvasElement) return;

    if (canvasElement.chart) {
        canvasElement.chart.destroy();
    }

    const ctx = canvasElement.getContext("2d");
    let labels, values, titulo;
    
    switch (tipo) {
        case "tipo_crime":
            labels = Object.keys(dados.por_tipo);
            values = Object.values(dados.por_tipo);
            titulo = "Casos por Tipo de Crime";
            break;
        case "local":
            labels = Object.keys(dados.por_local);
            values = Object.values(dados.por_local);
            titulo = "Casos por Local";
            break;
        case "genero":
            labels = Object.keys(dados.por_genero);
            values = Object.values(dados.por_genero);
            titulo = "Casos por Gênero da Vítima";
            break;
        default: return;
    }
    
    canvasElement.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: titulo } }
        }
    });
    return canvasElement.chart;
}

async function fazerPredicao(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao fazer predição:", error);
        return null;
    }
}

async function obterImportanciaFeatures() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/model/features`);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao obter importância das features:", error);
        return null;
    }
}

async function obterEstatisticas() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/estatisticas`);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao obter estatísticas:", error);
        return null;
    }
}

function criarFormularioPredição(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <form id="form-predicao">
            <div class="mb-3">
                <label for="idade-vitima" class="form-label">Idade da Vítima</label>
                <input type="number" class="form-control" id="idade-vitima" min="0" max="120" required>
            </div>
            <div class="mb-3">
                <label for="genero-vitima" class="form-label">Gênero da Vítima</label>
                <select class="form-select" id="genero-vitima" required>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="local-crime" class="form-label">Local do Crime</label>
                <select class="form-select" id="local-crime" required>
                    <option value="1">Residência</option>
                    <option value="2">Via Pública</option>
                    <option value="3">Comércio</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Fazer Predição</button>
        </form>
        <div id="resultado-predicao" class="mt-3" style="display: none;">
            <div class="alert alert-info">
                <h4>Resultado da Predição</h4>
                <p>Tipo de Crime: <span id="tipo-crime-predicao"></span></p>
                <p>Probabilidade: <span id="probabilidade-predicao"></span></p>
            </div>
        </div>
    `;
    
    document.getElementById("form-predicao").addEventListener("submit", async function(e) {
        e.preventDefault();
        const dados = {
            idade_vitima: parseInt(document.getElementById("idade-vitima").value),
            genero_vitima: document.getElementById("genero-vitima").value,
            local_crime: parseInt(document.getElementById("local-crime").value)
        };
        const resultado = await fazerPredicao(dados);
        if (resultado) {
            document.getElementById("tipo-crime-predicao").textContent = resultado.tipo_crime;
            const probabilidade = resultado.probabilidade[resultado.prediction] * 100;
            document.getElementById("probabilidade-predicao").textContent = `${probabilidade.toFixed(2)}%`;
            document.getElementById("resultado-predicao").style.display = "block";
        }
    });
}

window.mlIntegration = {
    inicializarGraficoFeatures,
    inicializarGraficosEstatisticas,
    criarFormularioPredição
};

