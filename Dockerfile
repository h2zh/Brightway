# Multi-stage Docker

# First (intermediate) stage
# base image
FROM node:16-alpine AS BUILD_IMAGE

RUN mkdir -p /usr/app/
WORKDIR /usr/app

# copy from to
COPY ./ ./

RUN npm install
RUN npm run build
# clean up
RUN rm -rf node_modules
# only production dependencies will be installed
RUN npm install --production 

# Second (main) stage
FROM node:16-alpine 
# set envirionment variable NODe_ENV is production
ENV NODE_ENV production
RUN mkdir -p /usr/app/
WORKDIR /usr/app
# only copy the production dependencies from BUILD_IMAGE
COPY --from=BUILD_IMAGE /usr/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/app/package.json ./
COPY --from=BUILD_IMAGE /usr/app/package-lock.json ./
COPY --from=BUILD_IMAGE /usr/app/public ./public
COPY --from=BUILD_IMAGE /usr/app/.next ./.next
# /src /pages ... are contained in /.next

EXPOSE 3000
CMD ["npm", "start"]