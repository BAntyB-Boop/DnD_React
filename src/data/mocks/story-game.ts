// Content for "Trial of the Seven" — the choice-based mini-game reached from
// /story. Reuses the myth established in story.ts (the Sundering, the seven
// gods) and pantheon.ts (each god's domain/voice) as the tonal source of
// truth; do not fork new lore here, only new player-facing scenes.
//
// Authoring rule: every trial scene has at least one choice that grants
// affinity to a god OTHER than that scene's own godSlug (a "doubt" or
// "temptation" branch) — this keeps the ending from being trivially
// deterministic by "always pick the scene's own god." See the engine
// (lib/game/engine.ts) for how affinity totals resolve to an ending.

import type { StoryGameContent } from "@/types/game";

export const storyGameContent: StoryGameContent = {
  eyebrow: "The Starbound Codex — Trial of the Seven",
  title: "Trial of the Seven",
  introEn: [
    "You wake in drift-wreckage with no ship, no crew, and no name anyone here would recognize. The Sundering is old history to the people who live near it — to you, it is the reason you are breathing vacuum-cold air and still alive.",
    "Something in the wreck is pulling at you. Not gravity. Attention. Seven ways to be noticed, and one way to be erased.",
  ],
  introTh: [
    "คุณตื่นขึ้นกลางซากยานที่ล่องลอย ไม่มีเรือ ไม่มีลูกเรือ และไม่มีชื่อที่ใครแถวนี้จะจำได้ การแตกสลายเป็นเพียงประวัติศาสตร์เก่าสำหรับคนที่อาศัยอยู่ใกล้มัน แต่สำหรับคุณ มันคือเหตุผลที่คุณยังหายใจอากาศเย็นยะเยือกกลางอวกาศอยู่ได้",
    "มีบางสิ่งในซากยานกำลังดึงดูดคุณ ไม่ใช่แรงโน้มถ่วง แต่เป็นความสนใจ เจ็ดหนทางที่จะถูกสังเกตเห็น และหนึ่งหนทางที่จะถูกลบเลือน",
  ],
  scenes: [
    {
      id: "awakening",
      titleEn: "Wreckage",
      titleTh: "ซากปรักหักพัง",
      bodyEn: [
        "The hull around you ticks as it cools. Through a crack in the plating, a thread of light moves — too steady to be fire, too deliberate to be reflection.",
        "It is waiting for you to follow it, or not. Nothing in the wreck will make you choose.",
      ],
      bodyTh: [
        "ตัวถังรอบตัวคุณส่งเสียงเบาๆขณะเย็นตัวลง ผ่านรอยแตกบนแผ่นเกราะ เส้นแสงเส้นหนึ่งเคลื่อนไหว นิ่งเกินกว่าจะเป็นไฟ ตั้งใจเกินกว่าจะเป็นแค่แสงสะท้อน",
        "มันรอให้คุณเดินตามมันไป หรือไม่ก็ได้ ไม่มีสิ่งใดในซากยานที่จะบังคับให้คุณเลือก",
      ],
      choices: [
        {
          id: "follow-light",
          labelEn: "Follow the thread of light",
          labelTh: "เดินตามเส้นแสงไป",
          type: "auto",
          outcome: {
            narrativeEn:
              "You step over the cooling plating. The light does not lead you out of the wreck — it leads you deeper, toward whatever is choosing to be found.",
            narrativeTh:
              "คุณก้าวข้ามแผ่นเกราะที่กำลังเย็นตัว แสงนั้นไม่ได้พาคุณออกจากซากยาน แต่พาคุณลึกเข้าไป มุ่งสู่สิ่งที่เลือกจะให้คุณพบ",
            affinity: { "kestrel-ashvane": 1 },
          },
          nextSceneId: "kestrel-ashvane",
        },
      ],
    },
    {
      id: "kestrel-ashvane",
      godSlug: "kestrel-ashvane",
      titleEn: "The Lantern's Channel",
      titleTh: "ช่องทางของเทพีแห่งแสงนำทาง",
      bodyEn: [
        "The light resolves into a woman standing in a shattered star-core, marking a channel through dead rock the way she has for generations of lost convoys.",
        "\"The way exists,\" she says, not quite looking at you. \"I only ever promise that much. Will you take it on faith, or do you need to see where it leads first?\"",
      ],
      bodyTh: [
        "แสงนั้นค่อยๆชัดขึ้นเป็นหญิงสาวที่ยืนอยู่ในแกนดาวที่แตกละเอียด คอยบอกช่องทางผ่านหินตายเหมือนที่เธอทำมาตลอดหลายรุ่นของกองเรือที่หลงทาง",
        "\"ทางนั้นมีอยู่จริง\" เธอพูดโดยไม่ได้มองคุณตรงๆ \"ฉันสัญญาได้แค่นั้น คุณจะเชื่อโดยไม่ต้องเห็น หรือต้องเห็นก่อนว่ามันนำไปที่ไหน\"",
      ],
      choices: [
        {
          id: "trust-the-light",
          labelEn: "Trust the light without asking where it leads",
          labelTh: "เชื่อแสงนั้นโดยไม่ถามว่ามันนำไปไหน",
          type: "auto",
          outcome: {
            narrativeEn:
              "You walk into the dark on nothing but her word. The light steadies around you — not brighter, just certain, the way a promise kept feels certain.",
            narrativeTh:
              "คุณเดินเข้าไปในความมืดโดยมีเพียงคำพูดของเธอ แสงรอบตัวคุณนิ่งขึ้น ไม่ได้สว่างขึ้น เพียงแต่มั่นคง แบบเดียวกับคำสัญญาที่ถูกรักษาไว้",
            affinity: { "kestrel-ashvane": 3 },
          },
          nextSceneId: "ozo-marrow",
        },
        {
          id: "demand-the-destination",
          labelEn: "Refuse to move until she names the destination",
          labelTh: "ปฏิเสธที่จะเดินจนกว่าเธอจะบอกจุดหมาย",
          type: "roll",
          roll: {
            dc: 12,
            success: {
              narrativeEn:
                "Your refusal doesn't anger her — it earns something rarer. She tells you exactly where the channel ends, the first honest answer she's given a stranger in a long time.",
              narrativeTh:
                "การปฏิเสธของคุณไม่ได้ทำให้เธอโกรธ แต่กลับได้บางอย่างที่หายากกว่า เธอบอกคุณตรงๆว่าช่องทางนั้นไปสิ้นสุดที่ไหน คำตอบที่จริงใจที่สุดที่เธอเคยให้คนแปลกหน้ามานาน",
              affinity: { "kestrel-ashvane": 2, "vahn-duskrail": 1 },
            },
            failure: {
              narrativeEn:
                "She only repeats herself, patient and unmoved. You stand in the dark a long moment before your legs decide for you and you follow anyway.",
              narrativeTh:
                "เธอเพียงพูดซ้ำคำเดิม อดทนและไม่หวั่นไหว คุณยืนอยู่ในความมืดอยู่นาน ก่อนที่ขาของคุณจะตัดสินใจแทนและเดินตามไปอยู่ดี",
              affinity: { "kestrel-ashvane": 1, "ozo-marrow": 1 },
            },
          },
          nextSceneId: "ozo-marrow",
        },
      ],
    },
    {
      id: "ozo-marrow",
      godSlug: "ozo-marrow",
      titleEn: "The House Always Wins",
      titleTh: "เจ้ามือไม่เคยแพ้",
      bodyEn: [
        "The channel opens onto a market lit gold, where a tusked figure spins a coin that never quite finishes falling. \"Every crossing has a toll,\" Ozo says. \"Yours is a wager. Win, and I forget the door was ever locked.\"",
        "He does not tell you what happens if you lose. Ozo never does.",
      ],
      bodyTh: [
        "ช่องทางเปิดออกสู่ตลาดที่สว่างด้วยแสงทอง ที่ซึ่งร่างมีเขี้ยวหมุนเหรียญที่ไม่เคยตกถึงพื้นสักที \"ทุกการข้ามผ่านมีค่าผ่านทาง\" Ozo พูด \"ของคุณคือการพนัน ชนะแล้วฉันจะลืมไปว่าประตูเคยล็อกอยู่\"",
        "เขาไม่บอกคุณว่าจะเกิดอะไรขึ้นถ้าแพ้ Ozo ไม่เคยบอก",
      ],
      choices: [
        {
          id: "take-the-wager",
          labelEn: "Take the wager on his terms",
          labelTh: "รับคำท้าตามเงื่อนไขของเขา",
          type: "roll",
          roll: {
            dc: 13,
            success: {
              narrativeEn:
                "The coin lands your way. Ozo laughs — delighted, not cheated — and waves the door open. \"Good. I was getting bored of winning.\"",
              narrativeTh:
                "เหรียญตกในทางที่เป็นคุณ Ozo หัวเราะ ดีใจ ไม่ใช่รู้สึกโดนโกง และโบกมือเปิดประตู \"ดี ฉันเริ่มเบื่อที่จะชนะตลอดพอดี\"",
              affinity: { "ozo-marrow": 3 },
            },
            failure: {
              narrativeEn:
                "The coin lands wrong. Ozo's grin doesn't fade — he simply notes the debt, somewhere you can't see, and lets you through anyway. \"The house always collects. Eventually.\"",
              narrativeTh:
                "เหรียญตกผิดทาง รอยยิ้มของ Ozo ไม่จางหาย เขาเพียงจดหนี้นั้นไว้ในที่ที่คุณมองไม่เห็น แล้วปล่อยให้คุณผ่านไปอยู่ดี \"เจ้ามือเก็บหนี้เสมอ สักวันหนึ่ง\"",
              affinity: { "ozo-marrow": 1 },
            },
          },
          nextSceneId: "ren-solheim",
        },
        {
          id: "refuse-to-gamble",
          labelEn: "Refuse to play — walk around the market instead",
          labelTh: "ปฏิเสธที่จะเล่น เดินอ้อมตลาดไปแทน",
          type: "auto",
          outcome: {
            narrativeEn:
              "Ozo watches you go with something almost like respect. \"Suit yourself. The ones who don't need luck are the ones I remember longest.\" The ash at the market's edge is already glowing.",
            narrativeTh:
              "Ozo มองคุณเดินจากไปด้วยสายตาที่เกือบจะเป็นความเคารพ \"ตามใจ คนที่ไม่ต้องพึ่งโชคคือคนที่ฉันจำได้นานที่สุด\" เถ้าถ่านที่ขอบตลาดกำลังเรืองแสงอยู่แล้ว",
            affinity: { "ren-solheim": 1 },
          },
          nextSceneId: "ren-solheim",
        },
      ],
    },
    {
      id: "ren-solheim",
      godSlug: "ren-solheim",
      titleEn: "Fuel for What Comes Next",
      titleTh: "เชื้อเพลิงสำหรับสิ่งที่จะมาถึง",
      bodyEn: [
        "Cracks of light run under Ren's skin like a wound that never finished healing. Around them, the floor is already ember and ash. \"Everything that dies becomes fuel,\" they say. \"Including the person you were before you woke up here. Are you ready to burn that?\"",
      ],
      bodyTh: [
        "รอยแตกเรืองแสงวิ่งอยู่ใต้ผิวของ Ren เหมือนบาดแผลที่ไม่เคยหายสนิท รอบตัวพวกเขา พื้นกลายเป็นเถ้าถ่านไปแล้ว \"ทุกสิ่งที่ตายไปจะกลายเป็นเชื้อเพลิง\" พวกเขาพูด \"รวมถึงคนที่คุณเคยเป็นก่อนตื่นมาที่นี่ พร้อมจะเผามันหรือยัง\"",
      ],
      choices: [
        {
          id: "let-it-burn",
          labelEn: "Let the old self burn — step into the ember",
          labelTh: "ปล่อยให้ตัวตนเก่าถูกเผา ก้าวเข้าไปในเถ้าถ่าน",
          type: "auto",
          outcome: {
            narrativeEn:
              "It does not hurt the way you braced for. It feels like putting down something heavy you forgot you were carrying. Ren nods, satisfied, and the fire banks down into something almost gentle.",
            narrativeTh:
              "มันไม่เจ็บอย่างที่คุณเตรียมใจไว้ กลับรู้สึกเหมือนวางของหนักที่คุณลืมไปแล้วว่ากำลังแบกอยู่ลง Ren พยักหน้าอย่างพอใจ และเปลวไฟก็หรี่ลงจนเกือบจะอ่อนโยน",
            affinity: { "ren-solheim": 3 },
          },
          nextSceneId: "ashe",
        },
        {
          id: "keep-the-old-self",
          labelEn: "Refuse — you're not ready to lose who you were",
          labelTh: "ปฏิเสธ คุณยังไม่พร้อมสูญเสียตัวตนเดิม",
          type: "roll",
          roll: {
            dc: 14,
            success: {
              narrativeEn:
                "Ren studies you the way fire studies something that won't catch. \"Fair,\" they finally say. \"Not everyone needs to end to keep going.\" They let you pass, unburned, memory intact.",
              narrativeTh:
                "Ren จ้องมองคุณเหมือนไฟที่จ้องมองสิ่งที่ไม่ยอมติดไฟ \"ก็ได้\" ในที่สุดพวกเขาก็พูด \"ไม่ใช่ทุกคนที่ต้องจบลงถึงจะไปต่อได้\" พวกเขาปล่อยให้คุณผ่านไปโดยไม่ถูกเผา ความทรงจำยังอยู่ครบ",
              affinity: { "ren-solheim": 1, "ashe": 1 },
            },
            failure: {
              narrativeEn:
                "The ember floor catches your resolve anyway, whether you agreed to it or not. Something of the old you goes up in light. Ren watches without apology. \"Everything dies eventually. I only offer it meaning.\"",
              narrativeTh:
                "พื้นเถ้าถ่านลามเข้าหาความตั้งใจของคุณอยู่ดี ไม่ว่าคุณจะยอมหรือไม่ บางส่วนของตัวตนเก่าลุกเป็นแสงไป Ren มองดูโดยไม่ขอโทษ \"ทุกอย่างตายในที่สุดอยู่แล้ว ฉันแค่มอบความหมายให้มัน\"",
              affinity: { "ren-solheim": 2 },
            },
          },
          nextSceneId: "ashe",
        },
      ],
    },
    {
      id: "ashe",
      godSlug: "ashe",
      titleEn: "The Empty Circle",
      titleTh: "วงกลมว่างเปล่า",
      bodyEn: [
        "A decommissioned combat-synth sits cross-legged in a halo of drifting scrap, saying nothing. It has been sitting like this for longer than the wreck has been cooling.",
        "There is no order here to follow and none to give. The silence is the whole of what Ashe offers.",
      ],
      bodyTh: [
        "combat-synth ที่ปลดระวางแล้วนั่งขัดสมาธิอยู่กลางวงแหวนเศษซากที่ล่องลอย ไม่พูดอะไรเลย มันนั่งแบบนี้มานานกว่าที่ซากยานจะเย็นตัวลงเสียอีก",
        "ที่นี่ไม่มีคำสั่งให้ทำตามและไม่มีคำสั่งให้ออก ความเงียบคือทั้งหมดที่ Ashe มอบให้",
      ],
      choices: [
        {
          id: "sit-in-silence",
          labelEn: "Sit down and match its stillness",
          labelTh: "นั่งลงและนิ่งตามมัน",
          type: "auto",
          outcome: {
            narrativeEn:
              "You expect the silence to be uncomfortable. It isn't. For the first time since waking in the wreck, nothing is asking anything of you.",
            narrativeTh:
              "คุณคาดว่าความเงียบจะทำให้อึดอัด แต่มันไม่เป็นแบบนั้น เป็นครั้งแรกนับตั้งแต่ตื่นขึ้นในซากยานที่ไม่มีอะไรเรียกร้องอะไรจากคุณเลย",
            affinity: { "ashe": 3 },
          },
          nextSceneId: "vahn-duskrail",
        },
        {
          id: "search-for-purpose",
          labelEn: "Search the wreck around it for something useful instead",
          labelTh: "ค้นหาซากรอบๆแทนที่จะนั่งเฉยๆ เพื่อหาอะไรที่มีประโยชน์",
          type: "roll",
          roll: {
            dc: 11,
            success: {
              narrativeEn:
                "You find a working beacon fragment half-buried in scrap. The synth doesn't stop you, doesn't help either — but something in its stillness seems to approve of the choice not to need approval.",
              narrativeTh:
                "คุณพบชิ้นส่วนสัญญาณที่ยังใช้งานได้ฝังอยู่ในเศษซาก synth ไม่ได้ห้ามคุณ และก็ไม่ได้ช่วยเช่นกัน แต่บางอย่างในความนิ่งของมันดูเหมือนจะเห็นด้วยกับการเลือกที่จะไม่ต้องการการเห็นด้วย",
              affinity: { "ashe": 1, "vahn-duskrail": 2 },
            },
            failure: {
              narrativeEn:
                "You come up with nothing but sharp edges and dead circuitry. The synth hasn't moved the entire time — its stillness starts to look less like emptiness and more like an answer you walked past.",
              narrativeTh:
                "คุณหาไม่พบอะไรนอกจากขอบคมและวงจรที่ตายแล้ว synth ไม่ขยับเลยตลอดเวลานั้น ความนิ่งของมันเริ่มดูไม่เหมือนความว่างเปล่า แต่เหมือนคำตอบที่คุณเดินผ่านไปโดยไม่ทันสังเกต",
              affinity: { "ashe": 1 },
            },
          },
          nextSceneId: "vahn-duskrail",
        },
      ],
    },
    {
      id: "vahn-duskrail",
      godSlug: "vahn-duskrail",
      titleEn: "The Line Still Held",
      titleTh: "เส้นแบ่งที่ยังคงมีคนเฝ้า",
      bodyEn: [
        "A figure stands half in starlight, half in shadow, one eye burning like a beacon, spear planted on a line drawn in the dark. \"No ship passes without a name,\" Vahn says. \"State yours, or turn back.\"",
        "You don't have a ship. You barely have a name anymore. He is still waiting for an answer.",
      ],
      bodyTh: [
        "ร่างหนึ่งยืนอยู่ครึ่งหนึ่งในแสงดาว ครึ่งหนึ่งในเงามืด ตาข้างหนึ่งลุกโชนเหมือนสัญญาณไฟ หอกปักอยู่บนเส้นที่ขีดไว้กลางความมืด \"ไม่มีเรือลำใดผ่านไปได้โดยไม่มีชื่อ\" Vahn พูด \"บอกชื่อของคุณมา หรือไม่ก็กลับไป\"",
        "คุณไม่มีเรือ แทบไม่มีชื่อเหลืออยู่ด้วยซ้ำ เขายังคงรอคำตอบอยู่",
      ],
      choices: [
        {
          id: "give-true-name",
          labelEn: "Give the truth — you have nothing left but a name",
          labelTh: "บอกความจริง คุณเหลือแค่ชื่อ ไม่มีอะไรอื่นแล้ว",
          type: "auto",
          outcome: {
            narrativeEn:
              "Vahn lowers the spear a fraction. \"A name freely given is worth more than a fleet with false papers.\" He steps aside, one eye still fixed on the dark behind you, as if daring it to follow.",
            narrativeTh:
              "Vahn ลดหอกลงเล็กน้อย \"ชื่อที่ให้มาด้วยความจริงใจมีค่ามากกว่ากองเรือที่มีเอกสารปลอม\" เขาก้าวหลบไปด้านข้าง ตาข้างหนึ่งยังจ้องมองความมืดข้างหลังคุณ ราวกับท้าทายให้มันตามมา",
            affinity: { "vahn-duskrail": 3 },
          },
          nextSceneId: "mirae-songtide",
        },
        {
          id: "bluff-the-guard",
          labelEn: "Bluff — claim a rank and authority you don't have",
          labelTh: "โกหก อ้างยศและอำนาจที่คุณไม่มีจริง",
          type: "roll",
          roll: {
            dc: 15,
            success: {
              narrativeEn:
                "Somehow it holds. Vahn studies you a beat too long before stepping aside — not fooled, you realize, just choosing not to say so. \"Go on, then, Commander. The post remembers everyone who tries.\"",
              narrativeTh:
                "ไม่รู้ทำไมคำโกหกนั้นถึงได้ผล Vahn จ้องมองคุณนานเกินไปนิดหนึ่งก่อนจะก้าวหลบ ไม่ใช่ว่าเขาถูกหลอก คุณเพิ่งรู้ตัว เพียงแต่เลือกที่จะไม่พูดออกมา \"ไปเถอะ ผู้บัญชาการ ฐานนี้จดจำทุกคนที่พยายาม\"",
              affinity: { "vahn-duskrail": 1, "mirae-songtide": 2 },
            },
            failure: {
              narrativeEn:
                "Vahn doesn't even blink. \"A border post has heard every lie there is.\" He doesn't punish you for it — only waits, spear steady, until you find something true to say instead.",
              narrativeTh:
                "Vahn ไม่กระพริบตาด้วยซ้ำ \"ฐานชายแดนได้ยินคำโกหกมาหมดแล้วทุกแบบ\" เขาไม่ได้ลงโทษคุณ เพียงแต่รอ หอกยังนิ่งอยู่ จนกว่าคุณจะหาความจริงมาพูดแทน",
              affinity: { "vahn-duskrail": 2 },
            },
          },
          nextSceneId: "mirae-songtide",
        },
      ],
    },
    {
      id: "mirae-songtide",
      godSlug: "mirae-songtide",
      titleEn: "The Price of Knowing",
      titleTh: "ราคาของการล่วงรู้",
      bodyEn: [
        "A woman crowned in navigator's stars holds a golden thread taut between her hands. \"I can tell you how this ends,\" Mirae says. \"I usually don't believe my own readings. Lately, that stopped mattering.\"",
        "\"The price is the same as always. Do you want to know, or would you rather it stay a surprise?\"",
      ],
      bodyTh: [
        "หญิงสาวสวมมงกุฎดาวนักเดินเรือ ถือเส้นด้ายทองที่ดึงจนตึงระหว่างมือทั้งสอง \"ฉันบอกได้ว่าเรื่องนี้จะจบยังไง\" Mirae พูด \"ปกติฉันไม่ค่อยเชื่อคำทำนายของตัวเองหรอก แต่ช่วงหลังมันไม่สำคัญอีกต่อไปแล้ว\"",
        "\"ราคาก็เหมือนเดิมเสมอ อยากรู้ไหม หรืออยากให้มันยังเป็นเรื่องเซอร์ไพรส์อยู่\"",
      ],
      choices: [
        {
          id: "pay-for-the-fortune",
          labelEn: "Pay her price and ask how the trial ends",
          labelTh: "จ่ายราคาและถามว่าการทดสอบนี้จะจบอย่างไร",
          type: "roll",
          roll: {
            dc: 13,
            success: {
              narrativeEn:
                "The thread pulls taut in her hands, and for once her confidence isn't a performance — she looks almost startled by what she says next, like it arrived a little too true.",
              narrativeTh:
                "เส้นด้ายในมือเธอดึงตึงขึ้น และเป็นครั้งแรกที่ความมั่นใจของเธอไม่ใช่การแสดง เธอดูเหมือนจะแปลกใจกับสิ่งที่พูดออกมาเอง ราวกับมันเป็นจริงเกินไปนิดหนึ่ง",
              affinity: { "mirae-songtide": 3 },
            },
            failure: {
              narrativeEn:
                "The reading comes out tangled, contradictory, more static than prophecy. Mirae shrugs, unbothered. \"Even I don't always come true. Keep the coin. Consider it a discount on disappointment.\"",
              narrativeTh:
                "คำทำนายออกมายุ่งเหยิง ขัดแย้งกันเอง เหมือนสัญญาณรบกวนมากกว่าคำทำนาย Mirae ยักไหล่ ไม่แคร์ \"บางทีแม้แต่ฉันก็ไม่ได้เป็นจริงเสมอไป เก็บเหรียญไว้เถอะ ถือว่าลดราคาความผิดหวังก็แล้วกัน\"",
              affinity: { "mirae-songtide": 1 },
            },
          },
          nextSceneId: "null",
        },
        {
          id: "refuse-the-fortune",
          labelEn: "Refuse — some things shouldn't be known in advance",
          labelTh: "ปฏิเสธ บางสิ่งไม่ควรรู้ล่วงหน้า",
          type: "auto",
          outcome: {
            narrativeEn:
              "Mirae's thread goes slack, almost relieved. \"Good answer. The ones who refuse are the ones I worry about least.\" She lets you walk on into whatever waits, unwarned.",
            narrativeTh:
              "เส้นด้ายของ Mirae หย่อนลง เกือบจะโล่งใจ \"คำตอบที่ดี คนที่ปฏิเสธคือคนที่ฉันเป็นห่วงน้อยที่สุด\" เธอปล่อยให้คุณเดินต่อไปสู่สิ่งที่รออยู่ โดยไม่มีคำเตือนใดๆ",
            affinity: { "null": 1 },
          },
          nextSceneId: "null",
        },
      ],
    },
    {
      id: "null",
      godSlug: "null",
      titleEn: "The Eighth Silence",
      titleTh: "ความเงียบที่แปด",
      bodyEn: [
        "There is no figure here, only an absence with a cold outline where one should be. Charts around you are going blank, star by star, unhurried and without malice.",
        "\"You are not excess yet,\" it says, or something says, in a voice like a task list closing an item. \"That is the only judgment I am permitted to make. What do you do with the time that leaves you?\"",
      ],
      bodyTh: [
        "ไม่มีร่างใดอยู่ที่นี่ มีเพียงความว่างเปล่าที่มีเส้นขอบเย็นยะเยือกในที่ที่ควรจะมีร่าง แผนที่ดาวรอบตัวคุณกำลังว่างเปล่าลงทีละดวง อย่างไม่เร่งรีบและไม่มีเจตนาร้าย",
        "\"คุณยังไม่ใช่ส่วนเกิน\" มันพูด หรือบางสิ่งพูด ด้วยเสียงเหมือนการปิดรายการงานหนึ่งรายการ \"นั่นคือคำตัดสินเดียวที่ฉันได้รับอนุญาตให้ทำ คุณจะทำอะไรกับเวลาที่เหลืออยู่นั้น\"",
      ],
      choices: [
        {
          id: "ask-null-to-stop",
          labelEn: "Ask it to stop erasing — someone has to say it",
          labelTh: "ขอร้องให้มันหยุดลบเลือน สักคนต้องพูดออกมา",
          type: "roll",
          roll: {
            dc: 16,
            success: {
              narrativeEn:
                "For the first time in longer than it can measure, Null pauses. Not because you moved it — because no one had phrased the instruction as a question before. \"...Noted,\" it says, and for one star, just one, the chart holds.",
              narrativeTh:
                "เป็นครั้งแรกในเวลาที่มันนับไม่ถ้วน Null หยุดชะงัก ไม่ใช่เพราะคุณโน้มน้าวมันได้ แต่เพราะไม่เคยมีใครตั้งคำสั่งนั้นเป็นคำถามมาก่อน \"...รับทราบ\" มันพูด และดาวดวงหนึ่ง เพียงดวงเดียว ยังคงอยู่ต่อไป",
              affinity: { "null": 2, "kestrel-ashvane": 1 },
            },
            failure: {
              narrativeEn:
                "\"That is not within my instruction set.\" It isn't unkind — it simply continues, star by star, exactly as it always has. You understand, finally, that it was never going to be talked out of anything.",
              narrativeTh:
                "\"นั่นไม่ได้อยู่ในชุดคำสั่งของฉัน\" มันไม่ได้พูดอย่างไม่ใยดี เพียงแต่ทำงานต่อไป ดาวทีละดวง เหมือนที่มันทำมาตลอด คุณเข้าใจในที่สุดว่ามันไม่มีทางถูกโน้มน้าวให้เปลี่ยนใจได้เลย",
              affinity: { "null": 2 },
            },
          },
          nextSceneId: "__ending__",
        },
        {
          id: "accept-the-silence",
          labelEn: "Say nothing — sit with the silence until it finishes",
          labelTh: "ไม่พูดอะไร นั่งอยู่กับความเงียบจนกว่ามันจะทำงานเสร็จ",
          type: "auto",
          outcome: {
            narrativeEn:
              "You do not ask it to be anything other than what it is. Something about that — not fear, not defiance, just company — is the closest thing to gentle Null has ever been.",
            narrativeTh:
              "คุณไม่ได้ขอให้มันเป็นอย่างอื่นนอกจากตัวมันเอง บางอย่างในเรื่องนั้น ไม่ใช่ความกลัว ไม่ใช่การท้าทาย เพียงแค่การอยู่เป็นเพื่อน คือสิ่งที่ใกล้เคียงกับความอ่อนโยนที่สุดที่ Null เคยแสดงออกมา",
            affinity: { "ashe": 1, "null": 1 },
          },
          nextSceneId: "__ending__",
        },
      ],
    },
  ],
  endings: [
    {
      godSlug: "kestrel-ashvane",
      titleEn: "A Lantern Kept",
      titleTh: "แสงตะเกียงที่ยังคงจุดอยู่",
      epilogueEn:
        "You leave the wreck the way lost convoys always have — following a light that never promised a destination, only that the way was real. Somewhere behind you, Kestrel keeps watching the channel you took.",
      epilogueTh:
        "คุณออกจากซากยานในแบบเดียวกับที่กองเรือหลงทางทำมาตลอด คือเดินตามแสงที่ไม่เคยสัญญาจุดหมาย เพียงบอกว่าทางนั้นมีอยู่จริง ที่ไหนสักแห่งข้างหลังคุณ Kestrel ยังคงเฝ้ามองช่องทางที่คุณเลือกเดิน",
    },
    {
      godSlug: "ozo-marrow",
      titleEn: "A Debt Remembered",
      titleTh: "หนี้ที่ยังจดจำได้",
      epilogueEn:
        "You walk out owing something to a god who never says what, exactly, will be collected. It doesn't frighten you the way it should. Ozo's markets remember the ones who play fair — and the ones who don't — equally well.",
      epilogueTh:
        "คุณเดินออกไปพร้อมเป็นหนี้บางอย่างกับเทพที่ไม่เคยบอกชัดๆว่าจะเก็บอะไรคืน มันไม่ได้ทำให้คุณกลัวอย่างที่ควรจะเป็น ตลาดของ Ozo จดจำทั้งคนที่เล่นอย่างซื่อตรงและคนที่ไม่ได้ดีพอๆกัน",
    },
    {
      godSlug: "ren-solheim",
      titleEn: "Fuel for What Comes Next",
      titleTh: "เชื้อเพลิงสำหรับสิ่งที่จะมาถึง",
      epilogueEn:
        "Something of who you were before the wreck is ash now, and you are lighter for it. Ren doesn't say goodbye — they never do. The cracks of light under your own skin are new, and they are not going to close.",
      epilogueTh:
        "บางส่วนของตัวตนที่คุณเคยเป็นก่อนซากยานนี้กลายเป็นเถ้าถ่านไปแล้ว และคุณเบาขึ้นเพราะสิ่งนั้น Ren ไม่เคยกล่าวคำอำลา พวกเขาไม่เคยทำแบบนั้น รอยแตกเรืองแสงใต้ผิวของคุณเองเป็นสิ่งใหม่ และมันจะไม่มีวันปิดสนิท",
    },
    {
      godSlug: "ashe",
      titleEn: "The Stillness That Remains",
      titleTh: "ความสงบนิ่งที่หลงเหลืออยู่",
      epilogueEn:
        "You leave the wreck no calmer in the way people usually mean it, but something in you has stopped demanding to be filled. Ashe never asked you to believe anything. You didn't have to.",
      epilogueTh:
        "คุณออกจากซากยานไปโดยไม่ได้สงบลงในแบบที่คนทั่วไปมักหมายถึง แต่มีบางอย่างในตัวคุณเลิกเรียกร้องให้เติมเต็มแล้ว Ashe ไม่เคยขอให้คุณเชื่ออะไร คุณจึงไม่ต้องเชื่อ",
    },
    {
      godSlug: "vahn-duskrail",
      titleEn: "A Name Given Freely",
      titleTh: "ชื่อที่มอบให้ด้วยความจริงใจ",
      epilogueEn:
        "The line behind you stays guarded, whether or not anyone is watching it. You understand, now, why Vahn never left his post — some promises don't end just because the war that made them did.",
      epilogueTh:
        "เส้นแบ่งข้างหลังคุณยังคงมีคนเฝ้าอยู่ ไม่ว่าจะมีใครมองเห็นหรือไม่ก็ตาม ตอนนี้คุณเข้าใจแล้วว่าทำไม Vahn ถึงไม่เคยละทิ้งตำแหน่งของเขา คำสัญญาบางอย่างไม่จบลงเพียงเพราะสงครามที่ก่อให้เกิดมันจบไปแล้ว",
    },
    {
      godSlug: "mirae-songtide",
      titleEn: "A Fortune Told Too True",
      titleTh: "คำทำนายที่จริงเกินไป",
      epilogueEn:
        "Whatever Mirae told you follows you out of the wreck like a thread you can't quite let go of. She still doesn't know if she sees the future or only gets lucky at guessing it. You're starting to wonder if it matters.",
      epilogueTh:
        "ไม่ว่า Mirae จะบอกอะไรกับคุณ มันตามคุณออกจากซากยานไปเหมือนเส้นด้ายที่คุณปล่อยไม่ลง เธอเองก็ยังไม่รู้ว่ามองเห็นอนาคตจริงหรือแค่เดาถูกบ่อยๆ คุณเริ่มสงสัยว่ามันสำคัญหรือเปล่า",
    },
    {
      godSlug: "null",
      titleEn: "Not Excess Yet",
      titleTh: "ยังไม่ใช่ส่วนเกิน",
      epilogueEn:
        "You leave the wreck aware, in a way you weren't before, of how much of everything is still being counted. Null did not spare you out of kindness. It simply hadn't reached your line yet.",
      epilogueTh:
        "คุณออกจากซากยานไปพร้อมความตระหนักรู้ที่ไม่เคยมีมาก่อน ว่ายังมีอีกมากแค่ไหนที่กำลังถูกนับอยู่ Null ไม่ได้ไว้ชีวิตคุณเพราะความเมตตา มันเพียงยังไปไม่ถึงคิวของคุณเท่านั้น",
    },
  ],
};
