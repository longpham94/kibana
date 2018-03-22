import d3 from 'd3';
import $ from 'jquery';
import { VislibVisualizationsChartProvider } from './_chart';
import { GaugeTypesProvider } from './gauges/gauge_types';

export function GaugeChartProvider(Private) {

  const Chart = Private(VislibVisualizationsChartProvider);
  const gaugeTypes = Private(GaugeTypesProvider);

  class GaugeChart extends Chart {
    constructor(handler, chartEl, chartData) {
      super(handler, chartEl, chartData);
      this.gaugeConfig = handler.visConfig.get('gauge', {});
      this.gauge = new gaugeTypes[this.gaugeConfig.type](this);
    }

    addEvents(element) {
      const events = this.events;

      return element
        .call(events.addHoverEvent())
        .call(events.addMouseoutEvent())
        .call(events.addClickEvent());
    }

    draw() {
      const self = this;
      const verticalSplit = this.gaugeConfig.verticalSplit;

      return function (selection) {
        selection.each(function (data) {
          const div = d3.select(this);
          const containerMargin = 20;
          const containerWidth = $(this).width() - containerMargin;
          const containerHeight = $(this).height() - containerMargin;
          const width = Math.floor(verticalSplit ? $(this).width() : containerWidth / data.series.length);
          const height = Math.floor((verticalSplit ? containerHeight / data.series.length : $(this).height()) - 25);

          div
            .style('text-align', 'center')
            .style('overflow-y', 'auto');

          data.series.forEach(series => {
            const svg = div.append('svg')
              .style('display', 'inline-block')
              .style('overflow', 'hidden')
              .attr('width', width);

            if (self.gaugeConfig.type === 'simple') {
              svg.attr('height', height);
            }

            const g = svg.append('g');

            const gauges = self.gauge.drawGauge(g, series, width, height);

            if (self.gaugeConfig.type === 'simple') {
              const bbox = svg.node().firstChild.getBBox();
              svg
                .attr('width', () => {
                  return bbox.width;
                })
                .attr('height', () => {
                  return bbox.height;
                });

              const transformX = bbox.width / 2;
              const transformY = bbox.height / 2;
              g.attr('transform', `translate(${transformX}, ${transformY})`);
            } else {
              svg.attr('height', height);
              const transformX = width / 2;
              const transformY = self.gaugeConfig.gaugeType === 'Arc' ? height / (2 * 0.75) : height / 2;
              g.attr('transform', `translate(${transformX}, ${transformY})`);
            }

            self.addEvents(gauges);
          });

          if (self.gaugeConfig.type !== 'simple') {
            div.append('div')
              .attr('class', 'chart-title')
              .style('text-align', 'center')
              .text(data.label || data.yAxisLabel);
          }

          self.events.emit('rendered', {
            chart: data
          });

          return div;
        });
      };
    }
  }

  return GaugeChart;
}
