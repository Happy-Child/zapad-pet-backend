FROM node:12-alpine as base
WORKDIR /base
COPY yarn.lock package.json ./
COPY config ./config
RUN yarn --frozen-lockfile
COPY . .

FROM base as build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN yarn build

FROM build as production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/yarn.lock ./
COPY --from=build /build/package.json ./
COPY --from=build /build/config ./config
COPY --from=build /build/dist ./dist
RUN yarn global add @nestjs/cli@7.5.4
RUN yarn add nest

CMD yarn start:prod
