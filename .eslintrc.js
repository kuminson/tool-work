module.exports = {
  root: true,
  env: {
    node: true,
    browser: true // 浏览器环境的全局变量
  },
  plugins: ['vue'],
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['warn', 'single'],
    semi: ['error', 'never'], //不使用分号结尾
    'vue/no-template-target-blank': ['error']
  },
  overrides: [
    {
      files: ['**/*.html'], // 针对哪些文件
      rules: {
        'vue/comment-directive': 'off' // 配置规则
      }
    }
  ]
}
