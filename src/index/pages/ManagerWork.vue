<template>
    <div class="work-box" v-for="work in workList" :key="work.workId">
        <el-descriptions title="任务" border>
            <el-descriptions-item label="内容">{{ work.content }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ work.releaseTime }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ work.endTime }}</el-descriptions-item>
            <el-descriptions-item label="任务文档"><a :href="work.resourceRoute">{{
                work.resourceRoute.split("/").pop()
                }}</a></el-descriptions-item>
            <el-descriptions-item label="状态">{{ status2description(work.status) }}</el-descriptions-item>
            <el-descriptions-item label="操作" v-if="work.teamWorkId!==undefined">
                <el-button @click="createPersonWork(work)">创建个人任务</el-button>
                <el-button @click="checkCompleteness(work)">查看完成情况</el-button>
                <el-button @click="submitTeamWork(work)">提交团队任务</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="创建个人任务" border v-show="work.showCreate===true">
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
                <el-button @click="submitPersonWork(work)">发布</el-button>
                <el-button @click="closeChecking">关闭</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="查看完成情况" border v-show="work.showCompleteness===true" :column="4">
            <template v-for="singleWork in work.singleWorks" :key="singleWork.singleWorkId"
                      v-show="singleWork.status!==0">
                <el-descriptions-item label="任务描述">{{ singleWork.workDescription }}</el-descriptions-item>
                <el-descriptions-item label="任务人">{{ singleWork.belongStudent }}</el-descriptions-item>
                <el-descriptions-item label="提交情况">{{ singleWork.status }}</el-descriptions-item>
                <el-descriptions-item label="提交成果"><a
                        :href="singleWork.productionRoute">{{ singleWork.productionRoute.split("/").pop() }}</a>
                </el-descriptions-item>
            </template>
        </el-descriptions>
        <el-descriptions title="提交团队任务" border v-show="work.showFinalSubmit===true">
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
                <el-button @click="teamWorkSave(work)">更新</el-button>
                <el-button @click="teamWorkSubmit(work)">提交</el-button>
                <el-button @click="closeChecking">关闭</el-button>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";
import {status2description} from '../utils.js'

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
    },
    submitPersonWork(work) {
      this.$axios.post("/api/work/single/create",
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
      work.showCompleteness = !work.showCompleteness
    },
    loadAllWorks() {
      this.$axios.get("/api/work/study/all")
          .then(res => {
            let workList = res.data.data
            let workMap = new Map()
            for (let work of workList)
              workMap.set(work.workId, work)
            this.$axios.get("/api/work/team/response")
                .then(res => {
                  let responsibleWorkList = res.data.data
                  console.log(workMap)
                  for (let work of responsibleWorkList) {
                    console.log(work)
                    if (workMap.has(work.belongWork)) {
                      workMap.get(work.belongWork).teamWorkId = work.teamWorkId
                      workMap.get(work.belongWork).singleWorks = work.singleWorks
                      workMap.get(work.belongWork).workDescription = work.workDescription
                      workMap.get(work.belongWork).productionRoute = work.productionRoute
                      workMap.get(work.belongWork).belongWork = work.belongWork
                      workMap.get(work.belongWork).belongTeam = work.belongTeam
                    }
                  }
                  this.workList = workList
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
      this.$axios.post("/api/work/resource/" + "3", formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        console.log("upload", res)
        work.productionRoute = res.data.data
      })
    },
    teamWorkSave(work) {
      console.log(work)
      this.$axios.post("/api/work/team/modify/1", {
        "belongTeam": work.belongTeam,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "status": 0,
        "teamWorkId": work.teamWorkId,
        "workDescription": work.workDescription
      }).then(res => {
        console.log(res)
        //TODO 用ElElMessageBox提示一下成功
      })
    },
    teamWorkSubmit(work) {
      this.$axios.post("/api/work/team/modify/2", {
        "belongTeam": work.belongTeam,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "status": 1,
        "teamWorkId": work.teamWorkId,
        "workDescription": work.workDescription
      }).then(res => {
        console.log(res)
        //TODO 用ElElMessageBox提示一下成功
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
    }
  },
  data() {
    return {
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
          "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
          "status": 1,
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
              "productionRoute": "http://127.0.0.1:8081/static/single_work/production/实验报告-模板-信息安全 - 副本.docx0",
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
          "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
          "status": 1,
          show: undefined
        }
      ],
      memberList: {
        "小组长": 1,
        "开发经理": 3
      },
      singleWorks: [
        {
          "singleWorkId": 1390130516,
          "workDescription": "eee",
          "belongStudent": 0,
          "belongWork": 1334870868,
          "productionRoute": "",
          "status": 0
        },
        {
          "singleWorkId": 1402732052,
          "workDescription": "eee1",
          "belongStudent": 1,
          "belongWork": 1334870868,
          "productionRoute": "http://127.0.0.1:8081/static/single_work/production/2035060729 谢卓越 实验一.docx",
          "status": 1
        }
      ]
    }
  },
  mounted() {
    this.loadAllWorks()
  }

}
</script>

<style lang="scss" scoped>
.work-box {
  height: fit-content;
  background: #dedede;
  padding: 10px;
}
</style>