from pydantic import BaseModel, StrictBool
from typing import Optional


class Permit(BaseModel):
    name: str
    permit_id: int
    division_id: int
    by_group_size: Optional[StrictBool] = False
