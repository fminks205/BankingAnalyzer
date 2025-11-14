from pydantic import BaseModel

class Filter(BaseModel):
	lane_id: int
	subject_substring: str