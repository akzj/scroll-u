// next.config.cjs
module.exports = {
    output: 'export', // 啟用 next export
    basePath: "/scroll-u",
    assetPrefix: "/scroll-u/",
    images: {
        unoptimized: true, // 因為 GitHub Pages 不支援 next/image 的伺服器端優化
    },
};