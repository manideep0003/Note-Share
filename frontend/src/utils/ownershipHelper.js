/**
 * Positively verifies whether a note is owned by the authenticated user.
 * A note must ONLY match when its uploadedBy field is present and positively
 * matches the current authenticated user's ID or email.
 *
 * CRITICAL RULE: Missing uploadedBy MUST NEVER be treated as ownership.
 *
 * @param {Object} note - The note document
 * @param {Object} currentUser - The authenticated user object
 * @returns {boolean} True ONLY if positively verified as the owner
 */
export const checkNoteOwnership = (note, currentUser) => {
  // If either party or the uploadedBy field is missing, reject ownership
  if (!currentUser || !note || !note.uploadedBy) {
    return false;
  }

  // Extract uploader ID (handles populated user object or raw ObjectId/string)
  const uploaderId =
    typeof note.uploadedBy === 'object' && note.uploadedBy !== null
      ? note.uploadedBy._id || note.uploadedBy.id
      : String(note.uploadedBy);

  // Extract uploader email if populated
  const uploaderEmail =
    typeof note.uploadedBy === 'object' && note.uploadedBy !== null
      ? note.uploadedBy.email
      : null;

  const currentUserId = currentUser._id || currentUser.id;

  // Positive matching on authenticated user ID
  const matchesId = Boolean(
    currentUserId && uploaderId && String(currentUserId) === String(uploaderId)
  );

  // Positive matching on verified user email
  const matchesEmail = Boolean(
    currentUser.email &&
    uploaderEmail &&
    currentUser.email.trim().toLowerCase() === uploaderEmail.trim().toLowerCase()
  );

  return matchesId || matchesEmail;
};

export default checkNoteOwnership;

