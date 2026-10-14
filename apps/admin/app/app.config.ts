export default defineAppConfig({
  console: {
    name: '后台管理',
    nav: [
      { label: '概览', items: [{ label: '仪表盘', to: '/', icon: 'dashboard' }] },
      {
        label: '管理',
        items: [
          { label: '用户', to: '/users', icon: 'users' },
          { label: '文件', to: '/files', icon: 'files' },
        ],
      },
    ],
  },
})
