# Project QA report

## Question bank
- Total: 200 MCQs.
- Grade 10: 100 MCQs across all 20 lesson units (5 per lesson).
- Grade 11: 100 MCQs across all 15 lesson units (6–7 per lesson).
- Every item has four distinct options, one valid zero-based correct-answer index, a Sinhala explanation, grade metadata, lesson metadata, and an assigned power-up type.
- Duplicate question text and duplicate options were checked; none were found.

## Power-up quiz flow
- The quiz is connected to Jumping Boots, Flying Boost, and Hoverboard.
- The game render loop pauses while the quiz is open.
- Wrong answers reveal the correct option and explanation and provide a retry action.
- Correct answers enable collection and apply the corresponding power-up.
- A mocked runtime test exercised wrong answer, retry, correct answer, collection, and quiz close for all three power-up types.

## Project preservation and static checks
- Preserved the original project files and assets, including the four existing worlds: City, Neon, Jungle Temple, and Ancient Egypt.
- Preserved swipe-only controls: left/right to change lanes, up to jump, down to slide. No keyboard gameplay handlers or on-screen gameplay control buttons were added.
- `node --check` passed for all project JavaScript files.
- Script and asset path checks passed.

## Curriculum reference and limitation
The lesson structure was taken from the Sri Lanka Ministry of Education e-Thaksalawa Grade 10 and Grade 11 Science course pages. Those pages list 20 Grade 10 lesson units and 15 Grade 11 lesson units. This build is aligned to the lesson structure currently available on those official course pages; it should not be represented as independently certified against a different or later syllabus revision.

- Grade 10 course: https://e-thaksalawa.moe.gov.lk/lcms/course/view.php?id=844&lang=si
- Grade 11 course: https://e-thaksalawa.moe.gov.lk/lcms/course/view.php?id=437&lang=si

## Browser test limitation
A full interactive browser/WebGL launch could not be completed in this environment: headless Chromium failed during graphics initialization and timed out. Therefore this report does not claim a successful visual gameplay test. Static checks and the mocked quiz-runtime test did pass.
