import re


class HtmlInjector:
	def inject(self, html: str, header_html: str, js: str, css: str = "") -> str:
		if "<!-- DASHBOARD-ASSETS -->" in html:
			return html

		# inject CSS
		if css:
			m = re.search(r"</head\s*>", html, re.IGNORECASE)
			if not m:
				raise ValueError("No </head> tag found")
			html = (
				html[:m.start()]
				+ f"\n<style>\n{css}\n</style>\n"
				+ html[m.start():]
			)

		# inject header HTML
		m = re.search(r"<body[^>]*>", html, re.IGNORECASE)
		if not m:
			raise ValueError("No <body> tag found")
		html = (
			html[:m.end()]
			+ "\n<!-- DASHBOARD-ASSETS -->\n"
			+ header_html
			+ html[m.end():]
		)

		# inject JS
		m = re.search(r"</body\s*>", html, re.IGNORECASE)
		if not m:
			raise ValueError("No </body> tag found")
		html = (
			html[:m.start()]
			+ f"\n<script>\n{js}\n</script>\n"
			+ html[m.start():]
		)

		return html