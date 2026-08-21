"use strict";

/* =============================================================
   BIRTHDAY MYSTERY EXPERIENCE
============================================================= */


/* =============================================================
   STATE
============================================================= */

const state = {

    currentScene: 0,

    soundEnabled: true,

    clueFound: false,

    correctChoice: false,

    secretUnlocked: false,

    stage2Started: false

};


/* =============================================================
   DOM
============================================================= */

const scenes =
    Array.from(
        document.querySelectorAll(".scene")
    );

const progressBar =
    document.getElementById("progressBar");

const chapterNumber =
    document.getElementById("chapterNumber");

const chapterName =
    document.getElementById("chapterName");

const transition =
    document.getElementById("transition");

const toast =
    document.getElementById("toast");

const soundButton =
    document.getElementById("soundButton");


/* =============================================================
   STAGE 2 DOM
============================================================= */

const finalButton =
    document.getElementById("finalButton");

const clueButton =
    document.getElementById("clueButton");

const secretDate =
    document.getElementById("secretDate");

const dateButton =
    document.getElementById("dateButton");

const dateMessage =
    document.getElementById("dateMessage");

const revealButton =
    document.getElementById("revealButton");

const revealText =
    document.getElementById("revealText");

const revealHeart =
    document.getElementById("revealHeart");


/* =============================================================
   INITIALIZE
============================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    setupNavigation();

    setupClue();

    setupChoices();

    setupSound();

    setupFinalButton();

    setupStage2();

    setupSwipeNavigation();

    setupKeyboardNavigation();

    updateUI();

}


/* =============================================================
   NAVIGATION
============================================================= */

function setupNavigation() {

    document
        .querySelectorAll("[data-next]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const next =
                        Number(
                            button.dataset.next
                        );

                    goToScene(next);

                }
            );

        });

}


/* =============================================================
   GO TO SCENE
============================================================= */

function goToScene(
    sceneIndex,
    animated = true
) {

    if (
        sceneIndex < 0 ||
        sceneIndex >= scenes.length
    ) {
        return;
    }


    /*
     * Do not allow skipping scenes.
     */

    if (
        sceneIndex >
        state.currentScene + 1
    ) {
        return;
    }


    /*
     * Interactive protection.
     */

    if (
        state.currentScene === 2 &&
        !state.clueFound &&
        sceneIndex > 2
    ) {

        showToast(
            "There is something you haven't found yet..."
        );

        return;

    }


    if (
        state.currentScene === 3 &&
        !state.correctChoice &&
        sceneIndex > 3
    ) {

        showToast(
            "Choose carefully..."
        );

        return;

    }


    if (!animated) {

        activateScene(
            sceneIndex
        );

        return;

    }


    transition.classList.add(
        "active"
    );


    setTimeout(() => {

        activateScene(
            sceneIndex
        );


        setTimeout(() => {

            transition.classList.remove(
                "active"
            );

        }, 100);

    }, 450);

}


/* =============================================================
   ACTIVATE SCENE
============================================================= */

function activateScene(sceneIndex) {

    scenes.forEach(scene => {

        scene.classList.remove(
            "active"
        );

    });


    const scene =
        scenes[sceneIndex];


    if (!scene) {
        return;
    }


    scene.classList.add(
        "active"
    );


    state.currentScene =
        sceneIndex;


    updateUI();


    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* =============================================================
   UPDATE UI
============================================================= */

function updateUI() {

    const scene =
        scenes[state.currentScene];


    if (!scene) {
        return;
    }


    const number =
        scene.dataset.chapter ||
        "00";


    const name =
        scene.dataset.name ||
        "";


    chapterNumber.textContent =
        number;


    chapterName.textContent =
        name;


    const progress =
        (
            state.currentScene /
            (scenes.length - 1)
        ) * 100;


    progressBar.style.width =
        `${progress}%`;

}


/* =============================================================
   CLUE
============================================================= */

function setupClue() {

    const clue =
        document.getElementById(
            "hiddenClue"
        );

    const message =
        document.getElementById(
            "clueMessage"
        );

    const continueButton =
        document.getElementById(
            "memoryContinue"
        );


    if (!clue) {
        return;
    }


    clue.addEventListener(
        "click",
        () => {

            if (state.clueFound) {
                return;
            }


            state.clueFound =
                true;


            clue.classList.add(
                "found"
            );


            message.textContent =
                "You found it...";


            message.style.color =
                "rgba(255,210,220,.9)";


            showToast(
                "Something tells me you are good at this..."
            );


            setTimeout(() => {

                message.textContent =
                    "But this was only the first clue.";


                continueButton.classList.remove(
                    "hidden"
                );

            }, 1300);

        }
    );

}


/* =============================================================
   MEMORY CHOICES
============================================================= */

function setupChoices() {

    const choices =
        document.querySelectorAll(
            ".memory-choice"
        );

    const message =
        document.getElementById(
            "choiceMessage"
        );

    const continueButton =
        document.getElementById(
            "choiceContinue"
        );


    choices.forEach(choice => {

        choice.addEventListener(
            "click",
            () => {

                if (
                    state.correctChoice
                ) {
                    return;
                }


                const correct =
                    choice.dataset.correct ===
                    "true";


                if (correct) {

                    state.correctChoice =
                        true;


                    choice.classList.add(
                        "correct"
                    );


                    choices.forEach(item => {

                        item.disabled =
                            true;

                    });


                    message.textContent =
                        "Yes... you know us better than anyone.";


                    continueButton.classList.remove(
                        "hidden"
                    );


                } else {

                    choice.classList.add(
                        "wrong"
                    );


                    showToast(
                        "Not this one... look again."
                    );


                    setTimeout(() => {

                        choice.classList.remove(
                            "wrong"
                        );

                    }, 400);

                }

            }
        );

    });

}


/* =============================================================
   SOUND
============================================================= */

function setupSound() {

    if (!soundButton) {
        return;
    }


    soundButton.addEventListener(
        "click",
        () => {

            state.soundEnabled =
                !state.soundEnabled;


            soundButton.textContent =
                state.soundEnabled
                    ? "♫"
                    : "×";


            showToast(
                state.soundEnabled
                    ? "Sound enabled"
                    : "Sound muted"
            );

        }
    );

}


/* =============================================================
   STAGE 2
============================================================= */

function setupFinalButton() {

    if (!finalButton) {
        return;
    }


    finalButton.addEventListener(
        "click",
        () => {

            if (
                state.stage2Started
            ) {
                return;
            }


            state.stage2Started =
                true;


            finalButton.disabled =
                true;


            /*
             * Scene 5 -> Scene 6
             */

            goToScene(6);

        }
    );

}


/* =============================================================
   STAGE 2 SETUP
============================================================= */

function setupStage2() {

    setupClueButton();

    setupDateButton();

    setupRevealButton();

}


/* =============================================================
   CLUE BUTTON
============================================================= */

function setupClueButton() {

    if (!clueButton) {
        return;
    }


    clueButton.addEventListener(
        "click",
        () => {

            goToScene(7);

        }
    );

}


/* =============================================================
   SECRET DATE
============================================================= */

/*
 * TEMPORARY DATE
 *
 * Change this later to the actual
 * date you want her to discover.
 */

const SECRET_DATE =
    "22/08/2026";


function setupDateButton() {

    if (!dateButton) {
        return;
    }


    dateButton.addEventListener(
        "click",
        checkSecretDate
    );


    if (secretDate) {

        secretDate.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    checkSecretDate();

                }

            }
        );

    }

}


/* =============================================================
   CHECK SECRET DATE
============================================================= */

function checkSecretDate() {

    if (!secretDate) {
        return;
    }


    const value =
        secretDate.value
            .trim()
            .replace(/\s/g, "");


    if (
        value === SECRET_DATE
    ) {

        state.secretUnlocked =
            true;


        dateMessage.textContent =
            "You remembered... ❤️";


        dateMessage.style.color =
            "rgba(255,210,220,.95)";


        secretDate.style.borderColor =
            "rgba(255,190,210,.8)";


        dateButton.disabled =
            true;


        setTimeout(() => {

            goToScene(8);

        }, 1200);


    } else {

        secretDate.classList.add(
            "input-error"
        );


        dateMessage.textContent =
            "Not quite... think about it.";


        dateMessage.style.color =
            "rgba(255,150,170,.8)";


        setTimeout(() => {

            secretDate.classList.remove(
                "input-error"
            );

        }, 500);

    }

}


/* =============================================================
   REVEAL BUTTON
============================================================= */

function setupRevealButton() {

    if (!revealButton) {
        return;
    }


    revealButton.addEventListener(
        "click",
        startPreReveal
    );

}


/* =============================================================
   PRE-REVEAL
============================================================= */

function startPreReveal() {

    goToScene(9);


    /*
     * Reset the reveal elements.
     */

    if (revealText) {

        revealText.classList.remove(
            "visible"
        );

        revealText.textContent =
            "";

    }


    if (revealHeart) {

        revealHeart.classList.remove(
            "visible"
        );

    }


    /*
     * First message.
     */

    setTimeout(() => {

        revealMessage(
            "Now I can finally tell you..."
        );

    }, 900);


    /*
     * Second message.
     */

    setTimeout(() => {

        hideRevealText();

    }, 3000);


    setTimeout(() => {

        revealMessage(
            "There was a reason for every clue."
        );

    }, 3900);


    /*
     * Third message.
     */

    setTimeout(() => {

        hideRevealText();

    }, 6500);


    setTimeout(() => {

        revealMessage(
            "And now..."

        );

    }, 7400);


    /*
     * Heart.

     */

    setTimeout(() => {

        if (revealHeart) {

            revealHeart.classList.add(
                "visible"
            );

        }

    }, 8500);


    /*
     * Stage 3 placeholder.
     */

    setTimeout(() => {

        showToast(
            "The real surprise begins now..."
        );

    }, 10500);

}


/* =============================================================
   REVEAL MESSAGE
============================================================= */

function revealMessage(message) {

    if (!revealText) {
        return;
    }


    revealText.textContent =
        message;


    revealText.classList.remove(
        "visible"
    );


    /*
     * Force browser reflow so
     * animation can restart.
     */

    void revealText.offsetWidth;


    revealText.classList.add(
        "visible"
    );

}


/* =============================================================
   HIDE REVEAL TEXT
============================================================= */

function hideRevealText() {

    if (!revealText) {
        return;
    }


    revealText.classList.remove(
        "visible"
    );

}


/* =============================================================
   TOAST
============================================================= */

let toastTimer = null;


function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =============================================================
   SWIPE NAVIGATION
============================================================= */

let touchStartY =
    0;

let touchEndY =
    0;


function setupSwipeNavigation() {

    document.addEventListener(
        "touchstart",
        event => {

            touchStartY =
                event.changedTouches[0]
                    .screenY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            touchEndY =
                event.changedTouches[0]
                    .screenY;


            const distance =
                touchStartY -
                touchEndY;


            if (
                Math.abs(distance) < 80
            ) {
                return;
            }


            /*
             * Only forward navigation.
             */

            if (
                distance > 0
            ) {

                const next =
                    state.currentScene + 1;


                if (
                    next >= scenes.length
                ) {
                    return;
                }


                /*
                 * Stage 1 protection.
                 */

                if (
                    state.currentScene === 2 &&
                    !state.clueFound
                ) {

                    showToast(
                        "There is something you haven't found yet..."
                    );

                    return;

                }


                if (
                    state.currentScene === 3 &&
                    !state.correctChoice
                ) {

                    showToast(
                        "Choose carefully..."
                    );

                    return;

                }


                /*
                 * Don't allow swipe
                 * to bypass Stage 2.
                 */

                if (
                    state.currentScene === 5 &&
                    !state.stage2Started
                ) {

                    showToast(
                        "Something is waiting here..."
                    );

                    return;

                }


                if (
                    state.currentScene === 6
                ) {

                    showToast(
                        "Follow the clue..."
                    );

                    return;

                }


                if (
                    state.currentScene === 7 &&
                    !state.secretUnlocked
                ) {

                    showToast(
                        "You still need to unlock this..."
                    );

                    return;

                }


                goToScene(next);

            }

        },
        {
            passive: true
        }
    );

}


/* =============================================================
   KEYBOARD
============================================================= */

function setupKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowDown"
            ) {
                return;
            }


            const next =
                state.currentScene + 1;


            if (
                next >= scenes.length
            ) {
                return;
            }


            /*
             * Prevent keyboard
             * from bypassing puzzles.
             */

            if (
                state.currentScene === 2 &&
                !state.clueFound
            ) {
                return;
            }


            if (
                state.currentScene === 3 &&
                !state.correctChoice
            ) {
                return;
            }


            if (
                state.currentScene === 5 &&
                !state.stage2Started
            ) {
                return;
            }


            if (
                state.currentScene === 6
            ) {
                return;
            }


            if (
                state.currentScene === 7 &&
                !state.secretUnlocked
            ) {
                return;
            }


            goToScene(next);

        }
    );

}




/* =============================================================
   STAGE 3 — MEMORY EXPERIENCE
============================================================= */

const memoryIntroText =
    document.getElementById(
        "memoryIntroText"
    );

const memory1Button =
    document.getElementById(
        "memory1Button"
    );

const memory2Button =
    document.getElementById(
        "memory2Button"
    );

const memory3Button =
    document.getElementById(
        "memory3Button"
    );

const memoryFinalButton =
    document.getElementById(
        "memoryFinalButton"
    );


/* =============================================================
   START STAGE 3
============================================================= */

function startStage3() {

    /*
     * Scene indexes depend on the complete
     * HTML order.
     *
     * Stage 3 begins immediately after
     * scene-pre-reveal.
     */

    const memoryIntro =
        document.getElementById(
            "scene-memory-intro"
        );


    if (!memoryIntro) {
        return;
    }


    const index =
        scenes.indexOf(
            memoryIntro
        );


    if (index === -1) {
        return;
    }


    goToScene(
        index
    );


    /*
     * Start cinematic text.
     */

    setTimeout(() => {

        showMemoryIntroText(
            "I kept something for you..."
        );

    }, 800);


    setTimeout(() => {

        hideMemoryIntroText();

    }, 3200);


    setTimeout(() => {

        showMemoryIntroText(
            "A few moments I never want to forget."
        );

    }, 4100);


    /*
     * Automatically continue to photo.
     */

    setTimeout(() => {

        hideMemoryIntroText();

    }, 7000);


    setTimeout(() => {

        const photoScene =
            document.getElementById(
                "scene-memory-1"
            );


        const photoIndex =
            scenes.indexOf(
                photoScene
            );


        if (photoIndex !== -1) {

            goToScene(
                photoIndex
            );

        }

    }, 7900);

}


/* =============================================================
   MEMORY INTRO TEXT
============================================================= */

function showMemoryIntroText(
    text
) {

    if (!memoryIntroText) {
        return;
    }


    memoryIntroText.textContent =
        text;


    memoryIntroText.classList.remove(
        "visible"
    );


    void memoryIntroText.offsetWidth;


    memoryIntroText.classList.add(
        "visible"
    );

}


function hideMemoryIntroText() {

    if (!memoryIntroText) {
        return;
    }


    memoryIntroText.classList.remove(
        "visible"
    );

}


/* =============================================================
   PHOTO 1
============================================================= */

if (memory1Button) {

    memory1Button.addEventListener(
        "click",
        () => {

            const scene =
                document.getElementById(
                    "scene-memory-2"
                );


            const index =
                scenes.indexOf(
                    scene
                );


            if (index !== -1) {

                goToScene(
                    index
                );

            }

        }
    );

}


/* =============================================================
   PHOTO 2
============================================================= */

if (memory2Button) {

    memory2Button.addEventListener(
        "click",
        () => {

            const scene =
                document.getElementById(
                    "scene-memory-3"
                );


            const index =
                scenes.indexOf(
                    scene
                );


            if (index !== -1) {

                goToScene(
                    index
                );

            }

        }
    );

}


/* =============================================================
   PHOTO 3
============================================================= */

if (memory3Button) {

    memory3Button.addEventListener(
        "click",
        () => {

            const scene =
                document.getElementById(
                    "scene-memory-final"
                );


            const index =
                scenes.indexOf(
                    scene
                );


            if (index !== -1) {

                goToScene(
                    index
                );

            }

        }
    );

}


/* =============================================================
   FINAL MEMORY
============================================================= */

if (memoryFinalButton) {

    memoryFinalButton.addEventListener(
        "click",
        () => {

            /*
             * Stage 4 will start here.
             *
             * For now we create a suspense pause.
             */

            memoryFinalButton.disabled =
                true;


            transition.classList.add(
                "active"
            );


            setTimeout(() => {

                transition.classList.remove(
                    "active"
                );


                showToast(
                    "There is something I want you to hear..."
                );


            }, 1500);

        }
    );

}