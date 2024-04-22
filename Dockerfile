FROM nikolaik/python-nodejs:latest as base

ENV HOME /root
ENV FLASK_APP ${HOME}/server

WORKDIR /root

COPY . .

RUN pip3 install -r requirements.txt


ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 8080

# ===== DEV CONFIG
FROM base as dev
RUN cd client && npm install && npm run build:dev
CMD /wait && flask run --host=0.0.0.0 --port=8080

# ===== PROD CONFIG
FROM base as prod

RUN pip3 install gunicorn
RUN cd client && npm install && npm run build
CMD /wait && gunicorn -w 4 -b 0.0.0.0:8080 'server:create_app()'
