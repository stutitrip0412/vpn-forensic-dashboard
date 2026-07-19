const openvpn = require('./openvpnParser');
const wireguard = require('./wireguardParser');
const syslogAuth = require('./syslogParser');

/**
 * Registry of available parsers (FR2.4: pluggable — add a new format by
 * writing a module with the same { sourceType, processLine, finalize }
 * shape and registering it here; nothing else in the pipeline changes).
 */
const REGISTRY = {
  openvpn: openvpn.createParser,
  wireguard: wireguard.createParser,
  syslog_auth: syslogAuth.createParser,
};

function getParser(sourceType) {
  const factory = REGISTRY[sourceType];
  if (!factory) {
    throw new Error(`No parser registered for sourceType "${sourceType}".`);
  }
  return factory();
}

/**
 * Auto-detects the most likely log format by test-parsing a sample of
 * lines against every registered parser and picking the highest match
 * rate. Used when the uploader doesn't specify sourceType explicitly.
 * Returns { sourceType, confidence } — confidence is the fraction of
 * sample lines that parser matched (0-1).
 */
function detectSourceType(sampleLines) {
  const nonEmpty = sampleLines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) {
    return { sourceType: 'unknown', confidence: 0 };
  }

  let best = { sourceType: 'unknown', confidence: 0 };

  for (const sourceType of Object.keys(REGISTRY)) {
    const parser = getParser(sourceType);
    let matched = 0;
    for (const line of nonEmpty) {
      const result = parser.processLine(line);
      if (result.matched) matched++;
    }
    const confidence = matched / nonEmpty.length;
    if (confidence > best.confidence) {
      best = { sourceType, confidence };
    }
  }

  return best;
}

module.exports = { getParser, detectSourceType, SUPPORTED_SOURCE_TYPES: Object.keys(REGISTRY) };
