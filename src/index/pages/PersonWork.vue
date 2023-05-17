<template>
    <div class="work-box" v-for="work in workList" :key="work.singleWorkId">
        <el-descriptions title="任务" border>
            <el-descriptions-item label="任务描述">{{ work.workDescription }}</el-descriptions-item>
            <el-descriptions-item label="从属任务">{{ work.studyWork.content }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ work.studyWork.releaseTime }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ work.studyWork.endTime }}</el-descriptions-item>
            <el-descriptions-item label="任务文档"><a :href="work.studyWork.resourceRoute">下载</a>
            </el-descriptions-item>
            <el-descriptions-item label="任务成果">
                <a :href="work.productionRoute">下载</a>
                <input type="file" style="margin-left: 20px" @change="uploadFile"/>
            </el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button>提交</el-button>
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
          "singleWorkId": 1402732052,
          "workDescription": "eee",
          "belongStudent": 1,
          "belongWork": 1334870868,
          "productionRoute": "eee",
          "status": 0,
          "studyWork": {
            "workId": 1334868820,
            "publisher": 0,
            "content": "test mission1",
            "releaseTime": "2023-05-16 20:27:00",
            "endTime": "2023-06-01 00:00:00",
            "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
            "status": 1
          },
          "teamWork": {
            "teamWorkId": 1334870868,
            "workDescription": null,
            "productionRoute": null,
            "belongTeam": 1,
            "belongWork": 1334868820,
            "status": 0
          }
        }
      ]
    }

  },
  methods: {
    uploadFile(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file",file)
      formData.append("type",4)
      this.$axios.post("/api//work/resource/"+"4",formData,{
        'Content-type' : 'multipart/form-data'
      }).then(res=>{
        console.log(res)
      })
    }
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