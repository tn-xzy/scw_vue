# How to use

* 安装nodejs (推荐LTS的16.*版本)
* clone项目
* npm -i (可能需要换源)
* 将vite.config.js最下面的target中的地址改为实际的后端
* npm run dev

# 开发注意
* 请使用this.$axios代替axios
* 所有api不需要加域名和端口，取而代之的是你需要在原接口前加/api
* 所有axios请求不需要处理错误和响应数据的status!=0的情况