/**
 * Parameters for usage:
 * @parameter: dataSource
 * Needed to be in the tree/sunburst layout as specified in d3. Size is specified on each node.
 * Two additional fields available for each node: fill_type (color) and description.
 * @parameter: width
 * @parameter: height
 * @parameter: units
 * @parameter: legend
 */
App.SunburstChartComponent = Ember.Component.extend({
  width: 750,
  height: 600,
  units: 'SCUs',
  dataSource: null,
  legend: false,
  gCustomId: 'g' + this.get('elementId'),
  customId: this.get('elementId'),
  totalSize: 0,
  chartTitle: '',
  chartDescription: '',
  explanationStyle: 'visibility: hidden; width:'+this.get('width')+'px; height:'+this.get('height')+'px;',

  color: d3.scale.category20c(),
  colors: {
    "gray": "#D7D7D7",
    "light-green": "rgb(106, 185, 117)",
    "dark-green": "#45924f",
    "blue": "rgb(86, 135, 209)",
    "orange": "rgb(222, 120, 59)",
    "others": "#FFF79A"
  },

  radius: function() {
    return Math.min(this.get('width'), this.get('height')) / 2;
  }.property('width', 'height'),

  draw: function() {

    var self = this;
    var vis = d3.select("#" + this.get('elementId') + " .sunburst-svg-container").append("svg:svg")
    .attr("width", self.get('width'))
    .attr("height", self.get('height'))
    .append("g")
    .attr("id", self.get('gCustomId'))
    .attr("transform", "translate(" + self.get('width') / 2 + "," + self.get('height') / 2 + ")");

    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, self.get('radius') * self.get('radius')])
      .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    d3.select("#" + this.get('elementId') + " .sunburst-svg-container").append("text")
      .attr("r", self.get('radius'))
      .style("opacity", 0);

    var self = this;
    var path = vis.data([this.get('dataSource')]).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.fill_type) {
          console.log('d fill type', self.get('colors')[d.fill_type]);
          return self.get('colors')[d.fill_type];
        } else {
          console.log('no fill type!');
          return d3.scale.category20c(((d.children ? d : d.parent).name));
        }
      })
      .style("fill-rule", "evenodd")
      .style("opacity", 1)
      .on("mouseover", mouseover);

      d3.select('#'+this.get('elementId')).on("mouseleave", mouseleave);
      this.set('totalSize', path.node().__data__.value);

      function mouseover(d) {

        var percentage = (100 * d.value / self.get('totalSize').toPrecision(3));
        var percentageString = percentage.toFixed(2) + "%";
        if (percentage < 0.1) {
          percentageString = "< 0.1%";
        }

        d3.select("#" + self.get('elementId') + "  .sunburst-percentage")
          .text(percentageString);

        d3.select("#" + self.get('elementId') + "  .sunburst-title")
          .text(d.name);

        d3.select("#" + self.get('elementId') + "  .sunburst-description")
          .text(d.size + " " + self.get('units'));

        d3.select("#" + self.get('elementId') + "  .sunburst-fill_type")
          .text(d.description);

        self.set('explanationStyle', 'visibility: visible; width:'+self.get('width')+'px; height:'+self.get('height')+'px;');
        var sequenceArray = getAncestors(d);
        //updateBreadcrumbs(sequenceArray, percentageString);

        // Fade all the segments.
        d3.selectAll("path")
          .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll("path")
          .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
          })
          .style("opacity", 1);
      }

      function mouseleave(d) {
        // Hide the breadcrumb trail
        //d3.select("#trail").style("visibility", "hidden");

        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
          .transition()
          .duration(500)
          .style("opacity", 1)
          .each("end", function() {
            d3.select(this).on("mouseover", mouseover);
          });

        self.set('explanationStyle', 'visibility: hidden; width:'+self.get('width')+'px; height:'+self.get('height')+'px;')
      }

      function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }

      function drawLegend() {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
          w: 75, h: 30, s: 3, r: 3
        };

        var legend = d3.select("#" +self.get('elementId') +" .sunburst-legend").append("svg:svg")
            .attr("width", li.w)
            .attr("height", d3.keys(self.get('colors')).length * (li.h + li.s));

        var g = legend.selectAll("g")
            .data(d3.entries(self.get('colors')))
            .enter().append("svg:g")
            .attr("transform", function(d, i) {
                    return "translate(0," + i * (li.h + li.s) + ")";
                 });

        g.append("svg:rect")
            .attr("rx", li.r)
            .attr("ry", li.r)
            .attr("width", li.w)
            .attr("height", li.h)
            .style("fill", function(d) { return d.value; });

        g.append("svg:text")
            .attr("x", li.w / 2)
            .attr("y", li.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.key; });
      }

      /* TODO: Finish dynamic generation of legend instead of having to pass in a legend array.
      var unique = self.get('dataSource').children.map(function(obj) { return obj.name; });
      unique = unique.filter(function(v,i) { return ages.indexOf(v) == i; });
      */

      if (self.get('legend')) { drawLegend(); }
  },

  customStyle: function() {
    return 'width:'+this.get('width')+'px; height:'+this.get('height')+'px;';
  }.property('width', 'height'),

  didInsertElement: function() {
    this.set('customId', App.uuid());
    this.set('gCustomId', App.uuid());
    this.draw();
  }

});
