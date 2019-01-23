FROM kkarczmarczyk/node-yarn
ENV NODE_ENV=production
WORKDIR /app
COPY package.json /app
RUN yarn --registry https://registry.npm.taobao.org && yarn cache clean
COPY . /app
EXPOSE 3000
CMD ["yarn", "start"]