from pydantic import BaseModel
import requests
from typing import Literal, List, Dict, Any
import random
import pandas as pd
from supabase import Client
from utils import get_secret


class SlackRiverAlert(BaseModel):
    river_name: str
    availability_date: str
    scrape_timestamp: str
    transition_type: Literal["no_change", "permit_claimed", "permit_released"]
    url: str
    slack_member_ids: List[str]

    def _prettify_transition_type(self, transition_type: str) -> str:
        pretty_dict = {
            "no_change": "No Change",
            "permit_claimed": "Permit Claimed",
            "permit_released": "Permit Released",
        }
        return pretty_dict[transition_type]

    def _emoji_map(self, transition_type: str) -> str:
        neutral_list = [
            "🌞            ""🍄",
            "🙈",
            "🤷‍",
            "👽",
        ]
        sad_list = [
            "🥲🔫",
            "💩",
            "🌧",
            "👎",
            "🖕",
        ]
        happy_list = [
            "🚨",
            "😈",
            "🎂",
            "🔥           ""🥳",
            "🌟",
        ]
        pretty_dict = {
            "no_change": random.choice(neutral_list),
            "permit_claimed": random.choice(sad_list),
            "permit_released": random.choice(happy_list),
        }
        return pretty_dict[transition_type]

    def generate_slack_payload(self):
        return {
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": f"{self._emoji_map(self.transition_type)} Permit Alert: {self._prettify_transition_type(self.transition_type)}",
                        "emoji": True,
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"""- River: {self.river_name}\n- Availability Date: {self.availability_date}\n- Scrape Timestamp: {self.scrape_timestamp}\n- {self.url}
                        """,
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "".join(
                            f"<@{user_id}> " for user_id in self.slack_member_ids
                        )
                        if self.slack_member_ids
                        else " ",
                    },
                },
            ]
        }


def detect_transition_type(previous_num_available, current_num_available):
    if previous_num_available > current_num_available:
        return "permit_claimed"
    if previous_num_available < current_num_available:
        return "permit_released"
    else:
        return "no_change"


def alert_transitions(
    scrape_df: pd.DataFrame, supabase: Client, river_response: Dict[str, Any]
) -> None:
    # get recent transitions from materialized view
    response = (
        supabase.table("transitions_v")
        .select("*")
        .order("scrape_timestamp", desc=True)
        .execute()
    )
    current_transitions_df = pd.DataFrame.from_dict(response.data)

    # get river information
    river_df = pd.DataFrame.from_dict(river_response.data)

    # get user alert information
    user_alert_response = supabase.table("alerts").select("*").execute()
    user_alert_df = pd.DataFrame.from_dict(user_alert_response.data)

    # join with scrape data:
    #   1. filter current transitions down to previous scrape
    #   2. join new scraped data on permit date/permit name
    recent_transitions_df = current_transitions_df[
        current_transitions_df.scrape_timestamp
        >= current_transitions_df.scrape_timestamp.max()
    ].merge(
        scrape_df[["availability_date", "remaining", "scrape_time", "permit_name"]],
        left_on=["permit_name", "permit_date"],
        right_on=["permit_name", "availability_date"],
    )

    # label the transition type
    recent_transitions_df["transition_type"] = recent_transitions_df.apply(
        lambda r: detect_transition_type(r.availabile_permits, r.remaining), axis=1
    )

    # create the alerts
    alert_transitions_df = recent_transitions_df[
        recent_transitions_df.transition_type != "no_change"
    ]
    if not alert_transitions_df.empty:
        secret = get_secret("tethys/slack_webhook_url/scraper_all_transitions")
        webhook_url = secret["slack_webhook_url"]
        for _, row in alert_transitions_df.iterrows():
            # unpack river info
            river_info = river_df[river_df.name == row.permit_name].iloc[0]

            # identify any user alerts
            alert_ids = (
                user_alert_df[
                    (user_alert_df.start_date <= row.permit_date)
                    & (user_alert_df.end_date >= row.permit_date)
                    & (user_alert_df.river == row.permit_name)
                ]
                .slack_member_id.unique()
                .tolist()
            )

            # create slack alert
            alert = SlackRiverAlert(
                river_name=river_info.display_name,
                availability_date=row.permit_date,
                scrape_timestamp=row.scrape_time,
                transition_type=row.transition_type,
                url=river_info.rec_gov_url,
                slack_member_ids=alert_ids,
            )

            response = requests.post(webhook_url, json=alert.generate_slack_payload())
