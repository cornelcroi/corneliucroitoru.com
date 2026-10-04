---
title: "178 reports in one afternoon: what a publish burst does to an LLM pipeline"
description: "A traveller published 178 trip reports at once. My site had 9 before that. The queue between the trigger and the model, and what held."
date: 2026-09-21
tags: [ai, llm, webdev, buildinpublic]
series: "Building Back From My Trip"
cover: /covers/publish-burst.png
devto: https://dev.to/cornelcroi/178-reports-in-one-afternoon-what-a-publish-burst-does-to-an-llm-pipeline-4jj9
---

On a Thursday afternoon a traveller published 178 trip reports at once. Two years on the road, Canada to Chile, imported from his Polarsteps diary, one report per stop. My site had 9 reports before that.

Every report that goes live starts three background jobs: text moderation, place extraction, and one image moderation per photo. All of them call a model. None of them run in the request. I wrote about the moderation part and the places part. This is the boring part, the queue between the trigger and the model, and what 178 publishes did to it.

## What one publish does

The author hits publish. A status flips in the store. A trigger on that change puts jobs on a queue. Not the text, not the photos. Just ids: "moderate report X", "extract the places of report X", "moderate photo Y". The request is done in milliseconds.

A worker wakes up once a minute, claims the ten oldest jobs, and calls the model for each. Claiming sets a five-minute lease on the job. If the worker dies mid-way, the lease expires and the job is claimable again. Three failed attempts and the job is marked failed, and whatever it was moderating falls to a human. The lease is the retry backoff and the crash recovery in one column.

Ten a minute is not a limit I hit by accident. It is the pace at which three job kinds together stay under the model's per-minute budget on my tier. Every job kind draws from the same budget, so the worker does not care what kind a job is. Oldest first, ten at a time.

## What 178 publishes do

Six minutes after the publish I ran the first query. This is what the queue looked like:

```plaintext
extract-places    done 28   pending 151
moderate-content  done 27   pending 152
moderate-image    done  0   pending  18
```

Fifty-five done. Ten a minute, six minutes. The worker was doing exactly what it was built to do, and it was going to take another half hour.

That half hour is the cost. A report published by someone else during it waits behind the burst. For a one-off import it is fine. For a live site during a busy day it would not be, and the fix is known and not built: a second worker, or a share of each tick reserved per job kind. I will build it the day the queue shows me it is needed, not before.

Two things in the queue looked wrong and were not.

The four jobs with one attempt and still pending. Those were the batch in flight, claimed under a live lease. Not failures.

The row in the HTTP log saying the call to the worker timed out after five seconds. Every minute. That is the cron calling the worker and giving up on waiting, while the worker keeps running for up to sixty seconds. The caller does not need the answer. The log line looks like an error and is the design.

I know these were fine because I checked the cron's own run log: one run a minute, every minute, all succeeded. If that log had stopped, the same queue numbers would have meant something else entirely. Same symptom, different cause, different fix. Look before you restart things.

## The hundred photos nobody judged

The next morning the admin's photo wall showed about a hundred photos marked "needs review". Needs review means the model was unsure and a human should look. A hundred of them from one traveller is a lot of looking.

So I looked at the reason first. Each photo row stores why it got its status. Ninety-eight said the same thing:

```plaintext
Image moderation service unavailable
```

That string is written by one place only: the image moderation function, when its call to the model fails on the final of three attempts. So these photos were tried, three times each, and the model refused every time. The model never saw them. Two other photos carried the model's own words, a child as the main subject, an unclear private space. Those two were real judgements. The ninety-eight were not.

When had this happened? The job rows were gone, because finished jobs are purged after seven days. So more than a week earlier, at import time, while the reports were still drafts. Back then, before the queue existed, every photo insert fired a call to the model directly. The import inserted hundreds of photos in minutes. The model rate-limited the burst. Three attempts, three refusals, and each photo was parked as "needs review".

Then the publish trigger, weeks later, queued only the photos still marked *pending*. These were marked needs review. So nothing ever tried them again. A pipeline failure had been stored in the same field as a verdict, and from then on it was treated as one.

## Two fixes, one lesson

The first fix already existed: the queue. Ten a minute cannot rate-limit anybody. That is why the 178 reports' text and places went through without a single failure.

The second fix is one migration. At publish, a photo parked by a pipeline failure, and never ruled on by a human, goes back to pending and into the queue with the others. A photo the model actually judged is left alone. The difference is the reason string, and the reason string is the only thing that made the difference visible.

I re-queued the ninety-eight by hand the same evening. The next morning I counted every photo that had gone through the queue since the publish: 465. Approved, 432. Rejected, 9. Needs review, 24, and every one of those now carries the model's own words: children as the main subject, people who do not seem aware they are being photographed, a diagram, a house decorated for a holiday it could not place as a travel photo. Not one says "service unavailable". That is what needs review is supposed to mean: twenty-four photos a human should look at, not a hundred nobody looked at.

The lesson is not about rate limits. It is that a failed check and a verdict must not live in the same field. The moment they do, a retry policy that gives up becomes a judgement that sticks, and nobody can tell the two apart without reading a string. Store the failure as a failure. Let the next run try again.

## What the afternoon cost

One more number, because people assume the answer is "a lot". The model bill for that day, the whole burst, 178 reports through text moderation and place extraction, 465 photos through image moderation, every retry included:


![Model spend for 2026-09-04: $0.29](/img/publish-burst-er9h4sozp26tw4rug13u.png)

Twenty-nine cents. The day before, a fraction of a cent. That is what "mini everywhere, and never ask the model to think" buys you. The queue was never about money. It was about the model's rate limit, and about failing in the right direction.

## Seeing it without SQL

Everything above I found with queries in the database console. That is fine once. So the admin panel got a Pipeline panel: per job kind, waiting, in progress, done in the last hour, failed in the last day. A one-line verdict above it: "Running · 131 waiting, oldest 12 min, last worked 20 s ago", or "Not running?" when work is waiting and nothing was claimed for three minutes. The last ten failures with their error text. One admin-gated function, the jobs table itself stays closed to the API.

The next burst, I will watch it drain from a page. And when it does not drain, the page will say so before a user does.

## The boring part is the part

The prompt was the easy part of all three features. The queue, the lease, the retry count, the failure direction, the reason string, the panel: that is the feature. A burst is the test you cannot run in development. Build the pipeline so every failure leaves a readable trace in a place you already look, and the burst becomes a story instead of an outage.

What is the biggest burst your pipeline has taken, and what did it leave behind? Surprise me.

*The site is [Back From My Trip](https://www.backfrommytrip.com): trip reports by people who were there, each ending on one question. Would I go back?*
