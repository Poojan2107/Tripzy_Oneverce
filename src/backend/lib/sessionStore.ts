import { db } from "./db";
import fs from "fs";
import path from "path";

export interface TripSession {
  sessionId: string;
  currentTrip: any | null;
  sessionState: any | null;
  conversationSummary: string | null;
  recentMessages: any[] | null;
  pendingChanges: any | null;
  metadata: any | null;
  updatedAt?: Date;
}

// In-memory fallback cache
const memorySessions = new Map<string, TripSession>();

// Local file-based fallback path
const SESSIONS_DIR = path.join(process.cwd(), ".sessions");

function ensureSessionsDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    try {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    } catch (e) {
      console.warn("Failed to create .sessions directory:", e);
    }
  }
}

async function getFromFile(sessionId: string): Promise<TripSession | null> {
  ensureSessionsDir();
  const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to read session ${sessionId} from file:`, e);
    }
  }
  return null;
}

async function saveToFile(session: TripSession): Promise<void> {
  ensureSessionsDir();
  const filePath = path.join(SESSIONS_DIR, `${session.sessionId}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2), "utf-8");
  } catch (e) {
    console.warn(`Failed to write session ${session.sessionId} to file:`, e);
  }
}

export async function getSession(sessionId: string): Promise<TripSession> {
  // 1. Try DB
  try {
    const dbSession = await db.tripSession.findUnique({
      where: { sessionId },
    });
    if (dbSession) {
      const session: TripSession = {
        sessionId: dbSession.sessionId,
        currentTrip: dbSession.currentTrip,
        sessionState: dbSession.sessionState,
        conversationSummary: dbSession.conversationSummary,
        recentMessages: (dbSession.recentMessages as any[]) || [],
        pendingChanges: dbSession.pendingChanges,
        metadata: dbSession.metadata,
        updatedAt: dbSession.updatedAt,
      };
      // Keep memory cache updated
      memorySessions.set(sessionId, session);
      return session;
    }
  } catch (e) {
    // Expected database timeout/failure fallback
  }

  // 2. Try file fallback
  const fileSession = await getFromFile(sessionId);
  if (fileSession) {
    memorySessions.set(sessionId, fileSession);
    return fileSession;
  }

  // 3. Try memory fallback
  const memSession = memorySessions.get(sessionId);
  if (memSession) {
    return memSession;
  }

  // 4. Return new empty session if not found
  const newSession: TripSession = {
    sessionId,
    currentTrip: null,
    sessionState: {
      destination: "",
      days: null,
      budget: "",
      travelStyle: "",
      travelerType: "",
      completed: [],
      pending: []
    },
    conversationSummary: "",
    recentMessages: [],
    pendingChanges: null,
    metadata: {},
  };
  
  // Save new session locally to register it
  memorySessions.set(sessionId, newSession);
  await saveToFile(newSession);
  return newSession;
}

export async function saveSession(session: TripSession): Promise<void> {
  const updatedSession = {
    ...session,
    updatedAt: new Date(),
  };

  // 1. Always save to memory
  memorySessions.set(session.sessionId, updatedSession);

  // 2. Always save to file
  await saveToFile(updatedSession);

  // 3. Try to save to DB
  try {
    await db.tripSession.upsert({
      where: { sessionId: session.sessionId },
      update: {
        currentTrip: session.currentTrip ?? null,
        sessionState: session.sessionState ?? null,
        conversationSummary: session.conversationSummary ?? null,
        recentMessages: session.recentMessages ?? null,
        pendingChanges: session.pendingChanges ?? null,
        metadata: session.metadata ?? null,
      },
      create: {
        sessionId: session.sessionId,
        currentTrip: session.currentTrip ?? null,
        sessionState: session.sessionState ?? null,
        conversationSummary: session.conversationSummary ?? null,
        recentMessages: session.recentMessages ?? null,
        pendingChanges: session.pendingChanges ?? null,
        metadata: session.metadata ?? null,
      },
    });
  } catch (e) {
    // Database save failed, log warning but proceed since we saved locally
  }
}
