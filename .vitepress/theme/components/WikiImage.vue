<template>
    <div :class="['wiki-image-box', side === 'left' ? 'float-left' : 'float-right']" :style="{ maxWidth: width }">
        <img :src="src" :alt="alt || caption" />
        <div v-if="caption" class="caption">{{ caption }}</div>
    </div>
</template>

<script setup>
defineProps({
    src: { type: String, required: true },
    caption: { type: String, default: '' },
    side: { type: String, default: 'right' },
    width: { type: String, default: '45%' }, // 默认最大宽度
    alt: { type: String, default: '' }
})
</script>

<style scoped>
.wiki-image-box {
    display: table;
    /* 关键：使容器宽度随内容（图片）缩放 */
    padding: 4px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    margin-bottom: 1rem;
    z-index: 10;
}

.float-right {
    float: right;
    margin-left: 1.5rem;
}

.float-left {
    float: left;
    margin-right: 1.5rem;
}

.wiki-image-box img {
    margin: 0 !important;
    border-radius: 4px;
    width: 100%;
    display: block;
}

.caption {
    text-align: center;
    font-size: 0.85em;
    padding: 0.5rem 0.2rem 0.2rem;
    color: var(--vp-c-text-2);
    line-height: 1.4;
}

@media (max-width: 640px) {
    .wiki-image-box {
        float: none !important;
        max-width: 100% !important;
        margin: 1rem 0 !important;
        display: block;
    }
}
</style>
