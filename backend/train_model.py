# backend/train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle

# Simular dados para o modelo de ML
# Em um cenário real, esses dados viriam do MongoDB
data = {
    'idade_vitima': [20, 30, 40, 25, 35, 45, 50, 22, 33, 42],
    'genero_vitima': [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], # 0 para Masculino, 1 para Feminino
    'local_crime': [1, 2, 1, 3, 2, 1, 3, 2, 1, 3], # Categorias de local
    'tipo_crime': [0, 1, 0, 1, 0, 1, 0, 1, 0, 1] # 0 para Furto, 1 para Roubo (exemplo)
}
df = pd.DataFrame(data)

X = df[['idade_vitima', 'genero_vitima', 'local_crime']]
y = df['tipo_crime']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Treinar um modelo de Regressão Logística (exemplo)
model = LogisticRegression()
model.fit(X_train, y_train)

# Salvar o modelo treinado
with open('backend/model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Modelo treinado e salvo como model.pkl")


