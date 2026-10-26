# Seel Ocean Rescue · 可交互原型

依据 `../SEEL_OCEAN_RESCUE_MVP.md` 实现的前端概念原型，全部使用本地 mock 数据，不接 Shopify / 支付 / 捐赠 / 优惠码 API。

在线预览：https://zxn980105.github.io/seel-ocean-rescue-demo/

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/，可直接静态托管
npm run deploy   # 构建并发布到 gh-pages 分支（GitHub Pages）
```

- 文案、积分、奖励、合作商品：`src/config/mock.ts`
- 埋点（console + 演示控制台日志）：`src/lib/analytics.ts`
- 插画素材从 `../docs/assets` 参考图裁切：`python scripts/crop_assets.py`
- 左下角「演示控制台」可切换 A/B 分组、积分预设、商品池状态（可用 / 加载中 / fallback）、公益文案强弱，并查看埋点事件；状态保存在 localStorage，可一键重置。
