import { defineConfig } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContentLoader } from 'vitepress'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSidebarItems(dir: string) {
    const dirPath = path.resolve(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) return [];

    return fs.readdirSync(dirPath)
        .filter((file: string) => file.endsWith('.md') && file !== 'index.md')
        .map((file: string) => {
            const filePath = path.join(dirPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            // 匹配一级标题 # Title
            const match = content.match(/^#\s+(.*)/m);
            const title = match ? match[1].trim() : file.replace(/\.md$/, '');
            const name = file.replace(/\.md$/, '');
            return {
                text: title,
                link: `/${dir}/${name}`
            };
        });
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: "羊油蛋服务器 Wiki",
    description: "A wiki site for Agnoeuf",
    ignoreDeadLinks: true,
    vite: {
        plugins: [
            {
                name: 'virtual-category-routes',
                resolveId(id) {
                    if (id.startsWith('virtual-category-')) {
                        return id
                    }
                },
                load(id) {
                    if (id.startsWith('virtual-category-')) {
                        // 返回虚拟模块内容
                        return 'export default {}'
                    }
                }
            }
        ]
    },
    head: [
        ['style', {}, `
            .dead-link { 
                color: #f43f5e !important; 
                text-decoration: underline dashed; 
            }
            .dead-link:hover {
                color: #fb7185 !important;
            }
        `]
    ],
    transformHtml(code, id, { siteConfig }) {
        const pages = new Set(siteConfig.pages.map(p => p.replace(/\\/g, '/')));
        const srcDir = siteConfig.srcDir.replace(/\\/g, '/');
        const currentFile = id.replace(/\\/g, '/');

        // 计算当前处理文件相对于 srcDir 的目录
        let currentRelativeDir = '';
        if (currentFile.startsWith(srcDir)) {
            const relPath = currentFile.slice(srcDir.length).replace(/^\//, '');
            const lastSlash = relPath.lastIndexOf('/');
            if (lastSlash !== -1) {
                currentRelativeDir = relPath.substring(0, lastSlash);
            }
        }

        return code.replace(/<a\s+[^>]*href="([^"]+)"[^>]*>/g, (match, href) => {
            // 跳过外部链接、协议链接、纯锚点
            if (/^(https?:|mailto:|tel:|#)/.test(href)) return match;

            // 跳过导航栏和侧边栏的链接，避免误标红
            if (match.includes('VPNavBar') || match.includes('VPSidebar') || match.includes('nav-link')) return match;

            let cleanHref = href.split('#')[0].split('?')[0];
            try {
                cleanHref = decodeURIComponent(cleanHref);
            } catch (e) { }

            if (cleanHref.endsWith('.html')) cleanHref = cleanHref.slice(0, -5);

            let targetPath = '';
            if (cleanHref.startsWith('/')) {
                targetPath = cleanHref.slice(1);
            } else {
                // 处理相对路径
                const base = currentRelativeDir ? currentRelativeDir.split('/') : [];
                const relative = cleanHref.split('/');
                const stack = [...base];
                for (const seg of relative) {
                    if (seg === '..') stack.pop();
                    else if (seg !== '.' && seg !== '') stack.push(seg);
                }
                targetPath = stack.join('/');
            }

            if (targetPath === '' || targetPath === 'index') return match;

            // 检查 MD 文件是否存在
            const possiblePaths = [
                targetPath.endsWith('/') ? `${targetPath}index.md` : `${targetPath}.md`,
                targetPath.endsWith('/') ? `${targetPath}index.md` : `${targetPath}/index.md`
            ];

            const exists = possiblePaths.some(p => pages.has(p));
            if (!exists) {
                return match.includes('class="')
                    ? match.replace('class="', 'class="dead-link ')
                    : match.replace('<a ', '<a class="dead-link" ');
            }
            return match;
        });
    },
    buildEnd: async (siteConfig) => {
        // 动态生成分类详情页
        const catDir = path.join(__dirname, '..', 'wiki', 'categories')

        // 建立 categories 目录
        if (!fs.existsSync(catDir)) {
            fs.mkdirSync(catDir, { recursive: true })
        }

        // 读取 wiki 数据来获取所有分类
        const wikiFiles = fs.readdirSync(path.join(__dirname, '..', 'wiki'))
            .filter(file => file.endsWith('.md') && file !== 'index.md')

        const categories = new Set<string>()

        wikiFiles.forEach(file => {
            const content = fs.readFileSync(path.join(__dirname, '..', 'wiki', file), 'utf-8')
            const match = content.match(/categories:\s*\[(.*?)\]/m)
            if (match) {
                const cats = match[1].split(',').map(c => c.trim().replace(/['\"\[\]]/g, ''))
                cats.forEach(cat => categories.add(cat))
            }
        })

        // 为每个分类创建一个 markdown 文件
        categories.forEach(category => {
            const fileName = `${category}.md`
            const filePath = path.join(catDir, fileName)

            if (!fs.existsSync(filePath)) {
                const content = `---
layout: page
---

# ${category}

<CategoryList />`
                fs.writeFileSync(filePath, content, 'utf-8')
            }
        })
    },
    themeConfig: {
        outline: {
            level: [2, 4],
        },
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '生存', link: '/wiki/生存服' },
            { text: '创造', link: '/wiki/创造服' },
            { text: '博客', link: '/blog/' },
            { text: 'Wiki', link: '/wiki' },
        ],

        sidebar: {
            '/blog/': [
                {
                    text: '博客文章',
                    items: getSidebarItems('blog')
                }
            ],
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
