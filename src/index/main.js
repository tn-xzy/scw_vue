import { createApp } from 'vue'
import App from './index.vue'
import * as VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
if (localStorage.getItem("token")===null)
    window.location.href = '/login.html'
axios.defaults.headers.common['token'] = localStorage.getItem("token")
axios.interceptors.response.use(function (res) {
  if (res.data.status!==0){
    console.log("inter",res)
    ElMessageBox.alert(`<p>简要描述:${res.data.description}</p>
    <p>错误信息:${res.data.data}</p>`, `错误状态码：${res.data.status}`, {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true,
    })
  }
  return res;
}, function (error) {
    console.log("inter",error)
    ElMessageBox.alert(`<p>简要描述:${error.message}</p>
    <p>错误信息:${error}</p>`, `错误状态码：${error.code}`, {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true,
    })
  return Promise.reject(error);
});
app.config.globalProperties.$axios = axios
// app.use(ElementPlus)
app.mount('#app')