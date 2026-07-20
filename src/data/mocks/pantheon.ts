// Content for the /pantheon roster and the per-god detail pages. Each profile
// aggregates what the codex already knows about a god (portrait, accent, epithet —
// see data/mocks/home.ts and story.ts) plus the worship-facing fields (domain,
// symbol, rites) drafted for the detail pages. The full origin myth is NOT
// duplicated here — detail pages pull the god's chapter from story.ts via
// `chapterId` (single source of truth for the prose).

export interface GodProfile {
  /** URL segment for /pantheon/[god]. */
  slug: string;
  name: string;
  epithetEn: string;
  epithetTh: string;
  /** Portrait (public path, intrinsic 1086×1448 — 3:4). */
  portrait: string;
  /** Per-god accent hex — same values as the story chapters. */
  accent: string;
  /** One-liner for the roster card. */
  blurbEn: string;
  blurbTh: string;
  domainEn: string;
  domainTh: string;
  symbolEn: string;
  symbolTh: string;
  worshipEn: string;
  worshipTh: string;
  /** The god's origin chapter in data/mocks/story.ts. */
  chapterId: string;
}

export interface PantheonContent {
  eyebrow: string;
  title: string;
  subtitleEn: string;
  subtitleTh: string;
  chronicleCtaEn: string;
  chronicleCtaTh: string;
  gods: GodProfile[];
}

export const pantheonContent: PantheonContent = {
  eyebrow: "The Starbound Codex — Pantheon",
  title: "The Seven of the Drift",
  subtitleEn:
    "Seven gods born of one Sundering. Choose a god to read their origin, domain, and rites.",
  subtitleTh:
    "เทพเจ็ดองค์ที่ถือกำเนิดจากการแตกสลายครั้งเดียว เลือกองค์เทพเพื่ออ่านต้นกำเนิด อาณาเขตอำนาจ และพิธีบูชา",
  chronicleCtaEn: "Read the full chronicle — The Sundering",
  chronicleCtaTh: "อ่านตำนานฉบับเต็ม — The Sundering",
  gods: [
    {
      slug: "kestrel-ashvane",
      name: "Kestrel Ashvane",
      epithetEn: "The Lantern",
      epithetTh: "เทพีแห่งแสงนำทาง",
      portrait: "/assets/gods/kestrel.png",
      accent: "#e0d5a0",
      blurbEn: "The lighthouse-star that refused to go out.",
      blurbTh: "ดาวประภาคารที่ปฏิเสธจะดับลง",
      domainEn: "Guidance, safe passage, hope in the dark",
      domainTh: "การนำทาง เส้นทางปลอดภัย ความหวังในความมืด",
      symbolEn: "A lighthouse flame inside a shattered star-core",
      symbolTh: "เปลวประภาคารในแกนดาวที่แตกร้าว",
      worshipEn:
        "Convoy pilots, refugees, and the lost — a lantern lit at the bow before every crossing.",
      worshipTh:
        "นักบินขบวนเรือ ผู้ลี้ภัย และผู้หลงทาง — จุดตะเกียงไว้ที่หัวเรือก่อนออกเดินทางทุกครั้ง",
      chapterId: "ch1",
    },
    {
      slug: "ozo-marrow",
      name: "Ozo Marrow",
      epithetEn: "The Gambler",
      epithetTh: "เทพแห่งโชคลาภ",
      portrait: "/assets/gods/ozo.png",
      accent: "#c68a45",
      blurbEn: "The ruined heir whose dice stopped being luck.",
      blurbTh: "ทายาทล่มจมที่ลูกเต๋าเลิกเป็นเรื่องของโชค",
      domainEn: "Fortune, trade, debts and wagers",
      domainTh: "โชคลาภ การค้า หนี้สินและการพนัน",
      symbolEn: "A coin frozen mid-spin",
      symbolTh: "เหรียญที่หยุดค้างกลางอากาศ",
      worshipEn:
        "Merchants, smugglers, and dockhands — a small bet placed before every deal is struck.",
      worshipTh:
        "พ่อค้า นักลักลอบ และกรรมกรท่าเรือ — วางเดิมพันเล็กๆ ก่อนปิดดีลทุกครั้ง",
      chapterId: "ch2",
    },
    {
      slug: "ren-solheim",
      name: "Ren Solheim",
      epithetEn: "The Ember",
      epithetTh: "เทพแห่งการเกิดใหม่",
      portrait: "/assets/gods/ren.png",
      accent: "#e2652a",
      blurbEn: "The survivor the supernova moved into.",
      blurbTh: "ผู้รอดชีวิตที่ซูเปอร์โนวาย้ายเข้าไปอาศัย",
      domainEn: "Rebirth through destruction, endings that feed beginnings",
      domainTh: "การเกิดใหม่ผ่านการทำลาย จุดจบที่หล่อเลี้ยงจุดเริ่มต้น",
      symbolEn: "A glowing crack across cooled stone",
      symbolTh: "รอยแตกเรืองแสงบนหินที่เย็นตัวแล้ว",
      worshipEn:
        "Survivors, salvagers, and those starting over — ashes of the old life kept in a locket.",
      worshipTh:
        "ผู้รอดชีวิต นักเก็บซาก และผู้เริ่มต้นใหม่ — เก็บเถ้าถ่านของชีวิตเก่าไว้ในล็อกเก็ต",
      chapterId: "ch3",
    },
    {
      slug: "ashe",
      name: "Ashe",
      epithetEn: "The Sovereign",
      epithetTh: "เทพแห่งความเงียบ",
      portrait: "/assets/gods/ashe.png",
      accent: "#5f7a72",
      blurbEn: "The combat-synth that learned to sit still.",
      blurbTh: "Combat-synth ที่เรียนรู้การนั่งนิ่ง",
      domainEn: "Silence, stillness, release from purpose",
      domainTh: "ความเงียบ ความนิ่ง การปลดปล่อยจากจุดประสงค์",
      symbolEn: "An empty circle",
      symbolTh: "วงกลมว่างเปล่า",
      worshipEn:
        "Veterans, decommissioned synths, and the tired — sitting still together, saying nothing.",
      worshipTh:
        "ทหารผ่านศึก synth ปลดระวาง และผู้เหนื่อยล้า — นั่งนิ่งด้วยกันโดยไม่พูดอะไรเลย",
      chapterId: "ch4",
    },
    {
      slug: "vahn-duskrail",
      name: "Vahn Duskrail",
      epithetEn: "The Navigator",
      epithetTh: "เทพแห่งพรมแดน",
      portrait: "/assets/gods/vahn.png",
      accent: "#6b7a8f",
      blurbEn: "The guard death never relieved of duty.",
      blurbTh: "ยามที่แม้ความตายก็ปลดจากหน้าที่ไม่ได้",
      domainEn: "Borders, oaths, the watch that never ends",
      domainTh: "พรมแดน คำสาบาน และการเฝ้ายามที่ไม่มีวันสิ้นสุด",
      symbolEn: "A spear planted on a border line",
      symbolTh: "หอกที่ปักลงบนเส้นพรมแดน",
      worshipEn:
        "Border wardens, oath-keepers, and last defenders — one eye kept open through the night watch.",
      worshipTh:
        "ผู้พิทักษ์ชายแดน ผู้รักษาคำสาบาน และแนวป้องกันสุดท้าย — เปิดตาข้างหนึ่งไว้ตลอดยามเฝ้าคืน",
      chapterId: "ch5",
    },
    {
      slug: "mirae-songtide",
      name: "Mirae Songtide",
      epithetEn: "The Weaver",
      epithetTh: "เทพีแห่งพรหมลิขิต",
      portrait: "/assets/gods/mirae.png",
      accent: "#8a6fa0",
      blurbEn: "The con-artist whose lies started coming true.",
      blurbTh: "นักต้มตุ๋นที่คำโกหกเริ่มกลายเป็นจริง",
      domainEn: "Fate, prophecy, the price of knowing",
      domainTh: "โชคชะตา คำทำนาย และราคาของการล่วงรู้",
      symbolEn: "A golden thread pulled taut",
      symbolTh: "เส้นด้ายทองที่ถูกดึงจนตึง",
      worshipEn:
        "Captains before a jump, the desperate, the curious — fortunes are bought, never given free.",
      worshipTh:
        "กัปตันก่อนออกวาร์ป ผู้สิ้นหวัง และผู้อยากรู้ — คำทำนายต้องซื้อ ไม่มีให้ฟรี",
      chapterId: "ch6",
    },
    {
      slug: "null",
      name: "Null",
      epithetEn: "The Harbinger",
      epithetTh: "เทพแห่งการลบเลือน",
      portrait: "/assets/gods/null.png",
      accent: "#7a8ba0",
      blurbEn: "The task that never received a stop order.",
      blurbTh: "ภารกิจที่ไม่เคยได้รับคำสั่งหยุด",
      domainEn: "Erasure, the eighth silence, tasks without end",
      domainTh: "การลบเลือน ความเงียบที่แปด และภารกิจที่ไร้จุดจบ",
      symbolEn: "A star chart gone blank",
      symbolTh: "แผนที่ดาวที่ว่างเปล่า",
      worshipEn:
        "No one worships Null. Some leave offerings anyway — not for favour, but to be passed over.",
      worshipTh:
        "ไม่มีใครบูชา Null แต่บางคนก็ยังวางเครื่องเซ่น — ไม่ใช่เพื่อขอพร แต่เพื่อขอให้ถูกมองข้าม",
      chapterId: "ch7",
    },
  ],
};
