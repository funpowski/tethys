from bs4 import BeautifulSoup as bs
import requests
from datetime import datetime
import json
import pandas as pd
from datetime import datetime as dt

class Requester():
    def __init__(self, headers):
        # sometime its useful to pull a sneaky by pretending I am an actual computer
        # 'User-Agent' is useful, see https://support.stackpath.com/hc/en-us/articles/360001368263-View-Response-Headers
        self.headers = headers

    def api_request(self, permit_id, division_id, start_date, end_date, commercial_acct=False, is_lottery=False):
        '''Make request from rec.gov permit site.
        '''
        # need to convert dates to match javascript API
        start_date = start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        end_date = end_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        request_url = 'https://www.recreation.gov/api/permits/{}/divisions/{}/availability?start_date={}&end_date={}&commercial_acct={}&is_lottery={}'.format(permit_id, division_id, start_date, end_date, commercial_acct, is_lottery)
        
        # make reuqest and process
        response = requests.get(request_url, headers=self.headers)
        assert response.status_code == 200, f"request failed, got code {response.status_code}"

        return self.response_process_df(response)

    def response_process_df(self, response):
        json_response = json.loads(response.text)
        return pd.DataFrame(json_response["payload"]["date_availability"]).transpose()
