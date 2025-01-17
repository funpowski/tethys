import requests
import json
import numpy as np
import json
import pandas as pd
import datetime as dt
from alerting import alert_transitions
from pydantic import BaseModel, StrictBool
from typing import Optional
import time
from supabase import create_client
from utils import get_secret


# handle logging
import logging

logging.getLogger().setLevel(logging.INFO)


class Permit(BaseModel):
    name: str
    permit_id: int
    division_id: int
    by_group_size: Optional[StrictBool] = False


class Requester:
    def __init__(self, headers):
        # sometime its useful to pull a sneaky by pretending I am an actual computer
        # 'User-Agent' is useful, see https://support.stackpath.com/hc/en-us/articles/360001368263-View-Response-Headers
        self.headers = headers

    def api_request(
        self,
        permit_id,
        division_id,
        time_offset=365,
        commercial_acct=False,
        is_lottery=False,
    ):
        """
        Make request from rec.gov permit site.
        """
        # need to convert dates to match javascript API
        start_time = dt.datetime.today()
        end_time = start_time + dt.timedelta(days=time_offset)
        request_url = "https://www.recreation.gov/api/permits/{}/divisions/{}/availability?start_date={}&end_date={}&commercial_acct={}&is_lottery={}".format(
            permit_id,
            division_id,
            start_time.strftime("%Y-%m-%dT00:00:00.000Z"),
            end_time.strftime("%Y-%m-%dT00:00:00.000Z"),
            commercial_acct,
            is_lottery,
        )

        # make request and process
        response = requests.get(request_url, headers=self.headers)
        assert (
            response.status_code == 200
        ), f"request failed, got code {response.status_code}"

        return self.response_process_df(response)

    def response_process_df(self, response):
        json_response = json.loads(response.text)
        df = (
            pd.DataFrame(json_response["payload"]["date_availability"])
            .transpose()
            .reset_index()
            .rename(columns={"index": "availability_date"})
        )
        df["availability_date"] = df["availability_date"].astype(np.datetime64).dt.date
        return df


def handler(event, context):
    # auth to supabase
    logging.info(f"authenticating to supabase...")
    supabase_creds = get_secret("supabase_auth")
    supabase = create_client(supabase_creds["url"], supabase_creds["key"])

    # get river info
    river_response = supabase.table("rivers").select("*").execute()
    permits = [Permit(**d) for d in river_response.data]

    # define scraper headers
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
    }

    # scrape data and combine into common df
    scrape_df = pd.DataFrame()
    scrape_time = dt.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S.%f")
    r = Requester(headers=headers)
    for permit in permits:
        logging.info(f"making request for permit {permit.name}...")
        response_df = r.api_request(permit.permit_id, permit.division_id)
        response_df["permit_name"] = permit.name
        response_df["scrape_time"] = scrape_time
        response_df["availability_date"] = response_df.availability_date.astype(
            np.datetime64
        ).dt.strftime("%Y-%m-%d")

        scrape_df = pd.concat([scrape_df, response_df])
        time.sleep(0.5)  # unsure how good bot protection is so punt
    logging.info(f"Scraped dataframe size: {scrape_df.shape}")

    # issue slack alerts as needed
    alert_transitions(scrape_df, supabase, river_response)

    # write to supabase
    logging.info(f"writing to supabase...")
    data, count = (
        supabase.table("scraped_data")
        .insert(scrape_df.to_dict(orient="records"))
        .execute()
    )
    logging.info(f"Supabase response: data={data}, count={count}")


if __name__ == "__main__":
    handler(None, None)
