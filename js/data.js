/* =====================================================================
   data.js  —  THE BRAIN OF THE QUIZ (edit this file to personalize)
   ---------------------------------------------------------------------
   1. Fill in the JAIME object below with her real details. Every [BRACKET]
      is a placeholder that shows up in the quiz until you replace it.
   2. Each faction has a result screen + a real Kill Team box (boxName).
      Set `photo` to a real file once you have it, e.g. 'assets/photos/orks.jpg'
   3. Each answer carries a weight vector, e.g. { orks: 2, harlequins: 1 }.
      Highest total at the end wins. Tweak numbers to steer results.
   Valid faction keys (4 outcomes):  orks  sisters  drukhari  ratlings
   ===================================================================== */

const JAIME = {
  name: 'Jaime',
  shop: '[YOUR SHOP NAME]',
  town: '[YOUR TOWN]',
  hairMetalBand: '[a hair-metal band she loves]',
  grungeBand: '[a grunge band she loves]',
  cocCampaign: '[your Call of Cthulhu campaign]',
  critter: '[her pet / favorite creature]'
};

/* ---------- INKBLOTS -------------------------------------------------
   Original, vertically-symmetric "Rorschach" silhouettes (currentColor). */
function blotSVG(shapes) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="blot" aria-hidden="true">`
    + `<g fill="currentColor">${shapes}</g>`
    + `<g fill="currentColor" transform="matrix(-1,0,0,1,200,0)">${shapes}</g></svg>`;
}
const BLOTS = {
  spire: blotSVG(`<polygon points="100,16 130,92 112,152 100,152"/><ellipse cx="126" cy="118" rx="16" ry="36"/><circle cx="142" cy="58" r="9"/>`),
  maw:   blotSVG(`<polygon points="100,40 152,28 120,80 168,96 118,112 152,152 100,122"/><circle cx="128" cy="94" r="10"/>`),
  bloom: blotSVG(`<circle cx="128" cy="88" r="42"/><circle cx="152" cy="130" r="18"/><circle cx="132" cy="152" r="11"/><ellipse cx="116" cy="150" rx="8" ry="22"/>`),
  crown: blotSVG(`<polygon points="100,28 122,70 148,54 132,102 162,122 120,122 100,162"/>`),
  swarm: blotSVG(`<path d="M100,68 q42,-30 56,6 q6,30 -20,25 q16,20 -5,36 q-21,11 -31,-10z"/><circle cx="152" cy="150" r="8"/><circle cx="132" cy="40" r="7"/>`),
  grin:  blotSVG(`<polygon points="100,58 142,54 130,80 156,86 134,106 152,138 110,120 100,142"/><polygon points="104,150 120,134 136,150 126,166 110,166"/>`)
};

/* ---------- FACTIONS (the 4 possible results) ------------------------ */
const FACTIONS = [
  {
    key: 'orks', name: 'THE ORKS', emblem: '☠', blot: 'grin',
    boxName: 'Kill Team Ork Kommandos',
    tagline: `da WAAAGH! iz a party an' ur invited`,
    accent: '#5fae28', accent2: '#b83a1e', photoStyle: 'troll', photo: null,
    flash: `A force of pure belief and momentum. They build everything from salvage and swagger, and the sheer noise of them believing it works makes it work. They are having an absolutely tremendous time.`,
    who: `Big, green, loud, and the single most JOYFUL army in the galaxy. Orks fight because it's FUN, build their gear from scrap and spite, and (this is real) the more of them who believe a thing will work, the better it works. A found-family in a roaring, kustomized horde.`,
    why: `${JAIME.name}, you run a place where people bring their handmade stuff and leave with treasure. That's Ork kulture with better lighting. You make your own luck, you make your own KIT, and your whole gravity is community. The WAAAGH isn't an army, it's a party that won a fight. It's you.`,
    grimdark: `Yes, technically they're a galaxy-threatening fungal menace. Details. They are having the BEST time.`,
    roast: `Be honest: a solid 60% of your charm is volume and confidence, and it works every single time.`,
    look: `Your team is the <b>Kommandos</b>: sneaky, stripped-down orks in camo, packing improvised bombs, a Bomb Squig, and one nervous grot. Toothy, junkyard-glorious, painted in colors that should not work.`,
    firstBox: `Grab <b>Kill Team: Ork Kommandos</b> (10 Kommandos + a Bomb Squig + a Kommando Grot, originally from Kill Team: Octarius). Good first squad to kitbash into something unhinged and paint at ${JAIME.shop}.`
  },
  {
    key: 'sisters', name: 'THE SISTERS OF BATTLE', emblem: '✟', blot: 'crown',
    boxName: 'Kill Team Novitiates',
    tagline: 'faith * flamethrowers = a personality',
    accent: '#c8413f', accent2: '#c9a43a', photoStyle: 'troll', photo: null,
    flash: `Armoured women who fight on conviction alone, and have never once run out of it. They SING while they burn things. The faith is not metaphorical.`,
    who: `Armored women powered by faith, fire, and a certainty that would frighten a freight train. They SING while they fight. They do not have an indoor voice and they do not want one.`,
    why: `Some people believe things halfway. You are not those people. ${JAIME.name}, you have CONVICTION about art, about your people, about how a thing ought to be DONE, and you'll carry the whole congregation on the strength of it. The shop is your chapel; the regulars are your choir.`,
    grimdark: `The faith is real, the flamers are realer, and "mercy" is spelled with an awful lot of fire.`,
    roast: `We both know you've ended an argument with nothing but righteous eye-contact. This is the miniature version.`,
    look: `Your team is the <b>Novitiates</b>: young zealots in gothic cathedral armor, censers, blades, stained-glass colors, and more conviction than sense. They're beautiful to paint.`,
    firstBox: `Grab <b>Kill Team: Novitiates</b> (a Novitiate Superior + 9 sisters, with specialists like the Hospitaller and Duellist, originally from Kill Team: Chalnath). One of the nicest boxes to put on a shelf at ${JAIME.shop}.`
  },
  {
    key: 'drukhari', name: 'THE DRUKHARI', emblem: '⚔', blot: 'spire',
    boxName: 'Kill Team Nightmare Drukhari Mandrakes',
    tagline: 'beauty, blades, bdsm, and absolutely zero chill',
    accent: '#7b3aa6', accent2: '#2bb0a0', photoStyle: 'troll', photo: null,
    flash: `Beautiful, fast, and very aware of both. They turned cruelty into an art form and style into a survival mechanism. Every moment is a performance, because it is.`,
    who: `Silk, shadow, and very bad intentions. The Drukhari are space-elf pirates who turned cruelty and STYLE into the same art form. They live fast because they have to, and they look unreal doing it.`,
    why: `Hair metal taught you that excess IS a personality and that the look is half the war. ${JAIME.name}, you've got taste with teeth. You find the one strange beautiful thing in the room and you OWN it. ${JAIME.hairMetalBand} would approve.`,
    grimdark: `They stay young by means we, um, don't have to read aloud at the party.`,
    roast: `High drama, perfect cheekbones, immaculate exits. We've seen the documentary; it's just footage of you.`,
    look: `Your team is the <b>Mandrakes</b>: Drukhari who slipped so deep into shadow they came back as living nightmares, smoke-wreathed, balletic, terrifying. Black, bone, and one poison-bright spot colour.`,
    firstBox: `Grab <b>Kill Team: Nightmare</b> (the new plastic <b>Mandrakes</b>, squaring off against Night Lords). Small squad, big statement, extremely good on a shelf at ${JAIME.shop}. (Prefer the classic glam pirates? The Kabalite "Hand of the Archon" is your alt.)`
  },
  {
    key: 'harlequins', name: 'THE HARLEQUINS', emblem: '◆', blot: 'bloom',
    boxName: 'Harlequin Troupe',
    tagline: 'performance * death * diamonds forever',
    accent: '#e040fb', accent2: '#00e5ff', photoStyle: 'troll', photo: null,
    flash: `Trickster-performers who keep the dying gods alive through dance and story. Every fight is a play. Every death is a punchline. They are the most joyful people in the galaxy, and the most dangerous, and they find those things entirely compatible.`,
    who: `Aeldari performer-warriors who travel the Webway staging elaborate shows of ancient myth. They wear jester diamonds and masks that shift with emotion, move faster than you can track, and carry blades that fold space. They serve Cegorach, the Laughing God, who survived the birth of Chaos through sheer trickery and joy.`,
    why: `${JAIME.name}, you run a place called The Whimsy. You help people through death. You play games about cosmic horror with your friends. You know that joy and darkness are the same thing with different lighting. The Harlequins figured that out ten thousand years ago and turned it into a religion, a performance, and a very good reason to carry a monofilament whip.`,
    grimdark: `The Laughing God survived by hiding inside his own stories. His followers keep those stories alive performing them in the spaces between stars, and by killing anyone who interrupts the show.`,
    roast: `Everything is a bit. Everything is aesthetic. You were already framing the scene before it happened.`,
    look: `The <b>Harlequin Troupe</b>: acrobatic warrior-jesters in diamond-patterned suits and blank-faced masks, armed with blades and monofilament wire. Painted in whatever riot of color you like. It's YOUR show.`,
    firstBox: `Grab the <b>Harlequin Troupe</b> box (six Troupe Players plus a Troupe Master). The most paintable kit Games Workshop makes. The diamond pattern is terrifying to attempt and looks absolutely unhinged when it comes together at ${JAIME.shop}.`
  }
];

/* Official, in-stock Games Workshop product pages (each shows live stock). */
const PRODUCT_URL = {
  orks:     'https://www.warhammer.com/en-US/shop/orks-kommandos-2025',
  sisters:  'https://www.warhammer.com/en-US/shop/adepta-sororitas-sisters-novitiate-squad-2025',
  drukhari: 'https://www.warhammer.com/en-US/shop/kill-team-mandrakes-2024',
  harlequins: 'https://www.warhammer.com/en-US/shop/Harlequin-Troupe-Troop-2017'
};
FACTIONS.forEach(f => {
  const team = encodeURIComponent('warhammer 40k ' + f.name.replace(/THE |'/g, '').trim() + ' kill team');
  f.boxImg = `assets/boxes/${f.key}.webp`;      // image of the faction (auto-loads; falls back to emblem)
  f.productUrl = PRODUCT_URL[f.key];            // FIND THE BOX -> official in-stock page
  f.buyUrl = f.productUrl;
  f.seeUrl = `https://www.google.com/search?tbm=isch&q=${team}+miniatures`;   // "more photos"
});
const FACTION_BY_KEY = Object.fromEntries(FACTIONS.map(f => [f.key, f]));

/* ---------- QUESTIONS (~12, rotating formats) ------------------------
   type: 'classic' | 'sanity' | 'inkblot' | 'music' | 'shop' | 'philo'
   Each option has a weight vector `w` over: orks sisters drukhari ratlings. */
const QUESTIONS = [

  /* 1 — MINIGAME */
  { type: 'colorpick', kicker: "LET'S START WITH AN EASY ONE", q: `What's your favorite shade of orange?`, options: [] },

  /* 2 — PERSONAL */
  { type: 'classic', kicker: 'EDGE OF DARKNESS ✷ we told you so',
    q: `You SAID the cult ritual at the end of Edge of Darkness probably cursed the shop, but now a shelf trinket at The Whimsy is rattling, smoke's pouring out, and something ancient and extremely annoyed is standing in your inventory section. You were right. You:`,
    options: [
      { label: `Absolutely lose it with excitement. Finally, a decent scrap. You've been so BORED.`, w: { orks: 2, sisters: 1 } },
      { label: `"Vade retro, immunde spiritus. Haec taberna est sanctificata et non tua." Counter-ritual. Memorised. The notecard has been in your wallet for months.`, w: { sisters: 2 } },
      { label: `You are DELIGHTED. Not about a deal. About the look on its face when it realises you're not scared. You take your time. You let it get uncomfortable. The discomfort is the point.`, w: { drukhari: 2, harlequins: 1 } },
      { label: `You're not surprised. You've performed this exact scene before. You welcome it with a bow, assign it a role, and start directing. The story needed a monster and now it has one.`, w: { harlequins: 2 } }
    ] },

  /* 3 — 40K LORE */
  { type: 'philo', kicker: 'THE WARP ✷ a brief introduction',
    q: `The Warp is a parallel dimension of pure psychic energy: every emotion, prayer, and scream ever felt across the galaxy, made real and waiting. Ships sail through it to reach distant stars. Chaos Gods live in it like things that were always there. It is beautiful and it will kill you. Your first instinct:`,
    options: [
      { label: `A test. The Emperor's light crosses it like a lighthouse in absolute dark. You fix your eyes on that and you don't look at anything else.`, w: { sisters: 3 } },
      { label: `A dimension that runs on rage and collective belief. All that emotion has to go somewhere. You already know where yours is going.`, w: { orks: 2 } },
      { label: `A dimension where reality bends to desire and nothing holds. Dangerous, obviously. Worth it.`, w: { drukhari: 2 } },
      { label: `Where the galaxy's story lives. Chaos Gods, screaming dead, burning dreams, all of it writing itself out in real time. You know how to read this kind of text.`, w: { harlequins: 2 } }
    ] },

  /* 4 — MINIGAME */
  { type: 'tactical', kicker: 'TACTICAL DEPLOYMENT ✷ trust your gut',
    q: `One unit. One objective in the center. Enemy standing between you. You move:`,
    options: [
      { label: 'STRAIGHT THROUGH', icon: '⚡', sub: 'directly at them, full speed, no detours', w: { orks: 2 } },
      { label: 'TAKE THE FLANK',   icon: '↻', sub: 'wide arc, hit from the side they forgot about', w: { harlequins: 2, drukhari: 1 } },
      { label: 'HOLD POSITION',    icon: '✛', sub: 'dig in, fortify, make them come to you', w: { sisters: 2 } },
      { label: 'DISAPPEAR',        icon: '◈', sub: 'into cover, into shadow, out somewhere else entirely', w: { drukhari: 2, harlequins: 1 } }
    ]
  },

  /* 5 — PSYCH (Attachment) */
  { type: 'classic', kicker: 'FIELD ASSESSMENT ✷ honest answers only', q: `Your relationship to the people you fight alongside:`,
    options: [
      { label: `The mob is everything. The more the better. The louder the better. Alone is not something you can do for long.`, w: { orks: 2 } },
      { label: `Your Sisters are your purpose. The bond is sworn and real and you don't spend time questioning it.`, w: { sisters: 2 } },
      { label: `Useful, when they are. You don't need them to be anything else.`, w: { drukhari: 2 } },
      { label: `The troupe is everything. You just don't let them see exactly how much. Masks exist for a reason.`, w: { harlequins: 2 } }
    ] },

  /* 6 — PERSONAL */
  { type: 'music', kicker: 'NOW PLAYING ♫', q: `Pick the sound that is actually YOU at 2am:`,
    options: [
      { label: `Something loud, decadent, and a little dangerous. The kind of music that makes bad decisions sound inevitable.`, w: { drukhari: 2 } },
      { label: `Bowie. A cabaret score. Something that's also a costume.`, w: { harlequins: 2 } },
      { label: `A choir that shakes walls. Something old and enormous and not entirely of this world.`, w: { sisters: 2 } },
      { label: `A crowd finding the same roar at the same time. The sound of everyone going YES.`, w: { orks: 2 } }
    ] },

  /* 7 — PSYCH (Dark Triad: Machiavellianism) */
  { type: 'classic', kicker: 'STRATEGIC ASSESSMENT ✷ no wrong answers', q: `You need something done. Someone is standing between you and it. Your move:`,
    options: [
      { label: `You don't need a strategy. You have momentum.`, w: { orks: 2 } },
      { label: `You state what needs to happen. The Emperor's authority is behind you. That usually settles it.`, w: { sisters: 2 } },
      { label: `You find what they want more than the thing they're protecting. You offer it. Smiling.`, w: { drukhari: 2 } },
      { label: `You give them a better story to be in. They walk away thinking it was their idea.`, w: { harlequins: 2 } }
    ] },

  /* 8 — MINIGAME */
  { type: 'inkblot', kicker: 'INKBLOT ✷ don\'t think, just point', q: `Pick the shape you can't look away from:`,
    options: [
      { blot: 'spire', tag: 'I.',   w: { drukhari: 2 } },
      { blot: 'maw',   tag: 'II.',  w: { orks: 2 } },
      { blot: 'bloom', tag: 'III.', w: { harlequins: 2 } },
      { blot: 'crown', tag: 'IV.',  w: { sisters: 2 } }
    ] },

  /* 9 — 40K LORE */
  { type: 'philo', kicker: 'THE BIG ONE', q: `A psyker read your fate in the Emperor's Tarot. Blank-eyed, shaking, three cards face down. Fate: real?`,
    options: [
      { label: `The Emperor's will made manifest. Every battle, every sacrifice, every moment of faith was written in His great design before you were born. You are grateful to know your role.`, w: { sisters: 2 } },
      { label: `Da WAAAGH is fate. Your fate, their fate, everybody's fate. It hasn't happened yet but it will, and it will be loud.`, w: { orks: 2 } },
      { label: `The Tarot, the psyker, the prophecy: stories to comfort the weak. You take what you want. Fate catches up with the people you leave behind.`, w: { drukhari: 2 } },
      { label: `Cegorach wrote this scene long before you arrived. He's already laughing at the punchline. You're getting there.`, w: { harlequins: 2 } }
    ] },

  /* 10 — PERSONAL */
  { type: 'classic', kicker: 'THE WHIMSY ✷ cafe knowledge required', q: `Favorite cafe treat:`,
    options: [
      { label: `The dark chocolate thing. Expensive. You eat it slowly and with eye contact.`, w: { drukhari: 2 } },
      { label: `The proper scone. Jam first, then cream. This is not up for debate.`, w: { sisters: 2 } },
      { label: `The enormous cinnamon roll. You needed two hands and a plan. You had neither.`, w: { orks: 2 } },
      { label: `The half-frozen strawberry muffin from The Whimsy. Technically cold in the middle. Still somehow the best thing you've had all week. You can't explain it.`, w: { harlequins: 2 } }
    ] },

  /* 11 — MINIGAME */
  { type: 'door', kicker: `CHOOSE YOUR DOOR ✷ don't think`,
    q: `Four doors. One opens for you. Which one?`,
    options: [
      { faction: 'orks',       label: 'THE BATTERED ONE', sub: 'dented iron, red handprint, very loud hinges' },
      { faction: 'sisters',    label: 'THE CARVED ONE',   sub: 'stone archway, cross relief, candle either side' },
      { faction: 'drukhari',   label: 'THE BLACK ONE',    sub: 'lacquered, no handle, thin light at the edge' },
      { faction: 'harlequins', label: 'THE PAINTED ONE',  sub: 'diamonds, slightly ajar, warm light spilling through' }
    ]
  },

  /* 12 — CLASSIC */
  { type: 'classic', kicker: 'PICK YOUR AESTHETIC', q: `Don't overthink it. Pick the vibe:`,
    options: [
      { label: `Gold, bone, and the dignity of ages.`, w: { sisters: 2 } },
      { label: `Black leather, blades, impeccable cheekbones.`, w: { drukhari: 2 } },
      { label: `Diamonds and mirrors and colors that shouldn't work together but absolutely do.`, w: { harlequins: 2 } },
      { label: `Red and chrome and a logo I designed myself.`, w: { orks: 2 } }
    ] },

  /* 13 — PSYCH (Dark Triad: Psychopathy) */
  { type: 'classic', kicker: 'AFTER THE FACT ✷ no witnesses', q: `Something got broken to get you here. You:`,
    options: [
      { label: `Already forgot about it. Forward.`, w: { orks: 2 } },
      { label: `Carry it. The Emperor sees every cost. You made the right call and you'll answer for it properly.`, w: { sisters: 2 } },
      { label: `Aren't sure what you're meant to feel here. You got what you needed.`, w: { drukhari: 2 } },
      { label: `The story required it. You were faithful to the scene.`, w: { harlequins: 2 } }
    ] },

  /* 14 — CLASSIC */
  { type: 'classic', kicker: 'YOUR IDEAL CREW', q: `Who's at your back?`,
    options: [
      { label: `A loud, loyal, mismatched warband that would die for me.`, w: { orks: 2 } },
      { label: `A tiny elite circle with terrifying competence.`, w: { drukhari: 2 } },
      { label: `A whole disciplined movement marching as one.`, w: { sisters: 2 } },
      { label: `A small troupe who make it look easy and mean every second of it.`, w: { harlequins: 2 } }
    ] },

  /* 15 — PSYCH (Attachment) */
  { type: 'classic', kicker: 'THREAT ASSESSMENT ✷ we\'ve all been there', q: `The alliance is holding. For now. Your read:`,
    options: [
      { label: `There's no alliance. There's just who's fighting next to you right now. That's enough.`, w: { orks: 2 } },
      { label: `The Covenant is sworn before the Emperor. People either mean it or they don't. You know which.`, w: { sisters: 2 } },
      { label: `They'll betray you the moment it's worth it. You have that moment circled. You'll move first.`, w: { drukhari: 2 } },
      { label: `You already know how it ends. You're enjoying the part where everyone still thinks it won't.`, w: { harlequins: 2 } }
    ] },

  /* 16 — MINIGAME */
  { type: 'reaction', kicker: 'REACTION TEST ✷ no thinking allowed',
    q: `Something is coming. Click when you see it.`,
    options: [] },

  /* 17 — PSYCH (Dark Triad: Narcissism) */
  { type: 'classic', kicker: 'LEGACY ✷ be specific', q: `You want to be remembered as:`,
    options: [
      { label: `The biggest. The loudest. The one everyone points at when they explain it.`, w: { orks: 2 } },
      { label: `Unquestionable. The name invoked when the situation is hopeless.`, w: { sisters: 2 } },
      { label: `Devastating. The version they describe to people who weren't there.`, w: { drukhari: 2 } },
      { label: `Impossible to forget. Still there in the story they tell after you're gone.`, w: { harlequins: 2 } }
    ] },

  /* 18 — 40K LORE */
  { type: 'classic', kicker: 'WARP THEOLOGY ✷ there are no wrong answers (there are wrong answers)',
    q: `Four gods rule the Warp. One of them is your type. Which?`,
    options: [
      { img: 'assets/lore/khorne.jpg',   label: `KHORNE. Blood God. He wants one thing: the fight. Not politics, not schemes, not long-term planning. The roar of combat, the weight of a weapon, the honesty of a charge. His followers don't pray. They hit things. Hard not to respect it.`, w: { orks: 2 } },
      { img: 'assets/lore/tzeentch.jpg', label: `TZEENTCH. The Changer of Ways. Plans within plans within plans. He's already rewriting your fate three moves ahead of you. His followers can't tell if they're winning or being played. Sometimes neither can he. He finds this delightful. He was right to.`, w: { harlequins: 2 } },
      { img: 'assets/lore/slaanesh.jpg', label: `SLAANESH. The Dark Prince. Born from the Aeldari's excess and now hunts them forever. Every sensation pushed until it breaks. Perfect beauty. Perfect pain. Everything turned up more.`, w: { drukhari: 2 } },
      { img: 'assets/lore/nurgle.png',   label: `NURGLE. Plague Father. God of disease, rot, and inexplicably: joy. He loves all his children, unconditionally, forever, even as they fall apart. The warmest god in a cold galaxy. He also wants you to have a minor intestinal situation. The love is still real.`, w: { sisters: 2 } }
    ] },

  /* 19 — PSYCH (Attachment) */
  { type: 'classic', kicker: 'PSYCHOLOGICAL PROFILE ✷ no judgment', q: `The others have gone. You're the only one in the room. How long before that's a problem?`,
    options: [
      { label: `Immediately. You're already looking for the door.`, w: { orks: 2 } },
      { label: `You have the litanies. The Emperor is present. You're fine.`, w: { sisters: 2 } },
      { label: `Ideal, honestly. You do your best thinking here.`, w: { drukhari: 2 } },
      { label: `You prefer the troupe. But you were the one who built in the exit. You know where it is.`, w: { harlequins: 2 } }
    ] },

  /* 20 — 40K LORE */
  { type: 'classic', kicker: 'THE GOD-EMPEROR ✷ he is complicated',
    heroImg: 'assets/lore/emperor.jpg',
    q: `The Emperor of Mankind has sat on the Golden Throne for ten thousand years. Technically alive. Technically a god. Sustained by ten thousand souls a day. Possibly the most important being in the galaxy. Definitely a lot. How do you feel about him?`,
    options: [
      { label: `Absolute devotion. He gave everything for humanity and he's still giving. His light holds back the dark. We fight in his name because there's nothing higher and nothing else worth fighting for.`, w: { sisters: 2 } },
      { label: `Massive respect. He's the biggest boss the humans have got, held the whole thing together on pure stubbornness for ten thousand years. That's hard. You have to admire it.`, w: { orks: 2 } },
      { label: `A rotting corpse on a golden chair, kept alive by ten thousand sacrifices a day, worshipped by the species that failed to save him. The Mon-keigh built a whole religion around the moment they lost. It's a lot.`, w: { drukhari: 2 } },
      { label: `He walked the stars before your civilisation had writing. He made decisions that unmade worlds and he's still making them, from that throne, ten thousand years later. The story isn't finished. We're watching.`, w: { harlequins: 2 } }
    ] },

  /* 21 — CLASSIC */
  { type: 'classic', kicker: `LAST ONE ✷ make it count`, q: `A remembrancer is carving your epitaph. One line. What goes on the stone?`,
    options: [
      { label: `"She built something from scratch, made everyone welcome, and was loud the entire time."`, w: { orks: 2 } },
      { label: `"She kept the faith."`, w: { sisters: 2 } },
      { label: `"She had EXQUISITE taste. The rest was decorative."`, w: { drukhari: 2 } },
      { label: `"She made it a show. We're still talking about the ending."`, w: { harlequins: 2 } }
    ] }
];
