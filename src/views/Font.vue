<template>
  <div class="font">
    <div class="title">计算字符串宽度</div>
    <div class="row">
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        accept=".woff,.woff2,.svg,.ttf,.otf,.eot"
      >
        <a-button>
          <a-icon type="upload" />
          上传要计算的字体
        </a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button @click="calcChart">
        <a-icon type="calculator" />
        开始计算
      </a-button>
    </div>
    <div class="row">
      <div class="subtitle">字体示例</div>
      <div class="font-place font-use">
        <span class="character" v-for="(item, key) of chart" :key="key">{{
          item
        }}</span>
      </div>
    </div>
    <div class="row">
      <div class="subtitle">结果</div>
      <pre class="row-res res-json copy" :data-clipboard-text="chartObj">{{
        chartObj
      }}</pre>
    </div>
    <div class="row">
      <div class="subtitle">测试</div>
      <span
        class="test-chart font-use"
        :style="{ fontSize: testChartSize + 'px' }"
        ref="testChart"
        >{{ address }}</span
      >
    </div>
    <div class="row">
      <div>计算宽度:{{ calcAddress }}</div>
      <div>测量宽度:{{ clientWidth }}</div>
      <div>误差:{{ (calcAddress - clientWidth) / clientWidth }}</div>
    </div>
    <div class="row">
      <div class="subtitle">测试2</div>
      <span
        class="test-chart font-use"
        :style="{ fontSize: testChartSize2 + 'px' }"
        ref="testChart2"
        >{{ testNumber }}</span
      >
    </div>
    <div class="row">
      <div>计算宽度:{{ calcNumber }}</div>
      <div>测量宽度:{{ clientWidth2 }}</div>
      <div>误差:{{ (calcNumber - clientWidth2) / clientWidth2 }}</div>
    </div>
    <div class="row">
      <div class="subtitle">方法</div>
      <pre class="row-res res-json copy" :data-clipboard-text="getSizeMethod">{{
        getSizeMethod
      }}</pre>
    </div>
  </div>
</template>

<script>
import { getTextSize } from '@/tools/utils'
export default {
  name: 'font',
  data() {
    return {
      fileList: [],
      fileUrl: '',
      styleTag: null,
      en_chart: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|} ~`,
      cn_chart: `０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ｀－＝【】、；‘’，。／＼～！＠＃￥％…＆×（）—＋｛｝｜：“”《》？〈〉＜＞〔〕〖〗『』`,
      res: {},
      address: '0x769049eD6f9a21Aa5c71f66856E564451747259E',
      testNumber: '12,835,274,128.1891286124102113',
      clientWidth: 0,
      clientWidth2: 0,
      testChartSize: 14,
      testChartSize2: 20,
      copyObj: null,
      getSizeMethod: `/**
 * 计算字符串宽度
 * @param {{}} widthObj - 字符宽度数据对象
 * @param {string} text - 要计算的字符串
 * @param {number} fontSize - 字体大小
 * @param {number} [letterSpacing] - 字符间距
 * @param {number} [wordSpacing] - 空格宽度
 */
export function getTextSize(
  widthObj,
  text,
  fontSize,
  letterSpacing = 0,
  wordSpacing = 0
) {
  let width = 0
  const zh_letter = new RegExp('[\u4E00-\u9FA5]+')
  const zh_symbol =
    '０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ｀－＝【】、；‘’，。／＼～！＠＃￥％…＆×（）—＋｛｝｜：“”《》？〈〉＜＞〔〕〖〗『』'
  text.split('').forEach(item => {
    if (zh_letter.test(item) || zh_symbol.indexOf(item) !== -1) {
      if (item === ' ' && wordSpacing !== 0) {
        width += fontSize + wordSpacing
      } else {
        width += fontSize
      }
    } else {
      width += fontSize * (widthObj[item] || 1)
    }
  })
  if (letterSpacing !== 0) {
    width += letterSpacing * text.length
  }
  return width
}`
    }
  },
  watch: {},
  computed: {
    chart() {
      return this.en_chart.split('')
    },
    chartObj() {
      return JSON.stringify(this.res, null, 2)
    },
    calcAddress() {
      return getTextSize(this.res, this.address, this.testChartSize, 0)
    },
    calcNumber() {
      return getTextSize(this.res, this.testNumber, this.testChartSize2, 0)
    }
  },
  methods: {
    handleRemove() {
      this.fileList = []
      this.fileUrl = ''
    },
    beforeUpload(file) {
      console.log('file', file)
      const url = URL.createObjectURL(file)
      this.fileUrl = url
      this.loadFont()
      console.log('url', url)
      this.fileList = [file]
      return false
    },
    loadFont() {
      let init = false
      if (this.styleTag === null) {
        this.styleTag = document.createElement('style')
        init = true
      }
      this.styleTag.type = 'text/css'
      this.styleTag.innerText = `@font-face {font-family:testFont;src:url(${this.fileUrl})};`
      if (init) {
        document.getElementsByTagName('head')[0].appendChild(this.styleTag)
      }
    },
    calcChart() {
      const charts = document.querySelectorAll('.character')
      const size = {}
      charts.forEach(item => {
        const info = item.getBoundingClientRect()
        size[item.innerText] = info.width / 20
      })
      this.res = size
      console.log('width', size)
      const clientTest = this.$refs.testChart.getBoundingClientRect()
      this.clientWidth = clientTest.width
      const clientTest2 = this.$refs.testChart2.getBoundingClientRect()
      this.clientWidth2 = clientTest2.width
    },
    addCopyEvent() {
      this.copyObj = new this.$cb('.copy')
      this.copyObj.on('success', () => {
        this.$message.success('复制成功', 3)
      })
      this.copyObj.on('error', () => {
        this.$message.error('复制失败', 3)
      })
    },
    removeCopyEvent() {
      if (this.copyObj !== null) {
        this.copyObj.destroy()
      }
    }
  },
  mounted() {
    this.addCopyEvent()
  },
  beforeDestroy() {
    this.removeCopyEvent()
  }
}
</script>

<style scoped lang="scss">
.font {
  width: 800px;
  padding-left: 20px;
  padding-right: 20px;
  .font-use {
    font-family: testFont;
  }
  .font-place {
    font-size: 20px;
    overflow-wrap: break-word;
    //word-spacing: 10px;
  }
  .test-chart {
    letter-spacing: 0px;
    word-spacing: 0px;
  }
}
</style>
