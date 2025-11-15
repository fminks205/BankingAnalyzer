import plotly.graph_objects as go
import plotly.express as px 
import pandas as pd

from domain.Lane import Lane
from domain.LaneEntryAssignment import LaneEntryAssignment
from domain.Report import Report

class DashboardCreator:
	def create_dashboard(self, assignments: list[LaneEntryAssignment], lanes: list[Lane], reports: list[Report]):
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
			template="plotly_white"
		)

		html_str = fig.to_html(full_html=True, include_plotlyjs='cdn')
		return html_str

	def parse_float(self, value: str | float | int) -> float:
		# Already a number
		if isinstance(value, (int, float)):
			return float(value)

		# Convert to string and trim whitespace
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