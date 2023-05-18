
export function status2description(status){
  if (status===1){
    return "已发布"
  }else if (status===2){
    return "已截止"
  }else if (status===0){
    return "未发布或未提交"
  }
}
export default {status2description}