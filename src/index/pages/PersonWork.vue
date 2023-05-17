<template>
    <div class="work-box" v-for="work in workList" :key="work.singleWorkId" v-show="work.status===0">
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
                <el-button @click="saveWork(work)">保存</el-button>
                <el-button @click="submitWork(work)">提交</el-button>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
  name: "负责的个人任务",
  data() {
    return {
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
            "resourceRoute": "http://127.0.0.1:8081/static/single_work/production/2035060729 谢卓越 实验二.docx",
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
    uploadFile(e,work) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file)
      formData.append("type", 4)
      this.$axios.post("/api//work/resource/" + "4", formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        work.productionRoute=res.data.data
      })
    },
    loadAllPersonWorks() {
      this.$axios.get("/api/work/single/response")
          .then(res => {
            this.workList = res.data.data
          })
    },
    saveWork(work) {
      this.$axios.post("/api/work/single/modify/2", {
        "belongStudent": work.belongStudent,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "singleWorkId": work.singleWorkId,
        "status": 0,
        "workDescription": work.workDescription
      }).then(res=>{
        if (res.data.status===0){
          this.loadAllPersonWorks()
          ElMessageBox.alert(`创建成功`, `提示`, {
            confirmButtonText: 'OK',
          })
        }
      })
    },
    submitWork(work) {
      this.$axios.post("/api/work/single/modify/3", {
        "belongStudent": work.belongStudent,
        "belongWork": work.belongWork,
        "productionRoute": work.productionRoute,
        "singleWorkId": work.singleWorkId,
        "status": 1,
        "workDescription": work.workDescription
      })
    },
  },
  mounted() {
    this.loadAllPersonWorks()
  }
}
</script>

<style scoped>
.work-box {
    height: fit-content;
    background: #dedede;
    padding: 10px;
}
</style>