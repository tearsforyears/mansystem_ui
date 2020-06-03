export default function loginCheck(vue) {
  let storage = window.localStorage;
  if (storage.token == null || storage.token === "") {
    vue.$router.push({name: "Login"});
    vue.$message({
      type: "info",
      message: "请先登录"
    })
  } else {
    // 登录之后得进行一些信息的获取
    vue.$axios.get("/api/checkLogin?token=" + storage.token).then((response) => {
      if (response.data.redirect === "1") {
        vue.$router.push({name: "Login"});
        storage.clear();
      } else {
        // accept login
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
