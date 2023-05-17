<template>
    <div class="main-box">
        <el-descriptions title="创建任务" border :column="2">
            <el-descriptions-item label="任务内容">
                <el-input></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="负责人">
                <el-select v-model="head">
                    <el-option v-for="(v,k,i) in memberList" :key="i" :label="k" :value="v">

                    </el-option>
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="发布时间">
                <el-date-picker
                        v-model="releaseTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
                <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
            </el-descriptions-item>
            <el-descriptions-item label="任务附件">
                <input type="file">
            </el-descriptions-item>
            <el-descriptions-item label="操作">
                <el-button>提交</el-button>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
export default {
  name: "TeacherWorkSingle",
  data() {
    return {
      releaseTime: undefined,
      endTime: undefined,
      head: undefined,
      TeamConfig: {
        "teamMemberMax": 5,
        "teamLeader": "小队长",
        "teamMember1": "质量经理",
        "teamMember2": "开发经理",
        "teamMember3": "产品经理",
        "teamMember4": "测试经理",
        "teamMember5": "无",
        "teamMember6": "无",
        "teamMember7": "无"
      },
      memberList: {//TODO 根据 获取队伍设置接口创建该对象
        "小组长": 0,
        "开发经理": 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  padding: 10px;
}
</style>