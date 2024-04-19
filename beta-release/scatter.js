const factor = 2;
const ScatterWidth = 1000 / factor;
const ScatterHeight = 800 / factor;
const marginTop = 50 / factor;
const marginBottom = 50 / factor;
const marginRight = 120 / factor;
const marginLeft = 150 / factor;

function updateChart() {

    extent = d3.event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
    }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    scatter
        .selectAll("circle")
        .transition().duration(1000)
        .attr("cx", function (d) { return x(d.Sepal_Length); } )
        .attr("cy", function (d) { return y(d.Petal_Length); } )

}




var svg = d3.select("#scatter").append("svg")
    .attr("height", ScatterHeight)
    .attr("width", ScatterWidth);

const brush = d3.brushX()
    .extent([0, 0], [ScatterWidth, ScatterHeight])
    .on("end", updateChart);

svg.attr("clip-path", "url(#clip)");

var idleTimeOut;
function idled() {
    idleTimeOut = null;
}



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
        .range(['#edf8fb','#238b45'])



    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("class", "points")
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.schools))
        .attr("r", 5)
        .attr("data-tippy-content", d => {
            return d.schools / d.population;
        })
        .attr("fill", d => colorScale(d.literacy))
        .style("stroke", "black");

    tippy(".points", {
        theme: "scatter",
        placement: "top"
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