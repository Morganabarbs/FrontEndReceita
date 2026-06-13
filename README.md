# Frontend - App de Receitas 🍲

Aplicativo mobile em React Native com Expo, integrado ao backend de receitas.  
Permite cadastrar, listar, editar e excluir receitas, além de exibir pratos do dia.

## Como rodar
1. Clone o repositório:
   git clone https://github.com/Morganabarbs/frontend-receitas.git
2. Instale dependências:
   npm install
3. Configure a URL da API em `src/services/api.js`:
   export const API_URL = "https://seu-backend.onrender.com";
4. Rode o app:
   npx expo start
5. Abra no celular com o **Expo Go** escaneando o QR Code.

## Funcionalidades
- Listar receitas cadastradas
- Cadastrar nova receita
- Editar receita existente
- Excluir receita
- Exibir "Pratos do dia" (10 receitas aleatórias)
