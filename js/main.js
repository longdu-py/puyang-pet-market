// 本地存储工具
const Storage = {
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
  },
  get(key) {
    const d = localStorage.getItem(key)
    return d ? JSON.parse(d) : null
  }
}

// 初始化数据
if (!Storage.get('petList')) Storage.set('petList', [])
if (!Storage.get('userList')) Storage.set('userList', [])
if (!Storage.get('loginUser')) Storage.set('loginUser', null)

// 获取当前登录用户
function getLoginUser() {
  return Storage.get('loginUser')
}

// 生成唯一ID
function createId() {
  return Date.now()
}

// 格式化时间
function formatTime() {
  return new Date().toLocaleString()
}

// 跳转页面
function goPage(url) {
  location.href = url
}

// 跳转宠物详情
function goDetail(petId) {
  location.href = `detail.html?id=${petId}`
}
