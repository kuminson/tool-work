<template>
  <div class="i18n">
    <div class="title">表格转js</div>
    <div class="note">表头第一行要用指定的规则 主要字段用'key' 语种用两个字母的缩写</div>
    <div class="note">| key | en | ja | es | ko |</div>
    <div class="row">
      <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".xlsx">
        <a-button><a-icon type="upload" />选择xlsx文件</a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="fileList.length === 0" @click="download"><a-icon type="download" />下载js文件</a-button>
    </div>
    <div class="line-dividing"></div>
    <div class="title">js转表格</div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import JSZip from 'jszip';
  import {saveAs} from 'file-saver'
  export default {
    name: "i18n",
    data () {
      return {
        fileList: []
      }
    },
    methods: {
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      beforeUpload(file) {
        this.fileList = [file];
        return false;
      },
      download () {
        // 读取文件
        const file = this.fileList[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, {type: 'array'})
          // 解析xlsx
          const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const myjson = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
          // 生成js文件
          const myKey = []
          let mainKey = ''
          for (let i = 0; i < myjson[0].length; i++) {
            if (myjson[0][i].search(/^[a-zA-Z]{2}$/) !== -1) {
              myKey.push({
                name: myjson[0][i],
                index: i
              })
            } else if (myjson[0][i] === 'key') {
              mainKey = i
            }
          }
          console.log('myKey', myKey, mainKey)
          const totalData = {}
          for (let i = 1; i < myjson.length; i++) {
            // 提取单页名
            const keyObj = myjson[i][mainKey].split('.')
            for (let j = 0; j < myKey.length; j++) {
              if (totalData[myKey[j].name] === undefined) {
                totalData[myKey[j].name] = {}
              }
              if (totalData[myKey[j].name][keyObj[0]] === undefined) {
                totalData[myKey[j].name][keyObj[0]] = {}
              }
              // [语种][单页名][字段key] = [表格数据第n行][语种的key值]
              totalData[myKey[j].name][keyObj[0]][keyObj[1]] = myjson[i][myKey[j].index]
            }
          }
          console.log('totalData', totalData)
          // 放到压缩包里
          const zip = new JSZip()
          for (let key in totalData) {
            for (let index in totalData[key]) {
              // 语种/单页名.js
              zip.file(key + '/' + index + '.js', 'export default ' + JSON.stringify(totalData[key][index]))
            }
          }
          // 下载
          zip.generateAsync({type:"blob"}).then((content) => {
            saveAs(content, "i18n.zip");
          })
        }
        reader.readAsArrayBuffer(file)
      }
    }
  }
</script>

<style scoped>
.i18n{
  width: 800px;
}
  .note{
    color: #999;
    font-size: 12px;
    margin-top: 10px;
  }
  .note+.note{
    margin-top: 4px;
  }
  .row{
    margin-top: 10px;
  }
</style>