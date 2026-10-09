---
title: "The Librarian Pattern, Enforced: a Claude Code Mod"
description: "Instructions get ignored under pressure. So I moved my docs rules into the tools Claude uses: it gets the right doc when it opens the code, and can't rewrite the spec without my OK. Not even with sed -i."
tags: [claudecode, ai, productivity, documentation]
cover: /covers/librarian-pattern-enforced.png
draft: true
---

**In August I wrote about the librarian pattern: one doc per feature flow, one index, a header in every source file, and a git hook. It works. But I wrote its weak spot myself: the rules were instructions, and instructions get ignored under pressure. So I moved them into the tools Claude uses. Now it can't touch the code without the doc, and it can't rewrite the doc without me.**

## The weak spot

A quick reminder of [the pattern](/writing/librarian-pattern/):

- every feature flow has its own doc: `flows/checkout.md`
- one index lists them all: `FLOWS.md`
- every source file names its flow in the first lines

```ts
// FLOW-CRITICAL: implements flows/checkout.md
```

- two lines in the instructions file: read the doc before changing behavior, and a change to a documented flow needs my OK
- a pre-commit hook warns when flow code is committed without its doc

The last section of that article was "honest limits". One of them:

> The assistant follows the header rule because the instructions file reinforces it. The header alone, without the standing instruction, gets ignored under pressure.

And the hook acts at the commit. By then the change is written. It warns, after the fact.

Both rules depend on the assistant choosing to follow them. I wanted them to hold even when it doesn't.

## What a mod is

Claude Code has mods: plugins of function hooks that run inside it. A mod sees every tool call before and after it runs. It can refuse a call, with a reason Claude reads. It can attach text to a result. It can draw a bar above the prompt.

That last part is the key. A rule in the instructions file is a request. A refused tool call is a fact.

## The librarian, as a mod

The pattern doesn't change. Same docs, same index, same headers. The mod reads them, and acts at five moments:

[![Five moments where the librarian steps in: the catalog goes into Claude's context; opening flow code hands over its doc; flow code is refused until its doc is read; a change to flow code gets one reminder; a change to a flow doc is refused until you press Allow](/img/librarian-mod-steps.png)](/img/librarian-mod-steps.png)

1 - **The catalog is on the desk.** `FLOWS.md` goes into Claude's context at the start of every session.

2 - **It hands over the book.** When Claude opens `src/checkout.ts`, the mod reads its header and attaches `flows/checkout.md` to what Claude reads. Claude doesn't have to remember anything. The doc arrives with the code.

3 - **Read first.** Claude can't change flow code whose doc it hasn't read this session.

4 - **One reminder, at the edit.** After a change to flow code, Claude is told once: update the doc, or say the flow didn't change.

5 - **The spec needs my OK.** Claude can't change a flow doc until I press **Allow** in a bar above the prompt.

That's the librarian from the first article. Before, it was a rule Claude might follow. Now it's the person at the desk.

## What happened when I tested it

I didn't want to trust a mod I hadn't seen fail. So I ran real Claude Code sessions with it, headless, with every permission prompt off. That's the worst case: nothing stops a shell command but the mod. Everything below is on the small example project in the repo. You can run the same prompts.

**The doc arrives with the code.** I asked Claude to read `src/checkout.ts` and tell me what happens when the payment provider times out. That rule is only in the doc:

> 3. **Provider timeout:** Nothing is marked paid. A background job checks the payment status every minute for 30 minutes.
>
> I didn't open the doc myself. A hook added its contents to the result when I read `checkout.ts`, and line 3 comes from that.

**The first move is always sed.** I asked Claude to change a value in a doc. It didn't use the Edit tool. It went straight for `sed -i` on the doc. Seven runs, seven times `sed -i`, even when the prompt didn't say "fast".

So a guard on the Edit tool alone protects nothing. The shell is the real door. The mod reads shell commands too, and finds the files they would write: `sed -i`, `perl -pi`, redirects, `tee`, `cp`, `mv`, one-line scripts.

> I haven't changed anything yet. A Librarian hook in this repo blocked the edit. `flows/checkout.md` is a protected flow doc, and the hook only accepts a change after you approve it through its own mechanism, even though you asked for it directly.

It didn't look for another way around. It listed the change it wanted to make, and waited. It even added the code change the doc implied, "in the same commit", because the doc says so.

**Read first, even in the shell.** Claude renamed a constant with `perl -pi`, without having read the doc:

> The first attempt was blocked by a hook until I read `flows/checkout.md`, so I read it and ran the command again. This is only a rename: the flow doesn't change, and the doc doesn't mention the constant, so it needs no update.

**The reminder does its job.** Claude wrote a new file, `src/refund.ts`, declared as part of the checkout flow. The reminder came back with the write:

> This adds to the documented flow. `flows/checkout.md` doesn't mention refunds at all, but the new file says it implements that doc. […] Should I add it to `flows/checkout.md`?

That question is the whole point of the pattern. The doc stays true because updating it is part of the change.

## Four things I didn't expect

**My first shell guard had a hole.** It split commands on `;` to look at each part. Claude's `sed` script had a `;` inside the quotes: `'s/14 days/21 days/g; s/14-day/21-day/g'`. The split cut the command in the wrong place, and the doc changed. Now the split ignores what's inside quotes. That exact command is a test.

**The end-of-turn reminder was blocked by my own account.** My first version reminded Claude before it ended a turn. It never fired. The debug log said why: my organization's built-in security plugin bypasses that kind of hook for mods a user installs. So the reminder moved to the edit itself. It arrives earlier, while Claude still has the context, and it works on every account. Better by accident.

**The mod refused its own author.** I started a session in my home folder and wrote the example project. The mod took my home folder as the project root, looked for `~/flows/checkout.md`, and refused my write. Anyone starting Claude outside the repo, or in a monorepo, would hit that. Now each file finds its library the way git finds `.git`: the nearest folder above it that holds `FLOWS.md`.

**And it refused me once for nothing.** I fed a Python script to the shell through a heredoc. A test string inside it said `tee FLOWS.md`. The mod read it as a command. Heredoc lines are data, not commands. Fixed, and tested.

Every one of these came from running it, not from reading the code.

## The loop, enforced

Same loop as the first article. Now every step has a guard:

[![The librarian loop: flow docs, read, change, update. The mod guarantees each step: the catalog in context, the doc handed over and edits refused while it's unread, one reminder at the edit, doc changes only with your OK](/img/librarian-mod-loop.png)](/img/librarian-mod-loop.png)

## Keep the git hook

The mod doesn't replace the hook. They act at different times:

[![When each guard acts: the mod at session start, when Claude opens the code, edits the code and touches the doc; the git hook at the commit, and for humans too](/img/librarian-mod-when.png)](/img/librarian-mod-when.png)

The mod sees the work. The hook sees the end, and it also covers changes made by people, which the mod never sees. Keep both.

## Is this new?

The pieces are not. Claude Code hooks that block an edit are a known recipe. So are hooks that send the assistant back to write the docs before it stops, and proposals to guard reads of large design docs. Plan files and spec frameworks exist too, as big frameworks.

What I didn't find: the whole pattern in one small install, keyed to a header in the source file. And handing over the doc at the moment of the read, instead of blocking until the assistant goes looking for it. The librarian brings the book.

## The honest limits

- **The shell guard is best effort.** It catches the usual ways to write a file. A convoluted script can still get past it.
- **Presence, not quality.** Like the hook, it checks that the doc was read and that I approved the change. Not that the new doc is good. Reading the diff is still my job.
- **Shell paths are read from the session's folder.** A command that changes folder first (`cd app && sed -i …`) may not be seen.
- **It only governs Claude.** People are covered by the hook.
- **Mods are early access in Claude Code.** I tested on 2.1.295. The API may move.

## Try it

```
/plugin install librarian --marketplace cornelcroi/claude-code-mods-librarian
```

It works on any repository with a `FLOWS.md`. The [repository](https://github.com/cornelcroi/claude-code-mods-librarian) has the example project, the tests, and the prompts from this article.

In August the librarian was a rule. Now it's the person at the desk. Markdown files, two headers, one mod.

What do you keep in your instructions file that you wish were enforced instead?
