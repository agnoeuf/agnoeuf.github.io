import DefaultTheme from 'vitepress/theme'
import CategoryList from './components/CategoryList.vue'
import WikiImage from './components/WikiImage.vue'
import './custom.css'
import type { App } from 'vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: { app: App }) {
        // 注册全局组件
        app.component('CategoryList', CategoryList)
        app.component('WikiImage', WikiImage)
    }
}
