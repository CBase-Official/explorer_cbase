<template>
  <div class="block-table">
    <base-table
      :dataSource="blockTable.dataSource"
      :columns="blockTable.columns"
      :loadMore="true"
      @load="loadBlockData"
      :showLoading="blockTable.loading"
      :showAppend="blockTable.append && !isMobile"
      @click-append="goTo('tipset')"
      :span-map="blockTable.heightMap"
      :span="blockTable.span"
      :max-height="isMobile ? 200 : 400 * rate"
      :labels="$t('home.blockTable.label')"
      radius
      :stripe="false"
    ></base-table>
  </div>
</template>
<script>
// import { getLatestBlock } from "@/api/home";
import { blockList } from "@/api/apis"
import { mapState } from "vuex";
export default {
  name: "BlockTable",
  data() {
    return {
      blockTable: {
        dataSource: [],
        span: true,
        columns: [
          {
            key: "height",
            isLink: true,
            target: "tipset"
          },
          {
            key: "hash",
            isLink: true,
            target: "tipset",
            ellipsis: true
          },
          {
            key: "time"
          },
          // {
          //   key: "reward",
          //   unit: "FIL"
          // }
        ],
        loadCount: 0,
        loading: false,
        append: false,
        heightMap: {},
        timer: null
      }
    };
  },
  methods: {
    formatTime(times){
      let date = new Date(times);
      return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    },
    async getBlockData(num) {
      if (num > 10) {
        return;
      }
      this.blockTable.heightMap = {};
      this.blockTable.loading = true;
      this.blockTable.span = false;
      try {
        // const data = await getLatestBlock(num);
        const datas = await blockList(0);
        // console.log("datas:",datas.data.resp.blockList)
        const heightMap = {};
        const dataSource = datas.data.resp.blockList.map((item, index) => {
          const { height, timestamp } = item;
          if (heightMap[height]) {
            heightMap[height].span++;
          } else {
            heightMap[height] = {
              span: 1,
              index
            };
          } //表头合并
          return {
            height: this.formatNumber(height),
            hash: item.hash,
            time: this.formatTime(timestamp)
          };
        });
        // console.log("dataSource:",dataSource)
        this.blockTable.dataSource = dataSource;
        Object.values(heightMap).forEach(item => {
          this.blockTable.heightMap[item.index] = item.span;
        });
        this.blockTable.loading = false;
        this.blockTable.span = true;
        return Promise.resolve();
      } catch (e) {
        this.blockTable.loading = false;
      }
    },
    async loadBlockData() {
      if (this.blockTable.loading) {
        return;
      }
      if (this.blockTable.loadCount == 3) {
        this.blockTable.append = true;
        return;
      } else {
        clearInterval(this.blockTable.timer);
        try {
          this.blockTable.loading = true;
          await this.getBlockData(10 * (this.blockTable.loadCount + 1));
          this.blockTable.loadCount++;
          this.blockTable.loading = false;
          // this.initBlockTimer();
        } catch (e) {
          this.blockTable.loading = false;
        }
      }
    }
  },
  watch: {
    async latestBlockHeight() {
      if (this.loadCount === 1) {
        return;
      }
      clearInterval(this.blockTable.timer);
      await this.getBlockData(this.blockTable.loadCount * 10);
      // this.initBlockTimer();
    }
  },
  beforeDestroy() {
    clearInterval(this.blockTable.timer);
  },
  computed: {
    ...mapState(["rate"])
  }
};
</script>
<style lang="scss" scoped>
.block-miner-table {
  display: flex;
  & > div {
    flex: 1;
    max-width: 50%;
    background: var(--main-bg-color);
  }
  & > div:first-child {
    margin-right: 10px;
  }
  .table-title {
    padding: 15px;
    background: var(--main-bg-color);
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    img {
      width: 20px;
      margin-right: 15px;
    }
  }
}
</style>
