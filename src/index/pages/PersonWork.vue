<template>
    <div class="main-box" v-if="workList.length!==0">
        <div class="work-box" v-for="work in workList" :key="work.singleWorkId" v-show="!loading&&work.status===0">
            <el-descriptions title="任务" border>
                <el-descriptions-item label="任务描述">{{ work.workDescription }}</el-descriptions-item>
                <el-descriptions-item label="从属任务">{{ work.studyWork.content }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ work.studyWork.releaseTime }}</el-descriptions-item>
                <el-descriptions-item label="截止时间">{{ work.studyWork.endTime }}</el-descriptions-item>
                <el-descriptions-item label="任务文档"><a
                        :href="work.studyWork.resourceRoute">{{ work.studyWork.resourceRoute.split("/").pop() }}</a>
                </el-descriptions-item>
                <el-descriptions-item label="任务成果">
                    <a :href="work.productionRoute" v-if="work.productionRoute!==''">
                        {{ work.productionRoute.split("/").pop() }}
                    </a>
                    <span v-else>尚无提交文件</span>
                </el-descriptions-item>
                <el-descriptions-item label="更新提交文件">
                    <input type="file" style="margin-left: 20px" @change="uploadFile($event,work)"/>
                </el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button @click="saveWork(work)" type="primary">保存</el-button>
                    <el-button @click="submitWork(work)" type="primary">提交</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <el-skeleton v-show="loading"></el-skeleton>
    </div>
    <div v-else style="display: flex;justify-content: center"><p>这里空空如也</p></div>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
  name: "负责的个人任务",
  data() {
    return {
      loading: true,
      workList: [
        {
          "singleWorkId": 686804884,
          "workDescription": "persona work 2",
          "belongStudent": 1,
          "belongWork": 498543124,
          "productionRoute": "",
          "status": 0,
          "studyWork": {
            "workId": 498542164,
            "publisher": 0,
            "content": "test mission axios 3",
            "releaseTime": "2023-05-17 20:48:10",
            "endTime": "2023-05-31 00:00:00",
            "resourceRoute": "",
            "status": 1
          },
          "teamWork": {
            "teamWorkId": 498543124,
            "workDescription": null,
            "productionRoute": null,
            "belongTeam": 1,
            "belongWork": 498542164,
            "status": 0
          }
        },
        {
          "singleWorkId": 686804884,
          "workDescription": "persona work 2",
          "belongStudent": 1,
          "belongWork": 498543124,
          "productionRoute": "",
          "status": 0,
          "studyWork": {
            "workId": 498542164,
            "publisher": 0,
            "content": "test mission axios 3",
            "releaseTime": "2023-05-17 20:48:10",
            "endTime": "2023-05-31 00:00:00",
            "resourceRoute": "http://127.0.0.1:8081/static/single_work",
            "status": 1
          },
          "teamWork": {
            "teamWorkId": 498543124,
            "workDescription": null,
            "productionRoute": null,
            "belongTeam": 1,
            "belongWork": 498542164,
            "status": 0
          }
        },
        {
          "singleWorkId": 686804884,
          "workDescription": "persona work 2",
          "belongStudent": 1,
          "belongWork": 498543124,
          "productionRoute": "",
          "status": 0,
          "studyWork": {
            "workId": 498542164,
            "publisher": 0,
            "content": "test mission axios 3",
            "releaseTime": "2023-05-17 20:48:10",
            "endTime": "2023-05-31 00:00:00",
            "resourceRoute": "http://127.0.0.1:8081/static/single_work/produc",
            "status": 1
          },
          "teamWork": {
            "teamWorkId": 498543124,
            "workDescription": null,
            "productionRoute": null,
            "belongTeam": 1,
            "belongWork": 498542164,
            "status": 0
          }
        },
        {
          "singleWorkId": 686804884,
          "workDescription": "persona work 2",
          "belongStudent": 1,
          "belongWork": 498543124,
          "productionRoute": "",
          "status": 0,
          "studyWork": {
            "workId": 498542164,
            "publisher": 0,
            "content": "test mission axios 3",
            "releaseTime": "2023-05-17 20:48:10",
            "endTime": "2023-05-31 00:00:00",
            "resourceRoute": "http://127.0.0.1:8081/static/single_wor",
            "status": 1
          },
          "teamWork": {
            "teamWorkId": 498543124,
            "workDescription": null,
            "productionRoute": null,
            "belongTeam": 1,
            "belongWork": 498542164,
            "status": 0
          }
        },
      ]
    }

  },
  methods: {
    uploadFile(e, work) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file)
      formData.append("type", 4)
      this.$axios.post("//work/resource/" + "4", formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        work.productionRoute = res.data.data
      })
    },
    loadAllPersonWorks() {
      this.$axios.get("/work/single/response")
          .then(res => {
            this.workList = res.data.data
              this.loading=false
          })
    },
    saveWork(work) {
      if (work.productionRoute === "") {
        ElMessageBox.alert(`未上传成果`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/single/modify/2", {
        "belongStudent": work.belongStudent,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "singleWorkId": work.singleWorkId,
        "status": 0,
        "workDescription": work.workDescription
      }).then(res => {
        if (res.data.status === 0) {
          this.loadAllPersonWorks()
          ElMessageBox.alert(`成功`, `提示`, {
            confirmButtonText: 'OK',
          })
        }
      })
    },
    submitWork(work) {
      if (work.productionRoute === "") {
        ElMessageBox.alert(`未上传成果`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      this.$axios.post("/work/single/modify/3", {
        "belongStudent": work.belongStudent,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "singleWorkId": work.singleWorkId,
        "status": 1,
        "workDescription": work.workDescription
      }).then(res => {
        if (res.data.status === 0) {
          this.loadAllPersonWorks()
          ElMessageBox.alert(`成功`, `提示`, {
            confirmButtonText: 'OK',
          })
        }
      })
    },
  },
  mounted() {
    this.loadAllPersonWorks()
  }
}
</script>

<style scoped>
.main-box {
    padding: 10px;
    background: white;
    min-height: calc(100% - 10px * 2);
    height: fit-content;

    .work-box {
        height: fit-content;
        padding: 20px 10px;
        box-shadow: 0 5px 10px -5px #D9D9D9;

    }
}

</style>