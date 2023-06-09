<template>
    <div class="main-box">
        <el-skeleton v-show="loading" :rows="5"></el-skeleton>
        <div class="work-box" v-show="!loading" v-for="work in workList" :key="work.workId">
            <el-descriptions class="item-mis" border>
                <el-descriptions-item label="内容">{{ work.content }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ work.releaseTime }}</el-descriptions-item>
                <el-descriptions-item label="截止时间">{{ work.endTime }}</el-descriptions-item>
                <el-descriptions-item label="任务文档"><a :href="work.resourceRoute">{{
                    work.resourceRoute.split("/").pop()
                    }}</a></el-descriptions-item>
                <el-descriptions-item label="状态">{{ status2description(work.status) }}</el-descriptions-item>
                <el-descriptions-item label="操作" v-if="work.teamWorkId!==undefined && work.submitStatus!==1">
                    <el-button @click="createPersonWork(work)" type="primary">创建个人任务</el-button>
                    <el-button @click="checkCompleteness(work)" type="primary">查看完成情况</el-button>
                    <el-button @click="submitTeamWork(work)" type="primary">提交团队任务</el-button>
                </el-descriptions-item>
                <template v-if="work.submitStatus===1&&work.comment!==null">
                    <el-descriptions-item label="成绩">
                        {{ work.comment.score }}
                    </el-descriptions-item>
                    <el-descriptions-item label="批注">
                        {{ work.comment.description }}
                    </el-descriptions-item>
                </template>
                <el-descriptions-item v-if="work.submitStatus===1&&work.comment==null" label="批阅情况">未批阅
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions class="item-box item-person" title="创建个人任务" border v-show="work.showCreate===true">
                <el-descriptions-item label="任务所属成员">
                    <el-select v-model="personWork.belongStudent">
                        <el-option v-for="(v,k,i) in memberList" :key="k" :label="k" :value="v">
                        </el-option>
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="任务描述">
                    <el-input v-model="personWork.workDescription"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button @click="submitPersonWork(work)" type="primary">发布</el-button>
                    <el-button @click="closeChecking" type="primary">关闭</el-button>
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions class="item-box item-com" title="查看完成情况" border v-show="work.showCompleteness===true"
                             :column="4">
                <template v-for="singleWork in work.singleWorks" :key="singleWork.singleWorkId"
                          v-if="work.singleWorks!==undefined&&work.singleWorks.length!==0">
                    <el-descriptions-item label="任务描述">{{ singleWork.workDescription }}</el-descriptions-item>
                    <el-descriptions-item label="任务人">{{ id2work(singleWork.belongStudent) }}</el-descriptions-item>
                    <el-descriptions-item label="提交情况">{{
                        status2description(singleWork.status)
                        }}
                    </el-descriptions-item>
                    <el-descriptions-item label="提交成果"><a
                            :href="singleWork.productionRoute">{{ singleWork.productionRoute.split("/").pop() }}</a>
                    </el-descriptions-item>
                </template>
                <el-descriptions-item label="提交情况" v-else>当前任务下未布置个人任务</el-descriptions-item>
            </el-descriptions>
            <el-descriptions class="item-box item-con" title="提交团队任务" border v-show="work.showFinalSubmit===true">
                <el-descriptions-item label="任务描述">
                    <el-input v-model="work.workDescription"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="当前结果">
                    <a :href="work.productionRoute"
                       v-if="work.productionRoute">{{ work.productionRoute.split("/").pop() }}</a>
                    <span v-else>当前无成果</span>
                </el-descriptions-item>
                <el-descriptions-item label="更新文件">
                    <input type="file" @change="uploadFile($event,work)">
                </el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button @click="teamWorkSave(work)" type="primary">保存</el-button>
                    <el-button @click="teamWorkSubmit(work)" type="primary">提交</el-button>
                    <el-button @click="closeChecking" type="primary">关闭</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";
import {status2description} from '../utils.js'
import anime from "animejs";

export default {
  name: "查看负责的团队任务",
  methods: {
    status2description,
    createPersonWork(work) {
      if (this.operatingWork === work) {
        this.closeChecking()
        return
      }
      if (this.operatingWork !== undefined) {
        ElMessageBox.alert(`你正在进行其他操作`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      work.showCreate = true
      this.personWork.belongWork = work.teamWorkId
      this.operatingWork = work
      anime({
        targets: '.item-person',
        translateY: [-30, 0],
      })
    },
    submitPersonWork(work) {
      if (this.personWork.belongStudent === undefined || this.personWork.belongWork === undefined) {
        ElMessageBox.alert(`有项目未填`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/single/create",
          this.personWork)
          .then(res => {
            if (res.data.status === 0) {
              ElMessageBox.alert(`创建成功`, `提示`, {
                confirmButtonText: 'OK',
              })
            }
          })
      this.closeChecking()
    },
    checkCompleteness(work) {
      if (work.showCompleteness === true) {
        work.showCompleteness = false
        this.reloadWork(work)
      } else {
        work.showCompleteness = true
        anime({
          targets: '.item-com',
          translateY: [-30, 0],
        })
      }

    },
    reloadWork(work) {
      this.$axios.get("/work/team/response")
          .then(res => {
            let responsibleWorkList = res.data.data
            for (let responsibleWork of responsibleWorkList) {
              if (work.workId === responsibleWork.belongWork) {
                work.singleWorks = responsibleWork.singleWorks
              }
            }
          })
    },
    loadAllWorks() {
      this.$axios.get("/work/study/all")
          .then(res => {
            let workList = res.data.data
            workList.sort(function (a, b) {
              let dateA = new Date(a.releaseTime);
              let dateB = new Date(b.releaseTime);
              return dateB - dateA;
            });
            let workMap = new Map()
            for (let work of workList)
              workMap.set(work.workId, work)
            this.$axios.get("/work/team/response")
                .then(res => {
                  let responsibleWorkList = res.data.data
                  for (let work of responsibleWorkList) {
                    if (workMap.has(work.belongWork)) {
                      workMap.get(work.belongWork).teamWorkId = work.teamWorkId
                      workMap.get(work.belongWork).singleWorks = work.singleWorks
                      workMap.get(work.belongWork).workDescription = work.workDescription
                      workMap.get(work.belongWork).productionRoute = work.productionRoute
                      workMap.get(work.belongWork).belongWork = work.belongWork
                      workMap.get(work.belongWork).belongTeam = work.belongTeam
                      workMap.get(work.belongWork).submitStatus = work.status
                      workMap.get(work.belongWork).comment = work.comment
                    }
                  }
                  this.workList = workList
                  this.loading = false
                })
          })
    },
    closeChecking() {
      this.operatingWork.showCreate = false
      this.operatingWork.showCompleteness = false
      this.operatingWork.showFinalSubmit = false
      this.operatingWork = undefined
      this.personWork = {
        "belongStudent": undefined,
        "belongWork": undefined,
        "productionRoute": "",
        "singleWorkId": 0,
        "status": 0,
        "workDescription": ""
      }
      this.teamWork = {
        "belongTeam": 0,
        "belongWork": 0,
        "productionRoute": "",
        "status": 0,
        "teamWorkId": 0,
        "workDescription": ""
      }
    },
    uploadFile(e, work) {
      console.log("upload", e)
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file)
      this.$axios.post("/work/resource/" + "3", formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        // console.log("upload", res)
        work.productionRoute = res.data.data
      })
    },
    teamWorkSave(work) {
      console.log(work)
      if (work.productionRoute === null || work.workDescription === null) {
        ElMessageBox.alert(`有项目未填`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/team/modify/1", {
        "belongTeam": work.belongTeam,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "status": 0,
        "teamWorkId": work.teamWorkId,
        "workDescription": work.workDescription
      }).then(res => {
        // console.log(res)
        ElMessageBox.alert(`成功`, `提示`, {
          confirmButtonText: 'OK',
        })
      })
    },
    teamWorkSubmit(work) {
      if (work.productionRoute === null || work.workDescription === null) {
        ElMessageBox.alert(`有项目未填`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/team/modify/2", {
        "belongTeam": work.belongTeam,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "status": 1,
        "teamWorkId": work.teamWorkId,
        "workDescription": work.workDescription
      }).then(res => {
        //console.log(res)
        this.loadAllWorks()
        this.closeChecking()
        ElMessageBox.alert(`成功`, `提示`, {
          confirmButtonText: 'OK',
        })
      })
    },
    submitTeamWork(work) {
      if (this.operatingWork === work) {
        this.closeChecking()
        return
      }
      if (this.operatingWork !== undefined) {
        ElMessageBox.alert(`你正在进行其他操作`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      work.showFinalSubmit = true
      this.operatingWork = work
      this.teamWork.belongTeam = work.belongTeam
      this.teamWork.belongWork = work.belongWork
      this.teamWork.productionRoute = work.productionRoute
      this.teamWork.teamWorkId = work.teamWorkId
      this.teamWork.workDescription = work.workDescription
      anime({
        targets: '.item-con',
        translateY: [-30, 0],
      })
    },
    id2work(id) {
      var keys = Object.keys(this.memberList); // ["a", "b", "c"]
      for (var i = 0; i < keys.length; i++) {
        if (this.memberList[keys[i]] === id) return keys[i]
      }
      return "小组长"
    },
    loadTeamMember() {
      //TODO 根据 获取队伍设置接口和获取所在团队信息接口创建this.memberList
    }

  },
  data() {
    return {
      loading: true,
      teamWork: {
        "belongTeam": 0,
        "belongWork": 0,
        "productionRoute": "",
        "status": 0,
        "teamWorkId": 0,
        "workDescription": ""
      },
      personWork: {
        "belongStudent": undefined,
        "belongWork": undefined,
        "productionRoute": "",
        "singleWorkId": 0,
        "status": 0,
        "workDescription": ""
      },
      operatingWork: undefined,
      workList: [
        {
          teamWorkId: 1,
          "workId": 1334868820,
          "publisher": 0,
          "workDescription": null,
          "productionRoute": null,
          "content": "test mission1",
          "releaseTime": "2023-05-16 20:27:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "",
          "status": 0,
          "singleWorks": [
            {
              "singleWorkId": 675604500,
              "workDescription": "test persona work 1",
              "belongStudent": 0,
              "belongWork": 498543124,
              "productionRoute": "",
              "status": 0
            },
            {
              "singleWorkId": 686804884,
              "workDescription": "persona work 2",
              "belongStudent": 1,
              "belongWork": 498543124,
              "productionRoute": "",
              "status": 1
            },
            {
              "singleWorkId": 691023380,
              "workDescription": "persona work 3",
              "belongStudent": 1,
              "belongWork": 498543124,
              "productionRoute": "",
              "status": 0
            }
          ],
          showCreate: undefined,
          showCompleteness: undefined
        },
        {
          teamWorkId: 2,
          "workId": 1334868821,
          "publisher": 0,
          "content": "test mission1",
          "releaseTime": "2023-05-16 20:27:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "",
          "status": 1,
          show: undefined
        }
      ],
      memberList: {
        "小组长": 1,
        "质量经理": 3,
        "开发经理": 4,
        "产品经理": 5,
        "测试经理": 6
      },
      singleWorks: [
        {
          "singleWorkId": 1390130516,
          "workDescription": "eee",
          "belongStudent": 0,
          "belongWork": 1334870868,
          "productionRoute": "",
          "status": 0
        }
      ]
    }
  },
  mounted() {
    this.loadAllWorks()
    this.loadTeamMember()
  }

}
</script>

<style lang="scss" scoped>
.main-box {
  padding: 10px;
  background: white;
  min-height: calc(100% - 10px * 2);
  height: fit-content;

  .work-box {
    height: fit-content;
    //background: #dedede;
    box-shadow: 0 5px 10px -5px #D9D9D9;
    padding: 20px 10px;

    .item-box {
      margin: 10px 0;
    }
  }
}

</style>