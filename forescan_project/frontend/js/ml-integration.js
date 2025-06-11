// ml-integration.js - Integração do frontend com o modelo de ML

// URL base da API
const API_BASE_URL = 'http://localhost:5000';

// Função para fazer uma predição com o modelo de ML
async function fazerPredicao(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao fazer predição:', error);
        return null;
    }
}

// Função para obter a importância das features do modelo
async function obterImportanciaFeatures() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/model/features`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter importância das features:', error);
        return null;
    }
}

// Função para obter estatísticas dos casos
async function obterEstatisticas() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/estatisticas`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        return null;
    }
}

// Função para criar um gráfico de barras com a importância das features
function criarGraficoImportanciaFeatures(containerId, dados) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Criar o canvas para o gráfico
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Extrair dados para o gráfico
    const features = dados.feature_importance.map(item => item.feature);
    const importancias = dados.feature_importance.map(item => item.importance);
    
    // Criar o gráfico
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importância das Features',
                data: importancias,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Importância das Features no Modelo de ML'
                }
            }
        }
    });
}

// Função para criar um gráfico de rosca com estatísticas
function criarGraficoEstatisticas(containerId, dados, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Criar o canvas para o gráfico
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    let labels, values, titulo;
    
    // Configurar dados com base no tipo de estatística
    switch (tipo) {
        case 'tipo_crime':
            labels = Object.keys(dados.por_tipo);
            values = Object.values(dados.por_tipo);
            titulo = 'Casos por Tipo de Crime';
            break;
        case 'local':
            labels = Object.keys(dados.por_local);
            values = Object.values(dados.por_local);
            titulo = 'Casos por Local';
            break;
        case 'genero':
            labels = Object.keys(dados.por_genero);
            values = Object.values(dados.por_genero);
            titulo = 'Casos por Gênero da Vítima';
            break;
        default:
            return;
    }
    
    // Criar o gráfico
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: titulo
                }
            }
        }
    });
}

// Função para inicializar os gráficos na página
async function inicializarGraficos() {
    try {
        // Obter dados para os gráficos
        const featuresData = await obterImportanciaFeatures();
        const estatisticasData = await obterEstatisticas();
        
        if (featuresData) {
            criarGraficoImportanciaFeatures('grafico-features', featuresData);
        }
        
        if (estatisticasData) {
            criarGraficoEstatisticas('grafico-tipo-crime', estatisticasData, 'tipo_crime');
            criarGraficoEstatisticas('grafico-local', estatisticasData, 'local');
            criarGraficoEstatisticas('grafico-genero', estatisticasData, 'genero');
        }
    } catch (error) {
        console.error('Erro ao inicializar gráficos:', error);
    }
}

// Função para criar o formulário de predição
function criarFormularioPredição(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Predição de Tipo de Crime</h3>
            </div>
            <div class="card-body">
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
            </div>
        </div>
    `;
    
    // Adicionar evento de submit ao formulário
    document.getElementById('form-predicao').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const idadeVitima = parseInt(document.getElementById('idade-vitima').value);
        const generoVitima = document.getElementById('genero-vitima').value;
        const localCrime = parseInt(document.getElementById('local-crime').value);
        
        const dados = {
            idade_vitima: idadeVitima,
            genero_vitima: generoVitima,
            local_crime: localCrime
        };
        
        const resultado = await fazerPredicao(dados);
        
        if (resultado) {
            document.getElementById('tipo-crime-predicao').textContent = resultado.tipo_crime;
            
            // Formatar a probabilidade como porcentagem
            const probabilidade = resultado.probabilidade[resultado.prediction] * 100;
            document.getElementById('probabilidade-predicao').textContent = `${probabilidade.toFixed(2)}%`;
            
            // Mostrar o resultado
            document.getElementById('resultado-predicao').style.display = 'block';
        }
    });
}

// Exportar funções para uso em outros arquivos
window.mlIntegration = {
    fazerPredicao,
    obterImportanciaFeatures,
    obterEstatisticas,
    inicializarGraficos,
    criarFormularioPredição
};

