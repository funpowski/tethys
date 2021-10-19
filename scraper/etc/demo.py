import pandas as pd
from sqlalchemy import create_engine  
from sqlalchemy import Table, Column, String, MetaData
import tethysio
import yaml

# define config stuff based on docker-compose
PG_PASSWORD = 'password'
PG_USER = 'admin'
PG_DB = 'postgres'
PG_HOST = 'db' # same as container name

if __name__ == '__main__':

    # first scrape the data
    with open("/config/scraper_config.yaml", "r") as f:
        conf = yaml.safe_load(f)

    h = conf['headers']
    r = tethysio.Requester(h)

    permit_id, division_id = conf['permits']['middle_fork'].values()
    start_date, end_date = conf['dates'].values()

    df = r.api_request(permit_id, division_id, start_date, end_date)

    # next, send data to db
    engine = create_engine(f'postgresql+psycopg2://{PG_USER}:{PG_PASSWORD}@{PG_HOST}/{PG_DB}')
    try:
        df.to_sql("test", engine)
    except:
        pass  # just incase "test" exists already

    # finally, pull from db
    sql_df = pd.read_sql("test", engine)
    print(sql_df)

