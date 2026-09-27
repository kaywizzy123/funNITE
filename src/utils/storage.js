const TOURNAMENTS_KEY = "funnite:tournaments";
const CURRENT_ID_KEY = "funnite:currentTournamentId";
const LEGACY_KEY = "funnite:tournament";
const NEW_DRAFT_KEY = "funnite:newTournamentDraft";

function readTournamentsRaw() {
  try {
    const raw = localStorage.getItem(TOURNAMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTournamentsRaw(tournaments) {
  try {
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
  } catch {
    // storage unavailable (private mode, quota) — fail silently, app still works in-memory
  }
}

// One-time migration: legacy single-tournament key -> tournaments array.
// Idempotent because it deletes LEGACY_KEY once done, so it only ever
// does real work on the very first load after upgrading.
function migrateLegacyTournament() {
  let legacy;
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    legacy = JSON.parse(raw);
  } catch {
    localStorage.removeItem(LEGACY_KEY);
    return;
  }

  const hasContent =
    legacy &&
    (legacy.gameName?.trim() ||
      legacy.players?.some((p) => p.name?.trim()) ||
      legacy.rounds?.length > 0);

  if (hasContent) {
    const now = new Date().toISOString();
    const migrated = {
      id: crypto.randomUUID(),
      gameName: legacy.gameName ?? "",
      players: legacy.players ?? [],
      rounds: legacy.rounds ?? [],
      format: legacy.format ?? "knockout",
      mode: legacy.mode ?? "single",
      createdAt: now,
      updatedAt: now,
    };
    const existing = readTournamentsRaw();
    writeTournamentsRaw([...existing, migrated]);
    // Preserve the "resume where you left off on refresh" behavior.
    try {
      localStorage.setItem(CURRENT_ID_KEY, migrated.id);
    } catch {
      /* ignore */
    }
  }

  localStorage.removeItem(LEGACY_KEY);
}

export function loadTournaments() {
  migrateLegacyTournament();
  return readTournamentsRaw();
}

export function upsertTournament(tournament) {
  const tournaments = readTournamentsRaw();
  const idx = tournaments.findIndex((t) => t.id === tournament.id);
  const next = [...tournaments];
  if (idx === -1) next.push(tournament);
  else next[idx] = tournament;
  writeTournamentsRaw(next);
  return next;
}

export function deleteTournamentById(id) {
  const next = readTournamentsRaw().filter((t) => t.id !== id);
  writeTournamentsRaw(next);
  return next;
}

export function loadCurrentTournamentId() {
  try {
    return localStorage.getItem(CURRENT_ID_KEY);
  } catch {
    return null;
  }
}

export function saveCurrentTournamentId(id) {
  try {
    if (id) localStorage.setItem(CURRENT_ID_KEY, id);
    else localStorage.removeItem(CURRENT_ID_KEY);
  } catch {
    // ignore
  }
}

// The /create form for a brand-new tournament (no id yet) lives under its
// own key so a refresh doesn't wipe it, without cluttering the dashboard
// with a tournament entry for every half-filled form.
export function loadNewTournamentDraft() {
  try {
    const raw = localStorage.getItem(NEW_DRAFT_KEY);
    const draft = raw ? JSON.parse(raw) : null;
    if (!draft || !Array.isArray(draft.players) || draft.players.length === 0) return null;
    return draft;
  } catch {
    return null;
  }
}

export function saveNewTournamentDraft(draft) {
  try {
    localStorage.setItem(NEW_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearNewTournamentDraft() {
  try {
    localStorage.removeItem(NEW_DRAFT_KEY);
  } catch {
    // ignore
  }
}
