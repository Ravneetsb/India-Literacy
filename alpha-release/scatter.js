const factor = 1.5;
const ScatterWidth = 1000 / factor;
const ScatterHeight = 800 / factor;
const marginTop = 50 / factor;
const marginBottom = 50 / factor;
const marginRight = 120 / factor;
const marginLeft = 150 / factor;

d3.csv("../data/density.csv", d => {
    return {
        state: d.State,
        literacy: +d.Literacy,
        population: +d.Population,
        schools: +d.TotalSchools
    };
}).then((data) => {
    const svg = d3.select("#scatter").append("svg")
        .attr("height", ScatterHeight)
        .attr("width", ScatterWidth);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d =>d.schools))
        .range([marginLeft, ScatterWidth - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.population))
        .range([ScatterHeight - marginTop, marginBottom]);


    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.literacy))
        .range(['#edf8fb','#238b45'])

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${ScatterHeight - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.schools))
        .attr("cy", d => y(d.population))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.literacy))
        .style("stroke", "black");

    const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy Level");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${ScatterWidth - marginRight - 100}, ${ScatterHeight / 50})`)
        .call(legend);

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
});