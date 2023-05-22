<template>
    <div class="main-box">
        <el-descriptions title="创建任务" border :column="2">
            <el-descriptions-item label="任务内容">
                <el-input v-model="workData.content"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="负责人">
                <el-select v-model="workData.publisher">
                    <el-option v-for="(v,k,i) in memberList" :key="i" :label="k" :value="v">
                    </el-option>
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="发布时间">
                <el-date-picker
                        v-model="workData.releaseTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="releaseNow"
                ></el-date-picker>
                <span style="margin-left: 10px">
                    立即发布:
                    <el-switch v-model="releaseNow"
                               inline-prompt
                               active-text="是"
                               inactive-text="否"
                    />
                </span>
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
                <el-date-picker
                        v-model="workData.endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
            </el-descriptions-item>
            <el-descriptions-item label="任务附件">
                <input type="file" @change="uploadFile">
            </el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button @click="submitWork" type="primary">提交</el-button>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import dayjs from "dayjs"
import {ElMessageBox} from "element-plus";

export default {
  name: "TeacherWorkSingle",
  data() {
    return {
      workData: {
        "content": undefined,
        endTime: undefined,
        "publisher": 0,
        releaseTime: undefined,
        "resourceRoute": "",
        "status": 0,
        "workId": 0
      },
      releaseNow: false,
      memberList: {
        "小组长": 0,
        "质量经理": 1,
        "开发经理": 2,
        "产品经理": 3,
        "测试经理": 4
      }
    }
  },
  methods: {
    uploadFile(e) {
      console.log("上传文件", e)
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file)
      this.$axios.post("/work/resource/" + "0", formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        this.workData.resourceRoute = res.data.data
      })
    },
    submitWork() {
      if (this.releaseNow) {
        this.workData.releaseTime = dayjs().startOf('m').format("YYYY-MM-DD HH:mm:ss")
      }
      for (let key in this.workData) {
        if (key === "resourceRoute")
          continue
        if (this.workData[key] === undefined || this.workData[key] === "") {
          ElMessageBox.alert(`有项目未填`, `提示`, {
            confirmButtonText: 'OK',
          })
          return
        }
      }
      this.$axios.post("/work/study/create", this.workData
      ).then(res => {
        if (res.data.status === 0) {
          ElMessageBox.alert(`创建成功`, `提示`, {
            confirmButtonText: 'OK',
          }).then(res => {
            this.$router.push("/")
          })
        }
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.main-box {
  padding: 10px;
}
</style>