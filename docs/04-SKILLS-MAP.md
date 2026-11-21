# KRISHI — Which Antigravity skills to use (and not)

You have 82 skills. Roughly 70 are for biology, chemistry, Swift, Android, or ancient texts, and have nothing to do with Krishi.
Using irrelevant skills wastes time and can change your code in unwanted ways. Only the ones below matter.

## USE (core)
| Skill | Where | Why | When |
|---|---|---|---|
| mobile-native | Welcome, signup, media, PWA, final QA | Fixes 100vh bugs, tap delay, bounce scroll, notch safe areas, input zoom. Farmers are on phones. | Phases 1, 2, 4, 5, 6, 8 |
| break-ui | New screens, then all screens | Tests long Kannada/Hindi text, empty states, huge strings. Your biggest risk is text breaking in non-English scripts. | End of Phase 1, 3, 4, and Phase 8 |
| credentials | Gemini key setup | Handles the API key without leaking it in logs or code. | Phase 0, 3, 5 |
| design-taste-frontend | New guide pages only | Gives the new pages purposeful layout and typography. | Phase 4B, scoped |
| unslop | Screens I name after reviewing screenshots | Removes generic AI-look patterns. | Phase 8B only |
| animation-performance | Recording UI, PWA, final QA | Keeps animations on transform/opacity so cheap phones don't stutter. | Phase 6, 8 |
| remove-animations | Frequent actions | Less motion means faster and calmer for tired users on slow phones. | Phase 8C |

## USE (optional, situational)
| Skill | Why | When |
|---|---|---|
| graphify | Builds a map of the codebase if Antigravity gets confused about structure. | Only if it starts breaking unrelated files |
| agy-customizations | Explains how to make 02-RULES.md load automatically as a workspace rule. | Once, at the start: "Use agy-customizations to register 02-RULES.md as an always-on workspace rule" |
| emil-design-eng | Polishes buttons and press feedback. | Only in Phase 8 if time remains. Low priority |
| animate | Only if you want a small mascot wave or card entrance. | Skip unless time remains |

## DO NOT USE (today)
| Skill | Reason |
|---|---|
| apple-design | Gesture-heavy, translucent, Apple look. Wrong fit for outdoor, low-end phones. |
| swarm, swarm_monitor, run-workflow | Parallel agents will collide in a small codebase and break rules. Too risky for a 1-day build. |
| automation, plugin, migrate-*, workflow-skill-creator | Not needed. |
| generative_ui | Makes chat widgets, not your app. |
| ask-sonner | Would add a library. Rule: no new packages. |
| animate-expo, android-*, compose-preview, write-swift | Wrong platform. Krishi is a web app / PWA. |
| lemo-opuscar | Video generation, unrelated. |
| Everything in sections 5 to 9 (biology, genomics, chemistry, literature, clinical, ancient text) | Irrelevant to this project. |

## Important cautions
- The skills guide the agent's work, but you still check the result. A skill saying "I applied best practice" proves nothing. Look at the screen.
- Skills that restyle (unslop, design-taste-frontend) can change working screens. Always name the exact screens and say "do not restyle anything else".
- Run one skill per task, not five at once.
- Claude has not seen your UI yet. Send screenshots before Phase 8B so the design pass targets real problems.

## Working loop for every task
1. Paste the phase prompt. 2. Agent reports in the CHANGED / VERIFIED / NOT VERIFIED / BROKEN / NEXT format.
3. You open it on your phone and check the "Done when" line. 4. Anything wrong, paste the problem back to Claude and fix it before moving on. 5. Say "go" for the next phase.
