# Post-Print

日本の定型封筒に宛名を印刷するための Web ツール。
A web tool for printing addresses on standard Japanese envelopes.
用于在日本标准信封上打印地址的 Web 工具。

🌐 **Online**: https://genkisugisaki.github.io/post-print-jp/

---

## 日本語

### 概要

Post-Print は、日本の定型封筒（長形3号 / 長形4号）に宛名を印刷するためのブラウザツールです。宛先と差出人を入力し、封筒サイズを選んで A4 用紙に印刷、切り取って封筒に貼り付けるだけ。手書きは不要、インストール不要、ブラウザだけで完結します。

### 機能

- **郵便番号検索** — 7桁の郵便番号から都道府県・市区町村を自動入力（逆方向の検索にも対応）
- **個人 / 法人モード** — 法人モードでは会社名・部署名・担当者名に対応
- **敬称の自動付与** — 個人名に「様」、法人の場合は担当者ありなら担当者に「様」、担当者なしなら会社名または部署名に「御中」を自動付与
- **封筒サイズ** — 長形3号（120 × 235 mm）／ 長形4号（90 × 205 mm）
- **縦書き・横書き** — 伝統的な縦書きレイアウトと横書きレイアウトを切り替え可能
- **差出人情報の保存** — 一度入力すればブラウザに保存され、次回以降は自動入力
- **リアルタイムプレビュー** — 印刷前に封筒の仕上がりをリアルタイムで確認
- **完全ローカル動作** — 入力データはブラウザ内で処理され、郵便番号検索時のみ外部APIに郵便番号を問い合わせます

### 使い方

1. **初回起動時** — 差出人情報（名前・郵便番号・住所）を入力するダイアログが表示されます（ブラウザに保存され、次回以降は自動使用）
2. **宛先住所を入力** — 郵便番号を入力すると住所が自動補完されます。手動入力も可能
3. **宛名を入力** — 「個人」または「法人」を選び、名前を入力（敬称は自動付与）
4. **封筒サイズとレイアウトを選択** — プレビューが即座に更新されます
5. **印刷** — 印刷ボタンをクリック → A4 用紙に印刷し、封筒の実寸に切り取って貼り付け

### 補足

- 差出人情報はブラウザ内（localStorage）にのみ保存されます。入力データはブラウザ内で処理され、郵便番号検索時のみ外部APIに郵便番号を問い合わせます
- 郵便番号検索にはインターネット接続が必要ですが、住所は常に手動入力できます
- 差出人情報を後から変更するには、ヘッダーの ⚙️（歯車）アイコンをクリック

---

## English

### Overview

Post-Print is a browser-based tool for printing addresses on standard Japanese envelopes (Nagagata No. 3 / Nagagata No. 4). Enter recipient and sender details, pick an envelope size, print on A4 paper, then cut and paste onto the envelope — no handwriting, no installation, all in your browser.

### Features

- **Postal code lookup** — Auto-fill prefecture and city from a 7-digit Japanese postal code (and vice versa)
- **Individual / Corporate modes** — Corporate mode supports company name, department, and representative name
- **Automatic honorifics** — "様" (sama) for individual names; for corporate recipients, "様" goes on the contact person when present, otherwise "御中" goes on the company or department name
- **Envelope sizes** — Nagagata No. 3 (120 × 235 mm) / Nagagata No. 4 (90 × 205 mm)
- **Vertical / horizontal layouts** — Switch between traditional vertical writing (縦書き) and horizontal writing (横書き)
- **Sender memory** — Enter once, stored in your browser, auto-filled next time
- **Live preview** — Confirm the printed result in real time
- **Fully local** — Input data is processed in your browser; only the postal code is sent to an external API during lookups

### How to Use

1. **First launch** — A dialog asks for your sender info (name, postal code, address). It is saved locally and reused automatically.
2. **Enter the recipient's address** — Type the postal code to auto-fill, or enter manually.
3. **Enter the recipient's name** — Choose "Individual" or "Corporate" and type the name (honorific added automatically).
4. **Select envelope size and layout** — The preview updates immediately.
5. **Print** — Click the print button → print on A4 paper, cut to the envelope's actual size, paste onto the envelope.

### Notes

- Sender information is stored in your browser (localStorage); other input data is processed locally, and only the postal code is sent to an external API for lookups
- Postal code lookup needs an internet connection, but you can always type addresses manually
- To edit your sender info later, click the ⚙️ (gear) icon in the header

---

## 中文

### 概述

Post-Print 是一款用于在日本标准信封（长形3号 / 长形4号）上打印地址的浏览器工具。输入收件人和发件人信息，选择信封尺寸，在 A4 纸上打印后裁剪粘贴到信封上即可。无需手写、无需安装，浏览器即开即用。

### 功能

- **邮编查询** — 输入 7 位日本邮编自动填充都道府县和市区町村（也支持反向查询）
- **个人 / 企业模式** — 企业模式支持公司名、部门名和负责人姓名
- **自动敬称** — 个人姓名自动添加"様"；企业模式下，有负责人时为负责人添加"様"，无负责人时为公司名或部门名添加"御中"
- **信封尺寸** — 长形3号（120 × 235 mm）/ 长形4号（90 × 205 mm）
- **竖排 / 横排版式** — 支持传统竖排（縦書き）和现代横排（横書き）切换
- **发件人信息保存** — 一次输入，保存在浏览器中，下次自动填入
- **实时预览** — 打印前实时确认信封效果
- **完全本地运行** — 输入数据均在浏览器内处理，仅在邮编查询时向外部 API 发送邮编

### 使用方法

1. **首次启动** — 弹出对话框，要求输入发件人信息（姓名、邮编、地址）。信息保存在浏览器本地，之后自动使用
2. **输入收件人地址** — 输入邮编即可自动补全地址，也可手动输入
3. **输入收件人姓名** — 选择"个人"或"企业"模式，输入姓名（敬称会自动添加）
4. **选择信封尺寸和版式** — 预览即时更新
5. **打印** — 点击打印按钮 → A4 纸打印后按信封实际尺寸裁剪并粘贴到信封上

### 备注

- 发件人信息保存在浏览器（localStorage）中，其他输入数据在浏览器内处理；仅在邮编查询时向外部 API 发送邮编
- 邮编查询需要网络连接，但地址始终可以手动输入
- 如需修改发件人信息，请点击页面顶部的 ⚙️（齿轮）图标

---

## 技術スタック / Tech Stack / 技术架构

### 日本語

- フロントエンド: React 19.2 + TypeScript 5.9
- ビルド: Vite 8
- スタイル: Tailwind CSS 3.4
- 永続化: 差出人情報のみ `localStorage` に保存
- 外部API: HeartRails Geoapi（郵便番号 ↔ 住所 双方向）
- テスト: Vitest + jsdom + Testing Library
- デプロイ: GitHub Actions から GitHub Pages へ自動公開

### English

- Frontend: React 19.2 + TypeScript 5.9
- Build: Vite 8
- Styling: Tailwind CSS 3.4
- Persistence: only sender info is stored in `localStorage`
- External API: HeartRails Geoapi (postal code ↔ address, both ways)
- Testing: Vitest + jsdom + Testing Library
- Deployment: auto-published to GitHub Pages via GitHub Actions

### 中文

- 前端框架：React 19.2 + TypeScript 5.9
- 构建工具：Vite 8
- 样式方案：Tailwind CSS 3.4
- 数据持久化：仅发件人信息写入 `localStorage`
- 外部 API：HeartRails Geoapi（邮编 ↔ 地址 双向查询）
- 测试：Vitest + jsdom + Testing Library
- 部署：GitHub Actions 自动发布到 GitHub Pages

---

## ライセンス / License / 许可证

MIT
