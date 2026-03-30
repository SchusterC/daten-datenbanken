/**
 * Lernmodul: Daten und Datenbanken
 * Erweiterte JavaScript-Funktionen
 * Version 1.0
 */

// ============================================================================
// STATISTIK UND ANALYSE
// ============================================================================

class CourseStatistics {
    constructor() {
        this.activityLog = [];
        this.startTime = new Date();
        this.pageVisits = {};
        this.exercisesCompleted = {};
        this.loadStatistics();
    }

    logActivity(type, data) {
        const activity = {
            timestamp: new Date().toISOString(),
            type: type,
            data: data,
            duration: new Date() - this.startTime
        };
        this.activityLog.push(activity);
        this.saveStatistics();
    }

    recordPageVisit(pageIndex) {
        if (!this.pageVisits[pageIndex]) {
            this.pageVisits[pageIndex] = 0;
        }
        this.pageVisits[pageIndex]++;
        this.logActivity('page_visit', { page: pageIndex });
    }

    recordExerciseCompletion(exerciseName, score) {
        if (!this.exercisesCompleted[exerciseName]) {
            this.exercisesCompleted[exerciseName] = [];
        }
        this.exercisesCompleted[exerciseName].push({
            timestamp: new Date().toISOString(),
            score: score
        });
        this.logActivity('exercise_completed', { exercise: exerciseName, score: score });
    }

    getStatistics() {
        return {
            totalSessionTime: new Date() - this.startTime,
            totalActivities: this.activityLog.length,
            pageVisits: this.pageVisits,
            exercisesCompleted: this.exercisesCompleted,
            averageScore: this.calculateAverageScore()
        };
    }

    calculateAverageScore() {
        const scores = [];
        for (const exercise in this.exercisesCompleted) {
            this.exercisesCompleted[exercise].forEach(completion => {
                scores.push(completion.score);
            });
        }
        if (scores.length === 0) return 0;
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    }

    saveStatistics() {
        localStorage.setItem('courseStatistics', JSON.stringify({
            activityLog: this.activityLog,
            pageVisits: this.pageVisits,
            exercisesCompleted: this.exercisesCompleted
        }));
    }

    loadStatistics() {
        const saved = localStorage.getItem('courseStatistics');
        if (saved) {
            const data = JSON.parse(saved);
            this.activityLog = data.activityLog || [];
            this.pageVisits = data.pageVisits || {};
            this.exercisesCompleted = data.exercisesCompleted || {};
        }
    }

    exportStatistics() {
        const stats = this.getStatistics();
        const json = JSON.stringify(stats, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `course-statistics-${new Date().getTime()}.json`;
        link.click();
    }
}

// ============================================================================
// QUIZ-MANAGER
// ============================================================================

class QuizManager {
    constructor() {
        this.quizzes = {};
        this.answers = {};
        this.feedback = {};
    }

    createQuiz(quizId, questions) {
        this.quizzes[quizId] = {
            id: quizId,
            questions: questions,
            totalQuestions: questions.length,
            createdAt: new Date().toISOString()
        };
    }

    submitAnswer(quizId, questionIndex, answer) {
        if (!this.answers[quizId]) {
            this.answers[quizId] = {};
        }
        this.answers[quizId][questionIndex] = answer;
    }

    getAnswer(quizId, questionIndex) {
        return this.answers[quizId] ? this.answers[quizId][questionIndex] : null;
    }

    markQuestion(quizId, questionIndex, isCorrect, feedback) {
        if (!this.feedback[quizId]) {
            this.feedback[quizId] = {};
        }
        this.feedback[quizId][questionIndex] = {
            isCorrect: isCorrect,
            feedback: feedback,
            timestamp: new Date().toISOString()
        };
    }

    getQuizScore(quizId) {
        if (!this.feedback[quizId]) return 0;
        const correct = Object.values(this.feedback[quizId]).filter(f => f.isCorrect).length;
        const total = this.quizzes[quizId].totalQuestions;
        return {
            correct: correct,
            total: total,
            percentage: ((correct / total) * 100).toFixed(2)
        };
    }

    resetQuiz(quizId) {
        delete this.answers[quizId];
        delete this.feedback[quizId];
    }
}

// ============================================================================
// TIMER UND ZEITVERFOLGUNG
// ============================================================================

class SessionTimer {
    constructor() {
        this.sessionStart = new Date();
        this.pageStartTimes = {};
        this.pageDurations = {};
        this.totalPausedTime = 0;
        this.isPaused = false;
        this.pauseStart = null;
    }

    startPageTimer(pageIndex) {
        this.pageStartTimes[pageIndex] = new Date();
    }

    endPageTimer(pageIndex) {
        if (!this.pageStartTimes[pageIndex]) return 0;
        const duration = new Date() - this.pageStartTimes[pageIndex];
        if (!this.pageDurations[pageIndex]) {
            this.pageDurations[pageIndex] = 0;
        }
        this.pageDurations[pageIndex] += duration;
        delete this.pageStartTimes[pageIndex];
        return duration;
    }

    pauseSession() {
        this.isPaused = true;
        this.pauseStart = new Date();
    }

    resumeSession() {
        if (this.pauseStart) {
            this.totalPausedTime += new Date() - this.pauseStart;
            this.pauseStart = null;
        }
        this.isPaused = false;
    }

    getSessionDuration() {
        let duration = new Date() - this.sessionStart - this.totalPausedTime;
        if (this.pauseStart) {
            duration -= (new Date() - this.pauseStart);
        }
        return duration;
    }

    getPageDuration(pageIndex) {
        return this.pageDurations[pageIndex] || 0;
    }

    formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

// ============================================================================
// NOTIZEN-SYSTEM
// ============================================================================

class NotesSystem {
    constructor() {
        this.notes = {};
        this.loadNotes();
    }

    addNote(pageIndex, noteText) {
        if (!this.notes[pageIndex]) {
            this.notes[pageIndex] = [];
        }
        this.notes[pageIndex].push({
            id: Date.now(),
            text: noteText,
            timestamp: new Date().toISOString(),
            highlighted: false
        });
        this.saveNotes();
    }

    getNotes(pageIndex) {
        return this.notes[pageIndex] || [];
    }

    deleteNote(pageIndex, noteId) {
        if (this.notes[pageIndex]) {
            this.notes[pageIndex] = this.notes[pageIndex].filter(n => n.id !== noteId);
            this.saveNotes();
        }
    }

    editNote(pageIndex, noteId, newText) {
        if (this.notes[pageIndex]) {
            const note = this.notes[pageIndex].find(n => n.id === noteId);
            if (note) {
                note.text = newText;
                note.timestamp = new Date().toISOString();
                this.saveNotes();
            }
        }
    }

    toggleHighlight(pageIndex, noteId) {
        if (this.notes[pageIndex]) {
            const note = this.notes[pageIndex].find(n => n.id === noteId);
            if (note) {
                note.highlighted = !note.highlighted;
                this.saveNotes();
            }
        }
    }

    exportNotes() {
        const json = JSON.stringify(this.notes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `course-notes-${new Date().getTime()}.json`;
        link.click();
    }

    saveNotes() {
        localStorage.setItem('courseNotes', JSON.stringify(this.notes));
    }

    loadNotes() {
        const saved = localStorage.getItem('courseNotes');
        if (saved) {
            this.notes = JSON.parse(saved);
        }
    }
}

// ============================================================================
// FORTSCHRITTS-TRACKER
// ============================================================================

class ProgressTracker {
    constructor() {
        this.milestones = {
            'first_page': false,
            'first_quiz': false,
            'first_exercise': false,
            'half_course': false,
            'all_pages_visited': false,
            'perfect_score': false,
            'course_complete': false
        };
        this.loadMilestones();
    }

    checkMilestone(pageVisits, score, totalPages) {
        if (pageVisits >= 1 && !this.milestones['first_page']) {
            this.milestones['first_page'] = true;
            this.onMilestoneReached('first_page', '🎯 Erste Seite besichtigt!');
        }

        if (score >= 2 && !this.milestones['first_quiz']) {
            this.milestones['first_quiz'] = true;
            this.onMilestoneReached('first_quiz', '🎯 Erstes Quiz gemacht!');
        }

        if (Object.keys(pageVisits).length >= totalPages && !this.milestones['all_pages_visited']) {
            this.milestones['all_pages_visited'] = true;
            this.onMilestoneReached('all_pages_visited', '🎯 Alle Seiten besucht!');
        }

        if (score >= 15 && !this.milestones['half_course']) {
            this.milestones['half_course'] = true;
            this.onMilestoneReached('half_course', '🎯 Hälfte der Punkte erreicht!');
        }

        if (score === 30 && !this.milestones['perfect_score']) {
            this.milestones['perfect_score'] = true;
            this.onMilestoneReached('perfect_score', '🌟 Perfekte Punktzahl!');
        }

        this.saveMilestones();
    }

    onMilestoneReached(milestone, message) {
        console.log(`Milestone reached: ${milestone}`);
        this.showNotification(message);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            animation: slideIn 0.5s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    saveMilestones() {
        localStorage.setItem('courseMilestones', JSON.stringify(this.milestones));
    }

    loadMilestones() {
        const saved = localStorage.getItem('courseMilestones');
        if (saved) {
            this.milestones = JSON.parse(saved);
        }
    }
}

// ============================================================================
// ACCESSIBILITY HELPER
// ============================================================================

class AccessibilityHelper {
    constructor() {
        this.fontSize = 16;
        this.highContrast = false;
        this.dyslexiaFont = false;
        this.loadSettings();
    }

    increaseFontSize() {
        if (this.fontSize < 24) {
            this.fontSize += 2;
            this.applyFontSize();
        }
    }

    decreaseFontSize() {
        if (this.fontSize > 12) {
            this.fontSize -= 2;
            this.applyFontSize();
        }
    }

    applyFontSize() {
        document.documentElement.style.fontSize = this.fontSize + 'px';
        this.saveSettings();
    }

    toggleHighContrast() {
        this.highContrast = !this.highContrast;
        if (this.highContrast) {
            document.body.style.filter = 'contrast(1.5)';
        } else {
            document.body.style.filter = 'contrast(1)';
        }
        this.saveSettings();
    }

    toggleDyslexiaFont() {
        this.dyslexiaFont = !this.dyslexiaFont;
        if (this.dyslexiaFont) {
            document.body.style.fontFamily = '"Dyslexie-Regular", "OpenDyslexic", sans-serif';
        } else {
            document.body.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        }
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify({
            fontSize: this.fontSize,
            highContrast: this.highContrast,
            dyslexiaFont: this.dyslexiaFont
        }));
    }

    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.fontSize = settings.fontSize;
            this.highContrast = settings.highContrast;
            this.dyslexiaFont = settings.dyslexiaFont;
            this.applyFontSize();
            if (this.highContrast) this.toggleHighContrast();
            if (this.dyslexiaFont) this.toggleDyslexiaFont();
        }
    }
}

// ============================================================================
// INITIALISIERUNG
// ============================================================================

// Erstelle globale Instanzen beim Laden der Seite
let courseStats = null;
let quizMgr = null;
let sessionTimer = null;
let notesSystem = null;
let progressTracker = null;
let accessibilityHelper = null;

document.addEventListener('DOMContentLoaded', function() {
    courseStats = new CourseStatistics();
    quizMgr = new QuizManager();
    sessionTimer = new SessionTimer();
    notesSystem = new NotesSystem();
    progressTracker = new ProgressTracker();
    accessibilityHelper = new AccessibilityHelper();

    console.log('✅ Erweiterte Lernmodul-Funktionen geladen');
});

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loader.innerHTML = '<div style="font-size: 24px;">⏳ Wird geladen...</div>';
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.remove();
}

function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function trackEvent(eventName, data = {}) {
    if (courseStats) {
        courseStats.logActivity(eventName, data);
    }
}

// CSS für Animationen hinzufügen
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
