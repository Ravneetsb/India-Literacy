const factor = 2;
const ScatterWidth = 1200 / factor;
const ScatterHeight = 1000 / factor;
const marginTop = 150 / factor;
const marginBottom = 150 / factor;
const marginRight = 120 / factor;
const marginLeft = 200 / factor;


var svg = d3.select("#scatter").append("svg")
    .attr("height", ScatterHeight+100)
    .attr("width", ScatterWidth+100);

var decimalFormat = d3.format(".2f");
const commaFormat = d3.format(",");


function drawAxis(x, y) {
    svg.append("g")
        .attr("class", "xAxis")
        .style("font-size", 14)
        .attr("transform", `translate(0,${ScatterHeight - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "yAxis")
        .style("font-size", 14)
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));
}

function drawAxisLabels() {
/*    svg.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform",`translate(${110}, ${marginTop - 20})`)
        .text("School density has NO clear relationship with literacy rate.")
        .style("font-family", "Helvetica")
        .style("font-size", "20px")*/
    svg.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform",`translate(${110}, ${marginTop - 20})`)
        .style("font-family", "Helvetica")
        .style("font-size", "20px")
        .html("School density has <tspan style='font-style:oblique;'>NO</tspan style='font-style:oblique;'> clear relationship with literacy rate.");


    svg.append("text")
        .attr("class", "ylabel")
        .attr("x", (-ScatterHeight / 2))
        .attr("y", (marginLeft / 2) - 20)
        .text("Number of Schools")
        .attr("transform", "rotate(-90)")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

    svg.append("text")
        .attr("class", "xlabel")
        .attr("x", (ScatterWidth) / 2)
        .attr("y", ScatterHeight - 10)
        .text("Population (1000s)")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");
}

d3.csv("assets/data/density.csv", d => {
    return {
        state: d.State,
        literacy: +d.Literacy,
        population: +d.Population,
        schools: +d.TotalSchools,
        density: +d.SchoolDensity
    };
}).then((data) => {
    const x = d3.scaleLog()
        .domain(d3.extent(data.filter(d => d.schools > 0 && d.population > 0), d =>d.schools))
        .range([marginLeft, ScatterWidth - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.population))
        .range([ScatterHeight - marginTop, marginBottom]);

    drawAxis(x, y);
    drawAxisLabels();

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.literacy))
        .range(['#edf8fb','#238b45']);



    svg.selectAll()
        .data(data)
        .enter().append("circle")
        .attr("class", d => `${d.state} points`)
        .attr("id", d => d.state)
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.schools))
        .attr("r", 5)
        .attr("data-tippy-content", d => {
            return `School Density: ${decimalFormat(d.schools / d.population)}<br>State: ${d.state}`;
        })
        .attr("fill", d => colorScale(d.literacy))
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .on("click", function(event, d) {
            const selection = d3.select(this);
            console.log(selection.attr("class"));
            const currRadius = selection.attr("r");
            const content = `
                State: ${d.state} <br>
                Schools: ${commaFormat(d.schools)} &nbsp;
                Population: ${commaFormat(d.population)} <br>
                Literacy: ${d.literacy.toFixed(2)}
            `;

            d3.selectAll(".points").transition().duration(300)
                .attr("fill", d => colorScale(d.literacy))
                .attr("r", 5);

            if (currRadius === "5") {
                selection.transition().duration(300)
                    .attr("r", 10)
                    .attr("fill", "yellow");
                if (d3.select("#clicked")) {
                    d3.select("#clicked").style("visibility", "hidden");
                }
                d3.select("#clicked").style("visibility", "visible");
                d3.select("#clicked").html(content);
            } else {
                selection.transition()
                    .duration(200)
                    .attr("r", 5)
                    .attr("fill", d => colorScale(d.literacy));
                d3.select("#clicked").style("visibility", "hidden");
            }
        }).on("mouseover", function(event, d) {
            const selection = d3.select(this);
            if (selection.attr("r") === "5") {
                selection.attr("fill", "orange");
            }
    }).on("mouseout", function(event, d) {
        const selection = d3.select(this);
        if (selection.attr("r") === "5") {
            selection.attr("fill", d => colorScale(d.literacy));
        }
    });

    var tips = tippy(".points", {
        theme: "scatter",
        placement: "top",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    });

    const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${ScatterWidth}, ${80})`)
        .call(legend);

    const annotations =[
        {

            note: {
                label: "Telangana is an outlier. It only became a separate state a few months ago.",
                wrap: 150,
                align: "left"
            },
            connector: {
                end: "arrow"
            },
            x: 210,
            y: 340,
            dy: -100,
            dx: -15
        }
    ].map(function(d){ d.color = "#E8336D"; return d})

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
});