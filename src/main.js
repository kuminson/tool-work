import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Input,
  Row,
  Col,
  Upload,
  Button,
  Icon,
  Message
} from 'ant-design-vue'
import clipboard from 'clipboard'


import './assets/style/common.scss'

Vue.component(Input.name, Input)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Upload.name, Upload)
Vue.component(Button.name, Button)
Vue.component(Icon.name, Icon)

Vue.prototype.$cb = clipboard
Vue.prototype.$message = Message


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
