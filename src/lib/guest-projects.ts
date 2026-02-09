/**
 * Misafir (giriş yapmamış) kullanıcılar için LocalStorage tabanlı proje yönetimi
 */

export interface GuestProject {
    id: string;
    name: string;
    questions: any[];
    settings: any;
    createdAt: string;
    updatedAt: string;
}

const GUEST_PROJECTS_KEY = 'testoloji_guest_projects';
const GUEST_PROJECT_LIMIT = 1;

export function getGuestProjects(): GuestProject[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(GUEST_PROJECTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load guest projects:', e);
        return [];
    }
}

export function saveGuestProjects(projects: GuestProject[]) {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(GUEST_PROJECTS_KEY, JSON.stringify(projects));
        // Dispatch custom event to notify dashboard
        window.dispatchEvent(new Event('guestProjectsUpdated'));
    } catch (e) {
        console.error('Failed to save guest projects:', e);
    }
}

export function createGuestProject(name: string): GuestProject | null {
    const projects = getGuestProjects();

    if (projects.length >= GUEST_PROJECT_LIMIT) {
        return null; // Limit aşıldı
    }

    const newProject: GuestProject = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        questions: [],
        settings: {
            colCount: 2,
            questionSpacing: 10,
            primaryColor: '#f97316',
            fontFamily: 'Roboto',
            template: 'classic',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    saveGuestProjects(projects);
    return newProject;
}

export function getGuestProject(id: string): GuestProject | null {
    const projects = getGuestProjects();
    return projects.find(p => p.id === id) || null;
}

export function updateGuestProject(id: string, updates: Partial<GuestProject>) {
    const projects = getGuestProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index !== -1) {
        projects[index] = {
            ...projects[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        saveGuestProjects(projects);
    }
}

export function deleteGuestProject(id: string) {
    const projects = getGuestProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveGuestProjects(filtered);
}

export function clearGuestProjects() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_PROJECTS_KEY);
}

// Question Management
export function addGuestQuestion(projectId: string, question: any) {
    const projects = getGuestProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) return null;

    const newQuestion = {
        ...question,
        id: `guest_q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: project.questions.length,
    };

    project.questions.push(newQuestion);
    project.updatedAt = new Date().toISOString();

    saveGuestProjects(projects);
    return newQuestion;
}

export function deleteGuestQuestion(projectId: string, questionId: string) {
    const projects = getGuestProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) return;

    project.questions = project.questions.filter(q => q.id !== questionId);
    project.updatedAt = new Date().toISOString();

    saveGuestProjects(projects);
}

export function updateGuestQuestion(projectId: string, questionId: string, updates: any) {
    const projects = getGuestProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) return;

    const questionIndex = project.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
        project.questions[questionIndex] = {
            ...project.questions[questionIndex],
            ...updates,
        };
        project.updatedAt = new Date().toISOString();
        saveGuestProjects(projects);
    }
}

export function reorderGuestQuestions(projectId: string, questions: any[]) {
    const projects = getGuestProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) return;

    project.questions = questions;
    project.updatedAt = new Date().toISOString();

    saveGuestProjects(projects);
}

export function updateGuestProjectSettings(projectId: string, settings: any) {
    const projects = getGuestProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) return;

    project.settings = {
        ...project.settings,
        ...settings,
    };
    project.updatedAt = new Date().toISOString();

    saveGuestProjects(projects);
}
