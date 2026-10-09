export interface Poet {
  slug: string;
  name: string;
  ar?: string;
  years: string;
  place: string;
  tag: string;
  img: string;
  pos: string;
  bio: string[];
  works: string[];
  themes: string[];
  sayings?: string[];
}

export interface Poem {
  slug: string;
  title: string;
  poet: string;
  img: string;
  pos: string;
  shape: "arch" | "oval" | "rect";
  frame: "gilt" | "carved" | "none";
  orig: boolean;
  tags: string[];
  plate: string;
  about: string;
  text: string;
}

export const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export const POETS: Poet[] = [
{slug:'mahmoud-darwish',name:'Mahmoud Darwish',ar:'محمود درويش',years:'1941 – 2008',place:'al-Birwa, Galilee',tag:'The poet of homeland, exile and memory',img:'i5',pos:'70% 40%',
 bio:['Mahmoud Darwish was born in 1941 in the village of al-Birwa in Galilee. In 1948 his family fled across the border; when they returned in secret, their village had been destroyed. That double wound, of leaving and of finding nothing to return to, runs under almost everything he wrote.','Writing in Arabic, he became widely regarded as Palestine\'s national poet. His early poem &ldquo;Identity Card&rdquo; (1964) made him famous across the Arab world. He lived in Beirut, Paris, Tunis and Ramallah, and his later books turned from slogan to a quieter, more musical voice in which love, myth and loss share a single line.','He died in Houston on 9 August 2008. His funeral in Ramallah drew crowds of mourners.'],
 works:['Memory for Forgetfulness (prose, 1982)','Why Did You Leave the Horse Alone? (1995)','Mural (2000)','State of Siege (2002)'],
 themes:['Homeland','Exile','Memory','Love','Identity'],
 sayings:['A homeland is what we carry when everything else has been counted.','The road is longer than the map, and kinder.','Memory is the only country that cannot be crossed out.','Say your name to the olive tree before you say it to the world.']},
{slug:'emily-dickinson',name:'Emily Dickinson',years:'1830 – 1886',place:'Amherst, Massachusetts',tag:'The recluse who kept the whole sky in a room',img:'i6',pos:'center',
 bio:['Emily Dickinson spent almost her entire life in Amherst, Massachusetts, much of it in her family\'s house, writing in near-secret. She left nearly 1,800 poems, of which only a handful appeared in print during her lifetime.','Her poems are short, hymn-like and strange: dashes for breath, capital letters for emphasis, and a gaze that turns a bird, a fly or a Tuesday into a question about death and eternity.'],
 works:['Poems (first published 1890, after her death)'],themes:['Hope','Death','Nature','Solitude']},
{slug:'william-shakespeare',name:'William Shakespeare',years:'1564 – 1616',place:'Stratford-upon-Avon',tag:'Playwright, and author of 154 sonnets',img:'i2',pos:'center',
 bio:['William Shakespeare is best known for his plays, but the 154 sonnets published in 1609 are some of the most compressed love poetry in English. Fourteen lines, a turn near the end, and a final couplet that locks the thought shut.','Sonnet 18 is the one most people can half-recite: a comparison that begins as flattery and ends as a promise that verse can outlast a summer, and a life.'],
 works:['Sonnets (1609)'],themes:['Love','Time','Beauty','Immortality']},
{slug:'william-blake',name:'William Blake',years:'1757 – 1827',place:'London',tag:'Engraver, visionary, poet of innocence and experience',img:'i4',pos:'center 30%',
 bio:['William Blake was a London engraver who printed his own illuminated books, writing, drawing and colouring each page by hand. He saw visions from childhood and mostly went unrecognised in his lifetime.','Songs of Innocence and of Experience (1794) sets two states of the soul side by side. &ldquo;The Sick Rose&rdquo;, only eight lines long, belongs to Experience: a whole drama of beauty, secrecy and harm.'],
 works:['Songs of Innocence and of Experience (1794)'],themes:['Love','Secrecy','Experience','Nature']}
];

export const POEMS: Poem[] = [
{slug:'night-on-the-terrace',title:'Night on the Terrace',poet:'mahmoud-darwish',img:'i1',pos:'center 30%',shape:'arch',frame:'gilt',orig:true,tags:['Love','Night'],
 plate:'Moon, roses and two shadows',
 about:'An original poem written for this site in the spirit of Darwish\'s love poetry, where tenderness always sits beside the knowledge of departure.',
 text:`The moon leans on the garden wall
like a guest who has forgotten the hour.
Below, the roses lose their gold to dark
and two shadows decide to be one shadow.

You say the stars are very far.
I say: let them be far; they have no hands.
Here is a shoulder, here is a cloak of silver thread,
here is the whole of what the night can promise.

Tomorrow the road will want its feet again,
the map its borders, the clock its argument.
But tonight the petals fall without a passport,
and every door in us stands open to the sky.`},
{slug:'the-man-who-walks-away-from-the-sea',title:'The Man Who Walks Away From the Sea',poet:'mahmoud-darwish',img:'i5',pos:'center',shape:'oval',frame:'gilt',orig:true,tags:['Exile','Memory'],
 plate:'A coat the colour of old soil',
 about:'An original poem on exile, written for this site in the spirit of Darwish\'s themes of the key, the house and the sentence left unfinished.',
 text:`He turns his collar up against a country of wind.
The gulls insist on staying; they have learned
that a coast is only a long goodbye.

Behind him, a house keeps its lamp in the memory of a window.
Before him, a street that has not been told his name.
He carries a key that opens nothing now
but still opens everything when he holds it.

Ask him where he is from. He will point
at the salt in his hair, the red of the old soil on his coat,
the sentence he has not finished saying to the shore.

Exile is not a place, he thinks. It is a verb
that learns to conjugate in every language of rain,
and the gulls, who owe no one a border, circle once
and give him back the sky.`},
{slug:'dreaming-a-country-the-size-of-the-moon',title:'Dreaming a Country the Size of the Moon',poet:'mahmoud-darwish',img:'i3',pos:'center 35%',shape:'arch',frame:'gilt',orig:true,tags:['Homeland','Dreams'],
 plate:'The painter asleep on his map',
 about:'An original poem written for this site in the spirit of Darwish, for whom a homeland could survive as a drawing, a name, a field remembered stone by stone.',
 text:`In the studio of sleep I paint a country
no larger than a moon, and hang it where the ceiling forgets.
Its rivers are pale chalk, its borders brushstrokes
that wash away when the morning asks questions.

My cheek rests on the map. The brushes keep watch.
Somewhere a village is learning the names of its own stones,
and a child is counting stars the way others count change.

Wake me gently, hour of the ordinary.
Let me finish the last field, the last olive,
before the world rubs its eyes
and calls my homeland a dream.`},
{slug:'hope-is-the-thing-with-feathers',title:'&ldquo;Hope&rdquo; is the thing with feathers',poet:'emily-dickinson',img:'i6',pos:'center',shape:'rect',frame:'none',orig:false,tags:['Hope','Nature'],
 plate:'A dark bird, a patient hand',
 about:'One of Dickinson\'s best-loved poems: three stanzas that turn an abstraction into a small bird that asks for nothing. Text from the 1891 printing\'s tradition; her original punctuation is kept.',
 text:`&ldquo;Hope&rdquo; is the thing with feathers &mdash;
That perches in the soul &mdash;
And sings the tune without the words &mdash;
And never stops &mdash; at all &mdash;

And sweetest &mdash; in the Gale &mdash; is heard &mdash;
And sore must be the storm &mdash;
That could abash the little Bird
That kept so many warm &mdash;

I&rsquo;ve heard it in the chillest land &mdash;
And on the strangest Sea &mdash;
Yet &mdash; never &mdash; in Extremity,
It asked a crumb &mdash; of me.`},
{slug:'sonnet-18',title:'Sonnet 18',poet:'william-shakespeare',img:'i2',pos:'center',shape:'rect',frame:'carved',orig:false,tags:['Love','Summer'],
 plate:'A lake in late summer light',
 about:'The most famous of the sonnets. The first eight lines argue that summer is the lesser thing; the last six promise that the poem itself will keep the beloved alive.',
 text:`Shall I compare thee to a summer&rsquo;s day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer&rsquo;s lease hath all too short a date;
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm&rsquo;d;
And every fair from fair sometime declines,
By chance or nature&rsquo;s changing course untrimm&rsquo;d;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow&rsquo;st;
Nor shall death brag thou wander&rsquo;st in his shade,
When in eternal lines to time thou grow&rsquo;st:
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.`},
{slug:'the-sick-rose',title:'The Sick Rose',poet:'william-blake',img:'i4',pos:'center 30%',shape:'oval',frame:'gilt',orig:false,tags:['Love','Secrecy'],
 plate:'A woman against the storm',
 about:'From Songs of Experience (1794). Eight lines, one rose, one worm: readers have found in it disease, desire, jealousy and the harm done by secret love.',
 text:`O Rose, thou art sick!
The invisible worm
That flies in the night,
In the howling storm,

Has found out thy bed
Of crimson joy,
And his dark secret love
Does thy life destroy.`}
];

export function getPoet(slug: string): Poet | undefined {
  return POETS.find((p) => p.slug === slug);
}

export function getPoem(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function stripTags(str: string): string {
  return str.replace(/&[a-z]+;/g, " ").replace(/<[^>]+>/g, "");
}
