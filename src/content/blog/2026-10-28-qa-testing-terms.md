---
title: Common QA Testing Terms Every Beginner Should Know
slug: qa-testing-terms
description: A beginner-friendly glossary of QA testing terms, from test cases and bugs to regression, smoke testing, and acceptance criteria.
date: 2026-10-28
category: Education
app: LearnLift AI
relatedAppUrl: /learnlift-ai
readingTime: 6 min read
seoTitle: Common QA Testing Terms Every Beginner Should Know | DCP Labs
seoDescription: Learn the QA testing terms beginners hear in interviews and on real projects, with plain-language examples and study tips.
tags: [QA testing terms, software testing glossary, QA interview prep]
---

If you are starting in software testing, the vocabulary can feel harder than the first test itself. Teams use short phrases such as “run a smoke test,” “cover the edge cases,” or “verify the acceptance criteria” as if everyone already knows what they mean.

You do not need to memorize a dictionary before you can learn QA. You need a working set of terms that helps you understand a ticket, describe a defect, and explain your reasoning in an interview. This glossary covers the concepts beginners meet most often, with small examples you can reuse while practicing.

## The basic language of testing

### Quality assurance (QA)

Quality assurance is the broader process of improving confidence in a product. It includes planning, reviewing requirements, designing tests, reporting findings, and checking whether the team’s process catches problems early. QA is not only “clicking through the app” at the end of development.

### Quality control (QC)

Quality control focuses on checking the product itself. Executing a test case and recording whether a login form behaves correctly are QC activities. In everyday conversation, people often use QA and testing interchangeably, but QA describes the wider quality process.

### Test scenario

A test scenario is a high-level situation you want to examine. For an online shop, “customer checks out with a saved card” is a scenario. It gives direction without listing every click.

### Test case

A test case is a repeatable set of steps, data, and expected results for checking one behavior. A login test case might specify a valid email, a valid password, the action of selecting **Sign in**, and the expected dashboard. Good test cases make the result understandable to another tester.

### Test data

Test data is the information used during a test: an account, address, date, product, or deliberately invalid value. Include the important properties of the data so someone else can reproduce your result. “A long password with spaces” is more useful than “bad password.”

### Expected result and actual result

The expected result is what the requirement says should happen. The actual result is what the software did. Comparing the two is the heart of a test. If the expected result is “an error message appears and the form remains open” but the page silently refreshes, the difference is evidence worth recording.

## Terms for defects and requirements

### Bug, defect, and failure

A bug or defect is a flaw in the product or its implementation. A failure is the visible incorrect behavior when that flaw is triggered. Many teams use the words casually as synonyms. In a report, focus on the observable behavior and the steps that produced it rather than debating the label.

### Reproduction steps

Reproduction steps are the shortest reliable path to seeing a problem again. They should include setup, actions, and relevant data. A precise sequence such as “open Settings, change language to Spanish, close and reopen the app” helps a developer investigate much faster than “language is broken.”

### Severity and priority

Severity describes the impact of a defect on the system or user. Priority describes how soon the team chooses to address it. A typo on a public checkout button may have low technical severity but high priority because it affects many customers. Keep the two ideas separate when discussing a bug.

### Acceptance criteria

Acceptance criteria are the conditions a feature must meet to be considered complete. They often appear in a user story. For a password reset feature, criteria might say that a valid email receives a link, an unknown email receives a safe response, and an expired link cannot set a password. Acceptance criteria become useful test ideas.

### Edge case

An edge case is an unusual value or situation near the boundary of expected use. Examples include an empty required field, a file at the maximum allowed size, February 29, or a user who has just lost network access. Edge cases are valuable because assumptions tend to fail at boundaries.

## Common test types

### Functional testing

Functional testing checks what a feature does. Does a search return matching products? Does saving a profile preserve the new phone number? The test is based on behavior and requirements, not on the internal code structure.

### Non-functional testing

Non-functional testing examines qualities such as performance, accessibility, security, compatibility, and usability. A page that returns the correct data but takes 20 seconds to load may pass a narrow functional test and still fail an important user need.

### Smoke testing

Smoke testing is a short, broad check that a build is stable enough for deeper testing. You might open the app, sign in, navigate to a key page, and complete one critical action. If these basics fail, spending hours on detailed scenarios is usually premature.

### Sanity testing

Sanity testing is a focused check of a particular change or fix. After a developer corrects a date filter, you may verify that filter and a few nearby behaviors. The exact distinction from smoke testing varies by team, so learn how your project uses the terms.

### Regression testing

Regression testing checks that existing behavior still works after a change. A new checkout discount could affect totals, refunds, order history, and receipts. Regression tests help uncover those unintended side effects.

### Retesting

Retesting means running the failed test again after a fix. First confirm the original defect no longer occurs. Then run relevant regression checks to see whether the fix introduced another problem. Retesting and regression testing answer different questions.

### Exploratory testing

Exploratory testing combines learning, test design, and execution. Instead of following only prewritten steps, you investigate the product, form a hypothesis, and follow useful clues. Take notes about what you tried so a promising discovery can become a repeatable test case.

## A simple way to study the vocabulary

Start with one feature, such as login, and write a small map:

- scenario: a user signs in;
- test case: valid credentials open the dashboard;
- test data: a verified account and an incorrect password;
- expected result: a clear message appears for the incorrect password;
- edge case: the email field contains spaces;
- regression risk: password reset or session handling changes.

Then explain the map aloud in your own words. If you can connect a term to an action and an expected result, you are learning a skill rather than reciting a definition. Keep a short list of terms you confuse and review it after a practice session.

## Where a study coach fits

Short, repeated recall is often easier to maintain than one long glossary session. [LearnLift AI](/learnlift-ai) can fit this workflow by turning QA concepts into review prompts, flashcards, and quizzes, while leaving you to check whether you can apply each term to a realistic scenario. Use it to identify weak areas, then return to a test case or bug report and practice the idea in context.

The goal is not to sound impressive by using every acronym. It is to communicate clearly: describe the risk, show the steps, compare expected with actual behavior, and explain what you would check next. That foundation will make both your interview answers and your day-to-day QA work more precise.
