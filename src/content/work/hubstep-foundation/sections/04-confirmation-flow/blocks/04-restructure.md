---
type: prose
---
### How I restructured the confirmation flow

I redesigned the standard table UI into a tab UI, organized around each list's status.

Each tab's role isn't just a category. It's organized around the action the user needs to take next.

- **Green — Information.** The list can still go to print even with records remaining, but it prompts a check since they may contain duplicates, non-standard characters, or other issues.
- **Red — Warning.** Printing is blocked as long as target records remain; they need to be excluded or otherwise resolved.
- Each tab shows a count of affected records, and links directly to the list that needs review.
