/**
 * 请求后端服务器更新 用户管理的社区(如果有的话)
 * @param vue
 */
export function requestManageCommunityInfo(vue) {
  let storage = window.localStorage;
  vue.$axios.get("/api/info/getManComs?token=" + storage.token).then((response) => {
    if (response.data == null) {
      storage["man_communities"] = "[]";
    } else {
      storage["man_communities"] = JSON.stringify(response.data);
    }
  }).catch((err) => {
  })
}; // 这个分号坑爹啊
/**
 * 请求后端服务器更新本地数据user_info 为用户的基本信息
 * @param vue
 */
export function requestUserInfo(vue) {
  let storage = window.localStorage;
  vue.$axios.get("/api/info/getUser?token=" + storage.token).then((response) => {
    storage["user_info"] = JSON.stringify(response.data);
  }).catch((err) => {
  })
};

/**
 * 请求后端服务器更新 用户加入的社区
 * @param vue
 */
export function requestUserCommunity(vue) {
  let storage = window.localStorage;
  vue.$axios.get("/api/info/getUserCommunity?token=" + storage.token).then((response) => {
    if (response.data == null) {
      storage["community"] = "[]";
    } else {
      storage["community"] = "[" + JSON.stringify(response.data) + "]";
    }
  }).catch((err) => {
  })
};
