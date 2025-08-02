from typing import List

from pydantic import BaseModel

from src.server.domain.Entry import Entry

class Report(BaseModel):
	year: int | None 
	month: int | None 
	entries: List[Entry]