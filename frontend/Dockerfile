# Image choose/server
FROM node:22-alpine as build

WORKDIR /app

# Corrected line
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# nginx instance/server
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
