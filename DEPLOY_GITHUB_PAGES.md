# GitHub Pages で公開する手順

このツールは静的ファイルだけで動くので、ビルドなしでそのまま `GitHub Pages` に載せられます。

## 1. GitHub に push する

リポジトリを作って、このフォルダの内容を push します。

最低限必要なファイル:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## 2. GitHub Pages を有効化する

1. GitHub のリポジトリを開く
2. `Settings`
3. `Pages`
4. `Build and deployment` の `Source` を `Deploy from a branch` にする
5. Branch は `main`
6. Folder は `/ (root)` を選ぶ
7. `Save`

公開URLは通常この形です。

`https://<your-account>.github.io/<repo-name>/`

## 3. 動作確認する

- 公開URLを開く
- 画像をドラッグ&ドロップできるか確認する
- `PNGを書き出す` まで試す

## 4. X に貼るときのおすすめ

- 1ポスト目に公開URL
- 画面キャプチャ1枚
- 使っている様子の短い動画か GIF
- `ローカル処理で安全` を一言入れる

## 補足

- ルートに `index.html` があるので、追加設定なしで公開できます。
- 独自ドメインを使いたい場合は、あとで `CNAME` を追加すれば対応できます。
