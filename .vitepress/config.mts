import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
        ]
    }
})
