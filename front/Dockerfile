FROM cgr.dev/chainguard/nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

USER nginx

EXPOSE 8080

