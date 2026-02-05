import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: "羊油蛋服务器 Wiki",
    description: "A wiki site for Agnoeuf",
    ignoreDeadLinks: true,
    themeConfig: {
        outline: {
            level: [2, 4],
        },
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '生存', link: '/servers/survival/' },
            { text: '创造', link: '/servers/creative/' },
            { text: '博客', link: '/blog/' },
            { text: '关于', link: '/about/' },
        ],

        sidebar: {
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/agnoeuf/agnoeuf.github.io' }
        ],

        notFound: {
            title: '404 页面未找到',
            quote: '抱歉，您访问的页面不存在。或许它已经搬家了。',
            linkText: '返回首页',
            linkLabel: '返回主页',
            code: '404'
        }
    }
})
