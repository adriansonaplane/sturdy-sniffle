import { execFileSync } from 'node:child_process';

const expectedNode = 'v24.18.0';
const expectedNpm = '11.16.0';
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const actualNode = process.version;
const actualNpm = execFileSync(npmCmd, ['--version'], { encoding: 'utf8' }).trim();
const mismatches = [];

if (actualNode !== expectedNode) {
  mismatches.push(`Node.js ${expectedNode} required, found ${actualNode}`);
}

if (actualNpm !== expectedNpm) {
  mismatches.push(`npm ${expectedNpm} required, found ${actualNpm}`);
}

if (mismatches.length > 0) {
  console.error(mismatches.join('\n'));
  process.exit(1);
}

console.log(`Runtime OK: Node.js ${actualNode}, npm ${actualNpm}`);
