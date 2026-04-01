// Replaced by useAuth from AuthContext — kept for backward compatibility.
// Any file that imports useCurrentMember should migrate to:
//   import { useAuth } from '@/contexts/AuthContext';
export { useAuth as useCurrentMember } from '@/contexts/AuthContext';
