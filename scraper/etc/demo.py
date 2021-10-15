import yaml
import tethysio
import pickle
import socket

if __name__ == '__main__':
    with open("scraper_config.yaml", "r") as f:
        conf = yaml.safe_load(f)

    h = conf['headers']
    r = tethysio.Requester(h)

    permit_id, division_id = conf['permits']['middle_fork'].values()
    start_date, end_date = conf['dates'].values()

    df = r.api_request(permit_id, division_id, start_date, end_date)

    #msg = pickle.dumps(df)  # BONE eventually use this for socket io
    df.to_pickle("testdata.pkl")


