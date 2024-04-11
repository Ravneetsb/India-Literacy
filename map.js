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
    var subunits = drawSubUnits(data);
    colorSubunits(subunits);
    // drawSubUnitLabels(data);
    // drawPlaces(data);
    drawOuterBoundary(data, boundary);
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

function drawOuterBoundary(data, boundary) {
    g.append('path')
        .datum(boundary)
        .attr('d', path)
        .attr('class', 'subunit-boundary')
        .attr('fill', 'none')
        .attr('stroke', '#3a403d');
}

function drawPlaces(data) {
    g.append('path')
        .datum(
            topojson.feature(data, data.objects.places),
        )
        .attr('d', path)
        .attr('class', 'place');

    g.selectAll('.place-label')
        .data(
            topojson.feature(data, data.objects.places)
                .features,
        )
        .enter()
        .append('text')
        .attr('class', 'place-label')
        .attr('transform', function (d) {
            return (
                'translate(' +
                projection(d.geometry.coordinates) +
                ')'
            );
        })
        .attr('dy', '.35em')
        .attr('x', 6)
        .attr('text-anchor', 'start')
        .style('font-size', '.7em')
        .style('text-shadow', '0px 0px 2px #fff')
        .text(function (d) {
            return d.properties.name;
        });
}

function drawSubUnits(data) {
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

function drawSubUnitLabels(data) {
    g.selectAll('.subunit-label')
        .data(
            topojson.feature(data, data.objects.polygons)
                .features,
        )
        .enter()
        .append('text')
        .attr('class', 'subunit-label')
        .attr('transform', function (d) {
            return 'translate(' + path.centroid(d) + ')';
        })
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', '.5em')
        .style('text-shadow', '0px 0px 2px #fff')
        .style('text-transform', 'uppercase')
        .text(function (d) {
            return d.properties.st_nm;
        });
}

function colorSubunits(subunits) {
    var colorScale = d3.scaleOrdinal(
        d3.schemeCategory10,
    ); // You can choose a different color scheme here

    subunits
        .style('fill', function (d, i) {
            return colorScale(i);
        })
        .style('opacity', '.6');
}