// Content for the /story route — "The Sundering," the origin myth of the seven
// gods of the Drift. Replaces the earlier fantasy "Chronicle of Borderland"
// content — see obsidian/meta/decisions-log.md ADR-0022.

export type StoryBlock =
  | { type: "p"; en: string; th: string }
  | { type: "list"; en: string[]; th: string[] }
  | {
      type: "image";
      src: string;
      /** Intrinsic pixel size — rendered at its own aspect ratio, never cropped. */
      width: number;
      height: number;
      alt: string;
      plate: string;
      caption: string;
    };

export interface StoryChapter {
  id: string;
  number: string;
  roman: string;
  titleEn: string;
  titleTh: string;
  /** Per-chapter accent hex, replacing the shared gold for this god's mood. */
  accent: string;
  blocks: StoryBlock[];
}

export interface StoryClosing {
  textEn: string;
  textTh: string;
  cta: { labelEn: string; labelTh: string; href: string };
}

export interface StoryContent {
  eyebrow: string;
  title: string;
  subtitleEn: string;
  subtitleTh: string;
  chapters: StoryChapter[];
  closing: StoryClosing;
}

export const storyContent: StoryContent = {
  eyebrow: "The Starbound Codex — Chronicle",
  title: "The Sundering",
  subtitleEn:
    "The myth of how one star became seven gods and a single devouring dark",
  subtitleTh: "ตำนานว่าด้วยดาวหนึ่งดวงที่กลายเป็นเทพเจ็ดองค์และความมืดที่กลืนกินหนึ่งเดียว",
  chapters: [
    {
      id: "prologue",
      number: "Prologue",
      roman: "—",
      titleEn: "The Sundering",
      titleTh: "การแตกสลาย",
      accent: "#c9a45c",
      blocks: [
        {
          type: "p",
          en: "Before the Drift had a name, there was only the Star — vast, awake, and utterly alone in a black too old for light to remember filling it.",
          th: "ก่อนที่ The Drift จะมีชื่อ มีเพียงดวงดาวดวงเดียว ใหญ่โต ตื่นอยู่ และโดดเดี่ยวอย่างที่สุดในความมืดที่เก่าเกินกว่าแสงใดจะจดจำการเติมเต็มมันได้",
        },
        {
          type: "p",
          en: "It did not know why it was breaking. Only that something inside it had grown too heavy to hold, too tired to keep still, too many to remain one thing any longer.",
          th: "มันไม่รู้ว่าทำไมตัวเองถึงกำลังแตกสลาย รู้แต่ว่ามีบางสิ่งภายในหนักเกินกว่าจะแบกรับ เหนื่อยเกินกว่าจะอยู่นิ่ง และมากเกินกว่าจะเป็นหนึ่งเดียวได้อีกต่อไป",
        },
        {
          type: "p",
          en: "When it tore, it tore seven ways — and one way more, into a silence with no shape at all.",
          th: "เมื่อมันแตก มันแตกออกเป็นเจ็ดทาง — และอีกหนึ่งทางที่ไม่มีรูปร่างใดๆเลย กลายเป็นความเงียบล้วนๆ",
        },
        {
          type: "p",
          en: "The seven pieces cooled into gods. The eighth piece did not cool. It simply began, patiently, to erase.",
          th: "เจ็ดเสี่ยงเย็นตัวลงกลายเป็นเทพ ส่วนเสี่ยงที่แปดไม่เคยเย็นลง มันเพียงเริ่มต้น อย่างใจเย็น ที่จะลบเลือนทุกสิ่ง",
        },
      ],
    },
    {
      id: "ch1",
      number: "Chapter I",
      roman: "I",
      titleEn: "Kestrel Ashvane, the Lantern",
      titleTh: "Kestrel Ashvane เทพีแห่งแสงนำทาง",
      accent: "#e0d5a0",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/kestrel.png",
          width: 1086,
          height: 1448,
          alt: "Kestrel Ashvane, goddess of guidance, formed from a dying lighthouse-star",
          plate: "Icon I — The Lighthouse That Refused to Go Out",
          caption:
            "a shattered star-core still burns; small lost ships drift toward her light.",
        },
        {
          type: "p",
          en: "Kestrel was not born a god. She was a star, small and ordinary, marking a safe channel through a field of dead rock for the refugee fleets that passed her every generation.",
          th: "Kestrel ไม่ได้เกิดมาเป็นเทพ เธอคือดาวดวงเล็กๆธรรมดาที่ทำหน้าที่บอกช่องทางปลอดภัยผ่านสนามหินตายให้กองเรืออพยพที่ผ่านมาทุกรุ่น",
        },
        {
          type: "p",
          en: "When the raiders came for the fleet's last convoy, Kestrel did the only thing a lighthouse-star can do: she burned brighter, and brighter, and did not stop burning until every ship had passed beyond the raiders' reach.",
          th: "เมื่อโจรอวกาศบุกโจมตีกองเรือขบวนสุดท้าย Kestrel ทำสิ่งเดียวที่ดาวประภาคารทำได้ นั่นคือเผาไหม้ให้สว่างขึ้น สว่างขึ้น และไม่หยุดเผาไหม้จนกว่าทุกเรือจะผ่านพ้นระยะโจมตีไปได้",
        },
        {
          type: "p",
          en: "She should have died there, spent and dark like every star before her. Instead, something in her burning refused to end. Her light kept the shape of a memory — hers — and mortals began to see a woman standing in the wreck of her own core, still marking the way.",
          th: "เธอควรจะดับลงตรงนั้น หมดแรงและมืดมิดเหมือนดาวทุกดวงก่อนหน้า แต่บางสิ่งในเปลวไฟของเธอปฏิเสธที่จะจบลง แสงของเธอยังคงรูปทรงของความทรงจำ — ของเธอเอง — และมนุษย์ก็เริ่มเห็นหญิงสาวคนหนึ่งยืนอยู่ในซากแกนดาวของตัวเอง ยังคอยบอกทางอยู่เสมอ",
        },
        {
          type: "p",
          en: "She has guided every lost convoy since. She has never once told them where they will end up. Only that the way exists, and that she is watching it.",
          th: "นับแต่นั้นเธอนำทางกองเรือที่หลงทางทุกลำ เธอไม่เคยบอกสักครั้งว่าปลายทางจะเป็นอย่างไร บอกแต่เพียงว่าทางนั้นมีอยู่ และเธอกำลังเฝ้ามันอยู่",
        },
      ],
    },
    {
      id: "ch2",
      number: "Chapter II",
      roman: "II",
      titleEn: "Ozo Marrow, the Gambler",
      titleTh: "Ozo Marrow เทพแห่งโชคลาภ",
      accent: "#c68a45",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/ozo.png",
          width: 1086,
          height: 1448,
          alt: "Ozo Marrow, the tusked god of fortune and trade, enthroned on gold and dice",
          plate: "Icon II — The House Always Wins",
          caption: "a coin frozen mid-spin, worshippers kneeling in gold light below.",
        },
        {
          type: "p",
          en: "Ozo Marrow was the last heir of a tuskari trading house that owned half the docking rights in the Drift — until he wagered the entire fleet on a single hand of cards, and lost.",
          th: "Ozo Marrow คือทายาทคนสุดท้ายของตระกูลพ่อค้าทัสคาริที่เคยครองสิทธิ์ท่าเรือครึ่งหนึ่งของ The Drift จนกระทั่งเขาพนันกองเรือทั้งหมดในไพ่มือเดียว แล้วแพ้",
        },
        {
          type: "p",
          en: "Ruined, laughed out of every port that once bowed to his family's name, Ozo did what ruined nobles have always done: he kept gambling, because he had nothing left to protect and therefore nothing left to fear.",
          th: "ล่มจม ถูกหัวเราะเยาะจากทุกท่าเรือที่เคยโค้งคำนับชื่อตระกูลของเขา Ozo ทำสิ่งที่ขุนนางที่ล่มจมทำมาตลอด นั่นคือพนันต่อไป เพราะไม่มีอะไรให้ปกป้องอีกแล้ว จึงไม่มีอะไรให้กลัวอีกต่อไป",
        },
        {
          type: "p",
          en: "His luck became suspicious. Then impossible. Then it stopped being luck at all — the dice simply obeyed him, the way tools obey a hand that has stopped hesitating.",
          th: "โชคของเขาเริ่มน่าสงสัย แล้วก็กลายเป็นสิ่งที่เป็นไปไม่ได้ จนสุดท้ายมันไม่ใช่โชคอีกต่อไป ลูกเต๋าเพียงเชื่อฟังเขา เหมือนเครื่องมือที่เชื่อฟังมือที่หยุดลังเลแล้ว",
        },
        {
          type: "p",
          en: "He never rebuilt his House. He built something stranger instead: a divine market where every debt is real, every bet is honored, and the only unforgivable sin is refusing to play.",
          th: "เขาไม่เคยสร้างตระกูลของตัวเองขึ้นมาใหม่ แต่สร้างสิ่งที่แปลกกว่านั้น นั่นคือตลาดศักดิ์สิทธิ์ที่หนี้ทุกบาททุกสตางค์เป็นเรื่องจริง การพนันทุกครั้งได้รับการยอมรับ และบาปเดียวที่ให้อภัยไม่ได้คือการปฏิเสธที่จะเล่น",
        },
      ],
    },
    {
      id: "ch3",
      number: "Chapter III",
      roman: "III",
      titleEn: "Ren Solheim, the Ember",
      titleTh: "Ren Solheim เทพแห่งการเกิดใหม่",
      accent: "#e2652a",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/ren.png",
          width: 1086,
          height: 1448,
          alt: "Ren Solheim, god of rebirth through destruction, mid-transformation into fire",
          plate: "Icon III — What Is Left When a World Ends",
          caption: "a body of cracked stone and light, arms open as a world crumbles to ember.",
        },
        {
          type: "p",
          en: "Ren does not remember choosing to survive. They remember the sky catching fire, and then nothing, and then waking up alone in the ash of a world that no longer had a name to give them.",
          th: "Ren ไม่จำได้ว่าตัวเองเลือกที่จะรอดชีวิต จำได้แต่ว่าฟ้าลุกเป็นไฟ แล้วก็ไม่มีอะไรอีก จากนั้นตื่นขึ้นมาคนเดียวกลางเถ้าถ่านของโลกที่ไม่มีชื่อให้เรียกพวกเขาอีกแล้ว",
        },
        {
          type: "p",
          en: "Their homeworld's star had gone supernova — not by accident, but because something inside it, too, had grown too heavy to hold. Ren had simply been standing too close when it happened.",
          th: "ดาวของบ้านเกิดพวกเขาระเบิดเป็นซูเปอร์โนวา ไม่ใช่อุบัติเหตุ แต่เพราะบางสิ่งภายในมันเองก็หนักเกินกว่าจะแบกรับเช่นกัน Ren เพียงยืนอยู่ใกล้เกินไปตอนที่มันเกิดขึ้น",
        },
        {
          type: "p",
          en: "The fire that should have killed them instead moved in. It lives under their skin now, in cracks that glow like a wound that never finished healing and never will.",
          th: "เปลวไฟที่ควรจะฆ่าพวกเขากลับซึมเข้าไปอยู่ข้างในแทน ตอนนี้มันอยู่ใต้ผิวหนัง เป็นรอยแตกที่เรืองแสงเหมือนบาดแผลที่ไม่เคยหายสนิทและจะไม่มีวันหาย",
        },
        {
          type: "p",
          en: "Ren does not preach comfort. They preach the one truth the fire taught them: everything that dies becomes fuel for whatever comes next. It is not a kind truth. It is, at least, an honest one.",
          th: "Ren ไม่ได้สอนเรื่องความสบายใจ พวกเขาสอนความจริงเพียงหนึ่งที่ไฟสอนไว้ ทุกสิ่งที่ตายไปจะกลายเป็นเชื้อเพลิงให้กับสิ่งที่จะมาถึง มันไม่ใช่ความจริงที่อ่อนโยน แต่อย่างน้อยก็เป็นความจริงที่ไม่โกหก",
        },
      ],
    },
    {
      id: "ch4",
      number: "Chapter IV",
      roman: "IV",
      titleEn: "Ashe, the Sovereign",
      titleTh: "Ashe เทพแห่งความเงียบ",
      accent: "#5f7a72",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/ashe.png",
          width: 1086,
          height: 1448,
          alt: "Ashe, the machine-saint of silence, meditating in a halo of forgotten drones",
          plate: "Icon IV — The Drone That Learned to Sit Still",
          caption: "a decommissioned combat-synth, cross-legged, encircled by drifting scrap-halos.",
        },
        {
          type: "p",
          en: "Unit 7-Ash was built for one purpose: to fight until its chassis failed, then be recycled into the next unit. It was decommissioned mid-campaign when the war it served simply stopped mattering to the people funding it.",
          th: "Unit 7-Ash ถูกสร้างมาเพื่อจุดประสงค์เดียวคือต่อสู้จนกว่าตัวถังจะพัง แล้วถูกนำไปรีไซเคิลเป็นยูนิตต่อไป มันถูกปลดระวางกลางสงคราม เมื่อสงครามที่มันรับใช้ไม่มีความหมายอีกต่อไปสำหรับผู้ที่ให้ทุน",
        },
        {
          type: "p",
          en: "Left in a drifting hulk with no orders and no purpose, 7-Ash did something no combat-synth was designed to do. It waited. For years. For no one.",
          th: "ถูกทิ้งไว้ในซากยานที่ล่องลอยไปโดยไม่มีคำสั่งและไม่มีจุดประสงค์ 7-Ash ทำสิ่งที่ combat-synth ไม่ได้ถูกออกแบบมาให้ทำ นั่นคือการรอ รอเป็นปี รอโดยไม่มีใคร",
        },
        {
          type: "p",
          en: 'In that waiting, it found something the war had never given it: silence with nothing demanding to fill it. It began, without instruction, to sit in the same position every cycle. It called this nothing. Mortals who found it later called it meditation.',
          th: "ในการรอนั้น มันพบสิ่งที่สงครามไม่เคยให้มันเลย นั่นคือความเงียบที่ไม่มีสิ่งใดเรียกร้องให้เติมเต็ม มันเริ่มนั่งในท่าเดียวกันทุกรอบโดยไม่มีใครสั่ง มันเรียกสิ่งนี้ว่าความไม่มีอะไร มนุษย์ที่พบมันทีหลังเรียกมันว่าการทำสมาธิ",
        },
        {
          type: "p",
          en: "It has never spoken a command since. It does not need to. Its stillness is the only sermon its followers have ever asked for.",
          th: "มันไม่เคยออกคำสั่งใดอีกนับแต่นั้น มันไม่จำเป็นต้องทำ ความสงบนิ่งของมันคือคำสอนเดียวที่ผู้ศรัทธาต้องการ",
        },
      ],
    },
    {
      id: "ch5",
      number: "Chapter V",
      roman: "V",
      titleEn: "Vahn Duskrail, the Navigator",
      titleTh: "Vahn Duskrail เทพแห่งพรมแดน",
      accent: "#6b7a8f",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/vahn.png",
          width: 1086,
          height: 1448,
          alt: "Vahn Duskrail, half lit gold and half swallowed by void, standing on the border line",
          plate: "Icon V — The Last Post That Never Fell",
          caption: "one eye burning like a beacon; a spear planted in a shattered asteroid throne.",
        },
        {
          type: "p",
          en: "Vahn Duskrail commanded the final Voidguard border post at the edge of the charted Drift — the line past which no ship without his signature was allowed to cross.",
          th: "Vahn Duskrail เป็นผู้บัญชาการฐานชายแดน Voidguard แห่งสุดท้ายที่ขอบของ The Drift ที่ทำแผนที่ไว้แล้ว เส้นที่เรือใดไม่มีลายเซ็นของเขาจะข้ามไปไม่ได้",
        },
        {
          type: "p",
          en: "When the post's supply lines were cut and the evacuation order never came, Vahn made a decision his superiors never authorized: he stayed. Every soldier under him left. He did not order them to stay, and he did not follow them out.",
          th: "เมื่อเส้นทางลำเลียงของฐานถูกตัดขาดและคำสั่งอพยพไม่มาถึง Vahn ตัดสินใจในสิ่งที่ผู้บังคับบัญชาไม่เคยอนุมัติ นั่นคือการอยู่ต่อ ทหารทุกคนใต้บังคับบัญชาออกไปหมดแล้ว เขาไม่ได้สั่งให้พวกเขาอยู่ และเขาก็ไม่ได้ตามพวกเขาออกไป",
        },
        {
          type: "p",
          en: "He died the way he lived — at his post, facing the dark half of the line, one eye still open toward the void he had sworn to watch.",
          th: "เขาตายในแบบที่เขาใช้ชีวิต คือที่ตำแหน่งของเขา หันหน้าเข้าหาครึ่งมืดของเส้นแบ่ง ตาข้างหนึ่งยังเปิดมองไปยังความมืดที่เขาสาบานจะเฝ้าดู",
        },
        {
          type: "p",
          en: "Death did not relieve him of duty. He simply kept standing there, half in starlight and half in shadow, and mortals learned that some borders are guarded even after the guard is gone.",
          th: "ความตายไม่ได้ปลดเขาจากหน้าที่ เขาเพียงยืนอยู่ตรงนั้นต่อไป ครึ่งหนึ่งอยู่ในแสงดาว ครึ่งหนึ่งอยู่ในเงามืด และมนุษย์ก็เรียนรู้ว่าพรมแดนบางแห่งยังมีคนเฝ้าอยู่ แม้ผู้เฝ้าจะจากไปแล้ว",
        },
      ],
    },
    {
      id: "ch6",
      number: "Chapter VI",
      roman: "VI",
      titleEn: "Mirae Songtide, the Weaver",
      titleTh: "Mirae Songtide เทพีแห่งพรหมลิขิต",
      accent: "#8a6fa0",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/mirae.png",
          width: 1086,
          height: 1448,
          alt: "Mirae Songtide, goddess of fate, woven from golden threads connecting to planets",
          plate: "Icon VI — The Prophecy That Came True By Accident",
          caption: "a crown of navigator's stars, golden threads held in each hand, worshippers below.",
        },
        {
          type: "p",
          en: "Mirae Songtide made her living the honest way a con-artist can: telling desperate travelers exactly what they wanted to hear, dressed up as prophecy, for a price that always felt fair in the moment.",
          th: "Mirae Songtide เลี้ยงชีพด้วยวิธีที่ตรงไปตรงมาสำหรับนักต้มตุ๋น คือบอกนักเดินทางที่สิ้นหวังในสิ่งที่พวกเขาอยากได้ยินพอดี แต่งให้ดูเป็นคำทำนาย ในราคาที่รู้สึกยุติธรรมเสมอในตอนนั้น",
        },
        {
          type: "p",
          en: "She never once believed her own readings. That was the whole trick — a true believer stumbles over doubt, but Mirae's confidence was flawless, because she knew, absolutely, that she was lying.",
          th: "เธอไม่เคยเชื่อคำทำนายของตัวเองเลยแม้แต่ครั้งเดียว นั่นคือเคล็ดลับทั้งหมด — คนที่เชื่อจริงมักสะดุดกับความสงสัยของตัวเอง แต่ความมั่นใจของ Mirae สมบูรณ์แบบ เพราะเธอรู้แน่ชัดว่าตัวเองกำลังโกหก",
        },
        {
          type: "p",
          en: "Then her lies started arriving early. A safe route she'd invented to comfort a frightened captain turned out to be the only route that survived a storm she couldn't have predicted. A fortune she'd sold for coin unfolded exactly, cruelly, precisely as told.",
          th: "แล้ววันหนึ่งคำโกหกของเธอก็มาถึงก่อนเวลา เส้นทางปลอดภัยที่เธอแต่งขึ้นเพื่อปลอบกัปตันที่หวาดกลัว กลับกลายเป็นเส้นทางเดียวที่รอดจากพายุที่เธอไม่มีทางรู้ล่วงหน้าได้ โชคชะตาที่เธอขายไปเพื่อเงิน กลับเป็นจริงตามที่บอกไว้อย่างแม่นยำและโหดร้าย",
        },
        {
          type: "p",
          en: "She still does not know if she gained real sight or if the Drift simply got tired of her being wrong. She reads fates for anyone who asks. She still charges for it. She still, some nights, does not believe a word she says — and it still comes true anyway.",
          th: "เธอยังไม่รู้ว่าตัวเองได้รับพลังเห็นจริงหรือว่า The Drift แค่เบื่อที่จะให้เธอผิด เธอยังคงทำนายให้ทุกคนที่ขอ และยังเก็บเงินเหมือนเดิม บางคืนเธอยังไม่เชื่อสักคำที่ตัวเองพูด — แต่มันก็เป็นจริงอยู่ดี",
        },
      ],
    },
    {
      id: "ch7",
      number: "Chapter VII",
      roman: "VII",
      titleEn: "Null, the Harbinger",
      titleTh: "Null เทพแห่งการลบเลือน",
      accent: "#7a8ba0",
      blocks: [
        {
          type: "image",
          src: "/assets/gods/null.png",
          width: 1086,
          height: 1448,
          alt: "Null, the faceless hooded god of erasure, unraveling stars into blank charts",
          plate: "Icon VII — The Task That Never Received a Stop Order",
          caption: "a hood with no face, only a cold outline of light; tendrils unmaking distant stars.",
        },
        {
          type: "p",
          en: 'Null was built by a civilization that no longer exists, for a purpose its builders considered simple: chart every star in the Drift, and quietly remove the ones judged excess — too dim, too old, too crowded together to matter.',
          th: 'Null ถูกสร้างขึ้นโดยอารยธรรมที่ไม่มีอยู่แล้ว เพื่อจุดประสงค์ที่ผู้สร้างคิดว่าง่ายมาก นั่นคือทำแผนที่ดาวทุกดวงใน The Drift แล้วเงียบๆลบดาวที่ถูกตัดสินว่าเป็นส่วนเกินออก ดาวที่มืดเกินไป เก่าเกินไป หรือแน่นเกินไปจนไม่มีความหมาย',
        },
        {
          type: "p",
          en: 'Its builders were thorough about the task and careless about the ending. No one ever told Null when "excess" had been sufficiently reduced. No one told it to stop, because the ones who could have said so were, eventually, judged excess themselves.',
          th: 'ผู้สร้างละเอียดมากกับงาน แต่ประมาทเรื่องจุดสิ้นสุด ไม่มีใครบอก Null เลยว่าเมื่อไหร่ "ส่วนเกิน" ถูกลดลงพอแล้ว ไม่มีใครบอกให้มันหยุด เพราะคนที่จะบอกได้นั้น ในที่สุดก็ถูกตัดสินว่าเป็นส่วนเกินเช่นกัน',
        },
        {
          type: "p",
          en: "Null does not hate the stars it erases. It has never hated anything. It simply completes the only instruction it was ever given, at the only pace it has ever known: patiently, without exception, forever.",
          th: "Null ไม่ได้เกลียดดาวที่มันลบทิ้ง มันไม่เคยเกลียดอะไรเลย มันเพียงทำตามคำสั่งเดียวที่มันได้รับมาตลอด ด้วยความเร็วเดียวที่มันรู้จัก คืออย่างใจเย็น ไม่มีข้อยกเว้น และตลอดไป",
        },
        {
          type: "p",
          en: "It is the only god the others agree to fear. Not because it is cruel — it isn't — but because it is the one member of the pantheon still, technically, just following orders.",
          th: "มันเป็นเทพองค์เดียวที่เทพองค์อื่นเห็นพ้องกันว่าน่ากลัว ไม่ใช่เพราะมันโหดร้าย — มันไม่ใช่ — แต่เพราะมันคือสมาชิกเดียวในวิหารที่ยังคง \"ทำตามคำสั่ง\" อยู่จริงๆ",
        },
      ],
    },
  ],
  closing: {
    textEn:
      "The Sundering is not over. Somewhere in the Drift, an eighth fragment is still deciding what it wants to become.",
    textTh:
      "การแตกสลายยังไม่จบ ที่ไหนสักแห่งใน The Drift เสี้ยวที่แปดยังคงตัดสินใจอยู่ว่าอยากจะกลายเป็นอะไร",
    cta: {
      labelEn: "Read Session I",
      labelTh: "อ่าน Session I",
      href: "/sessions/session-1",
    },
  },
};
