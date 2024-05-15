// let commaFormat = d3.format(",");
render();

function render() {
    const bgColor = "black"
    const colorScale = d3.scaleLinear()
        .domain([65, 95])
        .range(['#edf8fb', '#238b45']);
    document.querySelector('#bubble').innerHTML = '';

    var json = {
        'children': [{name: 'Lakshadweep', density: 64, literacy: 92.28}, {
            name: 'Andaman & Nicobar Island',
            density: 108,
            literacy: 86.27
        }, {name: 'Sikkim', density: 210, literacy: 82.2}, {
            name: 'Chandigarh',
            density: 19,
            literacy: 86.4
        }, {name: 'Mizoram', density: 282, literacy: 91.58}, {
            name: 'Arunachal Pradesh',
            density: 290,
            literacy: 66.95
        }, {name: 'Goa', density: 100, literacy: 87.4}, {
            name: 'Nagaland',
            density: 141,
            literacy: 80.11
        }, {name: 'Manipur', density: 179, literacy: 79.85}, {
            name: 'Meghalaya',
            density: 448,
            literacy: 75.48
        }, {name: 'Tripura', density: 132, literacy: 87.75}, {
            name: 'Himachal Pradesh',
            density: 263,
            literacy: 83.78
        }, {name: 'Uttarakhand', density: 234, literacy: 79.63}, {
            name: 'Jammu & Kashmir',
            density: 228,
            literacy: 68.74
        }, {name: 'Haryana', density: 88, literacy: 76.64}, {
            name: 'Kerala',
            density: 49,
            literacy: 93.91
        }, {name: 'Punjab', density: 104, literacy: 76.68}, {
            name: 'Chattisgarh',
            density: 199,
            literacy: 71.04
        }, {name: 'Jharkhand', density: 144, literacy: 67.63}, {
            name: 'Gujarat',
            density: 73,
            literacy: 79.31
        }, {name: 'Assam', density: 211, literacy: 73.18}, {
            name: 'Odisha',
            density: 164,
            literacy: 73.45
        }, {name: 'Karnataka', density: 101, literacy: 75.6}, {
            name: 'Tamil Nadu',
            density: 80,
            literacy: 80.3
        }, {name: 'Andhra Pradesh', density: 71, literacy: 67.66}, {
            name: 'Bihar',
            density: 77,
            literacy: 63.82
        }, {name: 'West Bengal', density: 97, literacy: 77.08}, {
            name: 'Maharashtra',
            density: 87,
            literacy: 82.91
        }, {name: 'Rajasthan', density: 157, literacy: 67.06}, {name: 'Madhya Pradesh', density: 196, literacy: 70.63}]
    }

    const values = json.children.map(d => d.density);
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const total = json.children.length;

    document.body.style.backgroundColor = bgColor;

    var diameter = 600

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(0);

    var margin = {
        left: 150, right: 25, top: 25, bottom: 25
    }

    var svg = d3.select('#bubble').append('svg')
        .attr('viewBox', '0 0 ' + (diameter + margin.right) + ' ' + diameter)
        .attr('width', (diameter + margin.right))
        .attr('height', diameter)
        .attr('class', 'chart-svg');

    var root = d3.hierarchy(json)
        .sum(function (d) {
            return d.density;
        });

    bubble(root);

    var node = svg.selectAll('.node')
        .data(root.children)
        .enter()
        .append('g').attr('class', 'node')
        .attr("data-tippy-content", d => {
            return `State:${d.data.name}<br>Literacy: ${d.data.literacy}<br>School Density: ${d.data.density / 100}`;
        })
        .attr('transform', function (d) {
            return 'translate(' + d.x + ' ' + d.y + ')';
        })
        .append('g').attr('class', 'graph');

    node.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", getItemColor)
        .style("stroke-width", 0.5)
        .append("title");

    tippy(".node", {
        theme: "bubble", placement: "top", trigger: "mouseenter focus", role: "tooltip", allowHTML: "true"
    });


    node.append("text")
        .attr("dy", "0.2em")
        .style("text-anchor", "middle")
        .style('font-family', 'Roboto')
        .style('font-size', getFontSizeForItem)
        .text(getLabel)
        .style("fill", "black")
        .style('pointer-events', 'none');

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .style('font-family', 'Roboto')
        .style('font-weight', '100')
        .style('font-size', getFontSizeForItem)
        .text(getValueText)
        .style("fill", "black")
        .style('pointer-events', 'none');

    const legend = d3.legendColor()
        .scale(colorScale)
        .title("Literacy");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${550}, ${80})`)
        .call(legend);

    function getItemColor(item) {
        return colorScale(item.data.literacy);
    }

    function getLabel(item) {
        if (item.data.density < max / 3.3) {
            return '';
        }
        return truncate(item.data.name);
    }

    function getValueText(item) {
        return item.data.density / 100;
    }

    function truncate(label) {
        const max = 11;
        if (label.length > max) {
            label = label.slice(0, max) + '...';
        }
        return label;
    }

    function getFontSizeForItem(item) {
        return getFontSize(item.data.density, min, max, total);
    }

    function getFontSize(value, min, max, total) {
        const minPx = 6;
        const maxPx = 25;
        const pxRange = maxPx - minPx;
        const dataRange = max - min;
        const ratio = pxRange / dataRange;
        const size = Math.min(maxPx, Math.round(value * ratio) + minPx);
        return `${size}px`;
    }
}