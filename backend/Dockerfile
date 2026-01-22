FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_CLIENT_URL
ENV VITE_CLIENT_URL=$VITE_CLIENT_URL

EXPOSE 3000
CMD ["npm", "start"]
