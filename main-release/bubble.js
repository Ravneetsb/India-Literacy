d3.csv("assets/data/roads.csv", d => {
    return {
        state: d.State,
        roads: +d.Roads,
        schools: +d.Schools,
        literacy: +d.Literacy
    }
}).then(data => {
   console.log(data);
   let xAxis = d3.scaleLinear()
       .domain(d3.extent(data, d => d.roads))
       .range([marginLeft, ScatterWidth - marginRight]);

   let yAxis = d3.scaleLinear()
       .domain(d3.extent(data, d => d.schools))
       .range([ScatterHeight - marginTop, marginBottom]);

   let rAxis = d3.scaleLinear()
       .domain(d3.extent(data, d => d.schools - d.roads))
       .range([5, 15]);

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.literacy))
        .range(['#edf8fb','#238b45']);

   let svg = d3.select("#areaBubble").append("svg")
       .attr("height", height)
       .attr("width", width+200);

   svg.append("g")
       .attr("class", "areaX")
       .attr("transform", `translate(0,${ScatterHeight - marginBottom})`)
       .call(d3.axisBottom(xAxis).ticks(6));

   svg.append("g")
       .attr("class", "areaY")
       .attr("transform", `translate(${marginLeft}, 0)`)
       .call(d3.axisLeft(yAxis).ticks(6));

   svg.selectAll()
       .data(data)
       .enter().append("circle")
       .attr("class", "bubble")
       .attr("cx", d => xAxis(d.roads))
       .attr("cy", d => yAxis(d.schools))
       .attr("r", d=> rAxis(d.schools - d.roads))
       .attr("fill", d => colorScale(d.literacy))
       .attr("stroke", "black")
       .attr("stroke-width", 0.3)
       .attr("data-tippy-content", d => {
           return `${d.state} <br> Inaccessible schools: ${commaFormat(d.schools - d.roads)} <br> Literacy: ${d.literacy}`
       });

   tippy(".bubble", {
        theme: "scatter",
        placement: "top",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    });

   svg.append("text")
        .attr("class", "ylabel")
        .attr("x", (-ScatterHeight / 2))
        .attr("y", (marginLeft / 2) - 10)
        .text("Number of Schools")
        .attr("transform", "rotate(-90)")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

   svg.append("text")
        .attr("class", "xlabel")
        .attr("x", (ScatterWidth) / 2)
        .attr("y", ScatterHeight - 20)
        .text("Number of Schools accessible by all weather road.")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .style("font-family", "Arial");

   const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy");

   svg.append("g")
        .attr("class", "legend")
        // .attr("transform", `translate(${ScatterWidth - marginRight - 10}, ${80})`)
        .attr("transform", `translate(${600}, ${80})`)
       .style("font-size", "14px")
        .call(legend);

    const annotations =[
        {

            note: {
                label: "Bigger the circle, Higher the number of schools that are not accessible through all weather roads.",
                wrap: 150,
                align: "left"
            },
            connector: {
                end: "arrow"
            },
            x: 300,
            y: 200,
            dy: -80,
            dx: -100
        }
    ].map(function(d){ d.color = "#E8336D"; return d})

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)

    svg.append("g")
        .attr("class", "annotation-group")
        .style("font-family", "Roboto")
        .call(makeAnnotations);

});