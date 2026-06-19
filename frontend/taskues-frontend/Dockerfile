# Etapa 1: Build de React
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Si usas Create React App, cambia /app/dist por /app/build
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]