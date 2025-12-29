# Walkthrough: "Uncommon Knowledge" Game Mechanics

I have successfully updated the Trivia App to reflect the "I Should Have Known That" style of gameplay.

## Changes Implemented
1.  **Game Setup**:
    -   Added **Game Mode Selection**: Choose between "Head-to-Head" (Simultaneous) or "Team Mode" (Turn-Based).
2.  **Core Gameplay**:
    -   **Batch Rounds**: Questions now appear in batches of 4.
    -   **Worksheet Interface**: Players can scroll through questions and answer in any order.
    -   **Text Input**: Multiple choice is gone. You must type the answer.
    -   **Locking**: You can "Lock" an answer to prevent accidental changes.
3.  **Mechanics**:
    -   **Global Timer**: A 5-minute timer runs for the entire batch.
    -   **Scoring**: Correct answers give +100 points. Wrong answers deduct -100 points. Blank answers remain 0.
    -   **Turn Management**: In Team Mode, the game alternates between teams after each round summary.

## Verification Steps
To verify these changes:

1.  **Start the App**: Run `npm run dev`.
2.  **Select a Country** (e.g., USA).
3.  **Setup Teams**:
    -   Select "Team Mode".
    -   Enter team names and click "Start Game".
4.  **Play a Round**:
    -   Verify the 5:00 timer starts.
    -   Type a correct answer for one question (check console/network for answers if you need to cheat for testing!).
    -   Type a purposefully wrong answer for another.
    -   Leave one blank.
    -   Click "Submit Batch".
5.  **Check Summary**:
    -   Verify the score delta (should be 0 if you got 1 right +100 and 1 wrong -100).
    -   Verify the Summary screen shows your answers vs correct answers.
6.  **Next Turn**:
    -   Click "Next Team".
    -   Verify the active team name changes in the top left or scoreboard.

## Known Limitations (MVP)
-   **Fuzzy Matching**: Currently supports case-insensitive exact matches and simple punctuation removal. "The Eiffel Tower" vs "Eiffel Tower" might strictly depend on the API data, though generic "The" handling isn't explicitly stripped yet beyond basic normalization.
-   **Timer**: If the timer hits 0:00, it currently force-submits whatever is in the inputs.
