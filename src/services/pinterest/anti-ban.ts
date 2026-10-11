/**
 * Zyntix Autonomous Pinterest Traffic Machine - Anti-Ban Queue & Drip Scheduler
 * - Enforces strict daily cap of 5 pins per day per domain
 * - High-converting Pinterest drip cadence: 11:00 AM, 2:00 PM, 5:00 PM, 8:00 PM, 10:30 PM
 * - Perceptual Image Hash Variation: distinct layouts, color tints, seeds, and typography
 */

import crypto from 'crypto';
import { PinSchedule } from './types';

// The 5 optimal Pinterest viral peak traffic slots (Local user timezone / UTC normalized)
export const VIRAL_TIME_SLOTS = [
  { label: '11:00 AM', hour: 11, minute: 0, delayMinutes: 0 },
  { label: '2:00 PM', hour: 14, minute: 0, delayMinutes: 180 },
  { label: '5:00 PM', hour: 17, minute: 0, delayMinutes: 360 },
  { label: '8:00 PM', hour: 20, minute: 0, delayMinutes: 540 },
  { label: '10:30 PM', hour: 22, minute: 30, delayMinutes: 690 }
];

export interface AntiBanConfig {
  maxPinsPerDay: number;
  dripIntervalHours: number[];
  enforceUniquePerceptualHash: boolean;
}

export const DEFAULT_ANTI_BAN_CONFIG: AntiBanConfig = {
  maxPinsPerDay: 5,
  dripIntervalHours: [11, 14, 17, 20, 22.5],
  enforceUniquePerceptualHash: true
};

/**
 * Calculates the exact scheduled execution date for each of the 5 pins
 */
export function generateDripSchedule(pinIndex: number, baseDate: Date = new Date()): PinSchedule {
  const slotIndex = Math.min(Math.max(pinIndex, 0), VIRAL_TIME_SLOTS.length - 1);
  const slot = VIRAL_TIME_SLOTS[slotIndex];

  // Schedule for current or next cycle
  const scheduledDate = new Date(baseDate);
  scheduledDate.setHours(slot.hour, slot.minute, 0, 0);

  // If the time has already passed today, advance to tomorrow
  if (scheduledDate.getTime() <= baseDate.getTime()) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  // Create unique cryptographic salt to guarantee distinct perceptual image hash
  const hashSalt = crypto.createHash('sha256')
    .update(`${baseDate.toISOString()}-${pinIndex}-${slot.label}`)
    .digest('hex')
    .slice(0, 12);

  return {
    scheduledSlotTime: slot.label,
    scheduledIsoDate: scheduledDate.toISOString(),
    dripDelayMinutes: slot.delayMinutes,
    hashSalt
  };
}

/**
 * Validates domain posting limits to protect against Pinterest shadowban
 */
export function validateDailyDomainCap(existingPinsTodayCount: number): { allowed: boolean; remainingQuota: number } {
  const cap = DEFAULT_ANTI_BAN_CONFIG.maxPinsPerDay;
  const remaining = Math.max(0, cap - existingPinsTodayCount);
  return {
    allowed: existingPinsTodayCount < cap,
    remainingQuota: remaining
  };
}
