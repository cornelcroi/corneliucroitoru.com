---
title: "You just write. The places find themselves."
seoTitle: "LLM Place Extraction: From Free Text to Places on a Map"
description: "You write the trip the way you would tell a friend. Minutes later the places you mentioned are on a map. Where the model’s job ends."
date: 2026-09-07
tags: [ai, llm, webdev, buildinpublic]
series: "Building Back From My Trip"
cover: /covers/places-find-themselves.png
featured: true
devto: https://dev.to/cornelcroi/you-just-write-the-places-find-themselves-2f2a
---

On my travel site you write a trip report the way you tell it to a friend. No field for the hotel. You publish, and a few minutes later a section appears under your story: the places you mentioned, pinned on a map, with the name a map would use.

An LLM does one part of that. Here is the whole pipeline, and where the model's job ends.

## The contract: a reader, not a writer

The model gets the text of the report and a few rules. These are verbatim from the prompt:

```plaintext
- Only extract NAMED places: a place must have a proper name a map would show
  (e.g. "Restaurante O Tasco", "Mercado dos Lavradores"). Never extract
  descriptive references: "the old town", "restaurants near the river",
  "our hotel", "a nice restaurant", "the beach" — these are not names.
- Most short reports mention no named places — returning an empty places
  list is the correct and common answer.
- Do NOT invent places. Only extract what is explicitly mentioned.
```

Three things are in there on purpose.

What a name is, with counter-examples. "The old town" is not a place a map can show. Left alone, a model will happily return "Old Town", geocode it to something, and put a pin in the wrong district.

An empty answer is normal. That line took me the longest to learn. Ask a model to find places, it finds places. Most short reports name nothing. Without that sentence, the model fills the list with guesses.

It does not invent but not because the instruction is enough but because the next step assumes the model might be wrong anyway.

The output is a small JSON contract: a name, a type (hotel, restaurant, beach, attraction, campsite, apartment), what the author did there (stayed, ate, visited), and a one-line caption taken from the text. Nothing about whether the author liked it. That question comes later, and it is asked to the author. One tap, or leave it blank.

## The map's name, not the author's word

One rule looks small and does a lot:

```json
"name": "the place's official name as it appears on a map, in its local
language (e.g. 'Mercado de Triana' even if the text says 'marché de
Triana') — never the author's translation."
```

People write on the site in three languages, in the language they think in. A French traveller writes "le marché de Triana". A Spanish one, "el Mercado de Triana". An English one, "Triana market". Three names, one building. If each became its own place, the map would show three pins and no reader would see that three people went there. So the model gives back the map's name. Everything else hangs on that name.

## Every name has to pass a check the model cannot touch

Here is the part I trust. It is not the model.

Each name goes to OpenStreetMap, with the report's destination and country as context. The map answers with an object, coordinates and an identity or nothing if no match.

If it does not, one typo-tolerant search on the same map data gets a second look. Then the place is dropped. The log says "place dropped (no geocode)" and that is the end of it. A wrong pin is worse than no pin, because a reader trusts a pin.

If it does, two more gates run in plain code before anything is written:

- **Is it the kind of thing we pin?** A closed list of map classes. A hotel, a restaurant, a beach, a viewpoint: yes. A whole region that happens to carry the same name: no. A model that returns "Madeira" for a report about Madeira did nothing wrong. The gate is what keeps it off the map.
- **Is it near the trip?** A distance guard around the destination. A restaurant with the right name on the wrong continent fails here, silently.

Two towns with the same name is a real problem and it gets its own article: two Calhetas, 1,199 km apart, and the afternoon a verification pipeline picked the wrong one. For today, the shape is the point. 

The model proposes a name. The map decides. The model cannot argue.

Then the place is stored once, under its map identity. The next report that names it, in any language, lands on the same row.

## It runs after publish, from a trigger, never from the request

Nothing here happens while the author waits. Publishing flips the report's status. A trigger on that change puts one job on a queue: "extract the places of report X". Not the text. Just the id.

A worker drains the queue a few jobs a minute, with retries. That pace is a choice, and what happens when a trigger fires 179 times in one afternoon is the next article in this series. The job reads the body from the stored record, by id. It never accepts text from a caller. Nothing outside the store can hand it a body to extract from. Same design as the moderation pipeline I wrote about, same reason: the model only ever sees what the author actually wrote.

The author sees a quiet note on their own report, "we're reading your story to find the places you mention". It goes away on its own when the job lands. Readers never see it. If the last retry fails, the note still resolves, to the honest state: no places yet, here is how to add one.

## When it is wrong, the author wins

It is wrong sometimes. A campsite the model missed. A café pinned to the wrong town. So the author can add a place, move one, or remove one. A removed place never comes back: the removal is a mark on the row, not a delete, so a re-run of the extractor cannot undo a human decision.

That is the other half of "the model is a reader". You can correct a reader. You cannot correct a writer, you can only argue with it.

## The lesson

Treat the extractor as a reader, not a writer. Say what a valid answer looks like, and make "nothing" one of them. Check every answer against ground truth the model can't touch. Give humans the last word.
Do that, and the model can be wrong without the map being wrong.

If you built extraction on top of an LLM: which check caught the most, the one the model could not talk its way past? Surprise me.

*The site is [Back From My Trip](https://www.backfrommytrip.com): trip reports by people who were there, each ending on one question. Would I go back?*

