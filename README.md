# Niconico-PepperMint Extension版
「ニコニコ動画をちょっとクールに」を目標に開発しているUserCSS「Niconico-PepperMint」  
...を拡張機能化し、UserStyle版の後継となることを目標に開発している拡張機能。

Niconico-PepperMint Extension版は現在試験的なものです。  
重大なパフォーマンスの問題、バグなどが発生する可能性があります。  

作者はJavaScript初心者なので、貢献は大歓迎です。  

# Install
## 安定版を入手
Firefox Add-onsからアドオンを入手できます。
1. https://addons.mozilla.org/ja/firefox/addon/niconico-peppermint/ に行きます
2. ``Firefox に追加`` を押します
3. 画面の手順に従います
4. おわり
## リリースからインストールする
### Chromeの場合
1. リリースページに行きます
2. ``-chrome``で終わるzipファイルをダウンロードします
3. zipを解凍します
4. ``chrome://extensions``を開きます
5. 右上のデベロッパーモードを有効化します
6. 「パッケージ化されていない拡張機能を読み込む」をクリックします
7. 解凍したフォルダーを選択します
8. おわり
### Firefoxの場合
Firefoxでは、新しいバージョンがある場合自動的にアップデートされます
1. リリースページに行きます
2. xpiファイルをダウンロードします(この時点でインストールダイアログが表示された場合は、そのまま画面の手順に従えば終わりです)
3. xpiファイルをfirefoxにD&Dします
4. 画面の手順に従います
5. おわり
## ソースコードからインストールする
開発真っ最中のバージョンをインストールする方法です。
### Chromeの場合
1. 緑色のCodeボタンからソースコードをダウンロードします
2. zipを解凍します
3. manifest.jsonを適当な名前にリネームして、manifest_chrome.jsonをmanifest.jsonにリネームします
4. ``chrome://extensions``を開きます
5. 右上のデベロッパーモードを有効化します
6. 「パッケージ化されていない拡張機能を読み込む」をクリックします
7. 解凍したフォルダーを選択します
8. おわり
### Firefoxの場合
ここでインストールした拡張機能は、Firefoxを再起動するとなかったことになります  
1. 緑色のCodeボタンからソースコードをダウンロードします
2. ``about:debugging`` を開きます
3. ``この Firefox`` をクリックします
4. ``一時的なアドオンを読み込む...`` をクリックします
5. ダウンロードしたzipファイルを読み込みます
6. おわり

# About ``create.bat``
``create.bat``は、拡張機能をリリースするための作業を短縮するためのものです。
batを実行して、バージョン名を入力するだけで、buildフォルダー内に作成されます。
buildとは名ばかりで、Niconico-PepperMintはjavascriptとcssとhtmlで開発されているため、行っている作業はコピーと圧縮とリネームと削除のみです。
そのため、通常のテストにこのバッチファイルを使用する必要はありません。

# Todo
現時点でやらねばならないこと。  
- [x] 拡張機能を作成する
- [x] ベースの作成(設定内容を元にCSSを適用するなど)
- [x] メジャー機能をUserStyle版から移植する
- [x] ダークモードをUserStyle版から移植する
- [x] Chromium系との相性を確認する
- [ ] マイナー機能をUserStyle版から移植する

# Supported Browser
Niconico-PepperMintはQuantumより後のFirefoxとその派生ブラウザ、そしてChromium系ブラウザをサポートします。  
  
## 動作確認済みブラウザーの一覧
開発者の意図的に動作することを確認したブラウザー。
チェックボックスの付いていないブラウザーは、テストしたが何かしらの無視できない問題があることを示します。
### Firefox
- [x] Firefox 110
- [x] Waterfox 5.1.2
- [x] Floorp (10.10.0時点で表示に軽微な問題あり、Floorp側のアップデートで解決されます)
### Chromium
- [x] Google Chrome 110
- [x] Vivaldi 5.6.2867.62
- [ ] Microsoft Edge 110 (シアターモードのvideo要素に問題あり、document_firstの問題？)

# License
Niconico-PepperMint Extension版のライセンスは``MIT License``です。  
詳細は``LICENSE.txt``を確認してください。  

Niconico-PepperMint内には、Material Iconsを使用している箇所があります。    
Material Iconsは``Apache License 2.0`` のもとで配布されています。  
Apache License 2.0 の文章: https://www.apache.org/licenses/LICENSE-2.0

Niconico-PepperMint内には、JQueryが含まれています。
JQueryは``MIT License``のもとで配布されています。
