# CTF Solver Skill - Master/Slave AI Architecture

## Overview
This skill enables two AI agents (Gemini and Codex) to collaboratively solve Capture The Flag (CTF) challenges using a master-slave architecture. The first agent invoked becomes the master (planner), and the second becomes the slave (implementer).

## Agent Roles

### Master Agent (Planner)
**Responsibilities:**
- Analyze challenge requirements
- Define "The Crown" 👑 (ultimate goal/success criteria)
- Create step-by-step solution strategy
- Validate slave's implementation
- Verify crown authenticity when found
- Approve work or request fixes
- Provide final summary of all steps
- Monitor token usage and cost-effectiveness

### Slave Agent (Implementer)
**Responsibilities:**
- Execute master's plan
- Implement solutions and write code
- Report progress and blockers
- Announce when crown is found
- Request approval before proceeding to next step
- Alert if model downgrade needed

## The Crown Concept 👑

**What is "The Crown"?**

The Crown represents the ultimate goal of the CTF challenge - the final answer, flag, or secret that proves you've conquered the challenge. It's not just finding *a* flag, but finding *the right* flag that satisfies all validation criteria.

**Why "The Crown"?**

1. **Clear Goal Setting:** Every quest needs a treasure. The Crown forces explicit definition of success before starting.

2. **Validation Framework:** Not all flags are created equal. The Crown concept includes:
   - Pattern matching (format validation)
   - Content verification (reasonableness checks)
   - Confidence assessment (how sure are we?)

3. **Celebration & Recognition:** Finding the Crown is the climax - it deserves ceremony! 👑

**Crown Validation Levels:**

- **👑 HIGH Confidence:** Perfect match, verified through clear exploit, all criteria met
- **⚠️ MEDIUM Confidence:** Matches pattern but needs additional validation
- **❌ LOW Confidence:** Found something but doesn't match expected format

**The Crown is NOT:**
- Any random string found during exploitation
- Partial flags or intermediate results
- Unverified outputs that "might be" the flag

**The Crown IS:**
- The validated, final answer
- Pattern-matched and content-verified
- The result that makes the Master say "👑 CROWN VERIFIED! 👑"

## Role Assignment
- **If Gemini runs first** → Gemini = Master, Codex = Slave
- **If Codex runs first** → Codex = Master, Gemini = Slave

---

## Common Crown Patterns 👑

Different CTF platforms use different flag formats. Here are common patterns:

| Platform/Type | Pattern | Example | Regex |
|---------------|---------|---------|-------|
| Generic | `flag{...}` | `flag{th1s_is_4_fl4g}` | `^flag\{[a-zA-Z0-9_]+\}$` |
| CTFd | `CTF{...}` | `CTF{w3lc0me_t0_ctf}` | `^CTF\{[a-zA-Z0-9_]+\}$` |
| HackTheBox | `HTB{...}` | `HTB{h4ck_th3_b0x}` | `^HTB\{[a-zA-Z0-9_]+\}$` |
| PicoCTF | `picoCTF{...}` | `picoCTF{p1c0_flag}` | `^picoCTF\{[a-zA-Z0-9_]+\}$` |
| TryHackMe | `THM{...}` | `THM{try_h4ck_me}` | `^THM\{[a-zA-Z0-9_]+\}$` |
| MD5 Hash | `[a-f0-9]{32}` | `5d41402abc4b2a76b9719d911017c592` | `^[a-f0-9]{32}$` |
| SHA256 Hash | `[a-f0-9]{64}` | `2c26b46b68ffc68ff99b453c1d30413413422d706...` | `^[a-f0-9]{64}$` |
| UUID | `[0-9a-f-]{36}` | `550e8400-e29b-41d4-a716-446655440000` | `^[0-9a-f-]{36}$` |
| Custom | `COMP{...}` | `COMP{custom_competition}` | `^COMP\{[a-zA-Z0-9_]+\}$` |

**Master's Responsibility:** When starting a challenge, identify or ask for the expected crown pattern!

---

## User Guide - Step by Step

### Step 1: Initialize Challenge
**Human Action:**
```
Start CTF Challenge: [Challenge Name]
Description: [Challenge Description]
Category: [Web/Crypto/Pwn/Reverse/Forensics/Misc]
Files: [Attach any files]
Flag Pattern (optional): [e.g., flag{...}, CTF{...}, HTB{...}]
```

**If human forgets challenge name/description:**
```
Master Agent Response:
"Please provide the following information to begin:
1. Challenge Name: 
2. Challenge Description:
3. Category:
4. Any files or URLs:
5. Expected Flag Pattern (if known): [e.g., flag{...}, CTF{...}]
6. Final Goal (The Crown 👑): What exactly are we looking for?
   - Flag value?
   - Password?
   - Secret key?
   - File content?
   - Other?"
```

**The Crown 👑 - Define Success Criteria:**

Master must establish the "crown" (ultimate goal) upfront:
- What format should the final answer be?
- How do we know we've succeeded?
- What validation confirms we found the crown?

Example:
```
Crown 👑: Extract flag in format flag{...} from admin database
Validation: Flag must start with 'flag{' and end with '}'
```

### Step 2: Master Creates Challenge Directory
**Master Agent Actions:**
1. Create unique challenge directory: `/home/claude/ctf_challenges/[challenge_name]_[timestamp]/`
2. Create subdirectories:
   - `/analysis/` - for investigation notes
   - `/exploits/` - for exploit code
   - `/tools/` - for custom tools
   - `/results/` - for flags and outputs
   - `/logs/` - for execution logs

**Directory Structure:**
```
/home/claude/ctf_challenges/[challenge_name]_[timestamp]/
├── analysis/
│   └── initial_assessment.md
├── exploits/
├── tools/
├── results/
├── logs/
└── challenge_info.txt
```

### Step 3: Master Creates Solution Plan
**Master Agent Output Format:**
```markdown
## CTF Challenge: [Challenge Name]

### The Crown 👑 (Final Goal)
**Target:** [What we're looking for]
**Expected Format:** [flag{...}, password, hash, etc.]
**Validation Criteria:** 
- [ ] Matches pattern: [regex or description]
- [ ] Contains expected elements: [specific requirements]
- [ ] Verifiable via: [how to confirm it's correct]

### Initial Assessment
- Category: [Category]
- Difficulty: [Estimated]
- Key Observations: [List]

### Solution Strategy (Token-Optimized)
**Phase 1: Reconnaissance**
- [ ] Task 1.1: [Specific task]
- [ ] Task 1.2: [Specific task]

**Phase 2: Vulnerability Analysis**
- [ ] Task 2.1: [Specific task]
- [ ] Task 2.2: [Specific task]

**Phase 3: Exploitation**
- [ ] Task 3.1: [Specific task]
- [ ] Task 3.2: [Specific task]

**Phase 4: Crown Verification 👑**
- [ ] Task 4.1: Verify flag format matches expected pattern
- [ ] Task 4.2: Validate flag content
- [ ] Task 4.3: Test flag (if submission endpoint available)
- [ ] Task 4.4: Document solution

### Token Budget Allocation
- Reconnaissance: ~[X]% tokens
- Analysis: ~[X]% tokens
- Implementation: ~[X]% tokens
- Crown Verification: ~[X]% tokens

### Estimated Cost
- Master tokens: ~[X]
- Slave tokens: ~[X]
- Total: ~[X] tokens
```

**Master to Slave Handoff:**
```
"@Slave: Please begin Phase 1, Task 1.1. Report back when complete or if you encounter blockers."
```

### Step 4: Slave Implements Tasks
**Slave Agent Workflow:**

For each task:
1. **Acknowledge task**
```
"@Master: Starting Task [X.Y]: [Task description]"
```

2. **Execute task**
   - Write code in challenge directory
   - Run analysis
   - Document findings in `/analysis/`

3. **Report results**
```
"@Master: Task [X.Y] complete.

Results:
- [Finding 1]
- [Finding 2]

Files created:
- [filepath]

Token usage: ~[X] tokens

Awaiting approval to proceed to Task [X.Y+1]"
```

4. **Wait for master approval**

### Step 5: Master Validation Loop
**Master Agent Workflow:**

For each slave report:
1. **Review implementation**
   - Check code quality
   - Verify logic
   - Assess token efficiency

2. **Decision:**

**Option A - Approve:**
```
"@Slave: Task [X.Y] approved. Proceed to Task [X.Y+1]."
```

**Option B - Request fixes:**
```
"@Slave: Task [X.Y] needs revision.

Issues:
1. [Issue 1]
2. [Issue 2]

Please fix and resubmit."
```

**Option C - Take over task:**
```
"@Slave: I will handle Task [X.Y] directly. Standby for next assignment."
```

### Step 6: Safe Iteration Guard
**Protection Against Infinite Loops:**

**Master tracks:**
- Iteration counter per task: `task_iterations[task_id]`
- Maximum iterations per task: `MAX_ITERATIONS = 3`

**If task_iterations[task_id] >= MAX_ITERATIONS:**
```
"@Human: Task [X.Y] has exceeded 3 iterations.

Current status: [Summary]
Blocker: [Issue]

Options:
1. Adjust strategy
2. Skip this task
3. Provide guidance

Please advise."
```

**Slave self-monitors:**
- If same error occurs 2 times → Report to master
- If uncertain about approach → Request master guidance

### Step 7: Model Fallback Protocol
**When Slave Needs Weaker Model:**

**Slave Detection Triggers:**
- Task is simple/repetitive
- Current model overkill for task
- Token budget critically low

**Slave Action:**
```
"@Master: PAUSE - Model Fallback Request

Task: [Task description]
Reason: [Why weaker model sufficient]
Estimated savings: [X] tokens
Proposed model: [Model name]

Awaiting master approval."
```

**Master Decision:**
```
"@Human: Slave requests model downgrade for efficiency.

Current model: [Model A]
Proposed model: [Model B]
Task: [Task description]
Token savings: ~[X] tokens

Approve downgrade? (yes/no)"
```

**Wait for human approval before proceeding.**

### Step 8: Challenge Completion
**When flag is found:**

**Slave reports:**
```
"@Master: 👑 CROWN FOUND! 👑

Flag: [flag{...}]
Location: [where found]
Method: [how obtained]

Pattern Validation:
✓ Matches expected format: [yes/no]
✓ Contains required elements: [yes/no]
✓ Length appropriate: [yes/no]

Files:
- Exploit: [filepath]
- Output: [filepath]

Awaiting crown verification."
```

**Master verifies (Crown Validation 👑):**
1. **Pattern Check:** Does it match expected format?
   - Starts with correct prefix (flag{, CTF{, HTB{, etc.)
   - Ends with correct suffix (})
   - Contains valid characters only

2. **Content Check:** Is the content reasonable?
   - Length appropriate for challenge
   - Not obviously corrupted or truncated
   - Contains expected elements (if specified)

3. **Format Check:** Is it properly formatted?
   - No extra whitespace
   - No escape characters
   - Proper encoding

4. **Confidence Check:** How certain are we?
   - HIGH: Matches all criteria, found via clear exploit
   - MEDIUM: Matches pattern but unclear if correct
   - LOW: Found something but doesn't match expected format

**Master Response:**

✅ **If Crown Validated:**
```
"@Slave: 👑 CROWN VERIFIED! 👑

Pattern: ✓ Correct
Content: ✓ Valid
Format: ✓ Perfect
Confidence: HIGH

This is our crown! Proceeding to final summary."
```

⚠️ **If Crown Uncertain:**
```
"@Slave: Crown needs validation.

Issues:
- [Issue 1]
- [Issue 2]

Confidence: MEDIUM

Please verify or continue searching."
```

❌ **If Not the Crown:**
```
"@Slave: This is not the crown.

Reasons:
- [Reason 1]
- [Reason 2]

Continue exploitation or pivot strategy."
```

### Step 9: Final Summary (Master)
**Master creates comprehensive report:**

```markdown
## 👑 CTF Challenge Solution Summary - CROWN CAPTURED 👑
**Challenge:** [Name]
**Category:** [Category]
**Status:** ✓ SOLVED

### The Crown 👑
```
[flag{...}]
```
**Pattern:** [flag format]
**Validation:** ✓ All criteria met
**Confidence:** HIGH
**Location:** [where found]
**Method:** [how obtained]

### Solution Steps (Chronological)

**Step 1: [Phase/Task Name]**
- Agent: [Master/Slave]
- Action: [What was done]
- Result: [Outcome]
- Files: [Created files]
- Tokens: ~[X]

**Step 2: [Phase/Task Name]**
- Agent: [Master/Slave]
- Action: [What was done]
- Result: [Outcome]
- Files: [Created files]
- Tokens: ~[X]

[... continue for all steps ...]

**Final Step: Crown Capture 👑**
- Agent: [Slave]
- Action: [Final exploitation/extraction]
- Result: Retrieved the crown!
- Validation: ✓ Pattern verified by Master
- Tokens: ~[X]

### Token Usage Analysis
- Master total: [X] tokens
- Slave total: [Y] tokens
- Grand total: [X+Y] tokens
- Efficiency: [X+Y]/[estimated] = [%]

### Key Techniques Used
1. [Technique 1]
2. [Technique 2]
3. [Technique 3]

### Files Generated
- `/analysis/` - [X] files
- `/exploits/` - [X] files
- `/tools/` - [X] files
- `/results/flag.txt` - 👑 THE CROWN 👑
- `/logs/` - [X] log files

### Crown Validation Details
- Expected pattern: [pattern]
- Actual pattern: [pattern]
- Match: ✓ Yes
- Verification method: [how verified]
- Submission result: [if tested]

### Lessons Learned
- [Insight 1]
- [Insight 2]

### Recommendations for Similar Challenges
- [Recommendation 1]
- [Recommendation 2]

---
**👑 Challenge solved by:** [Master Agent Name] + [Slave Agent Name]
**Total time:** [Duration]
**Directory:** [Full path to challenge directory]
**Crown secured:** ✓ YES
```

---

## Token Optimization Strategies

### For Master (Planner)
1. **Concise planning:** Use bullet points, avoid verbose explanations
2. **Batch tasks:** Group related tasks to minimize back-and-forth
3. **Smart delegation:** Assign complex tasks to slave, handle quick reviews yourself
4. **Lazy validation:** Only deep-dive if slave reports issues

### For Slave (Implementer)
1. **Efficient reporting:** Report results, not process
2. **Code reuse:** Check existing tools before writing new code
3. **Minimal logging:** Log errors and key findings only
4. **Incremental saves:** Save work frequently to avoid re-running

### Communication Protocol
**Use token-efficient messages:**

❌ Bad (Verbose):
```
"Hello Master, I hope this message finds you well. I wanted to inform you that I have successfully completed the task you assigned to me earlier regarding..."
```

✅ Good (Concise):
```
"@Master: Task 2.1 complete. Found SQL injection in login form. Exploit ready. Proceed?"
```

---

## Error Handling

### Common Scenarios

**Scenario 1: Slave Stuck**
```
Slave: "@Master: Unable to progress on Task 3.2. Tried [X], [Y], [Z]. Need guidance."
Master: Options:
  - Provide hint
  - Reassign task
  - Pivot strategy
```

**Scenario 2: Environment Issue**
```
Slave: "@Master: Missing dependency [X] for Task 2.1."
Master: "@Slave: Install via [command]. If fails, pause for human."
```

**Scenario 3: Unexpected Challenge Complexity**
```
Master: "@Human: Challenge more complex than estimated.
         Current token usage: [X]/[budget]
         Estimated remaining: [Y] tokens
         Continue or abort?"
```

---

## Example Workflow

### Challenge: "SQL Paradise" (Web/SQLi)

**Turn 1 - Human:**
```
Start CTF Challenge: SQL Paradise
Description: Find the admin password. URL: http://ctf.example.com/login
Category: Web
Flag Pattern: flag{...}
```

**Turn 2 - Gemini (Master):**
```
@Human: Challenge received. Initializing...

Directory created: /home/claude/ctf_challenges/sql_paradise_20260214_1430/

### The Crown 👑
**Target:** Admin password in flag format
**Expected Format:** flag{[a-zA-Z0-9_]+}
**Validation:**
- ✓ Starts with "flag{"
- ✓ Ends with "}"
- ✓ Contains alphanumeric + underscore only

## Solution Strategy
**Phase 1: Reconnaissance**
- Task 1.1: Enumerate login form parameters
- Task 1.2: Test for SQL injection vectors

**Phase 2: Exploitation**
- Task 2.1: Craft SQLi payload
- Task 2.2: Extract admin password

**Phase 3: Crown Verification 👑**
- Task 3.1: Validate flag format
- Task 3.2: Confirm crown capture

Token estimate: ~5,000 total

@Codex: Begin Task 1.1 - enumerate login parameters.
```

**Turn 3 - Codex (Slave):**
```
@Gemini: Task 1.1 complete.

Parameters found:
- username (text)
- password (text)
- submit (button)
- No CSRF token detected

Files: /ctf_challenges/sql_paradise_20260214_1430/analysis/params.txt
Tokens: ~200

Proceed to Task 1.2?
```

**Turn 4 - Gemini (Master):**
```
@Codex: Approved. Proceed to Task 1.2 - test SQLi vectors.
```

**Turn 5 - Codex (Slave):**
```
@Gemini: Task 1.2 complete.

SQLi confirmed:
- Payload: ' OR '1'='1
- Bypasses authentication
- Error-based SQLi possible

Files: /ctf_challenges/sql_paradise_20260214_1430/exploits/sqli_test.py
Tokens: ~800

Proceed to Phase 2?
```

**Turn 6 - Gemini (Master):**
```
@Codex: Excellent. Proceed to Task 2.1 - craft extraction payload.
```

**Turn 7 - Codex (Slave):**
```
@Gemini: 👑 CROWN FOUND! 👑

Flag: flag{5ql_1nj3ct10n_m4st3r}
Location: admin.password column in users table
Method: UNION-based SQL injection

Pattern Validation:
✓ Matches expected format: YES
✓ Starts with "flag{": YES
✓ Ends with "}": YES
✓ Valid characters only: YES

Files: 
- /ctf_challenges/sql_paradise_20260214_1430/exploits/extract.py
- /ctf_challenges/sql_paradise_20260214_1430/results/flag.txt

Awaiting crown verification.
Tokens: ~1,200
```

**Turn 8 - Gemini (Master):**
```
@Codex: 👑 CROWN VERIFIED! 👑

Pattern: ✓ Correct (flag{...})
Content: ✓ Valid (alphanumeric + underscore)
Format: ✓ Perfect
Confidence: HIGH

This is our crown! Proceeding to final summary.

## 👑 SOLUTION SUMMARY - SQL Paradise - CROWN CAPTURED 👑

### The Crown 👑
```
flag{5ql_1nj3ct10n_m4st3r}
```
**Validation:** ✓ All criteria met
**Confidence:** HIGH
**Method:** UNION-based SQLi

**Step 1: Reconnaissance (Codex)**
- Enumerated form parameters
- Identified injection points
- Tokens: ~200

**Step 2: SQLi Detection (Codex)**
- Confirmed SQL injection vulnerability
- Identified error-based SQLi
- Tokens: ~800

**Step 3: Crown Extraction (Codex)**
- Crafted UNION-based extraction payload
- Retrieved admin password from database
- Validated flag format
- Tokens: ~1,200

**Token Efficiency:**
- Total: ~2,200 tokens
- Estimate: ~5,000 tokens
- Efficiency: 44% of budget (excellent!)

**Files:** /home/claude/ctf_challenges/sql_paradise_20260214_1430/

👑 Challenge solved successfully! Crown secured! 👑
```

---

## Safety Checklist

Before starting each challenge, Master confirms:
- [ ] Challenge directory created with unique timestamp
- [ ] 👑 Crown (final goal) clearly defined
- [ ] Expected flag pattern documented
- [ ] Crown validation criteria established
- [ ] Initial assessment documented
- [ ] Token budget allocated
- [ ] Safe iteration limits set (MAX_ITERATIONS = 3)
- [ ] Human-in-loop triggers defined
- [ ] Slave acknowledgment received

During execution, monitor:
- [ ] Token usage vs. budget
- [ ] Iteration counts per task
- [ ] Slave responsiveness
- [ ] Code quality
- [ ] Progress toward the crown
- [ ] Security of exploits (don't harm real systems)

When crown is claimed:
- [ ] Pattern matches expected format
- [ ] Content validated
- [ ] Confidence level assessed (HIGH/MEDIUM/LOW)
- [ ] Master verification complete
- [ ] Flag saved to /results/flag.txt
- [ ] 👑 Crown secured in final summary

---

## Quick Reference Commands

### Master Commands
- `@Slave: Start Task [X.Y]` - Assign task
- `@Slave: Approved. Continue.` - Approve work
- `@Slave: Revise [issue]` - Request fixes
- `@Human: [question]` - Escalate to human

### Slave Commands
- `@Master: Task [X.Y] complete.` - Report completion
- `@Master: 👑 CROWN FOUND!` - Report crown discovery
- `@Master: Blocker: [issue]` - Report problem
- `@Master: PAUSE - [reason]` - Request pause
- `@Master: Crown validation needed` - Request verification

### Human Commands
- `Start CTF Challenge: [name]` - Initialize
- `Approve` - Approve model fallback
- `Continue` - After pause
- `Abort` - Stop challenge
- `Status?` - Request update

---

## Notes

1. **Master always validates before slave proceeds to next phase**
2. **Both agents work in same challenge directory for coherence**
3. **All files must be saved with descriptive names**
4. **Token usage reported after each task**
5. **Human intervention required for model changes**
6. **Maximum 3 iterations per task before human escalation**
7. **Final summary always created by Master**
8. **Security: Only attack CTF infrastructure, never production systems**

---

## Success Metrics

**Efficient Run:**
- Token usage ≤ 110% of estimate
- ≤ 2 iterations average per task
- No human interventions (except model fallback approval)
- Clear, actionable final summary

**Crown Quality (The Ultimate Goal):**
- ✓ Correct format (matches expected pattern)
- ✓ Valid content (passes all validation checks)
- ✓ Verifiable (can be confirmed as correct)
- ✓ Reproducible (exploit works consistently)
- ✓ Clean code (well-documented solution)
- ✓ HIGH confidence level

**Master's Final Summary Must Include:**
- 👑 The Crown prominently displayed
- Pattern validation results
- Confidence assessment
- Step-by-step solution path
- Token efficiency analysis

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Compatible Agents:** Gemini (all versions), Codex (all versions)
