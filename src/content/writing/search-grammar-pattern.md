---
title: "The Search Grammar Pattern: Natural Language Search with LLMs"
description: "How I built natural language search for my movie app with one small LLM call, and the pattern behind it: describe the offer by its dimensions, not its rows."
date: 2026-10-04
updated: 2026-10-05
tags: [llm, ai, search, architecture]
video:
  youtube: hoCesxy2o08
  title: "Natural Language Search with LLMs | The Search Grammar Pattern | Live Demo"
  description: "Natural language search with an LLM over a whole movie catalog: one small LLM call per search, structured output, and code that decides what exists. 9 real searches in Tonight, every result checked against the catalog."
  uploaded: 2026-10-04
  duration: PT1M49S
cover: /covers/search-grammar-pattern.png
---

**Natural language search over a catalog the LLM has never seen. The whole offer, condensed into a few thousand tokens. The model reads. Code decides.**

## The problem

At home I pay for several streaming services: Netflix, Prime Video, Disney+, HBO Max, Canal+ and a few others ;) .

Every time is the same thing: twenty minutes of scrolling, app after app and often no film at all.

I'm a film buff. I love movies, but not all of them. I have my taste, and what everyone is watching this week is usually not for me.

Each app pushes exactly that. What's new. What's hot for them this week. Not what fits my taste.

I've seen a lot of good films and I want more like those, across all my services, not inside one. 

What I wanted was simple. **One catalog with every film from all my services, the ones I can watch here in France. And a way to search it the way I talk.**

I looked for an app that does this. I found nothing I liked so, naturally, I built one for my own taste. I called it Tonight.

Here is how it looks, on my phone and on my Apple TV. Looks cool, right?

<div class="devices"><a href="/img/tonight-phone.png" style="--ratio: 0.473"><img src="/img/tonight-phone.png" alt="Tonight on a phone: The Wolf of Wall Street in the web app, saved for tonight" width="848" height="1792" loading="lazy"></a><a href="/img/tonight-tv.jpg" style="--ratio: 1.778"><img src="/img/tonight-tv.jpg" alt="Tonight on the Apple TV: the same film's page, with Open in Prime Video, saved for tonight" width="2400" height="1350" loading="lazy"></a></div>

*Left, the web app on my phone. Right, the Apple TV app. Same film, saved for tonight on the phone, already there on the TV.*

You say what you feel like watching, the way you would say it. Any sentence:

- "a French crime drama, not a comedy, from before 1980"
- "a movie with the leading actors from titanic, directed by scorcese"
- "a thriller with the leading actor from titanic"
- "a film by the director of Heat"
- "godfathr"

Some are simple. "a French crime drama from before 1980" is just filters. Language, genre, year.

Most are not. People search the way they remember. You forgot the actor's name, so you type "with the actors from Meet the Fockers". You don't know who directed Heat, so you type "the director of Heat". You type "scorcese" and "godfathr", because nobody spells right in a search box. And "crime drama" is two genres at once, not either.

Pulling fields out of the sentence works for the simple ones. Not for these.

And there is a second problem. The answer must come from what I can actually watch. My catalog: every film on my services, in France. Not a film the model remembers. Not one that is only on Netflix in the US.

**Every search needs the system to know that catalog. The model doesn't.**

You get films you can start now, on the services you already pay for. I use it at home.

It's an Apple TV app. Pick a film, press play, and it opens in its own app: Disney+, Prime Video, Canal+, HBO Max. Netflix ignores the link and opens its home screen, nothing I can do about that.

And you don't search with the remote. Typing on a TV is a sign you're on the wrong device. So you ask on your phone, the way you talk, save a film for tonight, and it's on the TV before you put the phone down.

**Does it work? Here it is, live:** 9 real searches, one model call each, no cuts. Every result checked against the catalog.

<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/hoCesxy2o08" title="The Search Grammar Pattern: natural language movie search, live demo" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## How I got there

I tested the simple patterns first. A prompt with tools: the model calls a search tool when it needs one. I ran them on the same list of test sentences, again and again. Typos, other languages, negations, people, films named through other films.

They failed in the same places. The model decided when to search and what to call things. It suggested films it knew, not films I had. It said "not available" about films that were. And every fix was one more line in the prompt, one more instruction to the same model.

Everything you hand the model, you can only **ask**. Everything you keep in code, you can **guarantee**.

So I moved the work towards less for the model to do. After several rounds of tests, I ended up with this: I call it **the search grammar pattern**. 

Here is how it works.

## What is the search grammar pattern?

Tonight has 19,072 films on 14 services. The obvious idea: put them all in the prompt and let the model pick.

That doesn't work. 19,072 films is about 1.1 million tokens. It doesn't fit in most models. The ones where it fits get lost in so much data and don't pick the best film. And you pay for 1.1 million tokens on every search, and you wait for them.

So I needed the opposite. Not the catalog in the prompt. A short description of it.

That's the search grammar. The whole offer, condensed. The fields a person can ask about, what each one means, and the few values that are fixed. A few thousand tokens, the same on every request.

The model doesn't search. It reads the sentence against the grammar and fills the fields. Code does the rest.

How do you condense a whole catalog? You describe it by its dimensions, not its rows.

**As rows**, one line per film:

```
Le Parrain (1972) · 175 min · Drame, Crime · Francis Ford Coppola · Marlon Brando, Al Pacino · Paramount+
Titanic (1997) · 194 min · Drame, Romance · James Cameron · Leonardo DiCaprio, Kate Winslet · Disney+
Heat (1995) · 170 min · Drame, Action · Michael Mann · Al Pacino, Robert De Niro · Disney+, HBO Max
... 19,069 more films
```

**As dimensions**, a few of the 32 fields the model actually reads. Title and genre are there too. These are the ones that make it work:

```
references    a person reached THROUGH a film rather than named: 'actors from Titanic', 'the director of Heat'
films         a film named for any reason other than wanting something like it
directed_by   people the sentence says DIRECTED it: 'a Nolan film', 'réalisé par Audiard'
genre_mode    'all' when it must be every genre at once ('a crime drama'), 'any' when either will do ('comedy or romcom')
cast_mode     'all' when everyone named must be in the same film ('De Niro AND Pacino'), 'any' otherwise
country       where the FILM is from, when a language cannot say it: British, American, Australian are all English
keywords      what the film is ABOUT. Narrower than a genre and never flattened into one
age           the age of the youngest person watching. A NUMBER, never a rating
audience      who is watching, in the sentence's own words: kids, my mother, a first date
pick          reception, never content: popular, blockbuster, acclaimed, classic
exact         true only if the viewer insisted: only, must, exactly. It stops the search widening
year_max      latest year. 'the 90s' is 1999, 'a classic' is 1990
...
GENRES, use these words exactly: Action, Comedy, Drama, Romance ... (19 in total)
```

I chose these dimensions. Some are columns of my database: year, runtime, language. Most are not. They are the ways a person asks for a film, and each of those comes with code that does the work before the SQL: a film becomes its cast, an age becomes the genres allowed, "scorcese" becomes Martin Scorsese.

Not "parse this query". Parse it **against this grammar**.

## What it saves: 1.1 million tokens down to 3,200

Measured on Tonight's real data, no model, one token per 4 characters:

| | Tokens on every request |
|---|---:|
| The offer as rows, 19,072 films | about 1,107,000 |
| The offer as dimensions: the grammar and its schema | about 3,200 |

350 times smaller. As rows, it doesn't fit in the model. As a grammar, it's one small call. And it's the same on every request, so it's cached. You pay for it once.

[![The search grammar pattern: Tonight's 19,072 films as rows (about 1.1 million tokens) or as dimensions (about 3,200 tokens)](/img/grammar-rows-vs-dimensions.png)](/img/grammar-rows-vs-dimensions.png)

## What goes in, and what stays out

**The grammar lists only the values that are few. The big ones stay out. Code finds them.**

- **Listed:** 19 genres. Exact words. The model can only pick from them.
- **Not listed:** 57,913 people. 19,170 keywords. 19,072 titles. The model writes what you said. Code finds the real thing.

"a French crime drama, not a comedy, from before 1980". Every phrase lands in the field that means it. "crime drama" is both genres, not either. "not a comedy" is an exclusion. "French" is the language, not the country. "before 1980" is 1979. One SQL query. 9 films on my services: The Sicilian Clan, Two Men in Town, Police Python 357.

"a movie with the leading actors from titanic, directed by scorcese". Here code does the work before any SQL. The model writes a reference, `{film: "titanic", wants: "lead_actors"}`, and "Martin Scorsese". It fixed the spelling. It never saw the list of people. It never writes an id. Code finds Titanic (1997), the best known of three. It takes its two leads, DiCaprio and Winslet. It finds the real Scorsese, one of five in the catalog. Then the search runs. 4 films, from The Wolf of Wall Street to Killers of the Flower Moon.

[![The search grammar pattern in action: two real natural language searches, each phrase lighting up the field it fills, then what code and the resolver find](/img/grammar-sentence-match.png)](/img/grammar-sentence-match.png)

## It only works with a forgiving (fuzzy) search

A compact grammar has a price. The model never sees the 57,913 people or the 19,072 titles. So it writes what you typed, not what the catalog calls it. "de nino". "godfathr". "le parrain".

A plain database search finds nothing for those. So code searches the forgiving way. First the exact name. Then names spelled almost the same. In every title, in every language. And it says how sure it is:

```
"de nino"       ->  Robert De Niro          close   among 57,913 people
"godfathr"      ->  The Godfather (1972)    close
"le parrain"    ->  The Godfather (1972)    exact   every title, in every language
"titanic"       ->  Titanic (1997)          exact   1953 and 1943 reported, never hidden
```

Exact first, fuzzy after. The answer says `exact` or `close`, never a number. A weak match comes back as a question ("did you mean"), never applied silently.

Neither works alone. Without the forgiving search, the model's loose words match nothing. Without the grammar, the model has nothing precise to aim at. Together, the model can be approximate and the answer is still exact.

## Natural language search for e-commerce, travel and more

Movies are just my case. The same pattern works for natural language product search in an online shop, for hotel and flight search, car configurators, concert tickets. Anywhere the offer is too big for the prompt.

Its always the same flow. Someone types a sentence. The model turns it into search filters, against the grammar. Code finds the real items, the prices, the stock.

| Domain | Someone types | What no model knows |
|---|---|---|
| Books | "the French translation of The Name of the Rose, as an audiobook" | which translation this shop sells, in which format, at which price |
| Hotels | "a sea view room in Lisbon I can still cancel, breakfast included" | that this "Superior Sea View" is non-refundable, with breakfast, at this price |
| Flights | "Paris to Lisbon in May, with a checked bag, cheapest fare I can change" | what this airline's "Light" fare includes on this route today |
| Cars | "a hybrid SUV in dark blue with the winter pack, in stock near Lyon" | which pack this dealer has in stock, in which colour |
| Fashion | "the running jacket in M, anything but black, under 150 €" | that the jacket comes in M, but only in Navy/Orange |
| Concerts | "two seats together for Saturday, not behind the stage" | which seats are left in "Category 2" tonight |

Always the same question: how does a person ask for it? That gives the dimensions. A few values are listed. Everything big is left to code.

## The limits

- The model can still misread a sentence. It can't invent a film.
- Every dimension is code you write. A new way to ask is work, not a prompt edit.
- The repo runs on 200 films. Tonight's numbers are real.

Turning a sentence into filters from a schema is not new: LangChain's self-query retriever and Typesense's natural-language search do it. What I didn't find written up is the rest. The whole offer condensed into its dimensions. Only the few fixed values listed, everything big left to code. Code that does the work before the SQL. And a forgiving search doing the other half.

## Why not a decision model?

A decision model like [Jev](https://typesafe.ai), from TypeSafe AI, picks one of your options with a calibrated confidence. It looks like the perfect fit.

It isn't. A decision model needs a finite set of answers. A search sentence has none: a year, a name, a genre, a person reached through a film, in any combination. And listing them costs more than it saves. On the demo, the people alone are about 4,850 tokens, more than one question can hold.

It fits after the grammar, choosing between the few films the search already found. Step two, never step one.

## What I took from it

The model doesn't decide. It reads.

Code decides. What exists, what applies, and what to say when it's not there.

The model behind it is `gpt-6-luna`, a small, cheap OpenAI model, reasoning off. Not the best model. It doesn't need to be. Reading a sentence against a grammar is classification, not reasoning. The hard part is in the grammar and in code.

A small model. One call. A few thousand tokens. An answer that never invents.

## Try it

```bash
git clone https://github.com/cornelcroi/llm-search-grammar
cd llm-search-grammar
cp .env.example .env        # your OpenAI key goes in .env
python3 -m examples.movies.web          # the web demo, with posters: http://127.0.0.1:8000
python3 -m examples.movies "the leading actors from titanic, directed by scorcese"   # the same steps, in the terminal
```

I rebuilt the pattern in a small open repo, [llm-search-grammar](https://github.com/cornelcroi/llm-search-grammar), with a web demo. 200 real films from Wikidata, not Tonight's 19,072: its README says what you can ask. No dependencies. 35 tests, no key needed: they replay real model answers.

It's not the prompt. It's the grammar. That's the search grammar pattern.
