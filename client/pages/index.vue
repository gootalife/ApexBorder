<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col>
        <div class="center">
          <v-btn-toggle v-model="selectedPlatform" group mandatory>
            <v-btn value="all">all</v-btn>
            <v-btn v-for="(plat, key) in platforms" :key="key" :value="plat">
              {{ plat }}
            </v-btn>
          </v-btn-toggle>
          <v-btn class="ml-10" value="all" @click="fetchData">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" align="start">
      <v-col>
        <border-table class="border-table" :border-data="bordersData">
        </border-table>
      </v-col>
      <v-col>
        <line-chart
          class="chart"
          :chart-data="chartData"
          :chart-options="chartOptions"
        ></line-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import * as border from '~/jsonFormat/borderFormat';
import * as rpLog from '~/jsonFormat/rpLogFormat';
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import lineChart from '~/components/lineChart.vue';
import borderTable from '~/components/borderTable.vue';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import config from '../../apiserver/config.json';
import 'chartjs-plugin-colorschemes';

@Component({
  components: {
    lineChart,
    borderTable
  }
})
export default class Index extends Vue {
  private platforms = Object.keys(config.platforms);
  private selectedPlatform: 'all' | keyof typeof config.platforms = 'all';
  private chartData: ChartData = {};
  private chartOptions: ChartOptions = {
    plugins: {
      colorschemes: {
        scheme: 'brewer.SetOne9'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  private rpLogs: rpLog.RPLog[] = [];
  private borders: border.Border[] = [];
  private overlay: boolean = false;

  async mounted(): Promise<void> {
    this.overlay = true;
    await this.fetchData();
    await this.renderChartAsync();
    this.overlay = false;
  }

  async fetchData(): Promise<void> {
    this.overlay = true;
    this.rpLogs = await this.getRPLogsOnSeasonAsync('8sp2');
    this.borders = await this.getBordersAsync();
    this.overlay = false;
  }

  @Watch('selectedPlatform')
  async renderChartAsync(): Promise<void> {
    this.rpLogs = await this.getRPLogsOnSeasonAsync('8sp2');
    let datasets: ChartDataSets[] = [];
    const selected = this.selectedPlatform;
    this.platforms.forEach((key) => {
      const plat = key as keyof typeof config.platforms;
      datasets.push({
        label: plat,
        data: this.rpLogs.map((log) => log[plat][config.env.border - 1]),
        fill: false
      });
    });
    if (selected !== 'all') {
      datasets.forEach((data) => {
        data.hidden = data.label !== this.selectedPlatform;
      });
    }
    this.chartData = {
      labels: this.rpLogs.map((elem) => elem.date.slice(0, 10)),
      datasets: datasets
    };
  }

  get bordersData(): border.Border[] {
    let data = this.borders;
    if (this.selectedPlatform !== 'all') {
      data = this.borders.filter((elem) => {
        return elem.platform === this.selectedPlatform;
      });
    }
    return data;
  }

  async getBordersAsync(): Promise<border.Border[]> {
    let borders: border.Border[] = [];
    try {
      const res = await fetch('https://apexapi.gootalife.work/api/v1/borders');
      if (res.ok) {
        borders = border.Convert.toBorder(await res.text());
      } else {
        throw new Error('An Error occurred.');
      }
    } catch (e) {
      console.log(e);
    }
    return borders;
  }

  async getRPLogsOnSeasonAsync(season: string): Promise<rpLog.RPLog[]> {
    let rpLogs: rpLog.RPLog[] = [];
    try {
      const res = await fetch(
        `https://apexapi.gootalife.work/api/v1/rplogs/season/${season}`
      );
      if (res.ok) {
        rpLogs = rpLog.Convert.toRPLog(await res.text());
      } else {
        throw new Error('An Error occurred.');
      }
    } catch (e) {
      console.log(e);
    }
    return rpLogs;
  }

  async getRPLogsBetweenAsync(
    beginning: string,
    ending: string
  ): Promise<rpLog.RPLog[]> {
    let rpLogs: rpLog.RPLog[] = [];
    try {
      const res = await fetch(
        `https://apexapi.gootalife.work/api/v1/rplogs/${beginning}/${ending}`
      );
      if (res.ok) {
        rpLogs = rpLog.Convert.toRPLog(await res.text());
      } else {
        throw new Error('An Error occurred.');
      }
    } catch (e) {
      console.log(e);
    }
    return rpLogs;
  }
}
</script>

<style scoped>
.center {
  text-align: center !important;
}
.chart {
  height: 300px !important;
  width: 600px !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
.border-table {
  width: 200px !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
</style>
