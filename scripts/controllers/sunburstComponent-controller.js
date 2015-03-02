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
  action: false,
  gCustomId: 'g' + this.get('elementId'),

  attributeBindings: ['getId:data-id'],
  getId: function() {
    return this.get('customId');
  }.property('customId'),

  totalSize: 0,
  chartTitle: 'SCU Metrics',
  chartDescription: '',


  explanationStyle: function() {
    return 'width:'+this.get('width')+'px; height:'+this.get('height')+'px;';
  }.property('width', 'height'),
  percent: 15,
  classNames: ['inline-block'],

  color: d3.scale.category20c(),
  colors: {
    "gray": "#D7D7D7",
    "light-green": "rgb(106, 185, 117)",
    "dark-green": "#45924f",
    "blue": "rgb(86, 135, 209)",
    "orange": "rgb(222, 120, 59)",
    "yellow": "#FFF79A",
    "red": "rgb(128, 21, 21)",
    "brown": "#4D3619"
  },

  dataSourceExists: function () {
    return typeof this.get('dataSource') !== 'undefined' && this.get('dataSource') !== null;
    return typeof this.get('dataSource') !== 'undefined' && this.get('dataSource') !== null;
  }.property('dataSource.@each', 'dataSource'),

  radius: function() {
    return Math.min(this.get('width'), this.get('height')) / 2;
  }.property('width', 'height'),

  drawDetailSunburst: function(dataSource) {
    var percent = 25;
    var width = (percent / 100) * this.get('width');
    var height = (percent / 100) * this.get('height');
    var radius = Math.min(width, height) / 2;

    var self = this;
    var vis = d3.select('[data-id="'+self.get('customId')+'"] .sunburst-details').append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", self.get('gCustomId') + 'details')
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    d3.select('[data-id="'+self.get('customId')+'"] .sunburst-details').append("text")
          .attr("r", radius)
          .style("opacity", 0);

    var path = vis.data([dataSource]).selectAll('[data-id="'+self.get('customId')+'"] .sunburst-details path')
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.fill_type) {
          return self.get('colors')[d.fill_type];
        } else {
          return d3.scale.category20c(((d.children ? d : d.parent).name));
        }
      })
      .style("fill-rule", "evenodd")
      .style("opacity", 1);

      dataSource.children.forEach( function(item, index, enumerable){
        $('[data-id="'+self.get('customId')+'"] .sunburst-details').append('<div class="sunburst-details-item"> <div class="sunburst-details-swatch" style="background-color:'+self.get('colors')[item.fill_type]+';"> </div><span class="sunburst-details-label">' + item.name + ' ' + item.size + ' '+self.get('units')+'</span></div>');
      });
  },

  draw: function() {
    var isHovered = $('[data-id="'+this.get('customId')+'"] .sunburst-svg-container').is(":hover");
    if (isHovered) { return; }
    $('[data-id="'+this.get('customId')+'"] .sunburst-svg-container').empty();

    var self = this;
    var vis = d3.select('[data-id="'+self.get('customId')+'"] .sunburst-svg-container').append("svg:svg")
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

    d3.select('[data-id="'+self.get('customId')+'"] .sunburst-svg-container').append("text")
      .attr("r", self.get('radius'))
      .style("opacity", 0);

    var self = this;
    var path = vis.data([this.get('dataSource')]).selectAll('[data-id="'+self.get('customId')+'"] .sunburst-svg-container path')
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.fill_type) {
          return self.get('colors')[d.fill_type];
        } else if (d.dynamic_color) {
          return d.dynamic_color;
        } else {
          return d3.scale.category20c(((d.children ? d : d.parent).name));
        }
      })
      .style("fill-rule", "evenodd")
      .style("opacity", 1)
      .on("mouseover", mouseover, true);

      d3.select('[data-id="'+self.get('customId')+'"').on("mouseleave", mouseleave);
      this.set('totalSize', path.node().__data__.value);
      defaultExplanation();

      function mouseover(d, i) {
          var percentage =  (100 * d.value / self.get('totalSize').toPrecision(3));
          var percentageString = percentage.toFixed(2) + "%";
          if (percentage < 0.1) {
            percentageString = "< 0.1%";
          }

          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-percentage')
            .text(percentageString);
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-title')
            .text(d.name);
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-description')
            .text(d.size + " " + self.get('units'));
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-fill_type')
            .text(d.description);
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-details')

          self.set('explanationStyle', 'visibility: visible; width:'+self.get('width')+'px; height:'+self.get('height')+'px;');

          // Empty details
          $('[data-id="'+self.get('customId')+'"] .sunburst-details').empty();
          // Draw Details
          if (typeof d.detailsChildren != "undefined") {
            self.drawDetailSunburst(d.detailsChildren);
          }

          var sequenceArray = getAncestors(d);
          //updateBreadcrumbs(sequenceArray, percentageString);

          // Fade all the segments.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .sunburst-svg-container path')
            .style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          vis.selectAll('[data-id="'+self.get("customId")+'"] .sunburst-svg-container path')
            .filter(function(node) {
              return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);

          // Highlight event siblings
          vis.selectAll('[data-id="'+self.get("customId")+'"] .sunburst-svg-container path')
            .filter(function(node) {
              return (node.eventSiblingId !== undefined && node.eventSiblingId == d.eventSiblingId);
            })
            .style("opacity", 1);

          // Update link values
          if (!Ember.isEmpty(self.get('action'))) {
            if (!Ember.isEmpty(d.route)) {
              self.set('linkRoute', d.route);
            }
            if (!Ember.isEmpty(d.routeId)) {
              self.set('linkRouteId', d.routeId);
            }
            if (!Ember.isEmpty(d.routeLabel)) {
              self.set('linkRouteLabel', d.routeLabel);
            }
          }
      }

      function mouseleave(d) {

          // Hide the breadcrumb trail
          //d3.select("#trail").style("visibility", "hidden");

          //Empty details
          $("[data-id="+self.get('customId')+"] .sunburst-details").empty();

          // Deactivate all segments during transition.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .sunburst-svg-container path').on("mouseover", null);

          // Transition each segment to full opacity and then reactivate it.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .sunburst-svg-container path')
            .transition()
            .duration(500)
            .style("opacity", 1)
            .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

          self.set('explanationStyle', 'width:'+self.get('width')+'px; height:'+self.get('height')+'px;')
          defaultExplanation();
      }
      function defaultExplanation() {
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-percentage')
            .text(self.get('chartTitle'));
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-title')
            .text('');
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-description')
            .text("Hover to see details.");
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-fill_type')
            .text('');
          d3.select('[data-id="'+self.get('customId')+'"] .sunburst-details')
          .text('');
          self.set('linkRoute', '');
          self.set('linkRouteId', '');
          self.set('linkRouteLabel', '');
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

        var legend = d3.select('[data-id="'+self.get('customId')+'"] .sunburst-legend').append("svg:svg")
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
  actions: {
    changeRoute: function(route, routeId) {
      this.sendAction('action', route, routeId);
    }
  },

  customStyle: function() {
    return 'width:'+this.get('width')+'px; height:'+this.get('height')+'px;';
  }.property('width', 'height'),

  dataSourceObserver: function() {
    this.draw();
  }.observes('dataSource.@each'),

  didInsertElement: function() {
    this.set('gCustomId', App.uuid());
    this.draw();
  },
  init: function() {
    this.set('customId', App.uuid());
    this._super();
  }

});


