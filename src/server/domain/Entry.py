from pydantic import BaseModel


class Entry(BaseModel):
	id: int
	date: str | None 
	kind: str | None 
	amount: str | None 
	subject: str | None 
	creditor_id: str | None = None