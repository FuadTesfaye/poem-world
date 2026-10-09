import React from "react";

interface LandingProps {
  hidden?: boolean;
}

export default function Landing({ hidden = false }: LandingProps) {
  if (hidden) return null;

  return (
    <div id="landing">
      <nav className="sc grid w-full grid-cols-2 gap-y-2 px-[4vw] pt-5 text-center text-[clamp(.75rem,1.1vw,1.1rem)] md:flex md:items-center md:justify-between">
        <a href="#philosophy">Our Philosophy</a>
        <a href="#expositions">Expositions</a>
        <a href="#interactive">Features</a>
        <a href="#immerse">Immerse</a>
        <a href="#/art" className="text-ember font-medium hover:underline">
          Art Gallery &rarr;
        </a>
        <a href="#/poems" className="col-span-2 text-ember md:col-span-1">
          Diwan &rarr;
        </a>
      </nav>

      <header className="relative w-full px-[4vw] pt-8 text-center">
        <p className="absolute left-[4vw] top-[12vw] z-20 hidden w-[15vw] text-left italic md:block">
          A slow retreat for the senses. Where verse is carved in gold and nature speaks in silence.
        </p>
        <p className="absolute right-[4vw] top-[12vw] z-20 hidden w-[15vw] text-left italic md:block">
          An invitation to pause, breathe, and rediscover what words were meant to do.
        </p>
        <div className="rise mx-auto w-[92vw] md:w-[66vw]">
          <div className="framed">
            <div className="win">
              <div className="pic" data-zoom></div>
            </div>
            <div className="fr"></div>
          </div>
        </div>
        <img
          data-speed="-.07"
          src="/images/cutout-header.webp"
          alt=""
          className="cut absolute left-[-2vw] top-[26vw] z-20 w-[40vw] md:top-[30vw] md:w-[34vw]"
        />
        <h1 className="ttl ink relative z-30 -mt-[.5em] text-[clamp(3.4rem,16vw,22rem)]">
          <i>A</i>rt-<i>N</i>ature
        </h1>
        <div className="orn mx-auto mt-[3vw] max-w-[72vw]">
          <span className="text-[clamp(.95rem,2.2vw,2.4rem)]">
            &#10059; A Sanctuary of Verse &#10059;
          </span>
        </div>
        <p className="mx-auto mt-6 max-w-sm italic md:hidden">
          Welcome to a house of verse, where classical poetry meets the quiet of landscape.
        </p>
        <a href="#/poems" className="btn mt-8">
          Read Poems
        </a>
      </header>

      <section id="expositions" className="relative mt-[9vw] w-full px-[4vw] pb-[6vw]">
        <img
          data-speed="-.06"
          src="/images/cutout-exposition-1.webp"
          alt=""
          className="cut absolute -left-6 top-[8vw] w-[44vw] md:left-[2vw] md:w-[33vw]"
        />
        <img
          data-speed=".05"
          src="/images/cutout-exposition-2.webp"
          alt="A knight in armour lifting a woman in a white gown, holding a bouquet"
          className="cut absolute -right-4 bottom-2 w-[30vw] md:right-[3vw] md:w-[21vw]"
        />
        <h2 className="ttl text-right text-[clamp(3rem,13vw,17rem)]">
          <i>E</i>xpositions
        </h2>
        <ol className="relative mt-8 space-y-[4vw] pl-[36vw] md:pl-[44%]">
          <li>
            <h3 className="font-serif text-[clamp(1.1rem,2vw,2.4rem)] uppercase tracking-wide">
              I. Landscape &amp; Spirit
            </h3>
            <p className="mt-2 max-w-md italic">
              How mountains, rivers and orchards have held human longing since the dawn of the written line.
            </p>
          </li>
          <li className="md:ml-[6vw]">
            <h3 className="font-serif text-[clamp(1.1rem,2vw,2.4rem)] uppercase tracking-wide">
              II. The Gilded Hour
            </h3>
            <p className="mt-2 max-w-md italic">
              A curation of illuminated verse celebrating the quiet beauty of late light and early thought.
            </p>
          </li>
          <li className="md:ml-[12vw]">
            <h3 className="font-serif text-[clamp(1.1rem,2vw,2.4rem)] uppercase tracking-wide">
              III. Voices of Solitude
            </h3>
            <p className="mt-2 max-w-md italic">
              From hermit songs to the intimate lyrics of the parlour, words born from quiet places.
            </p>
          </li>
        </ol>
      </section>

      <section
        id="philosophy"
        className="grid w-full items-center gap-10 px-[4vw] py-[6vw] md:grid-cols-[1.25fr_1fr]"
      >
        <figure className="md:-ml-[3vw]">
          <div className="framed">
            <div className="win">
              <div
                className="pic"
                style={{ backgroundPosition: "center 62%" }}
                data-zoom
              ></div>
            </div>
            <div className="fr"></div>
          </div>
          <figcaption className="plate">Figure 1. &mdash; The evening contemplation</figcaption>
        </figure>
        <div>
          <p className="max-w-[24vw] min-w-[14rem] font-serif text-[clamp(1rem,1.6vw,2rem)] uppercase tracking-wider text-ember">
            A quiet sanctuary for classical verse and timeless beauty
          </p>
          <h2 className="ttl mt-4 text-[clamp(3rem,10vw,13rem)]">
            <i>O</i>ur <i>P</i>hilosophy
          </h2>
          <div className="mt-8 max-w-[30vw] min-w-[16rem] space-y-4">
            <p className="drop">
              Poetry is beautiful because it asks us to slow down. A single image can hold what a hundred ordinary sentences cannot: a bird in a storm, a rose visited in secret, a country carried only in the pocket of memory.
            </p>
            <p>
              It gives sorrow a shape and joy a rhythm, and lets strangers across centuries speak directly to each other without needing to meet.
            </p>
            <p className="ml-8 italic">
              Welcome to a place where every poem is a small masterpiece, illuminated like an antique manuscript.
            </p>
          </div>
          <a href="#/poems" className="btn mt-8">
            Read the Poems &rarr;
          </a>
        </div>
      </section>

      <section id="interactive" className="relative w-full px-[4vw] py-[6vw]">
        <h2 className="ttl text-center text-[clamp(3rem,12vw,16rem)] md:text-right">
          <i>F</i>eatures
        </h2>
        <div className="mt-8 grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
          <figure className="md:-ml-[3vw]">
            <div className="framed">
              <div className="win">
                <div
                  className="pic"
                  style={{ backgroundPosition: "center 30%" }}
                  data-zoom
                ></div>
              </div>
              <div className="fr"></div>
            </div>
            <figcaption className="plate">Figure 2. &mdash; The gilded archives</figcaption>
          </figure>
          <div className="space-y-10">
            <div>
              <h3 className="font-serif text-[clamp(1.1rem,2vw,2.4rem)] uppercase tracking-wide">
                The Diwan Collection
              </h3>
              <p className="mt-2 max-w-md italic">
                Enter our interactive archive of classical verse. Explore poems by Shakespeare, Dickinson, Blake, and Mahmoud Darwish, each presented with illuminated borders.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-[clamp(1.1rem,2vw,2.4rem)] uppercase tracking-wide">
                Search &amp; Filter
              </h3>
              <p className="mt-2 max-w-md italic">
                Filter by poet, theme, or keyword. Whether seeking verses on hope, love, exile, or mortality, the collection responds instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="orn mx-auto max-w-[80vw] px-[4vw]">
        <span className="text-[clamp(.9rem,1.8vw,2rem)]">&#10086; &middot; &#10086; &middot; &#10086;</span>
      </div>

      <section id="immerse" className="relative w-full px-[4vw] pb-8 pt-[6vw]">
        <div className="framed mx-auto">
          <div className="fr" style={{ zIndex: 2 }}></div>
          <div
            className="win flex items-center justify-center text-center"
            style={{ background: "#5c2409" }}
          >
            <div
              className="pic"
              style={{ opacity: 0.2, filter: "sepia(1) contrast(.9)" }}
            ></div>
            <div className="relative z-[1] px-[4vw]">
              <h2
                className="ttl text-[clamp(1.5rem,6.2vw,8rem)]"
                style={{ color: "#ecd9ab" }}
              >
                <i>I</i>mmerse yourself
              </h2>
              <p
                className="mx-auto mt-[2vw] hidden max-w-[40vw] text-[clamp(1rem,1.7vw,2rem)] md:block"
                style={{ color: "#ecd9ab", lineHeight: 1.4 }}
              >
                A quiet corner for words that endure. Enter the Diwan and take a stanza with you.
              </p>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-sm text-center md:hidden">
          Choose a poem, read it slowly, and carry a line into the afternoon.
        </p>
        <p className="mt-12 text-center font-serif text-[clamp(1.1rem,2.6vw,3.4rem)] uppercase tracking-widest text-ember">
          A world of verse awaits
        </p>
        <div className="mt-8 text-center">
          <a
            href="#/poems"
            className="sc inline-block bg-ink px-8 py-3 text-lg text-paper shadow-md transition hover:bg-ember"
          >
            Browse the Poems &rarr;
          </a>
        </div>
      </section>

      <footer className="sc mt-16 border-t-4 border-double border-ink/60 px-[4vw] py-8 text-sm">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
          <a href="#philosophy">Our Philosophy</a>
          <a href="#expositions">Expositions</a>
          <a href="#interactive">Features</a>
          <a href="#immerse">Immerse</a>
          <a href="#/art" className="text-ember font-medium">Art Gallery</a>
          <a href="#/poems">Diwan</a>
        </div>
        <div className="mt-6 grid w-full items-center gap-3 text-center sm:grid-cols-3">
          <span>Art-Nature</span>
          <span>London &middot; Paris &middot; Beirut</span>
          <span>&copy; MMXXVI</span>
        </div>
      </footer>
    </div>
  );
}
