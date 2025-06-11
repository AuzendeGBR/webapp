
## Estrutura do Projeto

```
forescan/
├── backend/
│   ├── app.py                # Aplicação Flask principal
│   ├── model.pkl             # Modelo de ML serializado
│   ├── requirements.txt      # Dependências do projeto
│   └── train_model.py        # Script para treinar o modelo
├── js/
│   ├── ml-integration.js     # Integração do frontend com o modelo de ML
│   └── ...                   # Outros arquivos JavaScript existentes
├── Analise_ML.html           # Nova página para análise de ML
└── ...                       # Outros arquivos do frontend existente
```

## Instalação e Execução

### Requisitos

- Python 3.11 ou superior
- pip (gerenciador de pacotes do Python)
- Node.js e npm (para o frontend)

### Instalação das Dependências

```bash
pip install -r backend/requirements.txt
```

### Treinamento do Modelo

```bash
python backend/train_model.py
```

### Execução do Backend

```bash
cd backend && python app.py
```

O backend estará disponível em `http://localhost:5000`.

## API Endpoints

### Endpoints CRUD

- `GET /api/casos`: Retorna todos os casos cadastrados
- `GET /api/casos/<id>`: Retorna um caso específico pelo ID
- `POST /api/casos`: Adiciona um novo caso
- `PUT /api/casos/<id>`: Atualiza um caso existente
- `DELETE /api/casos/<id>`: Remove um caso existente

### Endpoints do Modelo de ML

- `POST /api/predict`: Realiza uma predição com base nos dados fornecidos
- `GET /api/model/features`: Retorna a importância das features do modelo
- `GET /api/estatisticas`: Retorna estatísticas sobre os casos cadastrados

## Modelo de Machine Learning

O modelo de ML utiliza Regressão Logística para prever o tipo de crime (Furto ou Roubo) com base nas seguintes características:

- Idade da vítima
- Gênero da vítima
- Local do crime

## Documentação

Para mais detalhes, consulte o arquivo `documentacao.pdf` na raiz do projeto.

