export const MissionStatus = {
  TERMINATED: 2, // ID du statut "Terminée"
  IN_PROGRESS: 1, // ID du statut "En cours"
  PENDING: 4     // ID du statut "En attente"
} as const;

export type MissionStatusId = typeof MissionStatus[keyof typeof MissionStatus];
