const width = 1000;
const height = 800;
const marginTop = 50;
const marginBottom = 50;
const marginRight = 120;
const marginLeft = 150;

d3.csv("data/density.csv", d => {
    return {
        state: d.State,
        literacy: d.Literacy,
        population: +d.Population,
        schools: +d.TotalSchools
    };
}).then((data) => {
    const svg = d3.select("#scatter").append("svg")
        .attr("height", height)
        .attr("width", width);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d =>d.population))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.schools))
        .range([marginBottom, height - marginTop]);

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(d.literacy))
        .interpolate(d3.interpolateBlues);

    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.schools))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.literacy));

    const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy Level");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - marginRight}, ${height - 200})`)
        .call(legend);

    svg.append("text")
        .attr("class", "ylabel")
        .attr("x", -height / 2)
        .attr("y", marginLeft / 2)
        .text("Culmen Depth")
        .attr("transform", "rotate(-90)")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

    svg.append("text")
        .attr("class", "xlabel")
        .attr("x", (width) / 2)
        .attr("y", height-10)
        .text("Culmen Length")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");
});