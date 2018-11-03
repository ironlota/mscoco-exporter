// Based on code by Burakcan
// github.com/burakcan/mb

/* eslint-disable */
module.exports = p => o => p.map(c => {
  o = (o || {})[c];
}) && o;
