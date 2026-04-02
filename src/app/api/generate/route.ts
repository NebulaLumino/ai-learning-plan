import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { studentAge, subject, currentLevel, learningGoals, timePerWeek, resources } = await req.json();

    const prompt = `You are an expert educational consultant and personalized learning specialist. Generate a customized learning plan for the following student:

**Student Profile:**
- Age/Grade: ${studentAge}
- Subject(s): ${subject}
- Current Level: ${currentLevel}
- Learning Goals: ${learningGoals}
- Time Available Per Week: ${timePerWeek}
- Available Resources: ${resources || "Standard school resources"}

Please generate a comprehensive personalized learning plan:

# 🎓 PERSONALIZED LEARNING PLAN
## ${subject} | ${studentAge} | ${timePerWeek}/week

---

## 1. STUDENT PROFILE SUMMARY

| Field | Details |
|-------|---------|
| Age/Grade | ${studentAge} |
| Subject Focus | ${subject} |
| Current Level | ${currentLevel} |
| Weekly Time Commitment | ${timePerWeek} |
| Primary Learning Goals | ${learningGoals} |

### Current Strengths Assessment
[Based on "${currentLevel}" level, identify what the student likely already knows well]

### Priority Areas for Growth
[Based on "${learningGoals}", identify the most important areas to develop]

---

## 2. WEEKLY LEARNING SCHEDULE

Based on ${timePerWeek} per week, here is the recommended weekly structure:

### Weekly Template (${timePerWeek} breakdown):

**Day 1 — Concept Introduction (${Math.ceil(parseInt(timePerWeek) / 7)} hours)**
- New topic introduction (watch video/read)
- Light note-taking
- 5-minute reflection

**Day 2 — Deep Dive & Practice (${Math.ceil(parseInt(timePerWeek) / 7)} hours)**
- Review previous day's notes
- Work through practice problems
- Identify confusion points

**Day 3 — Application & Review (${Math.ceil(parseInt(timePerWeek) / 7)} hours)**
- Apply concepts to real-world problems
- Quiz yourself (active recall)
- Review spaced repetition cards

**Day 4 — Rest or Light Review**
- 30-minute light review only
- Brain needs time to consolidate!

**Day 5 — Assessment & Correction (${Math.ceil(parseInt(timePerWeek) / 7)} hours)**
- Take a practice quiz or test
- Carefully review mistakes
- Fill in knowledge gaps

**Days 6-7 — Weekend Projects / Deep Work**
- Creative application of concepts
- Work on a mini-project if applicable
- 1-hour comprehensive review session

---

## 3. SESSION-BY-SESSION TUTOR AGENDA

For each tutor session, follow this structure:

### Session 1: Getting Started & Diagnostic
**Duration:** ${timePerWeek.includes("5") ? "45-60" : "30-45"} minutes
- Warm-up questions (5 min)
- Assess current level through targeted questions (15 min)
- Introduce 2-3 key concepts for the week (20 min)
- Assign practice work (5 min)
- Preview of next session (5 min)

### Session 2: Concept Reinforcement
- Review homework and questions (10 min)
- Address confusion points (15 min)
- Guided practice with feedback (20 min)
- Independent practice (10 min)
- Set up weekly challenge (5 min)

### Session 3: Progress Check & Application
- Quick knowledge check (10 min)
- Apply concepts to new contexts (20 min)
- Error analysis of recent work (15 min)
- Goal setting for next cycle (10 min)

---

## 4. 30-60-90 DAY MILESTONES

### 📅 30-Day Milestone (Short-Term)
By day 30, the student will:
- [ ] Have completed all foundational topics in ${subject}
- [ ] Score at least ${currentLevel.includes("Beginner") ? "60" : currentLevel.includes("Intermediate") ? "70" : "80"}% on topic quizzes
- [ ] Demonstrate understanding of [2-3 key concepts]
- [ ] Build consistent study habits

### 📅 60-Day Milestone (Medium-Term)
By day 60, the student will:
- [ ] Progress to ${currentLevel.includes("Beginner") ? "Intermediate" : currentLevel.includes("Intermediate") ? "Advanced Intermediate" : "Advanced"} level in ${subject}
- [ ] Score at least ${currentLevel.includes("Beginner") ? "75" : currentLevel.includes("Intermediate") ? "80" : "88"}% on cumulative assessments
- [ ] Be able to teach 2 concepts back to the tutor
- [ ] Complete a mini-project demonstrating mastery

### 📅 90-Day Milestone (Long-Term)
By day 90, the student will:
- [ ] Achieve the stated goal: ${learningGoals}
- [ ] Score at least ${currentLevel.includes("Beginner") ? "85" : currentLevel.includes("Intermediate") ? "90" : "95"}% on practice exams
- [ ] Have built independent study skills
- [ ] Be ready for next level (final exam / next course / etc.)

---

## 5. RECOMMENDED RESOURCES

### Primary Learning Resources
| Resource | Type | Purpose |
|----------|------|---------|
| [Recommended textbook/website] | Reading | Concept introduction |
| [Recommended video series] | Video | Visual explanations |
| [Practice problems website] | Practice | Skill building |
| [This app's flashcard generator] | Review | Spaced repetition |

### Supplementary Resources
- [Free resource 1]
- [Free resource 2]
- [Book recommendation]

### Progress Tracking Tools
- Quizlet or Anki for flashcards
- Khan Academy for ${subject}
- Khan Academy or IXL for practice problems

---

## 6. MOTIVATION & ENGAGEMENT STRATEGIES

### Intrinsic Motivation Boosters:
1. **Choice:** Let the student pick which sub-topic to tackle first when possible
2. **Relevance:** Connect ${subject} concepts to their hobbies/interests
3. **Progress Tracking:** Use a visual progress chart to show improvement
4. **Micro-Wins:** Celebrate small milestones (every 25% improvement)

### When Motivation Drops:
- Switch activity type (reading → video → hands-on)
- Take a 1-day break
- Try a "teach it back" session — explaining concepts cements learning
- Play a quick ${subject}-related game

---

## 7. PARENT/GUARDIAN INVOLVEMENT TIPS
- Check in briefly once a week on progress
- Ask "What did you learn today?" instead of "Did you do your homework?"
- Provide a dedicated study space and tools
- Celebrate milestones with small rewards

---

## 8. PLAN REVIEW SCHEDULE
This plan should be reviewed and updated:
- **Weekly:** Quick check-in (5 min) — Is the pace right?
- **Every 2 weeks:** Session with tutor to adjust pace/topics
- **30/60/90 days:** Major milestone review and plan update

---
*This learning plan was generated by AI. Review with a qualified educator before implementation.*`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4500,
    });

    const content = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ result: content });
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
