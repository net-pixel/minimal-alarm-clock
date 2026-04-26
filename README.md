# minimal-alarm-clock

シンプルなデザインのアラームアプリです。

**Live demo → https://alarm-app-pi.vercel.app**

## 機能

- 現在時刻のリアルタイム表示
- 任意の時刻にアラームをセット
- アラーム鳴動時に画面フラッシュ + 電子音
- ワンクリックで停止

## 使い方

1. 時刻入力欄でアラームを鳴らしたい時刻を選ぶ
2. 「セット」ボタンを押す
3. 設定した時刻になると音と画面点滅でお知らせ
4. 「止める」ボタンで停止

## 技術スタック

- HTML / CSS / JavaScript（フレームワーク不使用）
- Web Audio API（アラーム音の生成）

## ローカルで動かす

```bash
git clone https://github.com/net-pixel/minimal-alarm-clock.git
cd minimal-alarm-clock
# index.html をブラウザで開くだけで動きます
open index.html
```
