DROP JAIME'S PHOTOS IN THIS FOLDER
==================================

Name each file after the faction it should appear on, as a .jpg (or .png/.gif/.webp —
just match the extension in js/data.js if you don't use .jpg). The photo shows up
automatically on that faction's result screen. No photo yet = a placeholder box shows.

  FILENAME            FACTION                    FRAME STYLE (set in data.js)
  ----------------    -----------------------    ---------------------------
  orks.jpg            The Orks                   troll  (cursed/MS-Paint vibe)
  gsc.jpg             Genestealer Cults          sweet  (nice frame)
  sisters.jpg         Sisters of Battle          troll
  drukhari.jpg        The Drukhari               troll
  aeldari.jpg         The Aeldari                sweet
  necrons.jpg         The Necrons                troll
  deathguard.jpg      The Death Guard            sweet
  thousandsons.jpg    The Thousand Sons          sweet
  tau.jpg             The T'au Empire            sweet
  nids.jpg            The Tyranids               troll

TIPS
- Roughly square-ish crops look best (they're shown ~300px wide, centered).
- "troll" frames are the ridged magenta ones meant for crude composites / goofy shots;
  "sweet" frames are the gold double-border ones for nicer photos. You can flip any
  faction's style by editing its  photoStyle: 'troll' | 'sweet'  in js/data.js.
- Want a photo that's pre-composited (her face in a helmet, etc.)? Just save the
  finished image as the filename above — the frame + caption do the rest.
- You do NOT need photos to test the site. Placeholders show exactly where they'll land.
