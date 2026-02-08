export function getRandomAvatar(): string {
  const avatarStyles =
    {
    "adventurer": {
      "url": "https://api.dicebear.com/9.x/adventurer/svg?seed=",
      "seeds": ["Patch", "Alex", "Doodle", "Glitch", "Orion", "Piper", "Morton", "Quill", "Jamie", "Hurricane"]
    },
    "adventurer-neutral": {
      "url": "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=",
      "seeds": ["Bone", "Chip", "Nala", "Bolt", "Juno", "Nico", "Yara", "Rune", "Phoenix", "Taylor"]
    },
    "avataaars": {
      "url": "https://api.dicebear.com/9.x/avataaars/svg?seed=",
      "seeds": ["Harley", "Morgan", "Aria", "Atlas", "Felix", "Sky", "Luna", "Ember", "Echo", "Jax"]
    },
    "avataaars-neutral": {
      "url": "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=",
      "seeds": ["Sasha", "Kai", "Cruz", "Yumi", "Max", "Sol", "Nova", "Zephyr", "Aurora", "Nico"]
    },
    "big-ears": {
      "url": "https://api.dicebear.com/9.x/big-ears/svg?seed=",
      "seeds": ["Bolt", "Yara", "Sora", "Kai", "Shadow", "Lola", "Zeus", "Orion", "Vega", "Pixel"]
    },
    "big-ears-neutral": {
      "url": "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=",
      "seeds": ["Maya", "River", "Hana", "Skyler", "Ren", "Milo", "Casey", "Ivy", "Zen", "Morgan"]
    },
    "big-smile": {
      "url": "https://api.dicebear.com/9.x/big-smile/svg?seed=",
      "seeds": ["Asher", "Ember", "Yumi", "Nala", "Ember", "Zara", "Haruto", "Sage", "Echo", "Morgan"]
    },
    "bottts": {
      "url": "https://api.dicebear.com/9.x/bottts/svg?seed=",
      "seeds": ["Botty", "Xeno", "Glitch", "Rusty", "Circuit", "Aero", "Spark", "Byte", "Comet", "Volt"]
    },
    "bottts-neutral": {
      "url": "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=",
      "seeds": ["Glitch", "Byte", "Rune", "Zephyr", "Quill", "Patch", "Astra", "Bolt", "Nimbus", "Jax"]
    },
    "croodles": {
      "url": "https://api.dicebear.com/9.x/croodles/svg?seed=",
      "seeds": ["Sketch", "Doodle", "Quill", "Aurora", "Zephyr", "Sage", "Zen", "Echo", "Art", "Pixel"]
    },
    "croodles-neutral": {
      "url": "https://api.dicebear.com/9.x/croodles-neutral/svg?seed=",
      "seeds": ["Zen", "Rune", "Mirage", "Sage", "Ivy", "Bolt", "Galaxy", "Nova", "Haruto", "Ember"]
    },
    "dylan": {
      "url": "https://api.dicebear.com/9.x/dylan/svg?seed=",
      "seeds": ["Melody", "Jazz", "Rhythm", "Blues", "Echo", "Jazz", "Funk", "Soul", "Echo", "Lyric"]
    },
    "fun-emoji": {
      "url": "https://api.dicebear.com/9.x/fun-emoji/svg?seed=",
      "seeds": ["Smile", "Joy", "Laugh", "Party", "Happy", "Wink", "Cool", "Star", "Heart", "Emoji"]
    },
    "glass": {
      "url": "https://api.dicebear.com/9.x/glass/svg?seed=",
      "seeds": ["Crystal", "Shiny", "Prism", "Aurora", "Glare", "Beam", "Prism", "Polar", "Zen", "Sparkle"]
    },
    "icons": {
      "url": "https://api.dicebear.com/9.x/icons/svg?seed=",
      "seeds": ["Glyph", "Vector", "Pixel", "Logos", "Iconic", "Glyph", "Mono", "Classic", "Glyph", "Retro"]
    },
    "identicon": {
      "url": "https://api.dicebear.com/9.x/identicon/svg?seed=",
      "seeds": ["gridlock", "mosaic", "spiro", "weave", "matrix", "maze", "orbit", "delta", "hex", "pixel"]
    },
    "initials": {
      "url": "https://api.dicebear.com/9.x/initials/svg?seed=",
      "seeds": ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"]
    },
    "lorelei": {
      "url": "https://api.dicebear.com/9.x/lorelei/svg?seed=",
      "seeds": ["Piper", "Maya", "Azul", "Kai", "Haruka", "Zara", "Luna", "Nova", "Kira", "Ember"]
    },
    "lorelei-neutral": {
      "url": "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=",
      "seeds": ["Kira", "Nova", "Ember", "Kai", "Luna", "Mara", "Zen", "Ivy", "Sky", "Zephyr"]
    },
    "micah": {
      "url": "https://api.dicebear.com/9.x/micah/svg?seed=",
      "seeds": ["Micah", "Sam", "Alex", "Jamie", "Jordan", "Taylor", "Morgan", "Chris", "Riley", "Drew"]
    },
    "miniavs": {
      "url": "https://api.dicebear.com/9.x/miniavs/svg?seed=",
      "seeds": ["Pixel", "Neo", "Glitch", "Patch", "Bolt", "Luna", "Mars", "Juno", "Echo", "Nova"]
    },
    "notionists": {
      "url": "https://api.dicebear.com/9.x/notionists/svg?seed=",
      "seeds": ["Lola", "Shadow", "Bandit", "Phoenix", "Echo", "Rune", "Celeste", "Quinn", "Orion", "Aria"]
    },
    "notionists-neutral": {
      "url": "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=",
      "seeds": ["Quinn", "Mirage", "Zen", "Blaze", "Luna", "Orion", "Ember", "Aria", "Zephyr", "Sage"]
    },
    "open-peeps": {
      "url": "https://api.dicebear.com/9.x/open-peeps/svg?seed=",
      "seeds": ["Pablo", "Maria", "Hiro", "Fatima", "Anika", "Luca", "Ravi", "Sofia", "Omar", "Jin"]
    },
    "personas": {
      "url": "https://api.dicebear.com/9.x/personas/svg?seed=",
      "seeds": ["Pablo", "Luna", "Mika", "Rosa", "Lars", "Noemi", "Ilhan", "Yuna", "Vlad", "Mei"]
    },
    "pixel-art": {
      "url": "https://api.dicebear.com/9.x/pixel-art/svg?seed=",
      "seeds": ["Pixel", "8bit", "NES", "Atari", "Nintendo", "GameBoy", "Arcade", "Mega", "Donkey", "Mario"]
    },
    "pixel-art-neutral": {
      "url": "https://api.dicebear.com/9.x/pixel-art-neutral/svg?seed=",
      "seeds": ["Pixel", "Mono", "NES", "Void", "Dot", "Null", "Bit", "Byte", "Mega", "Zen"]
    },
    "rings": {
      "url": "https://api.dicebear.com/9.x/rings/svg?seed=",
      "seeds": ["loop", "spiral", "circle", "vortex", "orbit", "halo", "ring", "cycle", "flux", "spiral"]
    },
    "shapes": {
      "url": "https://api.dicebear.com/9.x/shapes/svg?seed=",
      "seeds": ["polygon", "wave", "chevron", "stripe", "zigzag", "plasma", "mandala", "flare", "mosaic", "grid"]
    },
    "thumbs": {
      "url": "https://api.dicebear.com/9.x/thumbs/svg?seed=",
      "seeds": ["thumb", "pointer", "like", "click", "pixel", "bit", "grid", "monochrome", "iconic", "glyph"]
    },
    "toon-head": {
      "url": "https://api.dicebear.com/9.x/toon-head/svg?seed=",
      "seeds": ["Doodle", "Xeno", "Quill", "Hoshi", "Otis", "Jordan", "Ren", "Midori", "Glitch", "Sage"]
    }
  }
  const styles = Object.values(avatarStyles);
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomSeed = randomStyle.seeds[Math.floor(Math.random() * randomStyle.seeds.length)];
  return `${randomStyle.url}${encodeURIComponent(randomSeed)}`;
}

export const XBOX_AVATARS = [
  "👽",
  "👾",
  "🤖",
  "👻",
  "🤡",
  "👺",
  "👹",
  "👿",
  "💀",
  "😻",
  "😎",
  "🤓",
  "🤠",
  "🥳",
  "😇",
  "😈",
  "🦄",
  "🐲",
  "🦕",
  "🦖",
  "🐳",
  "🐬",
  "🐙",
  "🐵",
  "🐶",
  "🐺",
  "🦊",
  "🦝",
  "🦁",
  "🐯",
  "🐨",
];
