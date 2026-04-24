# App Store Screenshot Resizer

App Store Connect にアップロードするスクリーンショットを、ブラウザ上でトリミングしながら accepted size に合わせて PNG 出力するシンプルなツールです。

- iPhone / iPad / Apple Watch 対応
- ドラッグ&ドロップ対応
- 画像はブラウザ内で処理され、サーバー送信なし

## 使い方

1. `index.html` をブラウザで開きます。
2. スクリーンショットを読み込みます。
3. プリセットを選び、ドラッグやズームで切り抜き位置を調整します。
4. `PNGを書き出す` を押して保存します。

## 収録しているプリセット

- Apple Watch Series 11 portrait: `416 x 496`
- iPhone 17 Pro Max portrait: `1320 x 2868`
- iPhone 17 Pro Max landscape: `2868 x 1320`
- 13" iPad portrait: `2064 x 2752`
- 13" iPad landscape: `2752 x 2064`
- 12.9" iPad portrait: `2048 x 2732`
- 12.9" iPad landscape: `2732 x 2048`

## 配布

- 静的ファイルだけで動くので、そのまま `GitHub Pages` で公開できます。
- 公開手順は [DEPLOY_GITHUB_PAGES.md](/Users/akira/Documents/Codex/2026-04-24/ipad-app-store/DEPLOY_GITHUB_PAGES.md) にまとめています。
- X 投稿文の草案は [X_POSTS.md](/Users/akira/Documents/Codex/2026-04-24/ipad-app-store/X_POSTS.md) にあります。

## メモ

- Apple の App Store Connect ヘルプにある screenshot specifications をもとにしています。
- 画像形式は `png`, `jpg`, `jpeg` に対応しています。
- 出力はブラウザ内で処理され、サーバー送信はしません。
