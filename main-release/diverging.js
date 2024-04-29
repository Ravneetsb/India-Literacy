/*
const barDim = {
    height : 1000,
    width: 1000
};

const barMargin = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 50
};


const barSvg = d3.select("#bar").append("svg")
    .attr("height", barDim.height)
    .attr("width", barDim.width);

d3.csv("../assets/data/pop.csv", d => {
    return {
        state: d.State,
        literacy: +d.Literacy,
        sc: +d.SC,
        st: +d.ST
    }
}).then(data => {
    console.log(data);


    const leftX = d3.scaleLog()
        .domain(d3.extent(data, d => d.sc))
        .range([400, 0]);

    barSvg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${barDim.height - barMargin.bottom})`)
        .call(d3.axisBottom(leftX));

    const rightX = d3.scaleLog()
        .domain(d3.extent(data, d => d.sc))
        .range([500, 900]);

    barSvg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${barDim.height - barMargin.bottom})`)
        .call(d3.axisBottom(rightX));

    const yAxis = d3.scaleBand()
        .domain(d3.extent(data, d => d.state))
        .range([barDim.height - barMargin.top, barMargin.bottom]);

    barSvg
        .data(data)
        .enter().append("rect")
        .attr("x", 400)
        // .attr("width", d => leftX(0) + leftX(d.sc))
        .attr("width", -100)
        .attr("height", yAxis.bandwidth());
});*/

const barDim = {
    height: 1000,
    width: 900
};

const barMargin = {
    top: 50,
    left: 75,
    right: 75,
    bottom: 50
};

const barSvg = d3.select("#bar").append("svg")
    .attr("height", barDim.height)
    .attr("width", barDim.width);

d3.csv("assets/data/pop.csv", d => {
    return {
        state: d.State,
        literacy: +d.Literacy,
        sc: +d.SC,
        st: +d.ST
    }
}).then(data => {
    console.log(data);

    const maxSC = d3.max(data, d => Math.abs(d.sc));
    const maxST = d3.max(data, d => Math.abs(d.st));
    const maxExtent = Math.max(maxSC, maxST);

    const xScale = d3.scaleLinear()
        .domain([-maxExtent, maxExtent])
        .range([barMargin.left, barDim.width - barMargin.right]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([barMargin.top, barDim.height - barMargin.bottom])
        .padding(0.1);

    barSvg.selectAll(".rightBar")
        .data(data)
        .enter().append("rect")
        .attr("class", "rightBar")
        .attr("x", xScale(0))
        .attr("y", d => yScale(d.state))
        .attr("width", d => Math.abs(xScale(d.sc) - xScale(0)))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("data-tippy-content", d => `SC students in state: ${d.sc}`);

    barSvg.selectAll(".leftBar")
        .data(data)
        .enter().append("rect")
        .attr("class", "leftBar")
        .attr("x", d => xScale(-d.st))
        .attr("y", d => yScale(d.state))
        .attr("width", d => Math.abs(xScale(d.st) - xScale(0)))
        .attr("height", yScale.bandwidth())
        .attr("fill", "orange")
        .attr("data-tippy-content", d => `ST students in state: ${d.st}`);

    tippy(".rightBar", {
        theme: "bar",
        placement: "top",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    });

    tippy(".leftBar", {
        theme: "bar",
        placement: "top",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    });

    barSvg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${barDim.height - barMargin.bottom})`)
        .call(d3.axisBottom(xScale));

    barSvg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${barMargin.left},0)`)
        .call(d3.axisLeft(yScale));
});

