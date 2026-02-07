<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as categories } from '../../data/wiki.data.mts'

const route = useRoute()

const categoryName = computed(() => {
    // 从路由路径提取分类名，例如 /wiki/categories/聚落.html -> 聚落
    const match = route.path.match(/^\/wiki\/categories\/([^/]+?)(?:\.html)?\/?$/)
    if (!match) return ''
    const name = decodeURIComponent(match[1])
    return name === 'index' ? '' : name
})

// 判断是否是分类详情页
const isCategoryPage = computed(() => {
    return Boolean(categoryName.value)
})

const posts = computed(() => {
    if (!isCategoryPage.value || !categoryName.value) return []
    return categories[categoryName.value] || []
})


const allCategories = computed(() => {
    return Object.entries(categories).map(([name, items]) => ({
        name,
        count: items.length,
        description: `包含 ${items.length} 篇文章`
    }))
})
</script>

<template>
    <!-- 分类索引页 -->
    <div v-if="!isCategoryPage" class="category-index">
        <div class="category-grid">
            <a v-for="item in allCategories" :key="item.name"
                :href="`/wiki/categories/${encodeURIComponent(item.name)}.html`" class="category-card">
                <div class="card-content">
                    <h3>{{ item.name }}</h3>
                    <p class="card-desc">{{ item.description }}</p>
                </div>
            </a>
        </div>
    </div>

    <!-- 分类详情页 -->
    <div v-else-if="isCategoryPage" class="category-detail">
        <h1>{{ categoryName }}</h1>
        <p class="post-count">共 {{ posts.length }} 篇文章</p>

        <ul class="post-list">
            <li v-for="post in posts" :key="post.url" class="post-item">
                <a :href="post.url" class="post-link">
                    <span v-if="post.hero" class="post-hero">
                        <img :src="post.hero" :alt="post.title" loading="lazy">
                    </span>
                    <span class="post-content">
                        <span class="post-title">{{ post.title }}</span>
                        <span v-if="post.date" class="post-date">{{ post.date }}</span>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
/* 分类索引页样式 */
.category-index {
    padding: 20px 0;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.category-card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;
}

.category-card:hover {
    border-color: var(--vp-c-brand);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.card-content {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.category-card h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: var(--vp-c-brand);
}

.card-desc {
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 14px;
}

/* 分类详情页样式 */
.category-detail {
    padding: 20px 0;
}

.category-detail h1 {
    margin-bottom: 12px;
    color: var(--vp-c-brand);
}

.post-count {
    color: var(--vp-c-text-2);
    font-size: 14px;
    margin-bottom: 24px;
}

.post-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.post-item {
    margin-bottom: 12px;
}

.post-link {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s;
}

.post-hero {
    width: 72px;
    height: 72px;
    flex: 0 0 72px;
    overflow: hidden;
    border-radius: 8px;
    background-color: var(--vp-c-bg-mute);
}

.post-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 12px;
    min-width: 0;
}

.post-link:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
}

.post-title {
    font-weight: 500;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.post-date {
    color: var(--vp-c-text-3);
    font-size: 12px;
    white-space: nowrap;
    margin-left: 12px;
}
</style>
