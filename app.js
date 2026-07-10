const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 文件上传配置
const upload = multer({ dest: 'public/images/' });

// 数据文件路径
const PETS_FILE = path.join(__dirname, 'data/pets.json');
const USER_FILE = path.join(__dirname, 'data/users.json');

// 初始化空数据文件
function initFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}
initFile(PETS_FILE);
initFile(USER_FILE);

// 读取/写入数据工具
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ========== 页面路由 ==========
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));
app.get('/publish', (req, res) => res.sendFile(path.join(__dirname, 'views/publish.html')));
app.get('/detail', (req, res) => res.sendFile(path.join(__dirname, 'views/detail.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));
app.get('/mine', (req, res) => res.sendFile(path.join(__dirname, 'views/mine.html')));

// ========== 用户接口 ==========
// 注册
app.post('/api/register', (req, res) => {
  const { phone, pwd, name } = req.body;
  const users = readJson(USER_FILE);
  if (users.find(u => u.phone === phone)) return res.json({ code: -1, msg: '手机号已注册' });
  users.push({ id: Date.now(), phone, pwd, name, city: '濮阳' });
  writeJson(USER_FILE, users);
  res.json({ code: 0, msg: '注册成功' });
});

// 登录
app.post('/api/login', (req, res) => {
  const { phone, pwd } = req.body;
  const users = readJson(USER_FILE);
  const user = users.find(u => u.phone === phone && u.pwd === pwd);
  if (!user) return res.json({ code: -1, msg: '账号密码错误' });
  res.json({ code: 0, data: user });
});

// ========== 宠物接口 ==========
// 获取全部宠物
app.get('/api/pets', (req, res) => {
  let list = readJson(PETS_FILE);
  // 濮阳区域筛选
  const area = req.query.area;
  const type = req.query.type;
  if (area) list = list.filter(item => item.area === area);
  if (type) list = list.filter(item => item.type === type);
  res.json(list.reverse());
});

// 单条宠物详情
app.get('/api/pet/:id', (req, res) => {
  const id = Number(req.params.id);
  const list = readJson(PETS_FILE);
  const pet = list.find(p => p.id === id);
  res.json(pet || null);
});

// 发布宠物
app.post('/api/publish', upload.single('img'), (req, res) => {
  const { title, type, area, price, desc, contact, uid } = req.body;
  const imgUrl = req.file ? `/images/${req.file.filename}` : '/images/default.png';
  const pets = readJson(PETS_FILE);
  pets.push({
    id: Date.now(),
    title, type, area, price, desc, contact, uid, imgUrl,
    city: '濮阳市',
    time: new Date().toLocaleString()
  });
  writeJson(PETS_FILE, pets);
  res.json({ code: 0, msg: '发布成功' });
});

// 启动服务
app.listen(port, () => {
  console.log(`濮阳宠物交易网站运行：http://localhost:${port}`);
});
