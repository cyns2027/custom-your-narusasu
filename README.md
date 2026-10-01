## PUBLIC URLS

- [特設サイト TOP](https://cyns2027.github.io/custom-your-narusasu/)
- [NARUSASU お題ガチャ](https://cyns2027.github.io/custom-your-narusasu/gacha/)

# CUSTOM YOUR NARUSASU — Production v4

v3.5を実ファイル基準とし、ユーザー共有のv3.5.1〜v3.5.3差分を再現したうえで、本番運用構造へ移行した版です。

## 1. v3.5.3から維持したもの

- 全体レイアウト／ガチャ本体の方向性
- オープニング：黄色画面 → 白画面ワイプ
  - CSS `.44s`
  - 開始 70ms
  - 終了 565ms
- サブタイトル：`好きなナルサスを、好きなかたちで、好きなだけ！`
- サブタイトル中央揃え＋v3.5より約5mm上
- オレンジのハンドルつまみ削除
- 非公式企画注記 6px

参考確認用として `legacy/v353-reconstructed.html` も同梱しています。

## 2. v4で反映したもの

### デザイン
- WEBアクセントカラーを **グラジオス #F9FF57** に統一
- フォントは `Source Han Sans JP / 源ノ角ゴシック JP Heavy` を優先。未インストール環境は Noto Sans JP 900へフォールバック
- ガチャ内部カプセルを9個→13個へ。サイズ差・重なりを追加
- v3.5.3の外形／オープニングタイミングは維持

### RELEASED / NEXT
`releases.js` のデータから自動生成します。

- `published:false` → NEXT／薄色／クリック不可
- `published:true` → OPEN／クリック可
- NEXT INFORMATION → 次の未公開リリースの日付を自動表示
- 全件公開後 → `ALL INFORMATION RELEASED / CLOSED`

### 情報モーダル
各リリースで以下を自由に設定できます。

- title
- image / imageAlt / imageCaption
- body（段落／リスト／HTMLブロック）
- ctaText / ctaUrl

CTAはテキストとURLが両方あるときだけ表示します。

### Hash直リンク
公開済みリリースは、たとえば

`/#anthology`

で直接モーダルを開けます。

### 開封状態
`localStorage` に保存します。
別端末・別ブラウザでは共有されません。

## 3. 情報解禁時の更新方法

基本的に触るのは **`releases.js` と画像だけ** です。

1. Netlify等のプレビュー環境で本文・画像を準備
2. `releases.js` の対象リリースへ title/body/CTA を入力
3. 必要画像を `assets/images/` に追加
4. 公開直前まで `published:false`
5. 解禁時、内容と画像をGitHubへアップロードして `published:true`

### 重要
**未解禁画像・本文を公開GitHubへ先に入れないでください。**
CSSで隠してもソース／画像URLから見つけられます。

## 4. POSTCARD RALLY

コードの器は `rally/` に実装済みですが、サークル情報は空です。

### 公開前
`rally/circles.js` の `window.CYNS_CIRCLES = []` を維持。

### スペース発表後
サークルデータを追加し、最終SVG MAPを `rally/map.svg` へ差し替えます。

保存キー：
- MY LIST
- GET
- BONUS引換済み

すべて `localStorage`。

RALLYをRELEASEDに出すときは、`releases.js` の末尾コメントにあるサンプルを追加し `type:"rally"` にします。

現在実装済み：
- MAP用ビュー（データ投入前はプレースホルダー）
- MY LIST
- POSTCARD GET
- 5 / 10 / 15 GET
- BONUS READY
- SLIDE TO REDEEM
- GETと引換状態の独立保存
- 合同スペース：データをサークル単位で保持可能

※最終スペース配置確定後、`map.svg` の各スペースクリック実装を本データへ接続します。現在は安全な一覧フォールバックを使用。

## 5. アンソロ招待ページ

`/anthology/invitation/index.html`

現在のv1.8を同梱。
一般サイトからリンクしない運用を想定しています。
`noindex` は検索抑制であり、パスワード保護ではありません。

## 6. お題ガチャ

`/gacha/` は **v5.3.3 light gray** を入れる場所だけ用意しています。
今回の環境には確定版v5.3.3の実ファイルがなかったため、旧版を混ぜず空にしています。
確定版をそのまま配置してください。

## 7. GitHub Pages

リポジトリの公開ディレクトリ直下へ、このフォルダ内のファイルをアップロードします。
GitHub Pagesをリポジトリルートから配信する場合、そのままで動作します。

## 8. Netlify preview

このフォルダをNetlifyへドラッグ＆ドロップすればプレビューできます。
本番前のスマホ確認はNetlify側で行い、承認後にGitHubへ反映する運用を推奨します。

## 9. 通常は触らなくていいファイル

- `style.css`
- `app.js`
- `rally/rally.js`

通常更新：
- `releases.js`
- `rally/circles.js`（7月）
- `assets/images/`
- 必要な個別ページ

## 10. CLOSE

全リリースを `published:true` にするとトップは自動で
`ALL INFORMATION RELEASED / CLOSED`
へ移行します。
2027年10月10日の正式クローズ時は、別途ヘッダー／フッターをアーカイブ表記へ変更し、SOURCE配布導線を追加します。


---

## v4.1 update

### Header / logo
- Header kicker: `2027 NARUTO × SASUKE ONLY PROJECT`
- `CUSTOM YOUR NARUSASU` is rendered at one unified font size.
- A normal half-width space remains between `YOUR` and `NARUSASU`.
- N / S accent colors remain unchanged.

### ABOUT / CONTACT
A permanent `ABOUT / CONTACT` link has been added below `RELEASED / NEXT`.

It opens the existing modal system and is also directly addressable with:

`#about`

Current fields:
- PLANNED BY: awase
- MAIL: custom.your.narusasu@gmail.com
- X: @CUSTOM_YOUR_NS
- Explanation that CUSTOM YOUR NARUSASU is a volunteer project within
  the Akaboo-hosted NARUTO × SASUKE only event, not an Akaboo-hosted project itself
- Unofficial fan-project disclaimer

The ABOUT content lives in `app.js` inside `openAbout()`.


---

## v4.2 update

### Gacha body
- Removed `NARUSASU CUSTOM GACHA` from the machine chamber.
- Removed the status line below `ハンドルをまわす`.
  The button itself now communicates the usable state.

### ABOUT
- `RELEASED INFORMATION` is hidden only while ABOUT is open.
- Removed the `2027 NARUTO × SASUKE ONLY PROJECT` subline from the ABOUT heading.
- Updated ABOUT introduction copy and line breaks.
- Credits remain below the introduction.
- Updated the two disclaimer notes with no forced line breaks inside either note.


---

## v4.3 update

### Main logo
- `CUSTOM YOUR NARUSASU` is centered.

### ABOUT editing
ABOUT content has been moved to:

`about.js`

You can edit ABOUT without touching `app.js` or the main HTML.

Editable fields:
- `title`
- `intro`
- `credits`
- `notes`

Example:

```js
window.CYNS_ABOUT = {
  title: "ABOUT",
  intro: [
    "1つ目の本文",
    "2つ目の本文"
  ],
  credits: [
    { label: "PLANNED BY", value: "awase" },
    { label: "MAIL", value: "example@example.com", href: "mailto:example@example.com" }
  ],
  notes: [
    "注釈1",
    "注釈2"
  ]
};
```

Important:
- `intro` and `notes` are arrays. Add or remove lines by adding/removing quoted entries.
- Use `<br>` only when you want a forced line break.
- `href` is optional. If omitted, the value is displayed as plain text.
- Do not delete the first line `window.CYNS_ABOUT = {` or the final `};`.


---

## v4.3.1 update

### Mobile logo centering fix
- `.logo-wrap` now uses flex centering.
- `.logo` uses its intrinsic text width and is centered as a single block.
- Mobile logo size was reduced slightly to prevent edge overflow while keeping the title on one line.
- Desktop appearance remains essentially unchanged.


---

## v4.3.2 update

### Mobile header logo
- Slightly increased the mobile `CUSTOM YOUR NARUSASU` logo size.
- Centering behavior from v4.3.1 is preserved.

### Spacing
- Increased the vertical space between the `ハンドルをまわす` button area and `>> RELEASED / NEXT`.
- Mobile receives a slightly larger gap for visual breathing room.
