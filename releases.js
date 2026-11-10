/*
  RELEASE DATA
  特設サイトの「RELEASED / NEXT」に表示する更新情報を管理するファイル。

  ▼ 基本ルール
  - 公開前の画像・本文・CTAなどは、public GitHubに事前アップしない。
  - 公開前は published: false にして、安全な予告情報だけ入れておく。
  - 公開日にサムネイル・本文・CTAなどを入力して、
    最後に published: true に変更する。
  - v4.4では、このデータをもとに
    3列×2段のRELEASED / NEXTカードが自動生成される。
*/

window.CYNS_RELEASES = [

  // =========================================================
  // 01｜2026.12.18
  // X ACCOUNT & SITE OPEN
  // =========================================================
  {
    // この更新情報だけが持つ固有ID。
    // URLの #x-account-open などにも使用されるため、
    // 一度公開したら基本的に変更しない。
    id: "x-account-open",

    // 管理用の通し番号。
    // 現在のカードUIでは主に管理用として使用。
    number: "01",

    // ユーザーに表示する公開日。
    // モーダルやOPEN ALL一覧などで表示される。
    dateLabel: "2026.12.18",

    // 並び順を決めるための日付。
    // 必ず YYYY-MM-DD 形式で入力する。
    // 新しい情報ほど先に表示される。
    sortDate: "2026-12-18",

    // 更新情報の名称。
    // OPEN ALL一覧の見出しなどで使用される。
    name: "X ACCOUNT & SITE OPEN",

    // 更新内容を簡潔に表す補足文。
    // 現状は主に管理・将来拡張用。
    teaser: "CUSTOM YOUR NARUSASU X & 特設サイト OPEN",

    // トップの3×2カードで使用する正方形サムネイル画像。
    // assets/releases/ 内に画像をアップして、そのパスを書く。
    thumbnail: "./assets/releases/icon_CYNS2027.png",

    // サムネイル画像の代替テキスト。
    // 画像が見えない環境やスクリーンリーダー向け。
    // 画面上には通常表示されない。
    thumbnailAlt: "CUSTOM YOUR NARUSASU Xアカウント・特設サイトOPEN",

    // true にすると、古い情報になっても
    // トップの最初の3×2カード内に残しやすくなる。
    // 通常の更新情報は false でOK。
    pinned: false,

    // pinned: true の情報が複数ある場合の優先順位。
    // 数字が小さいものから優先表示。
    // pinned: false の場合は 0 でOK。
    pinOrder: 0,

    // 公開状態。
    // false = NEXT / 未公開
    // true  = OPEN / 公開済み
    // 公開日に最後にここを true に変更する。
    published: true,

    // 情報の種類。
    // 通常のお知らせは "information"。
    // 特殊な機能を持つ更新を作る場合のみ別typeを使用。
    type: "information",

    // ↓↓↓ ここから「カードをクリックした後のモーダル」の内容 ↓↓↓

    // モーダルの大見出し。
    title: "企画X & 特設サイト OPEN",

    // モーダル本文内に表示する画像。
    // 不要な場合は "" のままでOK。
    // トップカードのthumbnailとは別管理。
    image: "",

    // モーダル内画像の代替テキスト。
    // imageを使わない場合は "" でOK。
    imageAlt: "",

    // モーダル内画像の下に表示するキャプション。
    // 不要な場合は "" でOK。
    imageCaption: "",

    // モーダル本文。
    // "文章" を1つ追加するごとに1段落として表示される。
    body: [
      "2027年7月18日（日）東京ビッグサイトにて開催される、赤ブーブー通信社主催 ナルト×サスケオンリー「ほうき星が尾を引けば」内の有志企画、「CUSTOM YOUR NARUSASU」の特設サイト・企画用Xアカウントをオープンしました！",
      "本サイトと企画用Xにて最新情報を随時お知らせしていきますので、一緒に楽しんでもらえたら嬉しいです🍥🍅"
    ],

    // モーダル最下部の黄色いCTAボタンに表示する文字。
    // CTA不要の場合は ""。
    ctaText: "企画用Xを見る",

    // CTAボタンのリンク先URL。
    // ctaTextとctaUrlの両方が入っている場合のみボタン表示。
    ctaUrl: "https://x.com/CUSTOM_YOUR_NS"
  },


  // =========================================================
  // 02｜2026.12.21
  // ANTHOLOGY TEASER
  // =========================================================
  {
    // 固有ID。
    // 公開後は基本的に変更しない。
    id: "anthology-teaser",

    // 管理用通し番号。
    number: "02",

    // 表示用の公開日。
    dateLabel: "2026.12.21",

    // 並び順用の日付。
    // YYYY-MM-DD形式。
    sortDate: "2026-12-21",

    // OPEN ALL一覧などで使用する名称。
    name: "？？？",

    // 更新内容の簡潔な補足。
    teaser: "『そのあと、ふたりで。』TEASER",

    // トップカード用の正方形サムネイル画像。
    // 公開時にassets/releases/へ画像をアップして入力。
    thumbnail: "",

    // サムネイルの代替テキスト。
    thumbnailAlt: "",

    // トップ1ページ目に固定したい場合のみ true。
    pinned: false,

    // PIN情報同士の表示優先順位。
    // pinned:falseなら0でOK。
    pinOrder: 0,

    // false = NEXT
    // true = OPEN
    // 公開日にtrueへ変更。
    published: false,

    // 通常のお知らせ。
    type: "information",

    // ↓↓↓ ここから公開後モーダル ↓↓↓

    // モーダル大見出し。
    // 公開時に入力。
    title: "",

    // モーダル内画像。
    // 不要なら空欄。
    image: "",

    // モーダル内画像の代替テキスト。
    imageAlt: "",

    // モーダル内画像キャプション。
    imageCaption: "",

    // モーダル本文。
    // 文章を配列形式で追加する。
    body: [],

    // モーダル下部CTAの文字。
    // 不要なら空欄。
    ctaText: "",

    // CTAリンク先。
    // 不要なら空欄。
    ctaUrl: ""
  },


  // =========================================================
  // 03｜2026.12.24
  // NARUSASU PROMPT GACHA
  // =========================================================
  {
    // 固有ID。
    // URLのハッシュリンクにも使用される。
    id: "prompt-gacha",

    // 管理用通し番号。
    number: "03",

    // ユーザー表示用公開日。
    dateLabel: "2026.12.24",

    // 並び順用日付。
    // YYYY-MM-DD形式。
    sortDate: "2026-12-24",

    // OPEN ALL一覧などで使用する名称。
    name: "NARUSASU PROMPT GACHA",

    // 更新内容の簡潔な補足。
    teaser: "NARUSASU お題ガチャ OPEN",

    // トップカード用正方形サムネイル。
    // 公開日にassets/releases/内の画像パスを入力。
    thumbnail: "",

    // サムネイルの代替テキスト。
    thumbnailAlt: "",

    // トップ1ページ目に固定する場合 true。
    // お題ガチャを長期間トップに残したい場合はtrueにしてもOK。
    pinned: false,

    // PIN情報の優先順位。
    // pinned:falseなら0。
    pinOrder: 0,

    // false = NEXT
    // true = OPEN
    // 12/24公開時にtrueへ変更。
    published: false,

    // 通常のお知らせ。
    type: "information",

    // ↓↓↓ ここから公開後モーダル ↓↓↓

    // モーダルの大見出し。
    // 例："NARUSASU PROMPT GACHA"
    title: "",

    // モーダル内画像。
    // 不要なら空欄。
    image: "",

    // モーダル内画像の代替テキスト。
    imageAlt: "",

    // モーダル内画像キャプション。
    imageCaption: "",

    // モーダル本文。
    body: [],

    // モーダル下部CTAボタン文字。
    // 例："お題ガチャをまわす"
    ctaText: "",

    // CTAリンク先。
    // お題ガチャは /gacha/ へのリンクを設定する想定。
    // 例："./gacha/"
    ctaUrl: ""
  }

];


/*
  =========================================================
  v4.4 RELEASE CARD FIELDS — 項目一覧
  =========================================================

  id:
    各情報の固有ID。
    hash URLにも使うため、公開後は原則変更しない。

  number:
    管理用通し番号。
    "01", "02", "03" のように入力。

  dateLabel:
    ユーザーに表示する日付。
    例：
    "2026.12.24"

  sortDate:
    カードの並び順を決めるための日付。
    必ず YYYY-MM-DD 形式。
    例：
    "2026-12-24"

  name:
    更新情報の名称。
    OPEN ALL一覧などで表示される。

  teaser:
    更新情報の簡潔な説明。
    現状は主に管理・補足用途。

  thumbnail:
    トップの3×2カードで使用する正方形サムネイル。
    例：
    "./assets/releases/20261224_prompt-gacha.jpg"

  thumbnailAlt:
    thumbnail画像の代替テキスト。
    視覚的には通常表示されない。

  pinned:
    true / false

    true:
      公開から時間が経過しても
      トップ1ページ目に残したい重要情報。

    false:
      通常の時系列更新。

  pinOrder:
    PIN情報同士の優先順位。

    例：
    アンソロ         pinOrder: 1
    CUSTOM BOOK      pinOrder: 2
    会場ガチャ        pinOrder: 3

    数字が小さいほど優先。

  published:
    false:
      未公開。
      NEXTとしてグレーアウト表示。

    true:
      公開済み。
      OPENとしてクリック可能。

  type:
    通常情報は
    "information"

    特殊機能を持たせる場合のみ別typeを使用。

  title:
    カードをクリックした後の
    モーダル大見出し。

  image:
    モーダル内に表示する画像。
    不要なら ""。

    ※thumbnailとは別。
    thumbnail = トップカード
    image     = モーダル本文内

  imageAlt:
    モーダル内画像の代替テキスト。

  imageCaption:
    モーダル画像下部の補足キャプション。

  body:
    モーダル本文。

    基本形：
    body: [
      "1段落目",
      "2段落目"
    ]

  ctaText:
    モーダル最下部の黄色いCTAボタン文字。

    例：
    "企画用Xを見る"
    "お題ガチャをまわす"
    "アンソロ詳細を見る"

  ctaUrl:
    CTAのリンク先。

    例：
    "https://x.com/..."
    "./gacha/"
    "./anthology/"

    ctaText または ctaUrl が空欄の場合、
    CTAボタンは表示されない。


  =========================================================
  FIRST PANEL PRIORITY
  トップの3列×2段＝6カードの表示優先順位
  =========================================================

  1. 最新の公開済み情報
  2. 次に公開されるNEXT情報
  3. pinned:true の公開済み情報
  4. その他の公開済み情報を新しい順

  ※同じ情報が複数条件に当てはまっても、
    重複カードは自動的に除外される。


  =========================================================
  公開日の基本作業
  =========================================================

  1. 正方形サムネイルを
     assets/releases/
     にアップロード

  2. thumbnail に画像パスを入力

  3. thumbnailAlt を入力

  4. title / body を入力

  5. 必要なら image / imageAlt / imageCaption を入力

  6. 必要なら ctaText / ctaUrl を入力

  7. 最後に
     published: false
     ↓
     published: true
     に変更

  8. Commit changes

  9. 本番サイトで
     ・カードがOPENになったか
     ・次のNEXTが正しく移動したか
     ・モーダルが開くか
     ・CTAが正しく遷移するか
     を確認


  =========================================================
  注意
  =========================================================

  公開前の本文・画像・CTAなど、
  解禁前に見られたくない情報は
  public GitHubへ事前アップロードしない。

  published:false にしていても、
  GitHub上のソースコード自体は閲覧可能。

  公開前は安全な
  dateLabel / name / teaser 等だけ入れておき、
  本文や画像は公開時に追加する。
*/
