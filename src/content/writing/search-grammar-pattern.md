---
title: "The Search Grammar Pattern: Natural Language Search with LLMs"
description: "How I built natural language search for my movie app with one small LLM call, and the pattern behind it: describe the offer by its dimensions, not its rows."
date: 2026-10-04
tags: [llm, ai, search, architecture]
video:
  youtube: hoCesxy2o08
  title: "Natural Language Search with LLMs | The Search Grammar Pattern | Live Demo"
  description: "Natural language search with an LLM over a whole movie catalog: one small LLM call per search, structured output, and code that decides what exists. 9 real searches in Tonight, every result checked against the catalog."
  uploaded: 2026-10-04
  duration: PT1M49S
cover: /covers/search-grammar-pattern.png
---

**Natural language search over a catalog the LLM has never seen. The whole offer, described by its dimensions instead of its rows. The model reads. Code decides.**

## The problem

At home we pay for several streaming services. Netflix, Prime Video, Disney+, HBO Max, Canal+.

Every evening is the same. Twenty minutes of scrolling, app after app. Often no film at all.

I'm a film buff. I love movies, but not all of them. I have my taste, and what everyone is watching this week is usually not for me.

Each app pushes exactly that. What's new. What's hot for them this week. Not what fits my taste.

I've seen a lot of good films. I want more like those. Across all my services, not inside one. And a chatbot doesn't help: it answers with what it knows, not with what's on my services.

I looked for an app that does this. I found nothing I liked. So, naturally, I built one for my own taste. I called it Tonight. You say what you feel like watching, the way you would say it. Any sentence:

- "a French crime drama, not a comedy, from before 1980"
- "a movie with the leading actors from titanic, directed by scorcese"
- "a thriller with the leading actor from titanic"
- "a film by the director of Heat"
- "godfathr"

Pulling fields out of the sentence is not enough for these. "crime drama" is two genres at once, not either. "the leading actor from titanic" and "the director of Heat" are people nobody named. "scorcese" and "godfathr" are names nobody spelled right. Each one needs the system to know the catalog. The model doesn't.

You get films you can start now, on the services you already pay for. I use it at home.

<video controls muted playsinline preload="metadata" poster="/video/search-grammar-pattern-poster.jpg" width="1440" height="900">
  <source src="/video/search-grammar-pattern.mp4" type="video/mp4">
</video>

*Tonight on my machine, real searches, one model call each, no cuts. Every result checked against the catalog.*

The full tour, 9 searches, from Japanese animation to Italian westerns:

<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/hoCesxy2o08" title="The Search Grammar Pattern: natural language movie search, live demo" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## How I got there

I tested the simple patterns first. A prompt with tools: the model calls a search tool when it needs one. I ran them on the same list of test sentences, again and again. Typos, other languages, negations, people, films named through other films.

They failed in the same places. The model decided when to search and what to call things. It suggested films it knew, not films I had. It said "not available" about films that were. And every fix was one more line in the prompt, one more instruction to the same model.

Everything you hand the model, you can only **ask**. Everything you keep in code, you can **guarantee**.

So I moved the work. Less for the model to do. Something precise for it to read. After several rounds of tests, I ended up with this. I call it the search grammar pattern. Here is how it works.

## What is the search grammar pattern?

The offer, described by its dimensions instead of its rows.

Tonight has 19,072 films on 14 services. **As rows**, one line per film:

```
Le Parrain (1972) · 175 min · Drame, Crime · Francis Ford Coppola · Marlon Brando, Al Pacino · Paramount+
Titanic (1997) · 194 min · Drame, Romance · James Cameron · Leonardo DiCaprio, Kate Winslet · Disney+
Heat (1995) · 170 min · Drame, Action · Michael Mann · Al Pacino, Robert De Niro · Disney+, HBO Max
... 19,069 more films
```

**As dimensions**, a few of the 32 fields the model actually reads:

```
people        people named directly with no role stated: 'with Tom Hanks', 'a Meryl Streep film'
references    a person reached THROUGH a film rather than named: 'actors from Titanic', 'the director of Heat'
genre         genre words, only from the list given
year_min      earliest year. 'the 90s' is 1990, 'recent' is 2015
runtime_max   longest, in minutes. 'under two hours' is 120, 'short' is 100
age           the age of the youngest person watching. A NUMBER, never a rating
...
GENRES, use these words exactly: Action, Comedy, Drama, Romance ... (19 in total)
```

The model doesn't search. It reads the sentence against the grammar and fills the fields. Code does the rest.

Not "parse this query". Parse it **against this grammar**.

## What it saves: 1.1 million tokens down to 3,200

Measured on Tonight's real data, no model, one token per 4 characters:

| | Tokens on every request |
|---|---:|
| The offer as rows, 19,072 films | about 1,107,000 |
| The offer as dimensions: the grammar and its schema | about 3,200 |

350 times smaller. As rows, it doesn't fit in the model. As a grammar, it's one small call. And it's the same on every request, so it's cached. You pay for it once.

![The search grammar pattern: Tonight's 19,072 films as rows (about 1.1 million tokens) or as dimensions (about 3,200 tokens), and one film's 80 offers folded into 4 lines](/img/grammar-rows-vs-dimensions.png)

## What goes in, and what stays out

**The grammar lists only the values that are few. The big ones stay out. Code finds them.**

- **Listed:** 19 genres. Exact words. The model can only pick from them.
- **Not listed:** 57,913 people. 19,170 keywords. 19,072 titles. The model writes what you said. Code finds the real thing.

"a French crime drama, not a comedy, from before 1980". Every phrase lands in the field that means it. "crime drama" is both genres, not either. "not a comedy" is an exclusion. "French" is the language, not the country. "before 1980" is 1979. One SQL query. 9 films on my services: The Sicilian Clan, Two Men in Town, Police Python 357.

"a movie with the leading actors from titanic, directed by scorcese". Here code does the work before any SQL. The model writes a reference, `{film: "titanic", wants: "lead_actors"}`, and "Martin Scorsese". It fixed the spelling. It never saw the list of people. It never writes an id. Code finds Titanic (1997), the best known of three. It takes its two leads, DiCaprio and Winslet. It finds the real Scorsese, one of five in the catalog. Then the search runs. 4 films, from The Wolf of Wall Street to Killers of the Flower Moon.

![The search grammar pattern in action: two real natural language searches, each phrase lighting up the field it fills, then what code and the resolver find](/img/grammar-sentence-match.png)

## It only works with a forgiving (fuzzy) search

A compact grammar has a price. The model no longer picks exact items. It writes loose words. So the other half is code that forgives them, and says how sure it is:

```
"de nino"       ->  Robert De Niro          close   among 57,913 people
"godfathr"      ->  The Godfather (1972)    close
"le parrain"    ->  The Godfather (1972)    exact   every title, in every language
"titanic"       ->  Titanic (1997)          exact   1953 and 1943 reported, never hidden
"Japanese"      ->  ja                      code knows the codes; the model never writes one
```

The last line is a real bug. An early version asked the model for the language code. It returned "japanese". The filter compared it to "ja". The screen said "in Japanese" over an empty wall. Now the model says the word. Code finds the code.

Exact first, fuzzy after. The answer says `exact` or `close`, never a number. A weak match comes back as a question, never applied silently.

Neither works alone. Without the forgiving search, the model's loose words match nothing. Without the grammar, the model has nothing precise to aim at. Together, the model can be approximate and the answer is still exact.

## A large catalog where each item has its own options

Tonight knows which of my services has each film. That's a filter in code. A real offer goes deeper: which service, rent or buy, which edition, which audio, at which price. Different for every film. No model knows it.

Someone types "inceptoin with nolan talking over it". They mean the director's commentary. By spelling, "nolan talking over it" and "with commentary by Christopher Nolan" score 0.26. No forgiving search bridges that. Only reading can.

To show this level, I rebuilt the pattern in a small open repo. 200 real films from Wikidata. 17,262 ways to watch them, invented: fictional services, made-up prices, but the shape of a real offer.

**One film, in full.** Titanic, 80 offers:

```
of5304  RentBox  rent  theatrical          SD  audio en  stereo  2.49 €
of5305  RentBox  rent  theatrical          SD  audio es  stereo  2.49 €
of5307  RentBox  rent  theatrical          HD  audio en  stereo  3.49 €
of5322  RentBox  rent  extended (+37 min)  SD  audio en  stereo  3.49 €
... 76 more
```

**The same film, as its pack:**

```
f1  StreamOne · subscription · theatrical · HD · audio en · included
f2  CinePass · subscription · theatrical · HD · audio en,fr,it · included
f3  RentBox · rent · 25th anniversary/Cameron's cut/extended (+37 min)/theatrical
    · HD/SD · audio en,es,it · 2.49–4.99 €
f4  RentBox · buy · the same 4 editions · HD/SD · audio en,es,it · 5.99–13.99 €
```

The same idea, one level down. Three moves:

- **Fold.** Offers that differ in a few values become one line. Values become sets, prices a range. 80 offers, 4 lines.
- **Write it once.** What every film shares goes in a dictionary, once, with variables. `{director}'s cut`. `with commentary by {person}`.
- **Send only what the sentence names.** Code spots the films in the sentence before the call, typos and all, and sends their packs. The model still decides if a film is really meant: "something taken seriously" is not the film *Taken*.

| On the demo | In full | As grammar | |
|---|---:|---:|---:|
| Titanic (1997), 80 offers | 1,626 | 144 | 11× smaller |
| The biggest film, 408 offers | 9,695 | 292 | 33× smaller |
| Every offer, every film | 396,929 | 2,676 with two films named | 148× smaller |

The more offers, the better it folds. 408 offers is 6 lines. In full, the prompt grows with every offer. As a grammar, it grows with the number of distinct ways to watch.

## What the model does with it

Real output, `gpt-6-luna`, a small, cheap OpenAI model, reasoning off:

```
$ python3 -m examples.movies "inceptoin with nolan talking over it"

CODE        loaded m142 Inception (2010), 3 families
THE MODEL   edition "with commentary by Christopher Nolan", pointing at f1, f2, f3
CODE        partial  Inception (2010) · RentBox · rent · theatrical · SD · 2.99 €  [of11110]
                     missing  edition with commentary by Christopher Nolan (nowhere for this film)
            ... the same for f1 and f3

1 model call · 5,492 prompt tokens · 265 completion tokens
```

"inceptoin" is a typo. Code found the film before the call.

"nolan talking over it" is a meaning. The model found it in the dictionary: `with commentary by {person}`. Code checked Inception's pack: theatrical only. So the answer is honest and certain. That version doesn't exist for this film. Here is what does, with real ids and prices that never passed through the model.

The dictionary says what exists in general. The pack says what exists here. Not in the pack means it doesn't exist.


Reading a sentence against a grammar is classification, not reasoning. A small model does it well.

## Not just movies: where the search grammar pattern fits

The search grammar pattern works wherever the offer is too big for the prompt and each item has options no model knows:

| Domain | Each item has | What no model knows |
|---|---|---|
| Books | editions, formats, translations, sellers, prices | which translation this shop sells, in which format, at which price |
| Hotels | rooms × rates × board × cancellation rules | that this "Superior Sea View" is non-refundable, with breakfast, at this price |
| Flights | fare families × baggage × change rules | what this airline's "Light" fare includes on this route today |
| Cars | trims × engines × colours × option packs | which pack this dealer has in stock, in which colour |
| Fashion | sizes × colours × fits × stock | that the jacket comes in M, but only in Navy/Orange |
| Concerts | categories × seats × prices | which seats are left in "Category 2" tonight |

Always the same question: what does each item have that no model can know? That goes in its pack. A few values become a dimension. Everything big is left to code.

## The limits

- The model can still misread a sentence. It can't invent a film, an offer or a price.
- A folded line lists what exists in it, not every combination. Code always checks the exact item.
- The demo's offers are invented. Real ones fold less neatly. Tonight's numbers are real.

Turning a sentence into filters from a schema is not new: LangChain's self-query retriever and Typesense's natural-language search do it. What I didn't find written up: describing the offer by its dimensions, listing only what the model can't know, folding each item's options into packs sent on demand, and a forgiving search doing the other half.

## Why not a decision model?

A decision model like [Jev](https://typesafe.ai), from TypeSafe AI, picks one of your options with a calibrated confidence. It looks like the perfect fit.

It isn't. A decision model needs a finite set of answers. A search sentence has none: a price, a year, a name, an edition, in any combination. And listing them costs more than it saves. On the demo, the people alone are about 4,850 tokens, more than one question can hold. With editions and titles, about 6,700, more than the small model's whole prompt.

It fits after the grammar, choosing between the few lines the small model already found. Step two, never step one.

## What I took from it

The model doesn't decide. It reads.

Code decides. What exists, what applies, what it costs, and what to say when it's not there.

`gpt-6-luna` is not the best model. It doesn't need to be. The hard part is in the grammar and in code.

A small model. One call. A few thousand tokens. An answer that never invents.

## Try it

```bash
git clone https://github.com/cornelcroi/llm-search-grammar
cd llm-search-grammar
export OPENAI_API_KEY=...
python3 -m examples.movies "inceptoin with nolan talking over it"
python3 -m examples.movies.measure Titanic
```

No dependencies. 27 tests replay 7 real model answers, no key needed.

It's not the prompt. It's the grammar. That's the search grammar pattern.
