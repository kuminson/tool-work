<template>
  <div class="i18n">
    <!--h5 表格转js-->
    <div class="title">h5 表格转js</div>
    <div class="note">
      表头第一行要用指定的规则 主要字段用'key' 语种用两个字母的缩写
    </div>
    <div class="note">| key | en | ja | es | ko |</div>
    <div class="row">
      <a-upload
        :file-list="fileList"
        :remove="
          (file) => {
            handleRemove(file, 'fileList')
          }
        "
        :before-upload="
          (file) => {
            beforeUpload(file, 'single', 'fileList')
            return false
          }
        "
        accept=".xlsx"
      >
        <a-button>
          <a-icon type="upload" />
          选择xlsx文件
        </a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="fileList.length === 0" @click="downloadJS">
        <a-icon type="download" />
        下载js文件
      </a-button>
    </div>
    <div class="row">
      <a href="./example/example.xlsx" download>下载xlsx例子</a>
    </div>
    <div class="line-dividing"></div>
    <!--h5 js转表格-->
    <div class="title">h5 js转表格</div>
    <div class="note">把所有js文件放到文件夹里一起上传</div>
    <div class="row">
      <a-upload
        directory
        :file-list="directory"
        :remove="dirHandleRemove"
        :before-upload="dirBeforeUpload"
      >
        <a-button>
          <a-icon type="upload" />
          选择js文件夹
        </a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="directory.length === 0" @click="downloadXLSX">
        <a-icon type="download" />
        下载xlsx文件
      </a-button>
    </div>
    <div class="row">
      <a href="./example/example.zip" download>下载js文件夹例子</a>
    </div>
    <div class="line-dividing"></div>
    <!--vue 表格转json-->
    <div class="title">vue 表格转json</div>
    <div class="note">
      表头第一行要用指定的规则 主要字段用'key' 语种用两个字母的缩写
    </div>
    <div class="note">| key | en | ja | es | ko |</div>
    <div class="row">
      <a-upload
        :file-list="vueXlsx"
        :remove="
          (file) => {
            handleRemove(file, 'vueXlsx')
          }
        "
        :before-upload="
          (file) => {
            beforeUpload(file, 'single', 'vueXlsx')
            return false
          }
        "
      >
        <a-button>
          <a-icon type="upload" />
          选择xlsx文件
        </a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="vueXlsx.length === 0" @click="downloadVueJSON">
        <a-icon type="download" />
        下载JSON文件
      </a-button>
    </div>
    <div class="row">
      <a href="./example/vue_example.xlsx" download>下载xlsx文件例子</a>
    </div>
    <div class="line-dividing"></div>
    <!--vue json转表格-->
    <div class="title">vue json转表格</div>
    <div class="note">key里不能有$符号</div>
    <div class="row">
      <a-upload
        :file-list="vueDirectory"
        :remove="
          (file) => {
            handleRemove(file, 'vueDirectory')
          }
        "
        :before-upload="
          (file) => {
            beforeUpload(file, 'single', 'vueDirectory')
            return false
          }
        "
      >
        <a-button>
          <a-icon type="upload" />
          选择json文件
        </a-button>
      </a-upload>
    </div>
    <div class="row">
      <a-button :disabled="vueDirectory.length === 0" @click="downloadVueXLSX">
        <a-icon type="download" />
        下载xlsx文件
      </a-button>
    </div>
    <div class="row">
      <a href="./example/vue_example.json" download>下载json文件例子</a>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
  name: 'i18n',
  data() {
    return {
      // 表格文件
      fileList: [],
      // js文件夹
      directory: [],
      // vue 表格文件
      vueXlsx: [],
      // vue json
      vueDirectory: []
    }
  },
  methods: {
    handleRemove(file, list) {
      // 找到目标文件下标
      const index = this[list].indexOf(file)
      // 生成新文件数组
      const newFileList = this[list].slice()
      // 删除目标文件
      newFileList.splice(index, 1)
      this[list] = newFileList
    },
    beforeUpload(file, type, list) {
      if (type === 'single') {
        this[list] = [file]
      } else if (type === 'multiple') {
        this[list].push(file)
      }
    },
    downloadJS() {
      // 读取文件
      const file = this.fileList[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        // 解析xlsx
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const myjson = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 })
        // 生成js文件
        const myKey = []
        let mainKey = ''
        for (let i = 0; i < myjson[0].length; i++) {
          if (myjson[0][i].search(/^[a-zA-Z]{2}$/) !== -1) {
            myKey.push({
              name: myjson[0][i],
              index: i
            })
          } else if (myjson[0][i].toLowerCase() === 'key') {
            mainKey = i
          }
        }

        if (myKey.length === 0) {
          console.log('未找到语种名，请用两个字母的缩写')
          return
        }
        if (mainKey === '') {
          console.log('未找到主要字段的key，请确定第一行主要字段名为key')
        }

        const totalData = {}
        for (let i = 1; i < myjson.length; i++) {
          // 提取单页名
          if (myjson[i].length === 0) {
            continue
          }
          const keyObj = myjson[i][mainKey].split('.')
          for (let j = 0; j < myKey.length; j++) {
            if (totalData[myKey[j].name] === undefined) {
              totalData[myKey[j].name] = {}
            }
            if (totalData[myKey[j].name][keyObj[0]] === undefined) {
              totalData[myKey[j].name][keyObj[0]] = {}
            }
            // [语种][单页名][字段key] = [表格数据第n行][语种的key值]
            totalData[myKey[j].name][keyObj[0]][keyObj[1]] =
              myjson[i][myKey[j].index]
          }
        }
        // 放到压缩包里
        const zip = new JSZip()
        for (let key in totalData) {
          for (let index in totalData[key]) {
            // 语种/单页名.js
            zip.file(
              key + '/' + index + '.js',
              'export default ' + JSON.stringify(totalData[key][index])
            )
          }
        }
        // 下载
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'h5_i18n.zip')
        })
      }
      // 用buffer方式读取
      reader.readAsArrayBuffer(file)
    },
    dirHandleRemove(file) {
      // 找到目标文件下标
      const index = this.directory.indexOf(file)
      // 生成新文件数组
      const newFileList = this.directory.slice()
      // 删除目标文件
      newFileList.splice(index, 1)
      this.directory = newFileList
    },
    dirBeforeUpload(file) {
      this.directory.push(file)
      return false
    },
    downloadXLSX() {
      // 建立表格数据
      const mainData = [['key', '原始文案']]
      // 初始化计数器
      let num = 0
      // 处理读取到的文件
      const readFileLoad = (e, name) => {
        // 解析js文件
        const result = e.target.result.replace(/\n/g, '')
        console.log(
          'result',
          result.replace(/^.+?(?=\{)/, '').replace(/, *?\}$/, '}')
        )
        const data = JSON.parse(
          result.replace(/^.+?(?=\{)/, '').replace(/, *?\}$/, '}')
        )
        // 把js内容压入表格
        for (let key in data) {
          const tableArray = []
          tableArray[0] = name + '.' + key
          tableArray[1] = data[key]
          mainData.push(tableArray)
        }
        // 累加计数器
        num++
        // 如果是最后一个文件
        if (num === this.directory.length) {
          // 把Array格式转成表格格式
          const worksheet = XLSX.utils.aoa_to_sheet(mainData)
          // 新建表格
          const new_workbook = XLSX.utils.book_new()
          // 在表格里加入表格内容
          XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS')
          // 下载表格
          XLSX.writeFile(new_workbook, 'h5_i18n.xlsx')
        }
      }
      // 读取所有文件
      for (let i = 0; i < this.directory.length; i++) {
        const reader = new FileReader()
        // 把文件名一同传入
        reader.onload = (e) => {
          readFileLoad(e, this.directory[i].name.replace(/\..+?$/, ''))
        }
        // 用文本方式读取
        reader.readAsText(this.directory[i])
      }
    },
    downloadVueXLSX() {
      // 建立表格数据
      const mainData = [['key', '原始文案']]
      const reader = new FileReader()
      reader.onload = (e) => {
        // 解析js文件
        const data = JSON.parse(e.target.result)
        console.log('e.target.result', e.target.result, data)
        mainData.push(...this.parseJson(data))
        console.log('mainData', mainData)
        // 把Array格式转成表格格式
        const worksheet = XLSX.utils.aoa_to_sheet(mainData)
        // 新建表格
        const new_workbook = XLSX.utils.book_new()
        // 在表格里加入表格内容
        XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS')
        // 下载表格
        XLSX.writeFile(new_workbook, 'vue_i18n.xlsx')
      }
      // 用文本方式读取
      reader.readAsText(this.vueDirectory[0])
    },
    // 解析json
    parseJson(json) {
      const res = []
      // 遍历
      for (let key in json) {
        // 内容是字符串  处理
        if (typeof json[key] === 'string') {
          const newArr = []
          newArr[0] = key
          newArr[1] = json[key]
          res.push(newArr)
        } else {
          // 确定连接符
          let midSymbol = '.'
          if (json[key] instanceof Array) {
            midSymbol = '.$'
          }
          // 内容是对象或数组  递归
          let newContent = this.parseJson(json[key])
          newContent = newContent.map((item) => {
            if (midSymbol === '.$') {
              // 如果下一个也是数组
              if (item[0].search(/^\d+?\$\$\./) !== -1) {
                item[0] = key + midSymbol + item[0]
              } else {
                // 下一个是对象
                item[0] = key + midSymbol + item[0]
              }
            } else {
              item[0] = key + midSymbol + item[0]
            }
            return item
          })
          res.push(...newContent)
        }
      }
      return res
    },
    downloadVueJSON() {
      // 读取文件
      const file = this.vueXlsx[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        // 解析xlsx
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const myjson = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 })
        // 获取语种与对应的index
        const languageKey = []
        let mainKey = ''
        for (let i = 0; i < myjson[0].length; i++) {
          if (myjson[0][i].search(/^[a-zA-Z]{2}$/) !== -1) {
            languageKey.push({
              name: myjson[0][i],
              index: i
            })
          } else if (myjson[0][i] === 'key') {
            mainKey = i
          }
        }
        const totalData = {}
        for (let i = 1; i < myjson.length; i++) {
          // 提取单页名
          let keyObj = myjson[i][mainKey].split('.')
          for (let j = 0; j < languageKey.length; j++) {
            if (totalData[languageKey[j].name] === undefined) {
              totalData[languageKey[j].name] = {}
            }
            this.getPositionSetData(
              totalData[languageKey[j].name],
              keyObj,
              myjson[i][languageKey[j].index]
            )
          }
        }
        console.log('totalData', totalData)
        // 放到压缩包里
        const zip = new JSZip()
        for (let key in totalData) {
          zip.file(key + '.json', JSON.stringify(totalData[key]))
        }
        // 下载
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'vue_i18n.zip')
        })
      }
      // 用buffer方式读取
      reader.readAsArrayBuffer(file)
    },
    getPositionSetData(obj, key, text) {
      // 获取每一层类型
      const typeList = []
      const newKey = []
      for (let i = 0; i < key.length; i++) {
        // 如果是数组
        if (key[i].search(/^\$\d+$/) !== -1) {
          typeList.push('array')
          newKey.push(Number(key[i].replace(/^\$/, '')))
        } else {
          // 如果是对像
          typeList.push('obj')
          newKey.push(key[i])
        }
      }
      let target = obj
      for (let i = 0; i < newKey.length; i++) {
        // 如果是最后一个 赋值
        if (i === newKey.length - 1) {
          target[newKey[i]] = text
          break
        }
        if (typeList[i + 1] === 'array') {
          if (target[newKey[i]] === undefined) {
            target[newKey[i]] = []
          }
        } else {
          if (target[newKey[i]] === undefined) {
            target[newKey[i]] = {}
          }
        }
        target = target[newKey[i]]
      }
    }
  }
}
</script>

<style scoped>
.i18n {
  width: 800px;
}
</style>
