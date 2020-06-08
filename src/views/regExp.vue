<template>
  <div class="regexp">
    <div class="title">正则字面量转译</div>
    <div class="row">
      <div class="item">
        <div class="row-title">请输入正则表达式</div>
        <a-input v-model="rgString" placeholder="不用输入前后的'/'" />
      </div>
    </div>
    <div class="row">
      <div class="row-res res-text">{{res}}</div>
    </div>
    <div class="title">pundix官网新闻转换</div>
    <div class="row">
      <div class="item">
        <div class="row-title">请粘贴文案</div>
        <a-textarea
          v-model="pundixText"
          :auto-size="{ minRows: 4, maxRows: 6 }"
        />
      </div>
    </div>
    <div class="row copy" :data-clipboard-text="pundixNews">
      <pre class="row-res res-json">{{pundixNews}}</pre>
    </div>
    <div class="title">functionX官网新闻转换</div>
    <div class="row">
      <div class="item">
        <div class="row-title">请粘贴文案</div>
        <a-textarea
          v-model="functionxText"
          :auto-size="{ minRows: 4, maxRows: 6 }"
        />
      </div>
    </div>
    <div class="row copy" :data-clipboard-text="functionXNews">
      <pre class="row-res res-json">{{functionXNews}}</pre>
    </div>
  </div>
</template>

<script>
  export default {
    name: "reg-exp",
    data () {
      return {
        copyObj: null,
        rgString: '',          // 正则字面量变量
        pundixText: '',        // pundix新闻
        functionxText: ''      // functionx新闻
      }
    },
    computed: {
      res () {
        return this.rgToLiteral(this.rgString)
      },
      pundixNews () {
        return this.ptToObj(this.pundixText)
      },
      functionXNews () {
        return this.fxToObj(this.functionxText)
      }
    },
    methods: {
      // 字面量转换用正则
      rgToLiteral (string) {
        return string.replace(/[\\]/g, "\\$&");
        //$&表示整个被匹配的字符串
      },
      // pundix 新闻转换正则
      ptToObj (string) {
        // 拆分
        const sArray = string.split(/\n(?=[^h])/g)
        const resArray = sArray.map((item) => {
          const res = item.replace(/([^h\n]+?(?:2019|2020)) +(.+)\n([h].+)/g, "{\n" +
            "\"time\": \"$1 - \",\n" +
            "\"text\": \"$2\",\n" +
            "\"url\": \"$3\",\n" +
            "\"blog\": true\n" +
            "},")
          return res
        })
        return resArray.join('')
      },
      // functionX 新闻转换正则
      fxToObj (string) {
        const sArray = string.split(/\n(?=[^h])/g)
        const resArray = sArray.map((item) => {
          const res = item.replace(/([^h\n]+?(?:2019|2020)) +(.+)\n([h].+)/g, "{\n" +
            "\"time\": \"$1\",\n" +
            "\"text\": \"$2\",\n" +
            "\"url\": \"$3\"\n" +
            "},")
          return res
        })
        return resArray.join('')
      },
      addCopyEvent () {
        this.copyObj = new this.$cb('.copy')
        this.copyObj.on('success', () => {
          this.$message.success(
            '复制成功',
            3
          )
        })
        this.copyObj.on('error', () => {
          this.$message.error(
            '复制失败',
            3
          )
        })
      },
      removeCopyEvent () {
        if (this.copyObj !== null) {
          this.copyObj.destroy()
        }
      }
    },
    mounted () {
      this.addCopyEvent()
    },
    beforeDestroy () {
      this.removeCopyEvent()
    }
  }
</script>

<style scoped>
  .regexp{
    width: 600px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .title{
    font-size: 18px;
    margin-top: 40px;
  }
  .row-title{
    text-align: left;
    line-height: 32px;
  }
  .row-title:after{
    content: ':';
    position: relative;
    top: -0.5px;
    margin: 0 8px 0 2px;
  }
  .row-res{
    height: 100px;
    background-color: #EEE;
    border: 1px solid #CCC;
  }
  .row-res.res-text{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .row-res.res-json{
    height: 200px;
    text-align: left;
  }
</style>