from pydantic import BaseModel

class Lane(BaseModel):
	id: int 
	name: str
	description: str | None 