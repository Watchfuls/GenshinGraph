import releaseDates from './character-release-dates.json';

export const names = `Aino|Albedo|Alhaitham|Aloy|Alyosha|Amber|Anemo Traveler|Arataki Itto|Arlecchino|Baizhu|Barbara|Beidou|Bennett|Candace|Charlotte|Chasca|Chevreuse|Chiori|Chongyun|Citlali|Clorinde|Collei|Columbina|Cryo Traveler|Cyno|Dahlia|Dehya|Dendro Traveler|Diluc|Diona|Dori|Durin|Electro Traveler|Emilie|Escoffier|Eula|Faruzan|Fischl|Flins|Freminet|Furina|Gaming|Ganyu|Geo Traveler|Gorou|Hu Tao|Hydro Traveler|Iansan|Ifa|Illuga|Ineffa|Jahoda|Jean|Kachina|Kaedehara Kazuha|Kaeya|Kamisato Ayaka|Kamisato Ayato|Kaveh|Keqing|Kinich|Kirara|Klee|Kujou Sara|Kuki Shinobu|Lan Yan|Lauma|Layla|Linnea|Lisa|Lohen|Lumine|Lynette|Lyney|Mavuika|Mika|Mitya|Mona|Mualani|Nahida|Navia|Nefer|Neuvillette|Nicole|Nilou|Ningguang|Noelle|Odette|Ororon|Prune|Pyro Traveler|Qiqi|Raiden Shogun|Razor|Rosaria|Sandrone|Sangonomiya Kokomi|Sayu|Sethos|Shenhe|Shikanoin Heizou|Sigewinne|Skirk|Sucrose|Tartaglia|Thoma|Tighnari|Valeriy|Varesa|Varka|Venti|Vesna|Vodyanitsa|Wanderer|Wriothesley|Xiangling|Xianyun|Xiao|Xilonen|Xingqiu|Xinyan|Yae Miko|Yanfei|Yaoyao|Yelan|Yoimiya|Yumemizuki Mizuki|Yun Jin|Zhongli|Zibai`.split('|').sort();

export const elements = ['Anemo', 'Cryo', 'Dendro', 'Electro', 'Geo', 'Hydro', 'Pyro'] as const;
export type Element = typeof elements[number];
export const weapons = ['Bow', 'Catalyst', 'Claymore', 'Polearm', 'Sword'] as const;
export type Weapon = typeof weapons[number];
type CharacterMetadata = { element: Element; rarity: 4 | 5; weapon: Weapon };

const metadataEntries: [string, CharacterMetadata][] = [
  ['Jahoda', { element: 'Anemo', rarity: 4, weapon: 'Bow' }],
  ['Illuga', { element: 'Geo', rarity: 4, weapon: 'Polearm' }],
  ['Alyosha', { element: 'Electro', rarity: 4, weapon: 'Polearm' }],
  ['Aino', { element: 'Hydro', rarity: 4, weapon: 'Claymore' }],
  ['Albedo', { element: 'Geo', rarity: 5, weapon: 'Sword' }],
  ['Alhaitham', { element: 'Dendro', rarity: 5, weapon: 'Sword' }],
  ['Aloy', { element: 'Cryo', rarity: 5, weapon: 'Bow' }],
  ['Amber', { element: 'Pyro', rarity: 4, weapon: 'Bow' }],
  ['Arataki Itto', { element: 'Geo', rarity: 5, weapon: 'Claymore' }],
  ['Arlecchino', { element: 'Pyro', rarity: 5, weapon: 'Polearm' }],
  ['Baizhu', { element: 'Dendro', rarity: 5, weapon: 'Catalyst' }],
  ['Barbara', { element: 'Hydro', rarity: 4, weapon: 'Catalyst' }],
  ['Beidou', { element: 'Electro', rarity: 4, weapon: 'Claymore' }],
  ['Bennett', { element: 'Pyro', rarity: 4, weapon: 'Sword' }],
  ['Candace', { element: 'Hydro', rarity: 4, weapon: 'Polearm' }],
  ['Charlotte', { element: 'Cryo', rarity: 4, weapon: 'Catalyst' }],
  ['Chasca', { element: 'Anemo', rarity: 5, weapon: 'Bow' }],
  ['Chevreuse', { element: 'Pyro', rarity: 4, weapon: 'Polearm' }],
  ['Chiori', { element: 'Geo', rarity: 5, weapon: 'Sword' }],
  ['Chongyun', { element: 'Cryo', rarity: 4, weapon: 'Claymore' }],
  ['Citlali', { element: 'Cryo', rarity: 5, weapon: 'Catalyst' }],
  ['Clorinde', { element: 'Electro', rarity: 5, weapon: 'Sword' }],
  ['Collei', { element: 'Dendro', rarity: 4, weapon: 'Bow' }],
  ['Columbina', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Cyno', { element: 'Electro', rarity: 5, weapon: 'Polearm' }],
  ['Dahlia', { element: 'Hydro', rarity: 4, weapon: 'Sword' }],
  ['Dehya', { element: 'Pyro', rarity: 5, weapon: 'Claymore' }],
  ['Diluc', { element: 'Pyro', rarity: 5, weapon: 'Claymore' }],
  ['Diona', { element: 'Cryo', rarity: 4, weapon: 'Bow' }],
  ['Dori', { element: 'Electro', rarity: 4, weapon: 'Claymore' }],
  ['Durin', { element: 'Pyro', rarity: 5, weapon: 'Sword' }],
  ['Emilie', { element: 'Dendro', rarity: 5, weapon: 'Polearm' }],
  ['Escoffier', { element: 'Cryo', rarity: 5, weapon: 'Polearm' }],
  ['Eula', { element: 'Cryo', rarity: 5, weapon: 'Claymore' }],
  ['Faruzan', { element: 'Anemo', rarity: 4, weapon: 'Bow' }],
  ['Fischl', { element: 'Electro', rarity: 4, weapon: 'Bow' }],
  ['Flins', { element: 'Electro', rarity: 5, weapon: 'Polearm' }],
  ['Freminet', { element: 'Cryo', rarity: 4, weapon: 'Claymore' }],
  ['Furina', { element: 'Hydro', rarity: 5, weapon: 'Sword' }],
  ['Gaming', { element: 'Pyro', rarity: 4, weapon: 'Claymore' }],
  ['Ganyu', { element: 'Cryo', rarity: 5, weapon: 'Bow' }],
  ['Gorou', { element: 'Geo', rarity: 4, weapon: 'Bow' }],
  ['Hu Tao', { element: 'Pyro', rarity: 5, weapon: 'Polearm' }],
  ['Iansan', { element: 'Electro', rarity: 4, weapon: 'Polearm' }],
  ['Ifa', { element: 'Anemo', rarity: 4, weapon: 'Catalyst' }],
  ['Ineffa', { element: 'Electro', rarity: 5, weapon: 'Polearm' }],
  ['Jean', { element: 'Anemo', rarity: 5, weapon: 'Sword' }],
  ['Kachina', { element: 'Geo', rarity: 4, weapon: 'Polearm' }],
  ['Kaedehara Kazuha', { element: 'Anemo', rarity: 5, weapon: 'Sword' }],
  ['Kaeya', { element: 'Cryo', rarity: 4, weapon: 'Sword' }],
  ['Kamisato Ayaka', { element: 'Cryo', rarity: 5, weapon: 'Sword' }],
  ['Kamisato Ayato', { element: 'Hydro', rarity: 5, weapon: 'Sword' }],
  ['Kaveh', { element: 'Dendro', rarity: 4, weapon: 'Claymore' }],
  ['Keqing', { element: 'Electro', rarity: 5, weapon: 'Sword' }],
  ['Kinich', { element: 'Dendro', rarity: 5, weapon: 'Claymore' }],
  ['Kirara', { element: 'Dendro', rarity: 4, weapon: 'Sword' }],
  ['Klee', { element: 'Pyro', rarity: 5, weapon: 'Catalyst' }],
  ['Kujou Sara', { element: 'Electro', rarity: 4, weapon: 'Bow' }],
  ['Kuki Shinobu', { element: 'Electro', rarity: 4, weapon: 'Sword' }],
  ['Lan Yan', { element: 'Anemo', rarity: 4, weapon: 'Catalyst' }],
  ['Lauma', { element: 'Dendro', rarity: 5, weapon: 'Catalyst' }],
  ['Layla', { element: 'Cryo', rarity: 4, weapon: 'Sword' }],
  ['Linnea', { element: 'Geo', rarity: 5, weapon: 'Bow' }],
  ['Lisa', { element: 'Electro', rarity: 4, weapon: 'Catalyst' }],
  ['Lohen', { element: 'Cryo', rarity: 5, weapon: 'Polearm' }],
  ['Lumine', { element: 'Anemo', rarity: 5, weapon: 'Sword' }],
  ['Lynette', { element: 'Anemo', rarity: 4, weapon: 'Sword' }],
  ['Lyney', { element: 'Pyro', rarity: 5, weapon: 'Bow' }],
  ['Mavuika', { element: 'Pyro', rarity: 5, weapon: 'Claymore' }],
  ['Mika', { element: 'Cryo', rarity: 4, weapon: 'Polearm' }],
  ['Mona', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Mualani', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Nahida', { element: 'Dendro', rarity: 5, weapon: 'Catalyst' }],
  ['Navia', { element: 'Geo', rarity: 5, weapon: 'Claymore' }],
  ['Nefer', { element: 'Dendro', rarity: 5, weapon: 'Catalyst' }],
  ['Neuvillette', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Nicole', { element: 'Pyro', rarity: 5, weapon: 'Catalyst' }],
  ['Nilou', { element: 'Hydro', rarity: 5, weapon: 'Sword' }],
  ['Ningguang', { element: 'Geo', rarity: 4, weapon: 'Catalyst' }],
  ['Noelle', { element: 'Geo', rarity: 4, weapon: 'Claymore' }],
  ['Odette', { element: 'Cryo', rarity: 5, weapon: 'Sword' }],
  ['Ororon', { element: 'Electro', rarity: 4, weapon: 'Bow' }],
  ['Prune', { element: 'Anemo', rarity: 4, weapon: 'Catalyst' }],
  ['Qiqi', { element: 'Cryo', rarity: 5, weapon: 'Sword' }],
  ['Raiden Shogun', { element: 'Electro', rarity: 5, weapon: 'Polearm' }],
  ['Razor', { element: 'Electro', rarity: 4, weapon: 'Claymore' }],
  ['Rosaria', { element: 'Cryo', rarity: 4, weapon: 'Polearm' }],
  ['Sandrone', { element: 'Cryo', rarity: 5, weapon: 'Claymore' }],
  ['Sangonomiya Kokomi', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Sayu', { element: 'Anemo', rarity: 4, weapon: 'Claymore' }],
  ['Sethos', { element: 'Electro', rarity: 4, weapon: 'Bow' }],
  ['Shenhe', { element: 'Cryo', rarity: 5, weapon: 'Polearm' }],
  ['Shikanoin Heizou', { element: 'Anemo', rarity: 4, weapon: 'Catalyst' }],
  ['Sigewinne', { element: 'Hydro', rarity: 5, weapon: 'Bow' }],
  ['Skirk', { element: 'Cryo', rarity: 5, weapon: 'Sword' }],
  ['Sucrose', { element: 'Anemo', rarity: 4, weapon: 'Catalyst' }],
  ['Tartaglia', { element: 'Hydro', rarity: 5, weapon: 'Bow' }],
  ['Thoma', { element: 'Pyro', rarity: 4, weapon: 'Polearm' }],
  ['Tighnari', { element: 'Dendro', rarity: 5, weapon: 'Bow' }],
  ['Varesa', { element: 'Electro', rarity: 5, weapon: 'Catalyst' }],
  ['Varka', { element: 'Anemo', rarity: 5, weapon: 'Claymore' }],
  ['Venti', { element: 'Anemo', rarity: 5, weapon: 'Bow' }],
  ['Vesna', { element: 'Anemo', rarity: 5, weapon: 'Sword' }],
  ['Vodyanitsa', { element: 'Hydro', rarity: 5, weapon: 'Catalyst' }],
  ['Wanderer', { element: 'Anemo', rarity: 5, weapon: 'Catalyst' }],
  ['Wriothesley', { element: 'Cryo', rarity: 5, weapon: 'Catalyst' }],
  ['Xiangling', { element: 'Pyro', rarity: 4, weapon: 'Polearm' }],
  ['Xianyun', { element: 'Anemo', rarity: 5, weapon: 'Catalyst' }],
  ['Xiao', { element: 'Anemo', rarity: 5, weapon: 'Polearm' }],
  ['Xilonen', { element: 'Geo', rarity: 5, weapon: 'Sword' }],
  ['Xingqiu', { element: 'Hydro', rarity: 4, weapon: 'Sword' }],
  ['Xinyan', { element: 'Pyro', rarity: 4, weapon: 'Claymore' }],
  ['Yae Miko', { element: 'Electro', rarity: 5, weapon: 'Catalyst' }],
  ['Yanfei', { element: 'Pyro', rarity: 4, weapon: 'Catalyst' }],
  ['Yaoyao', { element: 'Dendro', rarity: 4, weapon: 'Polearm' }],
  ['Yelan', { element: 'Hydro', rarity: 5, weapon: 'Bow' }],
  ['Yoimiya', { element: 'Pyro', rarity: 5, weapon: 'Bow' }],
  ['Yumemizuki Mizuki', { element: 'Anemo', rarity: 5, weapon: 'Catalyst' }],
  ['Yun Jin', { element: 'Geo', rarity: 4, weapon: 'Polearm' }],
  ['Zhongli', { element: 'Geo', rarity: 5, weapon: 'Polearm' }],
  ['Zibai', { element: 'Geo', rarity: 5, weapon: 'Sword' }],
  ['Anemo Traveler', { element: 'Anemo', rarity: 5, weapon: 'Sword' }],
  ['Geo Traveler', { element: 'Geo', rarity: 5, weapon: 'Sword' }],
  ['Electro Traveler', { element: 'Electro', rarity: 5, weapon: 'Sword' }],
  ['Dendro Traveler', { element: 'Dendro', rarity: 5, weapon: 'Sword' }],
  ['Hydro Traveler', { element: 'Hydro', rarity: 5, weapon: 'Sword' }],
  ['Pyro Traveler', { element: 'Pyro', rarity: 5, weapon: 'Sword' }],
  ['Cryo Traveler', { element: 'Cryo', rarity: 5, weapon: 'Sword' }],
  ["Mitya", { element: 'Electro', rarity: 5, weapon: 'Catalyst' }],
  ["Valeriy", { element: 'Electro', rarity: 4, weapon: 'Sword' }],
];

const metadataByName = Object.fromEntries(metadataEntries);
export const characters = names.map(name => {
  const metadata = metadataByName[name];
  if (!metadata) throw new Error(`Missing filter metadata for character: ${name}`);
  return { name, ...metadata };
});

export function imageFilename(name: string): string {
  if (name.endsWith(" Traveler")) {
    const element = name.split(" ")[0];
    return `${element}Traveler_Icon.png`;
  }

  return `${name.replace(/ /g, "_")}_Icon.webp`;
}

export const sortOptions = [
  {value:'name',label:'Name (A–Z)'},
  {value:'release-oldest',label:'Release (oldest first)'},
  {value:'release-newest',label:'Release (newest first)'},
  {value:'game',label:'In-game order'},
] as const;
export type CharacterSort = typeof sortOptions[number]['value'];
// Matches the planner at equal character levels: rarity, element, newest release.
const gameElements:Element[]=['Geo','Electro','Hydro','Cryo','Anemo','Dendro','Pyro'];
export function sortedCharacterNames(sort:CharacterSort):string[] {
  const date=(name:string)=>releaseDates[name as keyof typeof releaseDates];
  const release=(a:string,b:string,newest:boolean)=>{
    const left=date(a),right=date(b);
    if(!left||!right)return left?-1:right?1:0;
    return newest?right.localeCompare(left):left.localeCompare(right);
  };
  return [...characters].sort((a,b)=>{
    if(sort==='game')return b.rarity-a.rarity||gameElements.indexOf(a.element)-gameElements.indexOf(b.element)||release(a.name,b.name,true)||a.name.localeCompare(b.name);
    if(sort==='name')return a.name.localeCompare(b.name);
    return release(a.name,b.name,sort==='release-newest')||a.name.localeCompare(b.name);
  }).map(character=>character.name);
}
