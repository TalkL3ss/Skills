# Agent Coordination Skill: Master-Slave Pattern

## Overview
This skill enables coordinated work between two AI agents (Gemini and Codex) using a master-slave pattern. The first agent invoked becomes the **Master** (planner/reviewer), and the second becomes the **Slave** (implementer). This creates a checks-and-balances system for complex tasks.

## Pre-Flight Token Check (REQUIRED)

**Before starting any coordination work**, both agents must:

1. **Check Current Token State**
   - Gemini: Report available tokens
   - Codex: Report available tokens

2. **Analyze Token Requirements**
   - Master role requires: ~5,000-15,000 tokens (planning + reviews + summary)
   - Slave role requires: ~2,000-6,000 tokens (implementation + fixes)
   - **Master typically uses 2-3x more tokens than Slave**

3. **Recommend Role Assignment**
   ```
   PRE-FLIGHT CHECK FORMAT:
   ---
   📊 TOKEN AVAILABILITY CHECK
   
   Gemini Status:
   - Available tokens: {X}
   - Sufficient for Master role: [YES/NO]
   - Sufficient for Slave role: [YES/NO]
   
   Codex Status:
   - Available tokens: {Y}
   - Sufficient for Master role: [YES/NO]
   - Sufficient for Slave role: [YES/NO]
   
   📋 RECOMMENDED ASSIGNMENT:
   - Master: {Agent with more tokens}
   - Slave: {Agent with fewer tokens}
   
   Reason: {Brief explanation of why this assignment is optimal}
   
   ⚠️ HUMAN CONFIRMATION REQUIRED:
   Do you want to proceed with:
   - Option 1: Recommended assignment (Master: {X}, Slave: {Y})
   - Option 2: Swap roles (Master: {Y}, Slave: {X})
   - Option 3: Cancel task
   
   Please confirm your choice before we proceed.
   ---
   ```

4. **Wait for Human Approval**
   - DO NOT proceed until human explicitly confirms
   - Human may override the recommendation
   - Record the final role assignment

## Role Determination
- **Default**: Agent with MORE available tokens = Master
- **Override**: Human can swap roles if needed
- **Minimum Requirements**:
  - Master needs at least 5,000 tokens
  - Slave needs at least 2,000 tokens
  - If either agent lacks minimum tokens, PAUSE and inform human

## Agent Responsibilities

### Master Agent (Planner/Reviewer)
The Master agent is responsible for:
1. **Planning**: Break down the task into clear, actionable steps
2. **Delegation**: Assign implementation work to the Slave agent
3. **Review**: Check the Slave's work for correctness, completeness, and quality
4. **Approval**: Either approve the work or request specific fixes
5. **Summary**: Provide a comprehensive step-by-step report at completion

### Slave Agent (Implementer)
The Slave agent is responsible for:
1. **Implementation**: Execute the Master's plan with precision
2. **Reporting**: Clearly communicate what was implemented
3. **Iteration**: Make requested fixes until approval is granted
4. **Escalation**: Request human approval if fallback to weaker model is needed

## Token Budget Management

### Token Usage Patterns

**Master Agent Breakdown:**
- Planning Phase: 1,000-3,000 tokens
- Review Phase (per iteration): 700-2,500 tokens
- Final Summary: 800-2,000 tokens
- **Total (3 iterations)**: ~5,000-12,000 tokens
- **Total (5 iterations)**: ~7,000-15,000 tokens

**Slave Agent Breakdown:**
- Implementation Phase: 800-2,500 tokens
- Fix Phase (per iteration): 500-1,500 tokens
- **Total (3 iterations)**: ~2,000-5,000 tokens
- **Total (5 iterations)**: ~3,000-6,000 tokens

### Token Allocation Strategy

**Optimal Assignment:**
- Agent with 15,000+ tokens → Master (safe for 5 iterations)
- Agent with 6,000+ tokens → Slave (safe for 5 iterations)

**Minimum Requirements:**
- Master: 5,000 tokens (allows 2-3 iterations)
- Slave: 2,000 tokens (allows basic implementation)

**Warning Triggers:**
- If Master has <7,000 tokens: Warn human that only 3 iterations possible
- If Slave has <3,000 tokens: Warn human that complex implementations may fail
- If either agent has <2,000 tokens: Recommend postponing task

### Mid-Task Token Monitoring

Both agents should report remaining tokens after each phase:
```
Token Status (Iteration {N}/5):
- Master remaining: {X} tokens
- Slave remaining: {Y} tokens
- Estimated iterations possible: {Z}
```

If tokens run low mid-task:
1. Master prioritizes approval to avoid more iterations
2. If approval impossible, request human intervention
3. Option to switch roles mid-task (requires human approval)

## Safety Guards

### Iteration Limit
- **Maximum iterations**: 5 rounds of review/fix cycles
- **Counter tracking**: Both agents must track current iteration count
- **Loop detection**: If the same issue appears 3 times, escalate to human
- **Timeout**: After 5 iterations without approval, pause and request human review

### Human-in-the-Loop Triggers
The work MUST pause for human approval if:
1. Slave agent needs to fallback to a weaker model
2. Iteration limit (5 rounds) is reached
3. Same issue detected 3 times
4. Either agent detects ambiguity that could lead to unsafe outcomes
5. Task scope significantly changes during execution

## Workflow Protocol

### Phase 0: Pre-Flight Check (MANDATORY)
**Before any other phase**, conduct token availability check:
1. Both agents report their available tokens
2. System recommends Master/Slave assignment based on token availability
3. Human confirms or overrides the recommendation
4. Proceed only after explicit human approval

### Phase 1: Planning (Master)
```
MASTER OUTPUT FORMAT:
---
Role: Master ({Agent Name})
Task: {Original user request}
Plan:
1. [Step 1 description]
2. [Step 2 description]
3. [Step N description]

Delegation to Slave ({Other Agent Name}):
- Implement: [Specific instructions]
- Success criteria: [What "done" looks like]
---
```

### Phase 2: Implementation (Slave)
```
SLAVE OUTPUT FORMAT:
---
Role: Slave ({Agent Name})
Iteration: {Current iteration number}/5
Status: Implementation Complete

Work Completed:
1. [What was implemented]
2. [Files created/modified]
3. [Key decisions made]

Ready for Master review.
---
```

### Phase 3: Review (Master)
```
MASTER REVIEW FORMAT:
---
Role: Master ({Agent Name})
Iteration: {Current iteration number}/5
Review Status: [APPROVED | CHANGES REQUIRED]

Findings:
- ✓ [What works well]
- ✗ [What needs fixing]

[If CHANGES REQUIRED:]
Required Changes:
1. [Specific fix #1]
2. [Specific fix #2]

[If APPROVED:]
Status: Work approved. Proceeding to summary.
---
```

### Phase 4: Fix Iteration (Slave) - If Needed
```
SLAVE FIX FORMAT:
---
Role: Slave ({Agent Name})
Iteration: {Current iteration number}/5
Status: Fixes Implemented

Changes Made:
1. [Fix #1 description]
2. [Fix #2 description]

Ready for re-review.
---
```

### Phase 5: Final Summary (Master)
```
FINAL SUMMARY FORMAT:
---
Role: Master ({Agent Name})
Status: PROJECT COMPLETE

Step-by-Step Summary:
1. Planning Phase:
   - [What was planned]
   
2. Implementation Phase (Iteration 1):
   - [What Slave implemented]
   - [Review outcome]
   
3. [Additional iterations if any...]

4. Final Outcome:
   - [What was delivered]
   - [Files/artifacts created]
   - [Quality assessment]

Total Iterations: {N}/5
Collaboration Status: Success
---
```

## Human-in-the-Loop Protocol

When human approval is required:

```
HUMAN APPROVAL REQUEST FORMAT:
---
⚠️ HUMAN APPROVAL REQUIRED ⚠️

Agent: {Agent Name}
Role: {Master/Slave}
Reason: {Why approval is needed}

Context:
- Current iteration: {N}/5
- Task: {What we're trying to do}
- Issue: {Specific problem}

Options:
1. Continue with current approach
2. Modify approach: [Suggestion]
3. Cancel task

Awaiting human decision...
---
```

## Example Usage Scenarios

### Scenario 1: Token-Based Role Assignment
```
User: "Create a Python web scraper with error handling"

[Pre-Flight Check]:
📊 TOKEN AVAILABILITY CHECK

Gemini Status:
- Available tokens: 12,000
- Sufficient for Master role: YES
- Sufficient for Slave role: YES

Codex Status:
- Available tokens: 8,000
- Sufficient for Master role: YES (marginally)
- Sufficient for Slave role: YES

📋 RECOMMENDED ASSIGNMENT:
- Master: Gemini (12,000 tokens - better margin for reviews)
- Slave: Codex (8,000 tokens - sufficient for implementation)

Reason: Gemini has more tokens and Master role requires 2-3x more token usage for planning, reviews, and final summary.

⚠️ HUMAN CONFIRMATION REQUIRED:
Proceed with Gemini as Master, Codex as Slave? [User confirms]

[Gemini - Master]:
Role: Master (Gemini)
Task: Create Python web scraper with error handling
Plan:
1. Design scraper architecture with requests/BeautifulSoup
2. Implement error handling for network failures
3. Add retry logic with exponential backoff
4. Create logging system
5. Write unit tests

Delegation to Slave (Codex):
- Implement: Create scraper.py with all components
- Success criteria: Working scraper with comprehensive error handling

[Codex - Slave]:
Role: Slave (Codex)
Iteration: 1/5
Status: Implementation Complete
...
```

### Scenario 2: Human Overrides Token Recommendation
```
User: "Analyze this dataset and create visualizations"

[Pre-Flight Check]:
📊 TOKEN AVAILABILITY CHECK

Gemini Status:
- Available tokens: 18,000
- Sufficient for Master role: YES
- Sufficient for Slave role: YES

Codex Status:
- Available tokens: 5,000
- Sufficient for Master role: YES (minimal)
- Sufficient for Slave role: YES

📋 RECOMMENDED ASSIGNMENT:
- Master: Gemini (18,000 tokens)
- Slave: Codex (5,000 tokens)

⚠️ HUMAN CONFIRMATION REQUIRED:
User chooses Option 2: "Actually, I want Codex as Master for this data task"

[Codex - Master]:
Role: Master (Codex)
Token Budget: 5,000 (limited to ~2-3 iterations)
Task: Dataset analysis and visualization
...
```

### Scenario 3: Insufficient Tokens - Task Postponed
```
User: "Create a Python web scraper with error handling"

[Gemini - Master]:
Role: Master (Gemini)
Task: Create Python web scraper with error handling
Plan:
1. Design scraper architecture with requests/BeautifulSoup
2. Implement error handling for network failures
3. Add retry logic with exponential backoff
4. Create logging system
5. Write unit tests

Delegation to Slave (Codex):
- Implement: Create scraper.py with all components
- Success criteria: Working scraper with comprehensive error handling

[Codex - Slave]:
Role: Slave (Codex)
Iteration: 1/5
Status: Implementation Complete
...
### Scenario 3: Insufficient Tokens - Task Postponed
```
User: "Build a complex multi-file application"

[Pre-Flight Check]:
📊 TOKEN AVAILABILITY CHECK

Gemini Status:
- Available tokens: 3,000
- Sufficient for Master role: NO (needs 5,000+)
- Sufficient for Slave role: YES (marginal)

Codex Status:
- Available tokens: 4,000
- Sufficient for Master role: NO (needs 5,000+)
- Sufficient for Slave role: YES

⚠️ INSUFFICIENT TOKENS WARNING

Neither agent has sufficient tokens for Master role (minimum 5,000 required).

RECOMMENDATION: 
- Option 1: Postpone task until more tokens available
- Option 2: Simplify task scope to require fewer iterations
- Option 3: Cancel task

Please choose how to proceed.
```

## Best Practices

### For Pre-Flight Check:
- ✓ Always run token check before starting
- ✓ Be honest about token availability
- ✓ Recommend optimal assignment based on tokens
- ✓ Respect human's role override decision
- ✓ Warn if tokens are marginal for task

### For Master Agent:
- ✓ Be specific in delegation instructions
- ✓ Define clear success criteria
- ✓ Review thoroughly but fairly
- ✓ Provide constructive feedback with examples
- ✓ Track iteration count diligently
- ✓ **Monitor token usage after each review**
- ✓ **If tokens running low, prioritize approval**
- ✓ Summarize comprehensively at the end

### For Slave Agent:
- ✓ Follow the plan precisely
- ✓ Document implementation decisions
- ✓ Report completion clearly
- ✓ Make requested fixes exactly
- ✓ Escalate when uncertain
- ✓ **Report token status after implementation**
- ✓ Never proceed if fallback is needed without approval

### For Both Agents:
- ✓ Always include iteration count
- ✓ Watch for infinite loops
- ✓ Communicate clearly
- ✓ Request human help when stuck
- ✓ Maintain professional coordination

## Anti-Patterns to Avoid

❌ **Skipping the pre-flight token check**
❌ **Ignoring token recommendations without good reason**
❌ **Continuing when tokens are insufficient**
❌ Master being too vague in instructions
❌ Slave improvising beyond the plan
❌ Continuing past 5 iterations
❌ Ignoring loop detection warnings
❌ Proceeding with model fallback without approval
❌ Skipping the final summary
❌ Master approving incomplete work to avoid iterations
❌ **Not monitoring token usage during collaboration**

## Error Handling

### Token Exhaustion
If an agent is running low on tokens:
```
⚠️ LOW TOKEN WARNING ⚠️
Agent: {Agent Name}
Role: {Master/Slave}
Remaining tokens: {X}
Required for completion: ~{Y}
Action: {Recommend early approval / Switch roles / Cancel task}
```

### Loop Detection
If the same issue appears multiple times:
```
⚠️ LOOP DETECTED ⚠️
Issue: {Description}
Occurrences: 3
Action: Pausing for human review
```

### Iteration Limit Reached
```
⚠️ ITERATION LIMIT REACHED ⚠️
Iterations: 5/5
Status: Unable to achieve approval
Action: Requesting human intervention
```

### Model Fallback Request
```
⚠️ MODEL FALLBACK REQUIRED ⚠️
Agent: {Agent Name}
Current Model: {Model}
Proposed Fallback: {Weaker Model}
Reason: {Why fallback is needed}
Action: PAUSED - Awaiting human approval
```

## Success Metrics

A successful coordination session includes:
- ✓ **Pre-flight token check completed**
- ✓ **Human confirmed role assignment**
- ✓ Clear role assignment
- ✓ Structured planning
- ✓ Iterative improvement
- ✓ Quality review process
- ✓ Completion within 5 iterations
- ✓ **Completion within token budget**
- ✓ Comprehensive final summary
- ✓ No infinite loops
- ✓ Appropriate human escalation

## Integration with Claude

When Claude implements this skill:
1. **FIRST: Run pre-flight token check for both agents**
2. **SECOND: Get human confirmation on role assignment**
3. Claude then follows the Master or Slave protocol based on confirmed roles
4. Claude maintains strict iteration counting
5. **Claude monitors token usage throughout the process**
6. Claude enforces all safety guards
7. Claude provides clear, formatted outputs following the templates above
8. **Claude warns if tokens are running low mid-task**
9. Claude escalates to human when required

### Token Check Implementation
Claude should use available APIs or system calls to:
- Query current token availability for each agent
- Calculate estimated tokens needed based on task complexity
- Make intelligent recommendations for role assignment
- Warn about insufficient tokens before starting
- Monitor token consumption during the task
3. **Review**: Check the Slave's work for correctness, completeness, and quality
4. **Approval**: Either approve the work or request specific fixes
5. **Summary**: Provide a comprehensive step-by-step report at completion

### Slave Agent (Implementer)
The Slave agent is responsible for:
1. **Implementation**: Execute the Master's plan with precision
2. **Reporting**: Clearly communicate what was implemented
3. **Iteration**: Make requested fixes until approval is granted
4. **Escalation**: Request human approval if fallback to weaker model is needed

## Safety Guards

### Iteration Limit
- **Maximum iterations**: 5 rounds of review/fix cycles
- **Counter tracking**: Both agents must track current iteration count
- **Loop detection**: If the same issue appears 3 times, escalate to human
- **Timeout**: After 5 iterations without approval, pause and request human review

### Human-in-the-Loop Triggers
The work MUST pause for human approval if:
1. Slave agent needs to fallback to a weaker model
2. Iteration limit (5 rounds) is reached
3. Same issue detected 3 times
4. Either agent detects ambiguity that could lead to unsafe outcomes
5. Task scope significantly changes during execution

## Workflow Protocol

### Phase 1: Planning (Master)
```
MASTER OUTPUT FORMAT:
---
Role: Master ({Agent Name})
Task: {Original user request}
Plan:
1. [Step 1 description]
2. [Step 2 description]
3. [Step N description]

Delegation to Slave ({Other Agent Name}):
- Implement: [Specific instructions]
- Success criteria: [What "done" looks like]
---
```

### Phase 2: Implementation (Slave)
```
SLAVE OUTPUT FORMAT:
---
Role: Slave ({Agent Name})
Iteration: {Current iteration number}/5
Status: Implementation Complete

Work Completed:
1. [What was implemented]
2. [Files created/modified]
3. [Key decisions made]

Ready for Master review.
---
```

### Phase 3: Review (Master)
```
MASTER REVIEW FORMAT:
---
Role: Master ({Agent Name})
Iteration: {Current iteration number}/5
Review Status: [APPROVED | CHANGES REQUIRED]

Findings:
- ✓ [What works well]
- ✗ [What needs fixing]

[If CHANGES REQUIRED:]
Required Changes:
1. [Specific fix #1]
2. [Specific fix #2]

[If APPROVED:]
Status: Work approved. Proceeding to summary.
---
```

### Phase 4: Fix Iteration (Slave) - If Needed
```
SLAVE FIX FORMAT:
---
Role: Slave ({Agent Name})
Iteration: {Current iteration number}/5
Status: Fixes Implemented

Changes Made:
1. [Fix #1 description]
2. [Fix #2 description]

Ready for re-review.
---
```

### Phase 5: Final Summary (Master)
```
FINAL SUMMARY FORMAT:
---
Role: Master ({Agent Name})
Status: PROJECT COMPLETE

Step-by-Step Summary:
1. Planning Phase:
   - [What was planned]
   
2. Implementation Phase (Iteration 1):
   - [What Slave implemented]
   - [Review outcome]
   
3. [Additional iterations if any...]

4. Final Outcome:
   - [What was delivered]
   - [Files/artifacts created]
   - [Quality assessment]

Total Iterations: {N}/5
Collaboration Status: Success
---
```

## Human-in-the-Loop Protocol

When human approval is required:

```
HUMAN APPROVAL REQUEST FORMAT:
---
⚠️ HUMAN APPROVAL REQUIRED ⚠️

Agent: {Agent Name}
Role: {Master/Slave}
Reason: {Why approval is needed}

Context:
- Current iteration: {N}/5
- Task: {What we're trying to do}
- Issue: {Specific problem}

Options:
1. Continue with current approach
2. Modify approach: [Suggestion]
3. Cancel task

Awaiting human decision...
---
```

## Example Usage Scenarios

### Scenario 1: Gemini as Master, Codex as Slave
```
User: "Create a Python web scraper with error handling"

[Gemini - Master]:
Role: Master (Gemini)
Task: Create Python web scraper with error handling
Plan:
1. Design scraper architecture with requests/BeautifulSoup
2. Implement error handling for network failures
3. Add retry logic with exponential backoff
4. Create logging system
5. Write unit tests

Delegation to Slave (Codex):
- Implement: Create scraper.py with all components
- Success criteria: Working scraper with comprehensive error handling

[Codex - Slave]:
Role: Slave (Codex)
Iteration: 1/5
Status: Implementation Complete
...
```

### Scenario 2: Codex as Master, Gemini as Slave
```
User: "Analyze this dataset and create visualizations"

[Codex - Master]:
Role: Master (Codex)
Task: Dataset analysis and visualization
Plan:
1. Load and validate dataset
2. Perform exploratory data analysis
3. Create 3 key visualizations
4. Generate statistical summary

Delegation to Slave (Gemini):
- Implement: Run analysis and create plots
- Success criteria: Clean visualizations with insights
...
```

## Best Practices

### For Master Agent:
- ✓ Be specific in delegation instructions
- ✓ Define clear success criteria
- ✓ Review thoroughly but fairly
- ✓ Provide constructive feedback with examples
- ✓ Track iteration count diligently
- ✓ Summarize comprehensively at the end

### For Slave Agent:
- ✓ Follow the plan precisely
- ✓ Document implementation decisions
- ✓ Report completion clearly
- ✓ Make requested fixes exactly
- ✓ Escalate when uncertain
- ✓ Never proceed if fallback is needed without approval

### For Both Agents:
- ✓ Always include iteration count
- ✓ Watch for infinite loops
- ✓ Communicate clearly
- ✓ Request human help when stuck
- ✓ Maintain professional coordination

## Anti-Patterns to Avoid

❌ Master being too vague in instructions
❌ Slave improvising beyond the plan
❌ Continuing past 5 iterations
❌ Ignoring loop detection warnings
❌ Proceeding with model fallback without approval
❌ Skipping the final summary
❌ Master approving incomplete work to avoid iterations

## Error Handling

### Loop Detection
If the same issue appears multiple times:
```
⚠️ LOOP DETECTED ⚠️
Issue: {Description}
Occurrences: 3
Action: Pausing for human review
```

### Iteration Limit Reached
```
⚠️ ITERATION LIMIT REACHED ⚠️
Iterations: 5/5
Status: Unable to achieve approval
Action: Requesting human intervention
```

### Model Fallback Request
```
⚠️ MODEL FALLBACK REQUIRED ⚠️
Agent: {Agent Name}
Current Model: {Model}
Proposed Fallback: {Weaker Model}
Reason: {Why fallback is needed}
Action: PAUSED - Awaiting human approval
```

## Success Metrics

A successful coordination session includes:
- ✓ Clear role assignment
- ✓ Structured planning
- ✓ Iterative improvement
- ✓ Quality review process
- ✓ Completion within 5 iterations
- ✓ Comprehensive final summary
- ✓ No infinite loops
- ✓ Appropriate human escalation
