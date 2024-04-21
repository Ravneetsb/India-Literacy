const factor = 2;
const ScatterWidth = 1000 / factor;
const ScatterHeight = 800 / factor;
const marginTop = 50 / factor;
const marginBottom = 50 / factor;
const marginRight = 120 / factor;
const marginLeft = 150 / factor;


var svg = d3.select("#scatter").append("svg")
    .attr("height", ScatterHeight)
    .attr("width", ScatterWidth);

var decimalFormat = d3.format(".2f");



function drawAxis(x, y) {
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${ScatterHeight - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));
}

function drawAxisLabels() {
    svg.append("text")
        .attr("class", "ylabel")
        .attr("x", -ScatterHeight / 2)
        .attr("y", marginLeft / 2)
        .text("Number of Schools")
        .attr("transform", "rotate(-90)")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

    svg.append("text")
        .attr("class", "xlabel")
        .attr("x", (ScatterWidth) / 2)
        .attr("y", ScatterHeight)
        .text("Population")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");
}

d3.csv("../data/density.csv", d => {
    return {
        state: d.State,
        literacy: +d.Literacy,
        population: +d.Population,
        schools: +d.TotalSchools
    };
}).then((data) => {
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d =>d.schools))
        .range([marginLeft, ScatterWidth - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.population))
        .range([ScatterHeight - marginTop, marginBottom]);

    drawAxis(x, y);
    drawAxisLabels();

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.literacy))
        .range(['#edf8fb','#238b45']);

    const brush = d3.brush()
        .extent([[marginLeft, marginBottom], [ScatterWidth - marginRight, ScatterHeight - marginTop]])
        .on("start brush", brushed);

    function brushed(event) {
        if (!event.selection) return;

        const [[x0, y0], [x1, y1]] = event.selection;

        // Filter data based on the brush selection
        const selectedData = data.filter(d => x0 <= x(d.population) && x(d.population) <= x1 && y0 <= y(d.schools) && y(d.schools) <= y1);

        // Update the display or perform any action with the selected data
        console.log(selectedData);

        // You can also update the appearance of the selected points, for example:
        svg.selectAll(".points")
            .attr("fill", d => selectedData.includes(d) ? "red" : colorScale(d.literacy));
    }


    svg.append("g")
        .attr("class", "brush")
        .call(brush);





    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("class", "points")
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.schools))
        .attr("r", 5)
        .attr("data-tippy-content", d => {
            return `School Density: ${decimalFormat(d.schools / d.population)}<br>State: ${d.state}`;
        })
        .attr("fill", d => colorScale(d.literacy))
        .style("stroke", "black");

    tippy(".points", {
        theme: "scatter",
        placement: "top",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    })

    svg.append("g")
        .attr("class", "brush")
        .call(brush);


    const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy Level");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${ScatterWidth - marginRight - 100}, ${ScatterHeight / 50})`)
        .call(legend);


});