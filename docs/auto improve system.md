# MotionDrop - Auto-Improvement System
Version: 1.0

---

## HOW IT WORKS

The system tracks what works and what doesn't.
Uses this to improve the prompt rules automatically.
No server needed. Uses localStorage + GitHub.

---

## SIGNALS WE COLLECT

Signal 1: DOWNLOAD (positive)
When: User clicks any download button
Stores: { config_used, industry, energy, effects, timestamp }
Meaning: User liked the result

Signal 2: REGENERATE (negative)
When: User clicks regenerate without downloading
Stores: { config_used, industry, energy, effects, timestamp }
Meaning: User didn't like the result

Signal 3: EDIT (refinement)
When: User changes any editor control
Stores: { what_changed, original_value, new_value, industry }
Meaning: AI got that specific thing wrong for that industry

---

## PATTERN DETECTION

Runs every time history page is opened.
Reads all stored signals and looks for patterns.

Example patterns detected:
- "fitness + particles:gentle → 80% regenerate rate"
  → Rule learned: fitness needs intense particles
  
- "luxury + energy>5 → 70% regenerate rate"
  → Rule learned: luxury must be energy 3 max
  
- "gaming + duration>4 → 65% regenerate rate"
  → Rule learned: gaming must be under 3.5s

---

## IMPROVEMENT CYCLE

V1 (Manual, built now):
- Signals stored in localStorage
- Patterns shown on a hidden /debug page (you can access)
- You review patterns monthly
- Update industryRules.ts constants manually
- Deploy update → everyone benefits

V2 (Semi-automated, future):
- Patterns automatically become suggested rule updates
- GitHub issue created automatically with suggestion
- Community votes on it
- Merged and deployed

V3 (Fully automated, far future):
- Rules update themselves
- A/B testing between rule versions
- Best performing rules win automatically

---

## THE DEBUG PAGE (/debug)

Hidden page only you know about.
Shows:
- Total generations count
- Download rate percentage
- Regenerate rate percentage
- Most common industries
- Most common failures
- Top performing configurations
- Suggested rule improvements

This page reads from all users' localStorage signals
IF they are on the same browser (they won't be)

Note: V1 data is LOCAL only. 
To get real data from all users you need to add
a tiny analytics endpoint in V2.
For V1, you learn from your own testing.