from pydantic import BaseModel


class LaneEntryAssignment(BaseModel):
	lane: int | None
	entry: int
	month: int
	year: int