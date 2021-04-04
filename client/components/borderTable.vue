<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th v-for="(header, key) in headers" :key="key">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in borderData" :key="key">
          <td>{{ item.platform }}</td>
          <td>{{ item.rp }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import * as border from '~/jsonFormat/borderFormat';
import config from '../../apiserver/config.json';

@Component
export default class Index extends Vue {
  @Prop({ default: [] })
  private borderData!: border.Border[];
  private headers = ['Platfrom', 'BorderRP'];
  private platforms = Object.keys(config.platforms);
}
</script>

<style scoped></style>
