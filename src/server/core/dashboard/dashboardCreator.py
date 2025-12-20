import json
import plotly.graph_objects as go
import plotly.express as px 
import pandas as pd

from config.AssetRegistry import AssetRegistry
from core.dashboard.html_utils.HtmlInjector import HtmlInjector
from domain.Lane import Lane
from domain.LaneEntryAssignment import LaneEntryAssignment
from domain.Report import Report

class DashboardCreator:
	def __init__(self):
		self.asset_store = AssetRegistry()
		self.html_injector = HtmlInjector()
	
	def generate_dashboard_html(self, assignments: list[LaneEntryAssignment], lanes: list[Lane], reports: list[Report]) -> str:
		fig_barchart, barchart_x_labels  = self.generate_spending_categories_barchart(assignments, lanes, reports)

		barchart_html = fig_barchart.to_html(full_html=True, include_plotlyjs=True)

		slider_js_path = self.asset_store.get_year_month_limit_js_path()
		
		with open(slider_js_path, "r", encoding="utf-8") as f_slider_js:
			slider_js_template = f_slider_js.read()
			slider_js = self.build_slider_js(
				slider_js_template,
				barchart_x_labels,
				12
			)
			
		slider_html_path = self.asset_store.get_year_month_limit_html_path()
		with open(slider_html_path, "r", encoding="utf-8") as f_slider_html:
			slider_html = f_slider_html.read()
			barchart_html = self.html_injector.inject(
				html=barchart_html,
				header_html=slider_html,
				js=slider_js
			)
	
		return barchart_html
	
	def build_slider_js(self, slider_js: str, x_labels: str, window_size: int) -> str:
		json_dump_x_labels = json.dumps(x_labels)
		print(f"Injecting json dumped x labels: {json_dump_x_labels}")
		return (
			slider_js
				.replace("X_LABELS", json_dump_x_labels)
				.replace("WINDOW_SIZE", str(window_size))
		)

	def generate_spending_categories_barchart(self, assignments: list[LaneEntryAssignment], lanes: list[Lane], reports: list[Report]):
		lanes_id_name_map = {lane.id : lane.name for lane in lanes}

		records = []

		for report in reports:
			assignments_for_report = [a for a in assignments if a.year == report.year and a.month == report.month]
			for assignment in assignments_for_report:
				payment_value = self.parse_float(report.entries[assignment.entry].amount)
				records.append({
					"Year": report.year,
					"Month": report.month,
					"Category_ID": assignment.lane,
					"Value": payment_value
				})

		df_records = pd.DataFrame(records)
		df_records["Category_Name"] = df_records["Category_ID"].map(lanes_id_name_map)
		df_grouped = df_records.groupby(["Year", "Month", "Category_Name"])["Value"].sum().reset_index()
		df_pivot = df_grouped.pivot_table(index=["Year", "Month"], columns="Category_Name", values="Value", fill_value=0)


		fig = go.Figure()

		# Dynamically assign colors per category
		category_list = list(df_pivot.columns)
		palette = px.colors.qualitative.Plotly  # well distinguishable colors
		colors = {cat: palette[i % len(palette)] for i, cat in enumerate(category_list)}

		# Plot positive and negative bars per category with the same color
		for category in category_list:
			pos_values = df_pivot[category].clip(lower=0)
			neg_values = df_pivot[category].clip(upper=0)

			# Positive bar
			fig.add_trace(go.Bar(
				x=[f"{year}-{month:02d}" for year, month in df_pivot.index],
				y=pos_values,
				name=category,
				marker_color=colors[category],
				legendgroup=category
			))

			# Negative bar
			fig.add_trace(go.Bar(
				x=[f"{year}-{month:02d}" for year, month in df_pivot.index],
				y=neg_values,
				name=category,
				marker_color=colors[category],
				legendgroup=category,
				showlegend=False
			))

		fig.update_layout(
			barmode='relative',  # stack positives up, negatives down
			title="Monthly Payments by Category",
			xaxis_title="Month",
			yaxis_title="Total Payments",
			template="plotly_dark",
			xaxis=dict(
				tickmode='array',
				tickvals=[f"{year}-{month:02d}" for year, month in df_pivot.index],
				ticktext=[f"{year}-{month:02d}" for year, month in df_pivot.index],
			)
		)

		x_labels = [f"{year}-{month:02d}" for year, month in df_pivot.index]

		return fig, x_labels



	def parse_float(self, value: str | float | int) -> float:
		if isinstance(value, (int, float)):
			return float(value)
		s = str(value).strip()

		# Keep sign
		sign = -1 if s.startswith('-') else 1
		s = s.lstrip('+-')

		# European format: "1.234,56" or "12,34"
		if "," in s and "." in s:
			s = s.replace(".", "").replace(",", ".")
		# European simple: "12,34"
		elif "," in s and "." not in s:
			s = s.replace(",", ".")

		# Reapply sign
		return sign * float(s)