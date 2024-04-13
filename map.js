var width = 500,
    height = 500;

var projection = d3.geoMercator();

var path = d3
    .geoPath()
    .projection(projection)
    .pointRadius(2);

var svg = d3
    .select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g');

d3.json(
    'data/india.json',
).then(function (data) {
    var boundary = centerZoom(data);
    var subunits = drawStates(data);
    d3.csv("data/literacy.csv", d => {
        return {
            state: d.State,
            literacy: d.Literacy
        }
    }).then(data => {
        colorStates(subunits, data);
    });
    // colorStates(subunits);
    drawBoundary(data, boundary);
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
    var subunits = g
        .selectAll('.subunit')
        .data(
            topojson.feature(data, data.objects.polygons)
                .features,
        )
        .enter()
        .append('path')
        .attr('class', 'subunit')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('stroke-width', '1px');

    return subunits;
}

function colorStates(subunits, data) {
    /*var colorScale = d3.scaleOrdinal(
        d3.schemeCategory10,
    );

    subunits
        .style('fill', function (d, i) {
            return colorScale(i);
        })
        .style('opacity', '.6');*/

    var colorScale = d3.scaleLinear()
        .domain([0, 100])
        .range(["white", "blue"]);

    var stateLiteracy = {};
    data.forEach(d => {
        stateLiteracy[d.state] = d.literacy;
    });

    subunits.style("fill", d => {
        return colorScale(stateLiteracy[d.properties.st_name])
    }).style("opacity", ".6");
}
