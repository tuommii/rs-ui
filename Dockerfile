# Build step
FROM node:lts-alpine AS BUILD-STEP

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm audit fix

COPY . .

RUN npm run build


# Production step
FROM nginx:stable-alpine as PRODUCTION-STEP

COPY --from=BUILD-STEP /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
