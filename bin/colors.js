#!/usr/bin/env node
'use strict';

const colors = {
  red:    '\u001b[31m',
  green:  '\u001b[32m',
  blue:   '\u001b[34m',
  yellow: '\u001b[33m',

  reset:  '\u001b[0m'
};

const fillStr = (color, str) => {
  return colors[color] + str + colors.reset;
}

exports.fillStr = fillStr;
