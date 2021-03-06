<template>
  <div class="ticket-chain bottom-20">
    <div class="chart-con">
      <div
        class="chart"
        ref="chart"
        v-loading="loading"
        element-loading-background="var(--board-bg-color)"
      ></div>
      <div class="block-type" :style="typeStyle">
        <div class="arrow left" @click="goLeft" v-if="!atIndex">
          <span class="el-icon-arrow-left"></span>
        </div>
        <div class="type-list">
          <span>
            <i class="ticket"></i>
            {{ $t("tipset.nodeType")[0] }}
          </span>
          <span>
            <i class="normal"></i>
            {{ $t("tipset.nodeType")[1] }}
          </span>
        </div>
        <div @click="goRight" class="arrow right" v-if="!atIndex">
          <span class="el-icon-arrow-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { blockList } from "@/api/apis";
// import { getLatestBlock } from "@/api/home";
import { mapState } from "vuex";
import Null from "@/assets/image/block/null.png";
import Ticket from "@/assets/image/block/ticket.png";
import Normal from "@/assets/image/block/normal.png";
import Active from "@/assets/image/block/active.png";
import NormalDark from "@/assets/image/block/normal-dark.png";
import NullDark from "@/assets/image/block/null-dark.png";
let chart;
export default {
  name: "TipsetChain",
  data() {
    return {
      tipsets: [],
      startHeight: 0,
      loading: false,
      typeStyle: {
        marginTop: "-160px"
      },
      jumpSafeHeight: 0
    };
  },
  computed: {
    ...mapState(["defaultHeight"]),
    normalSrc() {
      return this.theme === "light" ? Normal : NormalDark;
    },
    ticketSrc() {
      return this.theme === "light" ? Ticket : Active;
    },
    activeSrc() {
      return this.theme === "light" ? Active : Ticket;
    },
    nullSrc() {
      return this.theme === "light" ? Null : NullDark;
    }
  },
  watch: {
    height(v) {
      if ((v <= this.startHeight && v > this.startHeight - 15) || v == 0) {
        this.drawChart();
      } else {
        this.getTipset(v);
      }
    },
    defaultHeight: {
      handler(h) {
        const { height, hash, jumpHeight } = this.$route.query;
        if ((height || hash || jumpHeight) && !this.atIndex) {
          return;
        }
        if (h != 0) {
          this.startHeight = h;
          this.getTipset(h);
        }
      }
    },
    theme() {
      this.drawChart();
    }
  },
  async mounted() {
    chart = this.$chart.init(this.$refs.chart);
    chart.on("click", e => {
      this.goTo("tipset", {
        query: {
          hash: e.data.name
        }
      });
      if (e.data.originData) {
      this.goTo("tipset", {
        query: {
          hash: e.data.name
        }
      });
    }
      if (e.componentType === "markLine") {
        this.$emit("height-change", String(this.startHeight - e.value));
      }
    });
  },
  methods: {
    async getTipset(height) {
      if (height == 0) {
        return;
      }
      if (height < 15) {
        height = 15;
      }
      try {
        this.loading = true;
        const res = await blockList(0);
        this.loading = false;
        this.startHeight = height;
        this.tipsets = Object.freeze(res.data.resp.blockList);
        this.$emit("get-blocks", res.data.resp.blockList);
        this.drawChart();
      } catch (e) {
        this.loading = false;
      }
    },
    drawChart() {
      const rate = this.rate;
      const {
        ticketNode,
        link,
        seriesMarkLine,
        seriesMarkLineLabel,
      } = this.chartTheme.tipset;
      const nodeList = this.tipsets.map((t, i) => {
        const block = {
          name: t.hash,
          value: [i, 5],
          symbol: `image://${this.ticketSrc}`,
          symbolSize: [56 * rate, 17 * rate],
          symbolOffset: [10 * rate, 0],
          label: {
            color: ticketNode,
            fontSize: 12 * rate,
            formatter() {
              return t.hash.substring(0, 6);
            }
          }
        };

				const underBlock = {
          name: `${t.hash}-t`,
          value: [i, 10],
          symbol: `image://${this.normalSrc}`,
          symbolSize: [56 * rate, 17 * rate],
          symbolOffset: [10 * rate, 0],
          label: {
            color: ticketNode,
            fontSize: 12 * rate,
            formatter() {
              return t.txs;
            }
          }
        };
				return [block, underBlock];
      }).flat();
      // console.log("draw1....")
      const linkList = this.tipsets
        .filter((_, i, arr) => i < arr.length - 1)
        .map((t, i) => ({
          source: t.hash,
          target: this.tipsets[i + 1].hash,
          lineStyle: {
            normal: {
              color: link
            }
          }
        }));
      const lineList = this.tipsets.map((t, i) => ({
        xAxis: i,
        label: {
          show: true,
          formatter() {
            return t.height;
          }
        }
      }));
     
      var option = {
        xAxis: {
          show: false,
          boundaryGap: false,
          min: -1,
          // max: 23,
          axisLine: {
            show: false
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          min: 0,
          max: 70,
          show: false,
          type: "value",
          inverse: true
        },
        grid: {
          top: 40 * rate,
          left: -40,
          right: 0,
          bottom: 0
        },
        series: [
          {
            type: "graph",
            layout: "none",
            id: "a",
            coordinateSystem: "cartesian2d",
            edgeSymbol: ["", "arrow"],
            label: {
              show: true,
              position: "inside"
            },
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: "none"
              }
            },
            markLine: {
              symbol: ["none", "none"],
              silent: false,
              lineStyle: {
                color: seriesMarkLine,
                width: 1,
                type: "solid"
              },
              data: lineList,
              label: {
                position: "start",
                color: seriesMarkLineLabel,
                fontSize: 12 * rate
              }
            },
            data: nodeList,
            links: linkList,
            z: 0,
            zlevel: 4
          }
        ]
      };
      try {
         chart.setOption(option);
      } catch (error) {
        console.log("setOption: ",error)
      }
    },
    async goRight() {
      let jumpHeight = Math.max(this.startHeight - 15, 15);
      await this.getTipset(jumpHeight);
      this.goTo("tipset", {
        query: {
          jumpHeight
        }
      });
    },
    async goLeft() {
      let jumpHeight = 0;
      if (this.startHeight === this.jumpSafeHeight) {
        return;
      }
      if (Number(this.startHeight) + 15 >= this.jumpSafeHeight) {
        jumpHeight = this.jumpSafeHeight;
      } else {
        jumpHeight = Number(this.startHeight) + 15;
      }
      await this.getTipset(jumpHeight);
      this.goTo("tipset", {
        query: {
          jumpHeight: jumpHeight
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ticket-chain {
  border-radius: 8px;
  box-shadow: 0px 1px 7px 9px rgba(0, 0, 0, 0.03);
  background: var(--board-bg-color);
  .chart-con {
    width: 100%;
    .chart {
      width: 100%;
      height: 350px;
    }
  }
  .block-type {
    position: relative;
    z-index: 10;
    .arrow {
      position: absolute;
      top: -10px;
      font-size: 30px;
      color: var(--main-text-color);
      cursor: pointer;
      &.left {
        left: 20px;
      }
      &.right {
        right: 20px;
      }
    }
  }
  .block-type div.type-list {
    width: 500px;
    margin: 0 auto;
    padding-bottom: 20px;
    color: var(--main-text-color);
    span {
      margin-left: 20px;
    }
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
      &.null {
        background: var(--null-block-bg-color);
      }
      &.ticket {
        background: var(--ticket-block-bg-color);
      }
      &.normal {
        border: 1px solid var(--other-block-border-color);
        width: 8px;
        height: 8px;
      }
    }
  }
}
</style>
