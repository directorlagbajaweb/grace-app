export const THEMES = [
  'despair',
  'loneliness',
  'fear',
  'shame',
  'gratitude',
  'weariness',
  'hope',
  'anger',
  'grief',
  'anxiety',
] as const;

export type Theme = (typeof THEMES)[number];

export type Scripture = {
  reference: string;
  text: string;
  themes: Theme[];
  // false = excluded from the Today screen rotation (reads oddly on its own)
  dailyVerse: boolean;
};

// World English Bible (WEB), public domain.
export const SCRIPTURES: Scripture[] = [
  {
    reference: 'Psalm 34:18',
    text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
    themes: ['despair', 'grief'],
    dailyVerse: true,
  },
  {
    reference: 'Psalm 42:11',
    text: 'Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God.',
    themes: ['despair', 'hope'],
    dailyVerse: true,
  },
  {
    reference: 'Psalm 23:4',
    text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.',
    themes: ['fear', 'grief'],
    dailyVerse: true,
  },
  {
    reference: 'Isaiah 41:10',
    text: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.',
    themes: ['fear', 'anxiety', 'loneliness'],
    dailyVerse: true,
  },
  {
    reference: 'Deuteronomy 31:8',
    text: 'Yahweh himself is who goes before you. He will be with you. He will not fail you nor forsake you. Don’t be afraid. Don’t be discouraged.',
    themes: ['loneliness', 'fear'],
    dailyVerse: true,
  },
  {
    reference: 'Psalm 68:6',
    text: 'God sets the lonely in families. He brings out the prisoners with singing, but the rebellious dwell in a sun-scorched land.',
    themes: ['loneliness'],
    dailyVerse: true,
  },
  {
    reference: 'Romans 8:1',
    text: 'There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.',
    themes: ['shame'],
    dailyVerse: true,
  },
  {
    reference: '1 John 1:9',
    text: 'If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.',
    themes: ['shame'],
    dailyVerse: true,
  },
  {
    reference: 'Psalm 34:5',
    text: 'They looked to him, and were radiant. Their faces shall never be covered with shame.',
    themes: ['shame', 'hope'],
    dailyVerse: true,
  },
  {
    reference: '1 Thessalonians 5:18',
    text: 'In everything give thanks, for this is the will of God in Christ Jesus toward you.',
    themes: ['gratitude'],
    dailyVerse: true,
  },
  {
    reference: 'Psalm 107:1',
    text: 'Give thanks to Yahweh, for he is good, for his loving kindness endures forever.',
    themes: ['gratitude'],
    dailyVerse: true,
  },
  {
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    themes: ['weariness'],
    dailyVerse: true,
  },
  {
    reference: 'Isaiah 40:31',
    text: 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
    themes: ['weariness', 'hope'],
    dailyVerse: true,
  },
  {
    reference: 'Romans 15:13',
    text: 'Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.',
    themes: ['hope'],
    dailyVerse: true,
  },
  {
    reference: 'Ephesians 4:26-27',
    text: '“Be angry, and don’t sin.” Don’t let the sun go down on your wrath, and don’t give place to the devil.',
    themes: ['anger'],
    dailyVerse: false,
  },
  {
    reference: 'James 1:19-20',
    text: 'So, then, my beloved brothers, let every man be swift to hear, slow to speak, and slow to anger; for the anger of man doesn’t produce the righteousness of God.',
    themes: ['anger'],
    dailyVerse: false,
  },
  {
    reference: 'Matthew 5:4',
    text: 'Blessed are those who mourn, for they shall be comforted.',
    themes: ['grief'],
    dailyVerse: true,
  },
  {
    reference: 'Revelation 21:4',
    text: 'He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.',
    themes: ['grief', 'hope'],
    dailyVerse: true,
  },
  {
    reference: 'Philippians 4:6',
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
    themes: ['anxiety', 'gratitude'],
    dailyVerse: true,
  },
  {
    reference: '1 Peter 5:7',
    text: 'casting all your worries on him, because he cares for you.',
    themes: ['anxiety'],
    dailyVerse: false,
  },
];
