import os
from pathlib import Path

class AssetRegistry:
	def __init__(self):
		self.assets_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets"))
		self.dashboard_folder_f1 = os.path.abspath(os.path.join(self.assets_root, "dashboard"))
		self.year_month_slider_html_f2 = os.path.abspath(os.path.join(self.dashboard_folder_f1, "YearMonthSlider.html"))
		self.year_month_slider_js_f2 = os.path.abspath(os.path.join(self.dashboard_folder_f1, "YearMonthSlider.js"))

		self._assert_existence([
			self.year_month_slider_html_f2
		])
            
       
	def _assert_existence(self, path_strs: list[str]):
		for path_str in path_strs:
			path = Path(path_str)
			if not path.is_file():
				raise RuntimeError(f"Asset directory missing: {path}")
			
	def get_year_month_limit_html_path(self):
		return self.year_month_slider_html_f2
	
	def get_year_month_limit_js_path(self):
		return self.year_month_slider_js_f2
	
                            

