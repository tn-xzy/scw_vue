<template>
    <div class="top-box">
        <header>
            <div class="button" @click="$router.push('/')">首页</div>
            <div class="button" @click="logout">注销</div>
        </header>
        <div class="main-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data(){
      return {
      }
    },
    methods:{
      logout(){
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
.top-box{
    height: 100%;
    display: flex;
    flex-direction: column;
    header{
        display: flex;
        justify-content: space-between;
        background: rgb(84, 92, 100);
        /*height:;*/
        .button{
            width: fit-content;
            padding: 10px;
            color: white;
        }
        :hover{
            background: rgb(92, 100, 108);
        }
    }
    .main-box{
        height: calc(100% - 40px - 20px);
        overflow: auto;
        margin: 20px;
        background: #dedede;
        border-radius: 10px;
    }
}
</style>