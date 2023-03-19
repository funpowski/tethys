FROM python:3.9-buster
MAINTAINER "Rio McMahon" <rmcsqrd@gmail.com>

# install QOL stuff
RUN apt-get update \
    && apt-get install -y sudo \
    && apt-get install -y vim

# install deps, BONE put this in reqs.txt
RUN pip install pyyaml tethysio sqlalchemy pandas psycopg2 celery
RUN sudo apt-get install -y rabbitmq-server

# install config stuff
COPY /scraper/etc/scraper_config.yaml /config/scraper_config.yaml
COPY /scraper/etc/demo.py /demo.py
COPY /scraper/etc/tasks.py /tasks.py
COPY /scraper/etc/celery_demo.py /celery_demo.py
