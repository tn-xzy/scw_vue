# How to use

* 安装nodejs (推荐LTS的16.*版本)
* clone项目
* npm -i (可能需要换源)
* 将vite.config.js最下面的target中的地址改为实际的后端
* npm run dev
* 当前已完成功能：教师发布任务->负责人和组员查看任务->负责人创建个人任务->组员查看和提交个人任务->负责人提交团队任务->教师批阅团队任务->负责人查看成绩和批注
* 待完成功能（最终不一定会实现）：公告查看和全部已读

# 开发注意
* 请使用this.$axios代替axios
* 所有api不需要加域名和端口，<del>取而代之的是你需要在原接口前加/api</del>，现在不需要了，直接使用即可
* 所有axios请求不需要处理错误和响应数据的status!=0的情况，它们会之间弹出提示，所以如果按钮点了没反应只可能是没加响应提示或没写请求