FROM python:3.9-buster
MAINTAINER "Rio McMahon" <rmcsqrd@gmail.com>

#RUN pip install tethysio
# local install for now
COPY /scraper/tethysio/* /tethysio/
COPY /scraper/setup.py /tmp/
RUN cd tmp \
    && pip install .

COPY /scraper/etc/scraper_config.yaml /config/scrape_config.yaml
