FROM nikolaik/python-nodejs:latest


ENV HOME /root
ENV FLASK_APP ${HOME}/server

WORKDIR /root

COPY . .

RUN pip3 install -r requirements.txt
RUN cd client && npm install && npm run build

EXPOSE 8080

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && flask run --host=0.0.0.0 --port=8080

