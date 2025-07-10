// next.config.js
module.exports = {
    output: 'export', // 啟用 next export
    images: {
        unoptimized: true, // 因為 GitHub Pages 不支援 next/image 的伺服器端優化
    },
};