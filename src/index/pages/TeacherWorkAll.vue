<template>
    <div class="main-box">
        <div class="work-box" v-show="!loading" v-for="work in workList" :key="work.workId">
            <el-descriptions title="任务" border>
                <el-descriptions-item label="内容">{{ work.content }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ work.releaseTime }}</el-descriptions-item>
                <el-descriptions-item label="截止时间">{{ work.endTime }}</el-descriptions-item>
                <el-descriptions-item label="任务文档"><a
                        :href="work.resourceRoute">{{ work.resourceRoute.split("/").pop() }}</a></el-descriptions-item>
                <el-descriptions-item label="状态">{{ status2description(work.status) }}</el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button @click="checkSubmit(work)" type="primary">查看提交情况</el-button>
                </el-descriptions-item>
            </el-descriptions>
            <div class="check-box" v-show="work.show===true">
                <template v-for="teamwork in work.teamWorks" :key="teamwork.teamWorkId">
                    <el-descriptions title="任务提交"
                                     v-if="teamwork.status===1&&(teamwork.comment&&teamwork.comment.status===0)" border>
                        <el-descriptions-item label="团队">{{ teamwork.belongTeam }}</el-descriptions-item>
                        <el-descriptions-item label="任务描述">{{ teamwork.workDescription }}</el-descriptions-item>
                        <el-descriptions-item label="提交成果"><a
                                :href="teamwork.productionRoute">{{ teamwork.productionRoute.split("/").pop() }}</a>
                        </el-descriptions-item>
                        <el-descriptions-item label="批注">
                            <el-input v-model="teamwork.description"></el-input>
                        </el-descriptions-item>
                        <el-descriptions-item label="成绩">
                            <el-input v-model="teamwork.score" type="number"></el-input>
                        </el-descriptions-item>
                        <el-descriptions-item label="操作">
                            <el-button @click="submitScore(teamwork)" type="primary">提交</el-button>
                            <el-button @click="closeChecking" type="primary">关闭</el-button>
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="任务提交" v-else-if="teamwork.status!==1" border>
                        <el-descriptions-item label="团队">{{ teamwork.belongTeam }}</el-descriptions-item>
                        <el-descriptions-item label="提交情况">该团队未提交结果</el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions title="批阅结果" v-else-if="teamwork.comment&&teamwork.comment.status!==0" border>
                        <el-descriptions-item label="批注">{{ teamwork.comment.description }}</el-descriptions-item>
                        <el-descriptions-item label="分数">{{ teamwork.comment.score }}</el-descriptions-item>
                    </el-descriptions>
                </template>
            </div>
        </div>
        <el-skeleton v-show="loading"></el-skeleton>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";
import {status2description} from "../utils.js";
import anime from "animejs";

export default {
  name: "管理学习任务",
  data() {
    return {
      loading: true,
      workList: [
        {
          "workId": 1067298516,
          "publisher": 0,//负责人
          "content": "test mission2",
          "releaseTime": "2023-05-17 13:57:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "",
          "status": 1,
          "teamWorks": [
            {
              "teamWorkId": 1067299092,
              "workDescription": "123",
              "productionRoute": "321/213",
              "belongTeam": 1,
              "belongWork": 1067298516,
              "status": 1
            }]
        },
        {
          "workId": 1334868820,
          "publisher": 0,
          "content": "test mission1",
          "releaseTime": "2023-05-16 20:27:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "",
          "status": 1,
          "teamWorks": [
            {
              "teamWorkId": 1067299092,
              "workDescription": null,
              "productionRoute": null,
              "belongTeam": 1,
              "belongWork": 1067298516,
              "status": 0
            }]
        }
      ],
      operatingWork: undefined
    }
  },
  methods: {
    status2description,
    checkSubmit(work) {
      if (this.operatingWork === work) {
        this.closeChecking()
        return;
      }
      if (this.checking) {
        ElMessageBox.alert(`你正在批阅其他团队的任务`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.operatingWork = work
      work.show = true
      anime({
        targets: '.check-box',
        translateY: [-30, 0],
      })
    },
    closeChecking() {
      if (this.operatingWork !== undefined) {
        this.operatingWork.show = false
        this.operatingWork = undefined
      }
    },
    submitScore(teamwork) {
      if (teamwork.description === undefined || teamwork.score === undefined) {
        ElMessageBox.alert(`有项目未填`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/comment/2", {
        "belongTeamWork": teamwork.teamWorkId,
        "description": teamwork.description,
        "score": teamwork.score,
        "status": 1
      }).then(res => {
        this.closeChecking()
        if (res.data.status === 0) {
          ElMessageBox.alert(`提交成功`, `提示`, {
            confirmButtonText: 'OK',
          })
        }
      })
    },
    loadAllWorks() {
      this.$axios.get("/work/study/all")
          .then(res => {
            let workList = res.data.data
            workList.sort(function (a, b) {
              var dateA = new Date(a.releaseTime);
              var dateB = new Date(b.releaseTime);
              return dateB - dateA;
            });
            this.workList = workList
            for (let work of workList) {
              this.$axios.get("/work/study/concrete/" + work.workId)
                  .then(res => {
                    let teamWorks = res.data.data.teamWorks
                    for (let w of teamWorks) {
                      if (w.status === 1) {
                        this.$axios.get("/work/comment/" + w.teamWorkId)
                            .then(res => {
                              w.comment = res.data.data
                            })
                      }
                    }
                    work.teamWorks = teamWorks
                    this.loading = false
                  })
              // this.$axios.get("/work/comment/{teamworkID}")
            }

          })
    }
  },
  mounted() {
    this.loadAllWorks()

  }
}
</script>

<style lang="scss" scoped>
.main-box {
  background: white;
  min-height: calc(100% - 10px * 2);
  height: fit-content;
  padding: 10px;

  .work-box {
    box-shadow: 0 5px 10px -5px #D9D9D9;
    padding: 20px 10px;

    .check-box {
      margin: 10px 0;
    }
  }
}

</style>