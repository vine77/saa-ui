import Ember from 'ember';

/**
 * Convert logTime labels to corresponding seconds used by Kibana
 *
 * @param {string} code A log time label for Kibana parameter
 * @return {string} The corresponding number of seconds
 */
export default function(time) {
  switch (time) {
    case 'Last 15min':
      return '900';
    case 'Last 60min':
      return '3600';
    case 'Last 4h':
      return '14400';
    case 'Last 12h':
      return '43200';
    case 'Last 24h':
      return '86400';
    case 'Last 48h':
      return '172800';
    case 'Last 7d':
      return '604800';
    case 'All Time':
      return 'all';
  }
}
