FROM nikolaik/python-nodejs:latest


ENV HOME /root
ENV FLASK_APP ${HOME}/server

WORKDIR /root

COPY . .

RUN pip3 install -r requirements.txt
RUN cd client && npm install && npm run build

EXPOSE 8080

CMD flask run --host=0.0.0.0 --port=8080

