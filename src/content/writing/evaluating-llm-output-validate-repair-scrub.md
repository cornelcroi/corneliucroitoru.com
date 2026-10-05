---
title: "Evaluating LLM Output in Production: Validate, Repair, Scrub"
draft: true
description: "Checking LLM output is easy. The hard part is what to do when it fails: a repair that fixes only the failing sentence, and a scrubber that cuts it."
tags: [llm, ai, evaluation, hallucinations]
series: "Building StreetLens"
cover: /covers/evaluating-llm-output-validate-repair-scrub.png
---

<!-- DRAFT 2026-10-05. Story framing per owner: validation is a given, the article is about what to do after a FAIL.
     Facts checked 2026-10-04 in the StreetLens pipeline:
     src/prompts/audio_script.py: writer base prompt l.15-63, repair = base prompt + "REPAIR MODE" l.89-148,
       validator l.150-324, scrubber l.326+ (shown simplified in the article: "remove the sentence entirely")
     src/workers/audio_script_repair/worker.py: same validator l.58-59, re-validation l.148, scrubber after 3 attempts l.116-118,
       max_error_attempts=1 l.48
     logs/audio_script_repair.log: 113 repairs, all "attempt 1/3"; 65 places repaired, 8 failed; "Scrubbed: 0" in 20 runs
     data/archive/2026-05-22/500-llm-content/paris-pois-standouts.jsonl: repair_history, Villa Windsor original vs repaired
     The attempts in "It says FAIL. Now what?" are the owner's account. The scrubber diagram is an illustration. -->

**Checking what an LLM writes is the easy part. The hard part is what to do when the check says FAIL. I tried a lot of things on a real product. I ended up with two steps: repair the sentence that failed. And if that doesn't work, cut it.**

## The situation

I build [StreetLens](https://streetlensapp.com). You walk, and it tells you the story of the place in front of you, in your ear.

For every place we have the facts. Dates, names, measurements, the stories behind them. A model turns them into a script of about 800 words. A voice reads it.

A model writing 800 words will drift. A height rounded. A date a bit off. A detail that isn't in the facts at all. And the listener can't check, they're standing in the street. A guide that invents is worse than no guide.

## The check is the easy part

The writer's prompt says it, first rule:

```
- Every factual claim — dates, names, locations, events, measurements — must come from the source facts. No exceptions.
```

But a rule in a prompt is a request, not a guarantee. So every script goes through a **validator**: a second model that reads the script next to its facts and says PASS or FAIL.

The validator is a must. That part was never a question. Thousands of scripts, 8 languages. You check everything, or you don't know what you ship.

[![What the validator fails and what it lets pass: an invented fact, a wrong number, a wrong date or a contradiction fail; a number in words, a paraphrase or atmosphere pass](/img/streetlens-checker-validator.png)](/img/streetlens-checker-validator.png)

The validator answers in JSON, with a reason:

```json
{ "result": "FAIL", "reason": "Script states nearly two hectares of gardens, but source says the villa sits within 1.5 hectares" }
```

Keep that reason in mind. It turned out to be the most important part.

## It says FAIL. Now what?

Thats where I spent my time. A FAIL is easy to get. Knowing what to do with it is not.

**I regenerated the whole script.** The wrong number was gone. And a new problem showed up somewhere else, in a sentence that was fine before. 800 new words, 800 new chances to drift.

**I fixed scripts by hand.** Fine for ten. Not for hundreds of places in 8 languages. And not again every time a prompt changes.

**I asked a model to "correct this script".** It corrected it. And rewrote half of it on the way. Nicer sentences, a different tone, new details the validator didn't like.

Dozens of tries like this. Every time the same lesson: the more the fix touches, the more it breaks.

What I wanted was simple. A fix that touches only the sentence that failed.

## What I ended up with: repair, then scrub

[![The three bricks: the validator checks every script; a failing script goes to repair, then to the scrubber; each result goes back to the validator; nothing reaches the app without passing](/img/streetlens-checker-flow.png)](/img/streetlens-checker-flow.png)

### The repair

The repair is not a new model with new rules. It's the writer itself. Same prompt, with one more section at the end:

```
## 🔧 REPAIR MODE

You previously generated an audio script for this POI, but validation
identified a factual issue that needs correction.

### Validation Issue Found:
{validator_reason}

## What to Fix:
- ONLY the specific factual errors explicitly mentioned in the validation failure reason above

⚠️ DO NOT introduce ANY new factual claims that weren't in the previous script
⚠️ Your ONLY job is to fix the identified error, not to improve or expand the script
```

Three things go in. The script. The facts. The validator's reason.

The reason is what realy makes it work. "Nearly two hectares, but the facts say 1.5" tells the model where to look and what is true. No guessing.

A real one. Villa Windsor, 833 words:

[![One real script followed through the system: the fact, the writer's rounding, the validator's FAIL, the repair, the validator's PASS](/img/streetlens-checker-journey.png)](/img/streetlens-checker-journey.png)

```diff
- Around you spreads nearly two hectares of gardens, quiet lawns within western Paris woods.
+ Around you spreads one and a half hectares of gardens, quiet lawns within western Paris woods.
```

One sentence changed. The rest stayed word for word. Same tone, same pauses, same story. And because the repair is the writer, the fixed sentence sounds like the others.

Then the repaired script goes back to the same validator. The repair never decides that it worked. The validator does.

In my logs, the repair fixed 65 of 73 failed places on the first try. 89%.

### The scrubber

Sometimes the repair can't fix it. The fact is just not there, and the model keeps trying to say something about it.

After three tries, the scrubber takes over. Different job. It doesn't try to fix the fact anymore. It cuts it:

```
You are a factual scrubber for audio tour scripts.

For those parts ONLY:
  * Remove the sentence entirely
```

[![An example of the scrubber: after three failed repairs, the invented sentence about Napoleon is removed, the rest of the script stays the same](/img/streetlens-checker-scrubber.png)](/img/streetlens-checker-scrubber.png)

A script with one sentence less is still a good script. Then, again, the validator. If even that fails, the place goes to an error folder. Not to the app.

## Is this new?

Not the idea of sending the error back. Guardrails AI calls it "reask". Instructor retries with the validation error. Research loops like Self-Refine let a model critique and fix its own output.

What I didn't find written up is this combination, for long text:

- the repair is the writer's own prompt plus a repair section, so the voice stays the same
- it changes only the flagged sentence and keeps the other 800 words, instead of regenerating
- a last step that cuts the sentence, instead of throwing the script away
- the same validator decides after every step

## What the logs showed

Two things I didn't expect.

**The scrubber never ran.** One setting sent a place to the error folder after the first failed repair. Attempts two and three never happened. The gate held, nothing wrong went out. But my net was smaller than I thought. Check that your last net really runs.

**Most failures were my fault, not the model's.** The validator wanted abbreviations spelled out. The writer was never told. The writer was told to round decimals. The validator failed rounded numbers. Two prompts that didn't agree. The repair fixed those too, but one shared set of rules would have avoided them for free.

## Lessons learned

The check is not the hard part. You have to do it, on everything. The hard part is the FAIL.

**Don't regenerate. Repair.** A new script brings new mistakes. A repair touches one sentence.

**Give the repair the reason.** The script, the facts, and why it failed. Without the reason, the model guesses. With it, it fixes.

**Make the repair the writer.** Same prompt, same rules, plus "fix only this". The fixed sentence sounds like the rest.

**Keep a scrubber for the end.** When a fact can't be fixed, cut the sentence. One sentence less is better than no script. And much better than a wrong one.

**The validator always has the last word.** After the repair, after the scrubber. Nothing goes out around it.

This is how every StreetLens script is made today. Not the first thing I tried. What was left after everything else broke something.
