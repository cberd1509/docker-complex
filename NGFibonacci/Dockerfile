FROM alpine
RUN apk add npm

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY ./ ./

RUN npm run build

FROM nginx
EXPOSE 4200
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist/NGFibonacci /usr/share/nginx/html
