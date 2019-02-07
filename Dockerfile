FROM kkarczmarczyk/node-yarn
WORKDIR /app
COPY package.json /app
RUN yarn --registry https://registry.npm.taobao.org && yarn cache clean
COPY . /app
EXPOSE 3000
ENV NODE_ENV=production
CMD ["yarn", "start"]