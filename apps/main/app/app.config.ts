export default defineAppConfig({
  tauriApp: {
    name: 'App',
    navigation: [
      { label: 'Dashboard', icon: 'layout-dashboard', to: '/' },
      { label: 'Analytics', icon: 'bar-chart-3', to: '/analytics' },
      { label: 'Settings', icon: 'settings', to: '/settings' },
    ],
  },
})
