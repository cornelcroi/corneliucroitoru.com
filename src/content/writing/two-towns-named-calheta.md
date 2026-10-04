---
title: "Two towns named Calheta: debugging an LLM verification pipeline"
description: "A real receipt, refused three times, for three different reasons. Three bugs at three layers, and why designing the failure direction first made being wrong survivable."
tags: [llm, ai, debugging, buildinpublic]
series: "Building Back From My Trip"
cover: /covers/two-towns-named-calheta.png
---

A traveller uploaded a real restaurant receipt from their trip. My verification pipeline looked at it and refused. I fixed that and tried again. Refused, for a different reason. Fixed that too. Refused a third time, for a third reason.

Three bugs. Three layers. One afternoon that taught me more about LLM pipelines than the months of building them. Here is the story, with the real fixes.

## The pipeline

On [Back From My Trip](https://backfrommytrip.com), a traveller can prove their trip happened. Upload a booking confirmation, or a photo of a restaurant bill, and the report gets a "Trip verified" badge.

The design rule: the LLM extracts facts only. The place on the document, the country, the dates, the amounts. Code computes the verdict: geocode the place, measure the distance to the trip's destination, check the dates against the visit window. The model cannot say "verified". It has no vote.

One more rule, and it is the one that saved me: when anything fails, the document is parked for a human to look at. No "rejected" label, no penalty. The pipeline can be wrong. It never punishes anyone for its mistakes.

So a real receipt, from a real trip, arrives. Parked. Why?

## Bug 1: the model needed glasses, not a lecture

The extraction model was gpt-4o-mini, my default everywhere, because no job in this codebase asks a model to think. It read the receipt with confidence. And wrong: it misread the number column and the year. On a readable receipt.

My first instinct was a prompt fix. Wrong layer. There was nothing unclear to clarify. The small model's vision was not good enough for photographed paper. I switched this one function to full gpt-4o and the numbers came back correct.

That upgrade costs nothing in practice. Travellers upload documents rarely, so this is cents per month. But it changed how I think about model choice. Mini everywhere was the right call for text jobs, and the wrong call for reading a photo of a crumpled bill. It needed better eyes, not better instructions.

## Bug 2: two towns named Calheta

Numbers fixed, next run. The receipt says the town: Calheta, Portugal. The trip was on Madeira, where Calheta is. Geocode it, measure the distance to the destination. This is what the cross-check logs (an example in the log's real shape: the distance is the real one, the original line is long gone):

```
[verify-proof-document] cross-check {
  evidence_id: "…",
  dest: "Madeira",
  place: "Calheta",
  distance_km: 1199,
  distance: "too far",
  dates: "in window"
}
```

1199 kilometers?

There are two Calhetas in Portugal. One on Madeira. One in the Azores. My code took the geocoder's first result, and that day the Azores came first. The next day it might not. The ranking really moves around. A verification pipeline that flips its verdict depending on which result comes first.

The fix is in the question the check asks. Not "where is Calheta?". That question has two answers and no code can pick one. The real question is: **"is there a place by this name at the trip?"** That one has a clean answer: check every place with that name, and if any of them is in range, yes.

```ts
// City names on receipts are ambiguous ("Calheta, Portugal" is a Madeira
// town AND an Azores one) and Nominatim's ranking moves around. The caller
// measures distance to the NEAREST candidate — the check asks "is a place
// by this name at the trip?", and any namesake in range answers it.
const candidates = await geocode(place, country);
const km = Math.min(...candidates.map((c) => haversineKm(c.lat, c.lng, destLat, destLng)));
```

A receipt from the wrong city still fails, as it should: none of the places with *its* name is near the trip. And the honest one now passes whichever Calheta the geocoder ranks first.

## Bug 3: the total that wasn't the total

Third run, third park. This time the arithmetic check. The pipeline sums the receipt's line items and compares against the printed total. Numbers that do not add up are a classic sign of a doctored document.

The photo was cropped. In the visible part, next to the items, sat the receipt's tax table, and the model took a tax amount as the total. The line items did not sum to it. To the check, that is a fraud signal. On a real receipt.

The fix was not better summing. It was making the check less sure of itself about receipts in the wild. Two principles, and I share the principles, not the rules:

- An uncertain reading never creates a fraud flag. No arithmetic beats wrong arithmetic. The other layers still gate the verdict.
- Accept any honest equation. Receipts disagree about what "total" means: a VAT-inclusive receipt and a US-style added-tax receipt are shaped differently, and both are honest.

The exact calibration, tolerances, which mismatches flag and which do not, stays behind the scenes on purpose. This is a fraud check. Publishing its rulebook is writing a cheat sheet for the people it exists to catch.

Fourth run: verified. Badge granted, document deleted. The pipeline keeps proof of *checking*, never the document itself. Even the debug logs carry the place name and the distance, never coordinates.

## What actually saved me

Count the layers: a vision failure, a geocoding failure, a calibration failure. Three bugs, zero overlap. No single fix, not a smarter model, not a better prompt, not cleverer code, would have caught the other two. That is the case for layers: each one checks one thing and can only fail in its own way.

But the real safety net was none of the layers. It was the failure direction. Through all three bugs, the pipeline never told the traveller "rejected" and never granted a false badge. It parked the document, a human was going to look, and nothing bad happened while I debugged. I was wrong three times in production. The cost was one delay, not one hurt user.

The lesson: in an LLM pipeline you will be wrong at layers you did not know existed. Design the failure direction first, so being wrong is survivable. Then debug the layers one at a time.

---

*The badge this pipeline grants is on every verified report at [BackFromMyTrip.com](https://www.backfrommytrip.com). Evidence checked, then deleted.*

*Builders: what is the most surprising layer an LLM pipeline of yours has failed at? "The geocoder changed its mind overnight" was not on my list. Surprise me.*
