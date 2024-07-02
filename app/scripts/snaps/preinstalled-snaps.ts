import type { PreinstalledSnap } from '@metamask/snaps-controllers';
import MessageSigningSnap from '@metamask/message-signing-snap/dist/preinstalled-snap.json';
///: BEGIN:ONLY_INCLUDE_IF(build-flask)
import BitcoinManagerSnap from './bitcoin-manager-snap-0.1.4-rc4-preinstalled-snap.json';
///: END:ONLY_INCLUDE_IF

const PREINSTALLED_SNAPS: readonly PreinstalledSnap[] = Object.freeze([
  MessageSigningSnap as PreinstalledSnap,
  ///: BEGIN:ONLY_INCLUDE_IF(build-flask)
  BitcoinManagerSnap as PreinstalledSnap,
  ///: END:ONLY_INCLUDE_IF
]);

export default PREINSTALLED_SNAPS;
