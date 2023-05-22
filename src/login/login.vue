<template>
    <div id="app">
        <div class="flex-center">
            <div class="vertical-center" >
                <h2>协同开发学习网站</h2>
                <div v-show="register === false" class="flex-vertical">
                    <el-input
                            class="info-input"
                            placeholder="用户名"
                            :prefix-icon="ElIconUser"
                            v-model="login_info.userid"
                    ></el-input>
                    <el-input
                            class="info-input"
                            placeholder="密码"
                            :prefix-icon="ElIconLock"
                            v-model="login_info.password"
                            show-password
                    >
                    </el-input>
                    <div class="more-action info-input">
                        <el-link
                                @click="
                $alert('请联系教务处', '忘记了密码？', {
                  confirmButtonText: '确定',
                })
              "
                        >忘记密码
                        </el-link
                        >
                        <el-link @click="register = true">注册</el-link>
                    </div>
                    <el-button
                            @click="Login"
                            type="primary"
                            class="info-input"
                            :loading="loadflag"
                            style="width: 50%; border-radius: 15px; background-color: #5d2dcc"
                    >登录
                    </el-button
                    >
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {User as ElIconUser, Lock as ElIconLock} from '@element-plus/icons'
import axios from "axios";

export default {
  data() {
    return {
      dev: null,
      root: '.',
      loadflag: false,
      register: false,
      login_info: {
        userid: '',
        password: '',
      },
      ElIconUser,
      ElIconLock,
    }
  },
  name: 'App',
  methods: {
    Login() {
      if (this.login_info.userid === '') {
        this.$alert('', '用户名未填', {confirmButtonText: '确定'})
        return
      }
      if (this.login_info.password === '') {
        this.$alert('', '密码未填', {confirmButtonText: '确定'})
        return
      }
      this.loadflag = true
      console.log(JSON.stringify(this.login_info))
      axios({
        method: 'POST',
        url: import.meta.env.VITE_API_URL+'/user/login',
        data: {
          userCode: this.login_info.userid,
          userPass: this.login_info.password
        },
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
          .then((resp) => {
            this.loadflag = false
            console.log('login.do', resp.data)
            let result = resp.data
            localStorage.setItem("token", resp.data.data)
            window.location.href = '/index.html'
            this.loadflag = false
          })
          .catch((error) => {
            this.loadflag = false
            this.$alert(error, '发生未知错误', {confirmButtonText: '确定'})
            console.log(error)
          })
    }
  },
}
</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0px;
}

#app {
    display: flex;
    justify-content: center;
    align-items: center;
}

body {
    background-image: url('../assets/login_background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
}

.more-action {
    display: flex;
    justify-content: space-between;
}

.info-input {
    width: 100%;
    margin: 5px 0 5px 0;
}

.vertical-center {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 20px;
}

.flex-vertical {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.flex-center {
    display: flex;
    justify-content: stretch;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 20px;
}
</style>
