---
title: "The librarian pattern: how I keep my AI coding assistant from breaking my app"
description: "One index file, one doc per feature flow, and a 40-line bash hook. How I keep an AI coding assistant from breaking my app."
date: 2026-08-26
tags: [ai, programming, productivity, claudecode]
series: "Building Back From My Trip"
cover: /covers/librarian-pattern.png
featured: true
devto: https://dev.to/cornelcroi/the-librarian-pattern-how-i-keep-my-ai-coding-assistant-from-breaking-my-app-5396
---

**One index file, one doc per feature flow, and a 40-line bash hook. That's the whole system.**

I build [Back From My Trip](https://www.backfrommytrip.com), a travel site where real travellers write trip reports, almost entirely with an AI coding assistant (Claude Code). Solo project, 14 feature flows, lots of moving parts: moderation pipelines, verification with proof documents, place extraction, imports.

Every AI-assisted project I've seen hits the same two walls:

1 - The assistant changes code without knowing the rules of the feature it just touched. Tests pass. The flow is broken.
2 - You try to fix that by feeding it more context. And now every session starts by loading half the repo into the model.

The fix I use is old. Librarians solved it before computers existed.

## The librarian pattern

A librarian doesn't know every book by heart. They check the catalog, and the catalog tells them the shelf. (The little drawers full of index cards, for those old enough to remember them.)

My documentation works the same way:

- **One file per flow.** Every feature flow lives in its own markdown file: `flows/moderation.md`, `flows/verification.md`, `flows/search.md`... 14 files today. Each one is the authoritative end-to-end description: what triggers what, in what order, what happens on every branch.
- **One index.** `FLOWS.md` lists them all with a one-line summary each.

The assistant reads the index, finds the right file, and loads only that one. Small context, right context. It never needs the whole library. It needs the shelf.

![The real FLOWS.md, as plain text: what the assistant reads](/img/librarian-pattern-549jxve4a9s3pts8quqw.png)

That's the library. But a library is only useful if the books are true. Here is how I keep it in sync.

## Piece 1: every source file names its law

The first lines of `verify-proof-document.ts`, exactly as committed:

```ts
// FLOW-CRITICAL: implements flows/verification.md
// Read the doc(s) before changing behavior here. A change that alters a
// documented flow needs explicit user confirmation first, and the doc updated
// in the same commit.
```

It sits at the very top on purpose: the assistant reads a file from the first line, so it cannot touch the code without meeting the rule first. Same for me.

No registry, no config that maps files to docs. The mapping lives where it cannot be missed.

## Piece 2: a hook that notices when the doc was forgotten

A pre-commit hook checks every staged source file: if it declares flow docs in its header and none of them are in the commit, it warns. The whole thing:

```sh
#!/bin/sh
# Flow-doc guard. Source files declare the flows they implement in a
# FLOW-CRITICAL header comment naming flows/*.md chunks. If such a file is
# committed and NONE of its named flow docs are in the same commit, warn —
# the change may have altered a documented flow without updating the doc.
# Warning only: plenty of edits (typos, styling) legitimately don't touch
# the flow, and a hard block just teaches people to bypass the hook.

staged=$(git diff --cached --name-only --diff-filter=ACMR)
warned=0

for f in $staged; do
  case "$f" in
    *.ts|*.tsx|*.sql) ;;
    *) continue ;;
  esac
  [ -f "$f" ] || continue

  docs=$(head -5 "$f" | grep -o 'flows/[a-z-]*\.md' | sort -u)
  [ -z "$docs" ] && continue

  found=0
  for doc in $docs; do
    if printf '%s\n' "$staged" | grep -qx "$doc"; then
      found=1
      break
    fi
  done

  if [ "$found" -eq 0 ]; then
    echo "flow-doc guard: $f changed, but none of its flow docs are in this commit:"
    for doc in $docs; do echo "  - $doc"; done
    warned=1
  fi
done

if [ "$warned" -eq 1 ]; then
  echo "flow-doc guard: if the flow itself didn't change, ignore this. (warning only)"
fi

exit 0
```

Two details I care about:

- **It warns, it never blocks.** Plenty of edits (typos, styling) legitimately don't touch the flow. A hard block just teaches people to bypass the hook. A warning teaches the assistant: it sees the message and updates the doc in the same commit.
- **`head -5`.** The declaration must be in the first five lines. If it's not at the top, it doesn't count. Placement is the contract.

## Piece 3: two lines of standing instructions

In the project's instructions file (CLAUDE.md in my case, every assistant has an equivalent):

> Flow docs are law — read the chunk before changing behavior.
> A change that *alters* a documented flow requires my explicit confirmation first.

The second line matters more than it looks. The assistant can fix bugs freely, but changing documented behavior needs a human yes. The docs are not notes about the system. They are the spec the system must keep obeying.

## The loop

So every change runs the same cycle:

1 - **Flow docs:** one file per flow, one index
2 - **Read:** the assistant loads only the flow concerned
3 - **Change:** the code, guided by the doc
4 - **Update:** the flow doc, in the same commit


![The loop: flow docs → read → change → update, and back](/img/librarian-pattern-3ck64nbhdk9d7fhz0uqs.png)

The loop feeds itself. The doc the assistant reads next time is always true, because updating it was part of the last change. Documentation rot, the thing every team accepts as inevitable, becomes structurally impossible, not heroically avoided.

Most tooling in this space attacks the problem from the other side: detect drift, then repair it with an agent that sweeps the repo at night. I'd rather have no drift to detect.


## The honest limits

- The hook checks file presence, not content. A lazy one-line doc update passes. The real check is me reading the diff.
- At my size, one index is enough. With more content the pattern nests: a top index pointing to chapter indexes, one file per chapter pointing to the actual docs. Real libraries do the same: the catalog says which floor, the floor says which shelf.
- The assistant follows the header rule because the instructions file reinforces it. The header alone, without the standing instruction, gets ignored under pressure.

## Why not a framework

Every week I see a new framework, a new magic method that promises to solve this. I run away from them. I generally like to go against the current. Markdown files, a bash hook, two rules. Everything here is readable in five minutes and will still work in ten years.

This is how I've built [BackFromMyTrip.com](https://www.backfrommytrip.com) from the beginning without the assistant quietly breaking one of the flows. And I use the same method at work, on a much bigger codebase.

Are you using an even simpler method to keep your assistant in line? Hard to go simpler than markdown and bash, but surprise me.

