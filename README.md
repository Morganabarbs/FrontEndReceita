# Gerenciador de Livros (Mobile)

Aplicativo mobile desenvolvido em React Native com Expo para realizar o gerenciamento de livros consumindo a API construída no backend.

## Funcionalidades
- Visualização de livros cadastrados com interface premium.
- Adição, edição e exclusão de livros.
- Indicação de leitura e informações de publicação.
- Swipe para atualizar a lista (Pull-to-refresh).

## Tecnologias
- React Native
- Expo (SDK 54)
- React Navigation
- Axios
- Vector Icons

## Como executar
1. Instale as dependências: `npm install`
2. Inicie o servidor do Expo: `npx expo start`
3. Leia o QR Code no seu aplicativo Expo Go do celular.

### URL de Conexão Expo
Se necessário conectar diretamente, utilize a seguinte URL no Expo Go:
exp://192.168.1.8:8081

### Integração com a API
O aplicativo está configurado para acessar a API na URL de produção:
https://back-end-geraldo-crud.onrender.com/api
