<template>
    <div class="main-box">
        <div class="function-box round-border">
            <div class="col-box">
                <div class="title">教师功能</div>
                <div class="list-outer">
                    <div class="list-inner" @click="$router.push('/TeacherTeam')">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>管理组队</div>
                    </div>
                    <div class="list-inner" @click="$router.push('/TeacherWorkAll')">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>管理学习任务</div>
                    </div>
                </div>
            </div>
            <div class="col-box">
                <div class="title">学生功能</div>
                <div class="list-outer">
                    <div class="list-inner" @click="$router.push('/StudentTeam')">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>查看队伍信息</div>
                    </div>
                    <div class="list-inner" @click="$router.push('/ManagerWork')">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>查看负责<br>的团队任务</div>
                    </div>
                    <div class="list-inner" @click="$router.push('/PersonWork')">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>查看个人任务</div>
                    </div>
                </div>
            </div>
            <div class="col-box">
                <div class="title">通用功能</div>
                <div class="list-outer">
                    <div class="list-inner">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>群聊</div>
                    </div>
                    <div class="list-inner">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>资料库</div>
                    </div>
                    <div class="list-inner">
                        <el-icon :size="75">
                            <Edit/>
                        </el-icon>
                        <div>通知</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="side-box">
            <div class="info-box round-border" @click="open">
                <div class="info-top">
                    个人信息
                </div>
                <div class="info-box">
                    <div style="margin-top: 10px">用户Id:{{userInfo.userId}}</div>
                    <div>用户名:{{userInfo.userName}}</div>
                    <div v-show="userInfo.userType==='student'">所属团队:{{userInfo.userTeam}}</div>
                </div>
            </div>
            <div class="announce-box round-border" @click="$router.push('/test')">
                未读通知
            </div>
        </div>
    </div>
</template>

<script>
import FunctionList from "../function_list.js";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  data() {
    return {
      userInfo:{
      }
    }
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/api/user/information")
          .then(resp => {
            console.log(resp)
          })
    },

  },
  mounted() {
    this.getUserInfo()

  }

}
</script>

<style lang="scss" scoped>
$box-margin: 20px;
$box-padding: 10px;
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-box {
  display: flex;
  height: 100%;

  .round-border {
    border-radius: 10px;
    padding: $box-padding;
  }

  .function-box {
    width: 65%;
    height: calc(100% - ($box-margin + $box-padding) * 2);
    background: rgb(204, 204, 204);
    margin: $box-margin;

    .col-box {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 27px;
        border-bottom: 1px solid gray;
        padding: 0 10px;
        width: fit-content;
        margin-bottom: 10px;
      }

      .list-outer {
        display: flex;

        .list-inner {
          margin: 10px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }

  .mission-box {
    width: 30%;
    background: rgb(204, 204, 204);
    margin: $box-margin;

  }

  .side-box {
    width: 30%;
    height: calc(100% - 40px);
    margin: $box-margin;
    display: flex;
    flex-direction: column;

    .info-box {
      height: 30%;
      background: rgb(204, 204, 204);
      margin-bottom: 20px;
    }

    .announce-box {
      height: 30%;
      background: rgb(204, 204, 204);
    }
  }
}
</style>