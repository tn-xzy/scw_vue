<template>
    <div class="work-box" v-for="work in workList" :key="work.workId">
        <el-descriptions title="任务" border>
            <el-descriptions-item label="内容">{{ work.content }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ work.releaseTime }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ work.endTime }}</el-descriptions-item>
            <el-descriptions-item label="任务文档"><a :href="work.resourceRoute">下载</a></el-descriptions-item>
            <el-descriptions-item label="状态">{{ work.status }}</el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button @click="checkSubmit(work)">查看提交情况</el-button>
                <el-button>修改任务</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <div v-show="work.show===true">
            <el-descriptions title="任务提交" v-for="work in teamWorks" :key="work.teamWorkId" v-if="work.status===1"
                             border>
                <el-descriptions-item label="团队">{{ work.belongTeam }}</el-descriptions-item>
                <el-descriptions-item label="任务描述">{{ work.workDescription }}</el-descriptions-item>
                <el-descriptions-item label="提交成果">{{ work.productionRoute }}</el-descriptions-item>
                <el-descriptions-item label="批注">{{ work.productionRoute }}</el-descriptions-item>
                <el-descriptions-item label="成绩">{{ work.productionRoute }}</el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button>提交</el-button>
                    <el-button @click="closeChecking">关闭</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
  name: "管理学习任务",
  data() {
    return {
        checking:false,
      workList: [
        {
          "workId": 1067298516,
          "publisher": 0,//负责人
          "content": "test mission2",
          "releaseTime": "2023-05-17 13:57:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
          "status": 1,
        },
        {
          "workId": 1334868820,
          "publisher": 0,
          "content": "test mission1",
          "releaseTime": "2023-05-16 20:27:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
          "status": 1
        }
      ],
      "teamWorks": [
        {
          "teamWorkId": 1067299092,
          "workDescription": null,
          "productionRoute": null,
          "belongTeam": 1,
          "belongWork": 1067298516,
          "status": 1
        }
      ]
    }
  },
    methods:{
      checkSubmit(work){
          if (this.checking){
              ElMessageBox.alert(`你正在批阅其他团队的任务`, `提示`, {
                  confirmButtonText: 'OK',
              })
              return
          }
          this.checking=true
          work.show=true
      },
      closeChecking(){
          this.checking=false
          this.workList.forEach(work=>{
              work.show=false
          })
      }
    }
}
</script>

<style lang="scss" scoped>
.work-box {
  padding: 10px;
}
</style>