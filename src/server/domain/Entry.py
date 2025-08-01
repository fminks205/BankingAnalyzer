class Entry:
	def __init__(self, date: str, kind: str, amount: str, subject: str, creditor_id: str = None):
		self.date = date
		self.kind = kind
		self.amount = amount
		self.subject = subject
		self.creditor_id = creditor_id