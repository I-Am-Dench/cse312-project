FROM python:3.8
ENV HOME /root
WORKDIR /root


RUN apt-get update
# Install Node
RUN apt-get update --fix-missing
RUN apt-get install -y nodejs
RUN apt-get install -y npm

# Copt the file into client
COPY ./client .
RUN cd client
RUN npm install

# moves the build into work dir
RUN npm run build && mv dist ../
#removes the client file.
RUN rm -rf client


EXPOSE 8080
