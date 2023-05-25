<template>
    <div class="top-box">
        <header>
            <div class="button" @click="$router.push('/')">首页</div>
            <div class="button" @click="logout">注销</div>
        </header>
        <div class="topmain-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      localStorage.removeItem("token")
      window.location.href = '/login.html'
    }
  },
  mounted() {
    this.$router.push("/")
  }
}
</script>

<style lang="scss" scoped>
.top-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #409eff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    /*height:;*/
    .button {
      width: fit-content;
      padding: 10px;
      color: white;
    }

    :hover {
      background: #2179d3;

    }
  }

  .topmain-box {
    height: calc(100% - 40px - 20px);
    overflow: auto;
    margin: 20px;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
}
</style>