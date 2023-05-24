<template>
    <div class="main-box">
        <div class="info-box round-border" @click="open">
            <div class="info-top">
                个人信息
            </div>
            <div class="info-inner">
                <el-avatar class="info-item" :size="120" src="/owl.png" fit="fill"></el-avatar>
                <div class="info-item">用户Id:{{ userInfo.userId }}</div>
                <div class="info-item">用户名:{{ userInfo.userName }}</div>
                <div class="info-item" v-show="userInfo.userType==='student'">所属团队:{{ userInfo.userTeam }}</div>
            </div>
        </div>
        <div class="function-box round-border">
            <div class="col-box" v-show="userType==='teacher' ||development">
                <div class="title">教师功能</div>
                <div class="list-outer">
                    <div class="list-inner" @click="$router.push('/TeacherWorkSingle')">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>创建学习任务</div>
                    </div>
                    <div class="list-inner" @click="$router.push('/TeacherWorkAll')">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>查看学习任务</div>
                    </div>
                </div>
            </div>
            <div class="col-box" v-show="userType==='student'||development">
                <div class="title">学生功能</div>
                <div class="list-outer">
                    <div class="list-inner" @click="$router.push('/ManagerWork')">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>团队任务</div>
                    </div>
                    <div class="list-inner" @click="$router.push('/PersonWork')">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>个人任务</div>
                    </div>
                </div>
            </div>
            <div class="col-box">
                <div class="title">通用功能</div>
                <div class="list-outer">
                    <div class="list-inner">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>群聊</div>
                    </div>
                    <div class="list-inner">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>资料库</div>
                    </div>
                    <div class="list-inner">
                        <el-icon :size="95">
                            <Edit/>
                        </el-icon>
                        <div>通知</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="announce-box round-border">
            <div class="bar-box">
                <span class="bar-title">未读通知</span>
                <el-button @click="readAllNotification">全部已读</el-button>
            </div>
            <div v-if="notificationList.length!==0" class="notification-box" v-for="noti in notificationList"
                 :key="notificationList.notId">
                <p>{{ noti.content }}</p>
                <!--                    <p>内容:{{ noti.notification }}</p>-->
            </div>
            <div v-else>
                当前还没有任何新的通知
            </div>
        </div>
    </div>
</template>

<script>

import anime from "animejs";
import {UserFilled} from "@element-plus/icons";
export default {
    computed: {
        UserFilled() {
            return UserFilled
        }
    },
  data() {
    return {
      userType: 'student',
      development: false,
      userInfo: {},
      notificationList: [
        {
          "notId": 1334869588,
          "publisher": 2,
          "content": "Tue May 16 20:27:00 CST 2023,新的学习任务:       test mission1...,截至时间是Thu Jun 01 00:00:00 CST 2023"
        },
        {
          "notId": 1334869588,
          "publisher": 2,
          "content": "Tue May 16 20:27:00 CST 2023,新的学习任务:       test mission1...,截至时间是Thu Jun 01 00:00:00 CST 2023"
        },
        {
          "notId": 1334869588,
          "publisher": 2,
          "content": "Tue May 16 20:27:00 CST 2023,新的学习任务:       test mission1...,截至时间是Thu Jun 01 00:00:00 CST 2023"
        }
      ]
    }
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/user/information")
          .then(resp => {
            //console.log(resp)
            this.userInfo = resp.data.data
          })
    },
    getNotificationList() {
      //TODO 这里获取一下所有未读通知放入this.notificationList,被注释的代码不用管
      // for (let i = 0; i < this.notificationList.length; i++) {
      //   let content = this.notificationList[i].content
      //   content = content.split(",")
      //   this.notificationList[i].releaseTime = content[0]
      //   this.notificationList[i].notification = content[1] + content[2]
      // }
    },
    readAllNotification() {
      //TODO 调用接口 将未读的通知设为已读
    }
  },
  mounted() {
    this.userType = localStorage.getItem("userType")
    this.getUserInfo()
    this.getNotificationList()
    anime({
      targets: '.list-inner',
        // duration:500,
      translateY: [30, 0],
    });
      anime({
          targets: '.notification-box',
          translateX: [30, 0],
      });
      anime({
          targets: '.info-item',
          translateX: [-30, 0],
      });
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
  background: white;

  .round-border {
    //border-radius: 10px;
    padding: $box-padding;
    height: calc(100% - ($box-padding) * 2);

  }

  $info-width: 25%;
  $not-width: 20%;

  .function-box {
    width: calc(100% - $info-width - $not-width);
    box-shadow: var(--el-box-shadow);

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

  .info-box {
    width: 25%;
    //height: calc(100% - ($box-margin + $box-padding) * 2);
    //background: rgb(204, 204, 204);
    margin-bottom: 20px;
      .info-top{
          border-bottom: 1px solid gray;
          width: fit-content;
          font-size: 27px;
          padding: 0 10px ;
      }
      .info-inner{
          .info-item{
              margin-left: 30px;
              margin-top: 10px;
              font-size: 24px;
          }
      }
  }

  .announce-box {
    width: 20%;
    overflow: auto;

    .bar-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
        .bar-title{
            border-bottom: 1px solid gray;
            width: fit-content;
            font-size: 27px;
            padding: 0 10px ;
        }
    }

    .notification-box {
      background: #f1f1f1;
      border-radius: 10px;
      padding: 10px;
      margin: 20px 5px;

      p {
        margin: 0;
      }
    }
  }

}
</style>