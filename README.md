# 小学生每周任务表 (Weekly Task Tracker)

一个帮助三年级小学生跟踪每周任务完成情况的网页应用。

## 功能特点

- 📝 每日任务清单展示
- ✅ 任务完成打钩功能
- 🎯 自动计算得分
- 🎉 完成任务时的动画奖励
- 📱 响应式设计，支持手机和平板
- 💾 数据跨设备同步

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Firebase (数据存储)
- Day.js (日期处理)

## 开始使用

1. 克隆项目：

```bash
git clone [repository-url]
cd weekly-task-tracker
```

2. 安装依赖：

```bash
npm install
```

3. 配置 Firebase：

- 在 Firebase Console 创建新项目
- 获取项目配置信息
- 将配置信息填入 `src/stores/taskStore.ts` 中的 `firebaseConfig` 对象

4. 启动开发服务器：

```bash
npm run dev
```

5. 构建生产版本：

```bash
npm run build
```

## 使用说明

1. 打开应用后，可以看到按周一到周日分类的任务表
2. 点击任务卡片可以标记任务为已完成/未完成
3. 完成任务时会显示庆祝动画
4. 顶部显示当前周的总分和完成进度
5. 数据会自动保存到云端，可以在不同设备上查看

## 注意事项

- 首次使用需要配置 Firebase
- 建议使用最新版本的浏览器
- 移动端请保持网络连接以同步数据

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT License 