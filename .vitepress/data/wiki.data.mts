import { createContentLoader } from 'vitepress'

export interface Post {
    title: string
    url: string
    hero?: string
    date?: string
}

export declare const data: Record<string, Post[]>

export default createContentLoader('wiki/*.md', {
    transform(raw): Record<string, Post[]> {
        const categories: Record<string, Post[]> = {}

        raw.forEach(({ url, frontmatter }) => {
            // 过滤掉 index.md
            if (url === '/wiki/' || url === '/wiki/index.html') return

            const cats = frontmatter.categories || []
            // 优先从 frontmatter 获取标题，否则使用一级标题或文件名
            const title = frontmatter.title || url.split('/').pop()?.replace('.html', '') || '未命名'
            const hero = frontmatter.hero || frontmatter.cover
            const date = frontmatter.date

            const categoryList = Array.isArray(cats) ? cats : [cats]

            categoryList.forEach((cat: string) => {
                if (!categories[cat]) {
                    categories[cat] = []
                }
                categories[cat].push({
                    title,
                    url,
                    hero,
                    date
                })
            })
        })

        return categories
    }
})
