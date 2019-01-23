FROM node
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
