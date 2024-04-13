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
    'https://gist.githubusercontent.com/HarryStevens/c9cf86eba753ba8650fb466e37d538d2/raw/c24913d2d636ecd84a4da73920ba92935f93c612/india.json',
).then(function (data) {
    var boundary = centerZoom(data);
    var subunits = drawStates(data);
    colorStates(subunits);
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
    d3.json("literacy.csv")
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

function colorStates(subunits) {
    d3.csv("data/literacy.csv", d => {
        return {
            state: d.State,
            literacy: d.Literacy
        }
    }).then((data) => {
        var colorScale = d3.scaleLinear()
            .domain([0, 100])
            .interpolate(d3.interpolateBlues);
        // console.log(data);
        var lits = data;
        subunits
            .style('fill', colorScale(lits[i]))
            .style('opacity', '.6');
    })
}