<template>
  <div class="tipset">
    <!-- <ticket-chain
      @hash-change="handleHashChange"
      :height.sync="height"
      :hash="hash"
      @height-change="handleHeightChange"
      @get-blocks="getBlocks"
      v-show="!isMobile"
    /> -->
    <block-detail v-if="hash || height" :hash="hash" :height="height" :type="type" :block="currentBlock"  />
    <!-- <block-list
      v-if="!hash && !isMobile"
      :height="currentHeight"
      :list="currentBlockList"
    />
    <div class="mb-block-list" v-if="isMobile && !hash">
      <div
        v-for="(value, key) in mbBlockList"
        :key="key"
        class="block-item-con"
      >
        <div class="height">
          <div>{{ $t("tipset.height") }}</div>
          <div>{{ key }}</div>
        </div>
        <mb-board
          v-for="item in value"
          :key="item.hash"
          :dataSource="item"
          :columns="mbColumns"
        ></mb-board>
      </div>
    </div> -->
  </div>
</template>
<script>
// import TicketChain from "./components/TicketChain";
// import BlockList from "./components/BlockList";
import BlockDetail from "./components/BlockDetail";
import { getBlockByHash , getChunkByHash ,getBlockByHeight } from "@/api/apis";
import { mapState } from "vuex";
export default {
  name: "Tipset",
  data() {
    return {
      type: "block",
      hash: "",
      height: 0,
      value: 0,
      blocks: [],
      block: {},
      block_type:"Block",
      dataList: [
        {
          key: "height",
          isLink: true,
          target: "tipset"
        },
        {
          key: "hash"
        },
        {
          key: "timestamp"
        },
        {
          key: "size"
        },
        {
          key: "mesLength"
        },
        {
          key: "miner",
          target: "address/account",
          isLink: true
        },
        {
          key: "reward"
        },
        {
          key: "parents",
          isLink: true,
          target: "tipset",
          paramKey: "hash"
        },
        {
          key: "parent_weight"
        },
        {
          key: "tickets"
        },
        {
          key: "state_root"
        }
      ],
      columns: [
        {
          key: "hash",
          isLink: true,
          target: "tipset",
          ellipsis: true
        },
        {
          key: "timestamp"
        },
        {
          key: "mesLength"
        },
        {
          key: "size",
          unit: "bytes"
        },
        {
          key: "miner",
          isLink: true,
          target: "address/detail",
          paramKey: "address"
        },
        {
          key: "reward",
          unit: "FIL"
        }
      ]
    };
  },
  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      async handler(v) {
          // console.log("block:",v);
          if(v.hash){
            this.hash = v.hash;
          let datas = await getBlockByHash(this.hash);
          if(datas.data.resp.block){
            this.block = datas.data.resp.block;
            this.block.block_type = "Block"
          }
          let datasc = await getChunkByHash(this.hash);
          if(datasc.data.resp.chunk){
            this.block = datasc.data.resp.chunk;
            this.block.height = datasc.data.resp.chunk.height_created;
            this.block.hash = datasc.data.resp.chunk.chunk_hash;
            this.block.block_type = "Chunk";
          }
        }
        if(v.height){
          this.height = v.height;
          let nums = v.height.replace(/,/g,'');
          let datasN = await getBlockByHeight(nums);
          // console.log("datasN:",datasN)
          if(datasN.data.resp.header){
            this.block = datasN.data.resp.header;
            this.block.block_type = "Block"
          }
          // console.log("thisblock::",this.block)
        }
        
        
        
        // let height = 0;
        // if (v.height) {
        //   height = this.parseFormatNumber(v.height);
        // }
        // this.height = Number(height);
      }
    }
  },
  components: {
    // TicketChain,
    // BlockList,
    BlockDetail
  },
  computed: {
    ...mapState(["defaultHeight"]),
    currentHeight() {
      return Number(this.height || this.defaultHeight);
    },
    currentBlockList() {
      if (this.height) {
        return this.blocks.filter(item => {
          return item.height == this.formatNumber(this.height);
        });
      } else {
        return this.blocks;
      }
    },
    currentBlock() {
      // console.log("sd--",this.block)
      return this.block;
    },
    mbBlockList() {
      const res = {};
      this.blocks.forEach(item => {
        if (!res[item.height]) {
          res[item.height] = [item];
        } else {
          res[item.height].push(item);
        }
      });
      return res;
    },
    mbColumns() {
      const labels = [...this.$t("component.blockList.label")];
      labels.shift();
      return this.columns.map((item, index) => {
        return {
          ...item,
          title: labels[index]
        };
      });
    }
  },
  methods: {
    getBlocks(v) {
      // console.log("v:",v)
      this.blocks = v;
    },
    handleHashChange(v) {
      this.goTo("tipset", {
        query: {
          hash: v
        }
      });
    },
    handleHeightChange(v) {
      this.goTo("tipset", {
        query: {
          height: v
        }
      });
    },
    handleValueChange() {
      this.height = this.value;
      this.goTo("tipset", {
        query: {
          height: this.value
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tipset {
  .chart-con {
    width: 100%;
    background: var(--main-bg-color);
    .chart {
      width: 100%;
      height: 500px;
    }
  }
  @media (max-width: 768px) {
    .block-item-con {
      .height {
        text-align: center;
        background: var(--link-color);
        color: white;
        line-height: 20px;
        margin-bottom: 10px;
      }
      //display: flex;
      // .height{
      //   background: var(--link-color);
      //   height: 20px;
      //   line-height: 20px;
      //   color: white;
      //   padding-left: 10px;
      //   margin-right: 10px;
      //   position: relative;
      //   width: 70px;
      //   &::after{
      //     content: '';
      //     display: inline-block;
      //     width: 14px;
      //     height: 14px;
      //     background: var(--link-color);
      //     transform: rotate(45deg);
      //     position: absolute;
      //     right: -7px;
      //     top: 3px
      //   }
      // }
    }
  }
}
</style>
