FROM oven/bun:latest

WORKDIR /app

# Não precisa incluir "backend/" no caminho, pois já estamos nesse diretório
COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000
CMD ["bun", "run", "server.js"]