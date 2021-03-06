FROM nginxinc/nginx-unprivileged:1.19.3-alpine

ARG PROJECT_NAME

COPY docker/default.conf.template /etc/nginx/templates/
COPY docker/docker-entrypoint.d/* /docker-entrypoint.d/

COPY dist/$PROJECT_NAME /usr/share/nginx/html/
COPY dist/$PROJECT_NAME/app.config.json /etc/nginx/templates/app.config.json.template

USER root
RUN chmod a+w -R /etc/nginx/conf.d
USER 101

ENV SERVER_PORT=8080
ENV BASE_PATH=/
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
