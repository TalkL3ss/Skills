# Agent Coordination Skill: Master-Slave Pattern

## Overview
This skill enables coordinated work between two AI agents (Gemini and Codex) using a master-slave pattern. The first agent invoked becomes the **Master** (planner/reviewer), and the second becomes the **Slave** (implementer). This creates a checks-and-balances system for complex tasks.

## Role Determination
- **If Gemini runs first**: Gemini = Master, Codex = Slave
- **If Codex runs first**: Codex = Master, Gemini = Slave

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
