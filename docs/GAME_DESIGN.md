# Game Design Document: "Uncommon Knowledge" (Revised)

## 1. Core Concept
A trivia game for 1-2 players (or teams) based on the "I Should Have Known That" mechanic. Players are presented with questions where the answers are generally common knowledge, but the fear of losing points makes confidence king.
The goal is not just to know the answer, but to be sure enough to risk your score.

**Platform**: Web
**Players**: 1-2 (Solo or Head-to-Head)

## 2. Gameplay Loop
The game consists of a series of "Rounds".

### The Round Structure
-   **Questions per Round**: 4
-   **Time Limit**: 5 Minutes (Global timer for all 4 questions)
-   **Display**: All 4 questions are accessible. Players can move between them freely ("Worksheet" style).

### Action Flow
1.  **Round Start**: Timer begins counting down from 5:00.
2.  **Answering**:
    -   Players select a question.
    -   **Input**: Players *type* their answer into a text field. (No multiple choice).
    -   **Lock In**: Players can "Lock In" an answer at any time. Once locked, it cannot be changed.
    -   **Pass/Skip**: Players can choose to leave a question blank or skip it entirely to avoid penalties. They can return to skipped questions if time permits.
3.  **Submission**:
    -   The round ends when the timer hits 0:00 OR when the player manually submits the entire batch.
    -   Any "un-locked" text in a box at 0:00 is considered a "Pass" (safety mechanism) or an "Answer" depending on user preference (Default: Treat as Pass to prevent typos from penalty).
    *Design Decision**: Explicit "Submit" button required to count the answer. Empty or drafted but unsubmitted fields count as Pass.

## 3. Scoring System
The core tension is between gaining points and avoiding penalties.

-   **Correct Answer**: +Points (e.g., +100)
-   **Incorrect Answer**: -Points (e.g., -50 or -100). The user specified "docked points".
-   **Pass (No Answer)**: 0 Points. "If you don't know, don't guess."

## 4. "You Should Have Known" Mechanics
-   **The Penalty**: The penalty for a wrong answer is significant (equal to or close to the reward), discouraging random guessing.
-   **The Content**: Questions are skewed towards things people feel they *should* know (concepts, simple math, famous logos, common phrases), rather than obscure trivia.
-   **The Twist (Game Modes)**:
    -   **Head-to-Head (2 Player)**: Both players answer simultaneously on their own devices/splitscreen. Scores reveal at end of round.
    -   **Team Mode (Group)**: Turn-based. Team A plays Round 1 (Batch of 4). Team B plays Round 2 (New Batch of 4). Taking turns emphasizes the "Group huddle" dynamic.

## 5. Technical Requirements
-   **Input Handling**: Fuzzy string matching is required to handle typos (e.g., "Eiffel Tower" vs "eiffel tower" vs "The Eiffel Tower").
-   **Timer Sync**: Server-side authority on the 5-minute timer.
