<template>
    <div class="work-box" v-for="work in workList" :key="work.workId">
        <el-descriptions title="任务" border>
            <el-descriptions-item label="内容">{{ work.content }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ work.releaseTime }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ work.endTime }}</el-descriptions-item>
            <el-descriptions-item label="任务文档"><a :href="work.resourceRoute">下载</a></el-descriptions-item>
            <el-descriptions-item label="状态">{{ work.status }}</el-descriptions-item>
            <el-descriptions-item label="操作" v-if="work.teamWorkId!==undefined">
                <el-button @click="createPersonWork(work)">创建个人任务</el-button>
                <el-button>查看完成情况</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="创建个人任务" border v-show="work.showCreate===true">
            <el-descriptions-item label="任务所属成员">
                <el-select v-model="belongMember">
                    <el-option v-for="(v,k,i) in memberList" :key="k" :label="k" :value="v">

                    </el-option>
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="任务描述">
                <el-input v-model="workDescription"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button @click="submitPersonWork(work)">发布</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="查看完成情况" border v-show="work.showCompleteness===true">

        </el-descriptions>
    </div>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
  name: "查看负责的团队任务",
  methods: {
    createPersonWork(work) {
      if (this.teamWorkId !== undefined) {
        ElMessageBox.alert(`你正在创建其他团队任务的个人任务`, `提示`, {
          confirmButtonText: 'OK',
        })
        return
      }
      work.showCreate = true
      this.teamWorkId = work.teamWorkId
    },
    submitPersonWork(work) {
      //在这里请求提交
      work.showCreate = false
      this.teamWorkId = undefined
    },
    loadAllWorks() {

    }
  },
  data() {
    return {
      teamWorkId: undefined,
      belongMember: undefined,
      workDescription: "",
      workList: [
        {
          teamWorkId: 1,
          "workId": 1334868820,
          "publisher": 0,
          "content": "test mission1",
          "releaseTime": "2023-05-16 20:27:00",
          "endTime": "2023-06-01 00:00:00",
          "resourceRoute": "http://127.0.0.1:8081/static/study_work/resource/2035060729 谢卓越 实验二(1).docx",
          "status": 1,
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
        "小组长": 0,
        "开发经理": 2
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.work-box {
  height: fit-content;
  background: #dedede;
  padding: 10px;
}
</style>