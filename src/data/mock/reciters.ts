import type { Reciter } from '../../types/content';

/**
 * MOCK DATA — reciter directory.
 *
 * Reciter names are public metadata. No audio is bundled or played, and
 * `audioAvailable` stays false until a source's coverage, attribution and
 * redistribution terms have been verified.
 */
export const MOCK_RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'abdul-basit',
    name: 'Abdul Basit Abdus Samad',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'maher',
    name: 'Maher Al-Muaiqly',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'ghamdi',
    name: 'Saad Al-Ghamdi',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
  {
    id: 'minshawi',
    name: 'Muhammad Siddiq Al-Minshawi',
    style: 'முரத்தல்',
    audioAvailable: false,
  },
];

export const DEFAULT_RECITER_ID = 'alafasy';
