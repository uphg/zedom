import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'zedom',
  description: 'A lightweight JavaScript DOM utility library',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/guide/getting-started' },
      { text: 'GitHub', link: 'https://github.com/xypur/zedom' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Events', link: '/api/events' },
          { text: 'DOM', link: '/api/dom' },
          { text: 'Environment', link: '/api/env' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xypur/zedom' }
    ]
  }
})
