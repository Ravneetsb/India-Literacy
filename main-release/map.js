var width = 500,
    height = 500;

var projection = d3.geoMercator();

var path = d3
    .geoPath()
    .projection(projection)
    .pointRadius(2);

var mapSVG = d3
    .select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var g = mapSVG.append('g');

d3.json(
    'assets/data/india.json',
).then(function (data) {
    var boundary = centerZoom(data);
    drawStates(data);
    drawBoundary(data, boundary);
    const annotations =[
        {

            note: {
                label: "Kerala has the highest literacy rate.",
                wrap: 150,
                align: "left"
            },
            connector: {
                end: "arrow"
            },
            x: 150,
            y: 450,
            dy: -10,
            dx: -150
        },
        {
            note: {
                label: "Bihar as the lowest literacy rate.",
                wrap: 150,
                align: "left"
            },
            connector: {
                end: "arrow"
            },
            x: 300,
            y: 200,
            dy: -70,
            dx: 50
        }
    ].map(function(d){ d.color = "#E8336D"; return d})

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)

    mapSVG.append("g")
        .attr("class", "annotation-group")
        .style("font-family", "Roboto")
        .call(makeAnnotations);
});

function centerZoom(data) {
    var o = topojson.mesh(
        data,
        data.objects.polygons,
        function (a, b) {
            return a === b;
        },
    );

    projection.scale(1).translate([0, 0]);

    var b = path.bounds(o),
        s =
            1 /
            Math.max(
                (b[1][0] - b[0][0]) / width,
                (b[1][1] - b[0][1]) / height,
            ),
        t = [
            (width - s * (b[1][0] + b[0][0])) / 2,
            (height - s * (b[1][1] + b[0][1])) / 2,
        ];

    var p = projection.scale(s).translate(t);

    return o;
}

function drawBoundary(data, boundary) {
    g.append('path')
        .datum(boundary)
        .attr('d', path)
        .attr('class', 'subunit-boundary')
        .attr('fill', 'none')
        .attr('stroke', '#3a403d');
}


function drawStates(data) {
    var colorScale = d3.scaleSequential(d3.interpolateBlues).domain([60, 100]);
    var subunits = g
        .selectAll('.map')
        .data(
            topojson.feature(data, data.objects.polygons)
                .features,
        )
        .enter()
        .append('path')
        .attr('class', d => `${d.properties.st_nm} map`)
        .attr('d', path)
        .attr("data-tippy-content", d => {
            if (d.properties.literacy > 0) {
            return `Literacy Level: ${d.properties.literacy} <br> State: ${d.properties.st_nm} `
            } else {
                return "NO DATA";
            }
        })
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .style("fill", d => {
            return d.properties.literacy !== 0? colorScale(d.properties.literacy):"black";
        }).on("click", function(event, d) {
            // let mapClass = d3.select(this).attr("class");
            let state = d.properties.st_nm;
            let circleClass = `${state} points`;
            console.log(circleClass);
            let circle = d3.select("#scatter");
            console.log(circle);
        });

    tippy(".map", {
        placement: "top",
        theme: "map",
        trigger: "mouseenter focus",
        role: "tooltip",
        allowHTML: "true"
    });
    return subunits;
}
