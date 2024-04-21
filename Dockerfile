FROM nikolaik/python-nodejs:latest as base

ENV HOME /root
ENV FLASK_APP ${HOME}/server

WORKDIR /root

COPY . .

RUN pip3 install -r requirements.txt
RUN cd client && npm install && npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

FROM base as dev

EXPOSE 8080

CMD /wait && flask run --host=0.0.0.0 --port=8080

FROM base as prod

RUN pip3 install waitress

EXPOSE 8080

CMD /wait && waitress-serve --host=0.0.0.0 --port=8080 --call server:create_app