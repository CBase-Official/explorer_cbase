<template>
  <div
    class="message-list"
    v-loading="loading"
    element-loading-background="var(--board-bg-color)"
  >
    <div class="total-number border-bottom" slot="header">
      <span
        v-html="$t('component.mesList.total', { total: formatNumber(total) })"
      ></span>
      <!-- <el-select
        v-model="option.method"
        @change="handleMethodChange"
        :placeholder="$t('component.mesList.placeholder')"
      > -->
        <!-- <el-option label="All Method" value="" />
        <el-option
          v-for="item in method"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option> -->
      <!-- </el-select> -->
    </div>
    <div class="table-con" v-if="!isMobile">
      <base-table
        :dataSource="messageData"
        :columns="columns"
        showPagination
        :total="total"
        @size-change="handleSizeChange"
        @page-change="handlePageChange"
        :labels="labels"
        :currentPage="currentPage"
      ></base-table>
    </div>
    <mb-board
      v-for="(item, index) in messageData"
      :key="item.cid + index"
      :dataSource="item"
      :columns="mbColumns"
      v-else
    />
    <mb-page v-if="isMobile" @page-change="handlePageChange" :total="total" />
  </div>
</template>
<script>
// import {
//   getMessage,
//   getMessageByAddress,
//   // getMessageMethods,
// } from "@/api/message";
import { getTxListByChunkHash , txListByAccountId , getMessage,getTxListByHeaderHash} from "@/api/apis";
export default {
  name: "MessageList",
  data() {
    const type = this.type;
    return {
      method: [],
      loading: false,
      option: {
        method: "",
        "begindex": "0",
        count: "10",
        page: 1
      },
      currentPage: 1,
      total: 0,
      messageData: [],
      columns: [
        {
          key: "type",
          hideInMobile: true
        },
        {
          key: "cid",
          isLink: true,
          target: "message/detail",
          ellipsis: true
        },
        {
          key: "height",
          isLink: true,
          target: "tipset",
          paramKey: "height"
        },
        {
          key: "time",
          hideInMobile: true
        },
        {
          key: "from",
          isLink: true,
          target: "address/detail",
          paramKey: "address",
          ellipsis: true,
        },
        {
          key: "to",
          isLink: true,
          target: "address/detail",
          paramKey: "address",
          ellipsis: true,
        },
        {
          key: "value"
        },
        // {
        //   key: "fee",
        //   hideInMobile: true,
        //   unit: "FIL"
        // },
      ],
      labels: []
    };
  },
  props: {
    withType: {
      type: Boolean,
      default: true
    },
    cid: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "transaction"
    },
    address: {
      type: String,
      default: ""
    }
  },
  methods: {
    
    handleSizeChange(v) {
      this.option.count = v;
    },
    handlePageChange(v) {
      this.currentPage = v;
      this.option.begindex = (v - 1) * this.option.count;
      this.option.page = v;
    },
    handleMethodChange(v) {
      this.currentPage = 1;
      this.option = {
        method: v,
        begindex: 0,
        count: 10
      };
    },
    formatTime(time){
      let date = new Date(time);
      return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    },
    async getMessage() {
      try {
        this.loading = true;
        const addressHash = this.address;
        const type = this.type;
        const ellipsisByLength = this.ellipsisByLength;
        
        let data = {};
        if (this.type === "transaction") {
          let dataT = await getMessage(this.option);
          data.msgs = dataT.data.resp.txList;
          data.total = dataT.data.resp.count;
        }else if(this.type == "block"){
          let datas = await getTxListByHeaderHash(this.cid,this.option);
          data.msgs = datas.data.resp.tx;
         
          data.total = datas.data.resp.count;
        }else {
          this.columns;
          let res = await txListByAccountId(this.option.page,this.address)
          data.msgs = res.data.resp.txList;
          
          data.total = res.data.resp.count;
        }
        this.total = Number(data.total);
        
        const messageData = data.msgs.map(item => {
          let res = {
            cid: item.hash,
            time: this.formatTime(item.timestamp),
            from: item.signer_id,
            to: item.receiver_id,
            value: item.value,
            type: this.address !== item.signer_id ? "in" : "out",
            height: this.formatNumber(item.height),
          };
          return res;
        });
        this.messageData = messageData;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    // async getMessageMethods() {
    //   try {
    //     let data = await getMessageMethods();
    //     this.method = data.method.map(item => {
    //       return {
    //         value: item,
    //         label: item
    //       };
    //     });
    //   } catch (e) {
    //     this.loading = false;
    //   }
    // }
  },
  watch: {
    option: {
      deep: true,
      handler() {
        this.getMessage();
      }
    },
    cid() {
      this.option = {
        begindex: 0,
        count: 10
      };
    },
    address() {
      this.getMessage();
    }
  },
  mounted() {
    this.labels = [...this.$t("component.mesAccList.label")];
    if (!this.withType) {
      this.columns.shift();
      this.labels.shift();
    }
    this.getMessage();
    // this.getMessageMethods();
  },
  computed: {
    mbColumns() {
      return this.columns
        .map((item, index) => {
          return {
            ...item,
            title: this.labels[index]
          };
        })
        .filter(item => {
          return !item.hideInMobile;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.message-list {
  .total-number {
    height: 80px;
    align-items: center;
    padding: 0 100px;
    display: flex;
    background: var(--board-bg-color);
    color: var(--main-text-color);
    & ::v-deep > span {
      margin-right: auto;
      i {
        color: var(--link-color);
				font-size: 150%;
      }
    }
    .el-dropdown-link {
      color: white;
    }
  }
  @media (max-width: 768px) {
    .total-number {
      height: 30px;
      margin-bottom: 10px;
      & ::v-deep .el-select input {
        height: 20px;
        font-size: 12px !important;
        width: 100px;
      }
      & ::v-deep .el-input__suffix {
        i {
          line-height: 20px;
          padding-left: 5px;
          &.is-reverse {
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .el-select-dropdown {
    z-index: 10000 !important;
    .el-select-dropdown__wrap {
      max-height: 160px !important;
    }
    li {
      height: 20px !important;
      line-height: 20px !important;
      font-size: 12px;
    }
  }
}
</style>
