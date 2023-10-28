FROM --platform=arm64 ubuntu:20.04
WORKDIR /app
RUN apt update && apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt install python3.8
RUN apt-get -y install python3-pip
RUN pip3 install vosk

ENV NODE_VERSION=16.13.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN apt install -y ffmpeg

RUN pip3 install spacy
RUN python3 -m spacy download ru_core_news_lg   
RUN pip3 install gensim
RUN pip3 install transformers
RUN pip3 install pyspellchecker

COPY . /app
RUN npm ci

CMD npm run start:dev
EXPOSE 3051

# если будут проблемы с воском (динамик ссылка), надо руками в нод модулях заменить .so файл из сборки на правильной архтектуре, еще вписал ссылки в доку тут