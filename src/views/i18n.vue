<template>
  <div class="i18n">
    <div class="row">
      <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".xlsx">
        <a-button><a-icon type="upload" />选择xlsx文件</a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="fileList.length === 0" @click="download"><a-icon type="download" />下载js文件</a-button>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
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
          // 放到压缩包里
          // 下载
          console.log('workbook', myjson)
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
</style>