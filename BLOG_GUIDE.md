# DCP Labs Blog Guide

The blog is file-based. To publish a new post, add one Markdown or MDX file to `src/content/blog/`. You do not need to edit React components for normal daily posting.

## Create a New Blog Post

1. Copy `src/content/blog/_template.md`.
2. Rename the copy with the publish date and topic, for example:

```text
src/content/blog/2026-06-25-best-pet-reminder-app.md
```

3. Fill in the frontmatter.
4. Write the post body in Markdown.
5. Add at least one natural internal link to the related app page.

The blog index automatically reads posts from `src/content/blog/`, skips files that start with `_`, and sorts published posts by newest `date` first.

## Frontmatter Fields

Every post needs:

```yaml
---
title: Best Pet Reminder App Features for Daily Care
slug: best-pet-reminder-app
description: A practical guide to choosing pet reminder app features for daily care routines.
date: 2026-06-25
category: Pet Care
app: CareTail
relatedAppUrl: /caretail
readingTime: 4 min read
seoTitle: Best Pet Reminder App Features for Daily Care | DCP Labs
seoDescription: Learn which pet reminder app features help organize medication, grooming, vet visits, and daily care routines.
tags: [pet reminder app, pet care tracker, pet care app]
---
```

Supported categories:

- `Pet Care`
- `Productivity`
- `Career Tools`
- `Education`
- `Field Service`
- `Collecting`

## Choose a Slug

Use a short, readable, lowercase slug:

- Good: `best-pet-reminder-app`
- Good: `tailor-resume-to-job-description`
- Avoid: `Best_Pet_Reminder_App_2026!!!`

The public URL becomes:

```text
/blog/best-pet-reminder-app
```

Keep slugs stable after publishing. Changing a slug changes the URL.

## Link the Post to an App Page

Set `relatedAppUrl` to the relevant product route:

- CareTail: `/caretail`
- RoleForge: `/roleforge`
- CoinRelic: `/coinrelic`
- LearnLift AI: `/learnlift-ai`
- ServiceSphere: `/servicesphere`

Also include a natural Markdown link in the article body:

```md
[CareTail](/caretail) keeps pet profiles, reminders, diary notes, and documents in one organized place.
```

## Preview Locally

Run the local dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/blog
http://127.0.0.1:5173/blog/your-slug
```

Run checks before publishing:

```bash
npm run lint
npm run build
```

## Commit and Push

After previewing and running checks:

```bash
git status
git add src/content/blog/2026-06-25-best-pet-reminder-app.md
git commit -m "Add best pet reminder app blog post"
git push
```

If you changed the blog loader, template, or docs, stage those files too.

## Keep SEO Clean

- `seoTitle` should be specific and readable, usually under 60 characters before the brand suffix when possible.
- `seoDescription` should explain the reader benefit in one sentence, usually under 160 characters.
- Use the target phrase naturally in the title, description, intro, or one heading.
- Do not repeat the same phrase in every paragraph.
- Write for the reader first. Search terms should clarify the topic, not distort the article.

## Example: CareTail

```yaml
---
title: Best Pet Reminder App Features for Daily Care
slug: best-pet-reminder-app
description: A practical guide to choosing pet reminder app features for daily care routines.
date: 2026-06-25
category: Pet Care
app: CareTail
relatedAppUrl: /caretail
readingTime: 4 min read
seoTitle: Best Pet Reminder App Features for Daily Care | DCP Labs
seoDescription: Learn which pet reminder app features help organize medication, grooming, vet visits, and daily care routines.
tags: [pet reminder app, pet care tracker, pet diary app]
---
```

Suggested body angle: explain medication reminders, grooming schedules, vet visits, and notes, then link naturally to `[CareTail](/caretail)`.

## Example: RoleForge

```yaml
---
title: What to Change on Your Resume for Each Job Application
slug: what-to-change-on-resume-for-each-application
description: A practical checklist for tailoring a resume without rewriting every section.
date: 2026-06-25
category: Career Tools
app: RoleForge
relatedAppUrl: /roleforge
readingTime: 5 min read
seoTitle: What to Change on Your Resume for Each Application | DCP Labs
seoDescription: Learn which resume sections to tailor for each job application while keeping your experience accurate.
tags: [resume tailoring, tailor resume to job description, resume checklist]
---
```

Suggested body angle: focus on the summary, top skills, strongest bullets, and role-specific proof, then link naturally to `[RoleForge](/roleforge)`.
