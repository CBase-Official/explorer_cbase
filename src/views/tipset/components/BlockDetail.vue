<template>
  <div class="block-detail bottom-10 top-20">
    <div class="block-overview">
      <overview :dataList="realList" :block_type="getBlockType" :dataLabel="$t('tipset.block.overview')" />
    </div>
    <message-list :withType="false" :type="type" :cid="hash" />
  </div> 
</template>
<script>

export default {
  name: "BlockDetail",
  props: {
    hash: {
      type: String,
      default: ""
    },
    block: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
       type: String,
       default: "block"
    }
  },
  data() {
    return {
      dataList: [
        {
          key: "block_type"
        },
        {
          key: "hash",
          style: {
            fontWeight: "bold"
          }
        },
        {
          key: "height",
        },
      ]
    };
  },
  mounted(){
  },
  computed: {
    realList() {
      let currentBlock =this.block;
      console.log("currentBlock:",currentBlock)
      
      return this.dataList.map(item => {
        let linkList;
        if (item.key === "height") {
          linkList = [currentBlock[item.key]];
        } else {
          linkList = currentBlock[item.key];
        }
        return {
          ...item,
          value: currentBlock[item.key],
          linkList: linkList
        };
      });
    },
    getBlockType() {
      return this.block_type;
    }
  },
};
</script>
<style lang="scss" scoped>
.block-detail {
  position: relative;
  .block-hash {
    background: white;
  }
  & ::v-deep .message-list {
    margin-top: 20px;
  }
}
</style>
