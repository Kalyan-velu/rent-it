# CRS Sprint Planning - Google Sheets Guide

## Overview
This sprint planning package contains 7 comprehensive CSV files that can be imported into Google Sheets to manage your Car Rental Software (CRS) development project.

## Files Included

### 1. crs_sprint_plan.csv
**Main Sprint Breakdown** - The core planning document with all tasks organized by sprint.

**Columns:**
- Sprint: Sprint number (0-22)
- Week: Calendar week
- Phase: Development phase (Setup, Phase 1, Phase 2, Phase 3)
- Component: System component (Super Admin, Service Admin, Customer Portal, etc.)
- Feature/Task: Specific feature being built
- Description: Detailed description
- Priority: CRITICAL, HIGH, MEDIUM, LOW
- Story Points: Effort estimation (1-34)
- Status: Not Started, In Progress, Testing, Completed, Blocked
- Dependencies: What must be completed first
- Assignee: Who's working on it
- Notes: Additional context

**How to Use:**
1. Import into Google Sheets
2. Add filters to header row
3. Create pivot tables for sprint summaries
4. Use conditional formatting for status colors
5. Update Status and Assignee columns as you progress

### 2. story_points_guide.csv
**Story Points Reference** - Explains the effort estimation system.

**Use this to:**
- Understand time estimates for each story point value
- Calibrate your estimations
- Reference when planning new features

### 3. cost_budget_tracking.csv
**Budget & Infrastructure Costs** - Monthly and annual cost tracking.

**Includes:**
- Monthly operational costs (hosting, database, email, SMS, etc.)
- Scaling costs as you grow
- One-time development costs if outsourcing
- Phase-based cost breakdown

**How to Use:**
- Track actual vs. estimated costs
- Plan budget for each phase
- Monitor ROI and burn rate
- Forecast scaling costs

### 4. feature_priority_matrix.csv
**Feature Prioritization** - Scores features based on business value, complexity, and impact.

**Columns:**
- Business Value (1-10): How important to business
- Technical Complexity (1-10): How hard to build
- User Impact (1-10): How much users benefit
- Priority Score: Calculated total
- Must Have: YES/NO for MVP

**How to Use:**
- Sort by Priority Score to see what matters most
- Use for trade-off decisions
- Validate phase assignments
- Communicate priorities to stakeholders

### 5. technical_dependencies_risks.csv
**Technical Dependencies & Risks** - Identifies technical challenges and mitigation strategies.

**Includes:**
- Feature dependencies
- Technical risks for each feature
- Mitigation strategies
- Required external services
- Integration time estimates

**How to Use:**
- Review before starting any feature
- Plan for risk mitigation
- Budget for external service costs
- Identify potential blockers early

### 6. database_schema_plan.csv
**Database Schema Planning** - Complete database table structure.

**For each table:**
- Purpose and key fields
- Relationships to other tables
- Required indexes
- Important notes

**How to Use:**
- Reference when creating migrations
- Ensure data integrity with proper relationships
- Plan indexes for performance
- Understand the complete data model

### 7. weekly_progress_tracker.csv
**Weekly Progress Tracking** - Track actual progress against plan.

**Columns:**
- Planned vs. Completed Story Points
- Velocity tracking
- Blockers
- Key achievements
- Next week focus

**How to Use:**
- Update weekly during sprint review
- Calculate team velocity
- Identify trends and issues
- Report progress to stakeholders

## How to Import to Google Sheets

### Option 1: Import All as Separate Sheets
1. Create a new Google Sheets workbook
2. For each CSV file:
   - Click the "+" to add a new sheet
   - File > Import > Upload
   - Select the CSV file
   - Choose "Insert new sheet(s)"
   - Click "Import data"
3. Rename each sheet appropriately

### Option 2: Import to Existing Sheet
1. Open your Google Sheets
2. File > Import
3. Upload tab > Select file
4. Choose import location
5. Repeat for each file

## Recommended Setup in Google Sheets

### 1. Main Sprint Plan Sheet
**Conditional Formatting:**
- Status column: Green (Completed), Yellow (In Progress), Red (Blocked), Gray (Not Started)
- Priority column: Red (CRITICAL), Orange (HIGH), Yellow (MEDIUM), Blue (LOW)

**Filters:**
- Add filters to all columns
- Create filter views for:
  - Current sprint only
  - My tasks (by Assignee)
  - By component
  - By phase

**Formulas to Add:**
- Column for "% Complete" per sprint
- Total story points per sprint
- Burndown tracking

### 2. Progress Tracker Sheet
**Add Charts:**
- Burndown chart (Planned vs Completed Story Points over time)
- Velocity chart (Story Points completed per week)
- Status pie chart

**Weekly Update Checklist:**
1. Update Completed Story Points
2. Calculate Velocity (Completed / Planned * 100%)
3. Log blockers and achievements
4. Plan next week's focus
5. Update main sprint plan Status column

### 3. Cost Budget Sheet
**Add Tracking:**
- "Actual Cost" column next to estimates
- "Variance" formula (Actual - Estimated)
- Running total for year-to-date costs
- Budget remaining calculation

### 4. Feature Priority Matrix
**Visualizations:**
- Scatter plot: Technical Complexity vs Business Value
- Bar chart: Priority Score ranking
- Filter view: Must Have features only

## Sprint Ceremonies (Recommended)

### Weekly (Every Friday):
1. **Sprint Review** (1 hour)
   - Demo completed features
   - Update sprint plan Status
   - Update weekly progress tracker

2. **Sprint Retrospective** (30 min)
   - What went well
   - What to improve
   - Action items

3. **Sprint Planning** (1 hour)
   - Review next week's tasks
   - Assign tasks
   - Identify dependencies and risks

### Monthly:
1. Review budget vs actual costs
2. Reassess feature priorities
3. Adjust timeline if needed

## Tips for Solo Development

1. **Be Realistic**: Don't overcommit on story points
2. **Track Everything**: Even if alone, documentation helps future you
3. **Weekly Reviews**: Take time to reflect and adjust
4. **Celebrate Wins**: Mark milestones and completed phases
5. **Stay Flexible**: Adjust priorities based on learning
6. **Document Decisions**: Use Notes column to explain why you did things

## Key Metrics to Track

1. **Velocity**: Average story points per week
2. **Sprint Completion Rate**: % of planned tasks completed
3. **Time to Market**: Weeks to Phase 1 completion
4. **Budget Variance**: Actual vs planned costs
5. **Feature Completion**: % of Phase 1 features done

## Phase Gates (Go/No-Go Checkpoints)

### Before Phase 1 Launch:
- [ ] All CRITICAL features completed
- [ ] Security audit passed
- [ ] Performance testing completed
- [ ] At least 2 test users validated the system
- [ ] Production environment stable
- [ ] Backup and recovery tested

### Before Phase 2 Start:
- [ ] Phase 1 in production for 2+ weeks
- [ ] No critical bugs in Phase 1
- [ ] User feedback incorporated
- [ ] Resources (time/budget) available

### Before Phase 3 Start:
- [ ] At least 5 paying customers
- [ ] Positive user feedback
- [ ] ROI justifies additional features
- [ ] Technical debt addressed

## Getting Help

If you need to:
- **Add features**: Use feature_priority_matrix.csv to evaluate
- **Estimate time**: Refer to story_points_guide.csv
- **Check dependencies**: See technical_dependencies_risks.csv
- **Plan database**: Reference database_schema_plan.csv
- **Track costs**: Update cost_budget_tracking.csv

## Version Control

Recommended: Use Google Sheets' version history feature
- File > Version history > See version history
- Name important versions (e.g., "Phase 1 Complete")
- Restore previous versions if needed

## Export & Backup

Weekly backup recommendation:
1. File > Download > Microsoft Excel (.xlsx)
2. Save with date in filename (e.g., "CRS_Sprint_Plan_2026-02-01.xlsx")
3. Store in cloud backup (Dropbox, OneDrive, etc.)

---

Good luck with your CRS development! Remember: it's a marathon, not a sprint. Take it one feature at a time. 🚀