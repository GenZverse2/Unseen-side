# Security Specification — UNSEEN SIDE Firestore Rules

## 1. Data Invariants
1. **Public Read Integrity**: Public visitors can read published gallery items and published site content. Unpublished gallery items must never be exposed to public queries.
2. **Strict Admin Gates**: Only verified administrators present in `/admins/{uid}` or matching the bootstrapped administrator email (`gdayoota@gmail.com` with `email_verified == true`) may mutate `content`, `gallery`, or read/modify `inquiries`.
3. **Contact Submission Integrity**: Anyone can submit a contact inquiry, but submissions must satisfy strict schema bounds (name <= 100 chars, email regex match <= 120 chars, message between 10 and 2000 chars, status initialized to 'new', createdAt equal to request.time). Inquirers cannot read other inquiries, and cannot update or delete inquiries.
4. **Gallery Item Invariants**: Images must have valid string paths, valid categories, valid bounds on titles and subtitles, and order must be numeric.
5. **PII Isolation**: Submissions in `/inquiries/{inquiryId}` contain client PII (name, email, message) and must be readable exclusively by administrators. Public users have zero read access to `/inquiries`.
6. **Path Hardening**: All target document IDs must satisfy `isValidId(id)` with characters `[a-zA-Z0-9_\-]+` and max length 128.
7. **Temporal Integrity**: All mutation timestamps must equal `request.time`.

## 2. The "Dirty Dozen" Threat Payloads
1. **Payload 1 (Ghost Field Injection)**: Creating a contact inquiry with injected `{ isAdmin: true, status: 'approved' }` attempting to elevate privileges. (Must be rejected via `hasOnly`).
2. **Payload 2 (Unverified Email Spoofing)**: Writing to `/content/site_content` using an unverified token claiming admin email. (Must be rejected via `email_verified == true`).
3. **Payload 3 (Public Snooping on Inquiries)**: Anonymous client running `get` or `list` on `/inquiries`. (Must return PERMISSION_DENIED).
4. **Payload 4 (Oversized Message Denial-of-Wallet)**: Submitting contact inquiry with 500KB message string. (Must fail size bound `<= 2000`).
5. **Payload 5 (Invalid Inquiry Email Format)**: Submitting contact inquiry with malformed email `notanemail`. (Must fail regex guard).
6. **Payload 6 (Unauthorized Content Mutation)**: Non-admin trying to update `heroTitle` or brand statement. (Must return PERMISSION_DENIED).
7. **Payload 7 (Unpublished Gallery Leak)**: Unauthenticated visitor querying `where("isPublished", "==", false)`. (Must return PERMISSION_DENIED).
8. **Payload 8 (Inquiry Status Tampering)**: Public user attempting to set `status: 'reviewed'` or update past inquiries. (Must return PERMISSION_DENIED).
9. **Payload 9 (ID Poisoning Attack)**: Injecting 2KB illegal path key `/gallery/../../../root`. (Must fail `isValidId`).
10. **Payload 10 (Client-Controlled Timestamp Spoof)**: Sending `createdAt: "1999-01-01T00:00:00Z"` instead of server `request.time`. (Must return PERMISSION_DENIED).
11. **Payload 11 (Self-Promoted Admin Profile)**: Non-admin attempting to create a document in `/admins/{uid}` with `{ role: 'owner' }`. (Must return PERMISSION_DENIED).
12. **Payload 12 (Gallery Shadow Delete)**: Non-admin attempting to delete an editorial look from `/gallery/{galleryId}`. (Must return PERMISSION_DENIED).

## 3. Test Runner Invariant
All 12 dirty payloads are designed to be blocked decisively at the Firestore security rules engine before any document read or write is executed.
