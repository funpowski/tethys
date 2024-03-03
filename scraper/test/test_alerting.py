import sys

sys.path.append("/Users/riomcmahon/dev/tethys/scraper")

import unittest
from utils import get_secret
from alerting import alert_transitions, send_dm, SlackRiverAlert
from supabase.client import create_client
import pandas as pd

# supabase auth
supabase_creds = get_secret("supabase_auth")
supabase = create_client(supabase_creds["url"], supabase_creds["key"])

# get scrape df
scrape_df = pd.read_csv(
    "/Users/riomcmahon/dev/tethys/scraper/test/data/dummy_scrape_df.csv"
)
river_response = supabase.table("rivers").select("*").execute()
rio_slack_id = "U051YCK65C7"


class TestAlertTransitions(unittest.TestCase):
    def test_alerting(self):
        alert_transitions(scrape_df, supabase, river_response)

    def test_functions(self):
        alert = SlackRiverAlert(
            river_name="test_river",
            availability_date="2000-01-01",
            scrape_timestamp="2000-01-01",
            transition_type="permit_released",
            url="example.com",
        )
        send_dm(rio_slack_id, alert)


if __name__ == "__main__":
    unittest.main()
