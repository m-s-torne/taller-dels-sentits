/**
 * Fallback mechanism when Resend API is unavailable
 * Stores failed submissions for manual handling
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import type { ContactFormData } from '@/app/contacte/types/form.types';

const FALLBACK_DIR = path.join(os.tmpdir(), '.contact-forms-fallback');
const FALLBACK_ENABLED = process.env.NODE_ENV === 'production';

/**
 * Ensure fallback directory exists
 */
const ensureFallbackDir = async (): Promise<void> => {
  if (!FALLBACK_ENABLED) return;

  try {
    await fs.mkdir(FALLBACK_DIR, { recursive: true });
  } catch (error) {
    console.error('[Fallback] Error creating fallback directory:', error);
  }
};

/**
 * Save form submission to fallback storage
 * Called when Resend API fails after retries
 */
export const saveFallbackSubmission = async (
  formData: ContactFormData,
  error: string
): Promise<boolean> => {
  if (!FALLBACK_ENABLED) {
    console.log('[Fallback] Disabled in development mode');
    return false;
  }

  try {
    await ensureFallbackDir();

    const timestamp = new Date().toISOString();
    const filename = `submission-${Date.now()}-${crypto.randomUUID().replace(/-/g, '')}.json`;
    const filepath = path.join(FALLBACK_DIR, filename);

    const fallbackData = {
      timestamp,
      error,
      formData,
      status: 'needs_manual_handling',
    };

    await fs.writeFile(filepath, JSON.stringify(fallbackData, null, 2));

    console.log(`[Fallback] Submission saved to: ${filename}`);
    return true;
  } catch (error) {
    console.error('[Fallback] Error saving submission:', error);
    return false;
  }
};

/**
 * Get number of fallback submissions pending handling
 */
export const getPendingFallbackCount = async (): Promise<number> => {
  if (!FALLBACK_ENABLED) return 0;

  try {
    await ensureFallbackDir();
    const files = await fs.readdir(FALLBACK_DIR);
    return files.filter(f => f.startsWith('submission-')).length;
  } catch (error) {
    console.error('[Fallback] Error reading fallback directory:', error);
    return 0;
  }
};

/**
 * Get all pending fallback submissions (admin use)
 */
export const getPendingFallbackSubmissions = async () => {
  if (!FALLBACK_ENABLED) return [];

  try {
    await ensureFallbackDir();
    const files = await fs.readdir(FALLBACK_DIR);
    const submissions = [];

    for (const file of files.filter(f => f.startsWith('submission-'))) {
      try {
        const content = await fs.readFile(path.join(FALLBACK_DIR, file), 'utf-8');
        submissions.push({
          filename: file,
          data: JSON.parse(content),
        });
      } catch (error) {
        console.error(`[Fallback] Error reading ${file}:`, error);
      }
    }

    return submissions;
  } catch (error) {
    console.error('[Fallback] Error reading submissions:', error);
    return [];
  }
};

/**
 * Delete a fallback submission after manual handling
 */
export const deleteFallbackSubmission = async (filename: string): Promise<boolean> => {
  if (!FALLBACK_ENABLED) return false;

  try {
    const filepath = path.join(FALLBACK_DIR, filename);
    // Validate path to prevent directory traversal
    // Must use path.sep suffix to avoid matching sibling directories with the same prefix
    if (!filepath.startsWith(FALLBACK_DIR + path.sep)) {
      throw new Error('Invalid file path');
    }
    await fs.unlink(filepath);
    console.log(`[Fallback] Deleted: ${filename}`);
    return true;
  } catch (error) {
    console.error('[Fallback] Error deleting submission:', error);
    return false;
  }
};
