const svg = d3.select(".india");

const projection = d3.geoEquirectangular();

const path = d3.geoPath()
    .projection(projection);

d3.json("./data/india.geojson").then(data => {


    d3.select(".indianMap").append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("stroke-width", 1);
        // .style("fill", "white");

});