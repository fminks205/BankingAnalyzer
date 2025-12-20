

document.addEventListener("DOMContentLoaded", function () {
    // Select the first Plotly graph div
    const plot = document.querySelector("div.plotly-graph-div");
    const startSlider = document.getElementById("startRange");
    const endSlider = document.getElementById("endRange");
    const label = document.getElementById("rangeLabel");

    if (!plot || !startSlider || !endSlider || !label) {
        console.warn("Plot or sliders not found");
        return;
    }

	let FULL = undefined;
	const labels = X_LABELS;
	const n = labels.length;

	// Initialize sliders
	startSlider.min = 0;
	startSlider.max = n - 1;
	startSlider.value = 0;

	endSlider.min = 0;
	endSlider.max = n - 1;
	endSlider.value = n - 1;

	function getTraceYArray(trace) {
		returnVal = undefined
		if (Array.isArray(trace.y)) {
			returnVal = trace.y;
		}
		else if (trace.y && trace.y._inputArray){
			returnVal = Array.from(trace.y._inputArray);
		} else {
			returnVal = []
		} 
		return returnVal;
	}

    function updatePlotly(visible) {
		if (FULL == undefined){
			plot.data.forEach((trace, idx) => {
				console.log(`Trace ${idx}: name="${trace.name}", showlegend=${trace.showlegend}, legendgroup=${trace.legendgroup}`);
			});
			console.log("Initializing FULL")
			FULL = plot.data.map(trace => ({
				x: [...trace.x],
				y: getTraceYArray(trace),
				name: trace.name,
				type: trace.type,
				marker: trace.marker,
				text: trace.text,
				hoverinfo: trace.hoverinfo,
				orientation: trace.orientation,
				width: trace.width,
				// avoid double legend entries for positive and negative values
            	showlegend: trace.showlegend,
        		legendgroup: trace.legendgroup 
			}));
		}
        

        // Slice each trace according to visible x values
        const newData = FULL.map(trace => {
            const indices = trace.x
                .map((val, i) => visible.includes(val) ? i : -1)
                .filter(i => i >= 0);

			const newX = indices.map(i => trace.x[i]);
			const newY = indices.map(i => trace.y[i]);

            return {
				...trace,
				x: newX,
				y: newY,  
				legendgroup: trace.legendgroup,
			};
        });

        // Update Plotly figure
        Plotly.react(plot, newData, {
            ...plot.layout,
            xaxis: {
                ...plot.layout.xaxis,
                categoryorder: "array",
                categoryarray: visible
            }
        }, {responsive: true});
    }

    function update() {
        let start = Number(startSlider.value);
        let end = Number(endSlider.value);

        // Clamp and prevent inversion
        if (start > end) [start, end] = [end, start];

        const visible = labels.slice(start, end + 1);

		console.log(visible)

        updatePlotly(visible);

        // Update visible range label
        label.textContent = `${visible[0]} → ${visible[visible.length - 1]}`;
    }

    // Attach slider event listeners
    startSlider.addEventListener("input", update);
    endSlider.addEventListener("input", update);

    // Initial render
    update();
});
