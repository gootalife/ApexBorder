<script lang="ts">
import { Component, Prop, mixins, Watch } from 'nuxt-property-decorator';
import vc from 'vue-chartjs';
import { ChartData, ChartOptions } from 'chart.js';
const { reactiveProp } = vc.mixins;

@Component
export default class LineChart extends mixins(vc.Line, reactiveProp) {
  @Prop({ default: {} })
  chartData!: ChartData;
  @Prop({ default: {} })
  chartOptions!: ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }

  @Watch('chartOptions')
  updateOption() {
    this.renderChart(this.chartData, this.chartOptions);
  }

  @Watch('chartData')
  updateData() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>

<style scoped></style>
