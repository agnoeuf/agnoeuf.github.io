import { defineConfig } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
        const pages = new Set(siteConfig.pages);
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

            let cleanHref = href.split('#')[0].split('?')[0];
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
            { text: '关于', link: '/about' },
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
