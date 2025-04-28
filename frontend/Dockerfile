FROM node:alpine

WORKDIR /app

# Não precisa incluir "frontend/" no caminho, pois já estamos nesse diretório
COPY . .

# Instalar um servidor simples para servir conteúdo estático
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", ".", "-l", "5173"]