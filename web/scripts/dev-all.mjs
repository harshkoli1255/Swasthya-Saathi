#!/usr/bin/env node
import { spawn } from 'child_process';
import readline from 'readline';

console.log('\x1b[1m\x1b[32m%s\x1b[0m', '═════════════════════════════════════════════════════════════════════');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  SwasthyaSaathi Dual-Surface Development Servers');
console.log('\x1b[36m%s\x1b[0m', '  • Patient Intake Portal:     http://localhost:5173');
console.log('\x1b[35m%s\x1b[0m', '  • Doctor OPD Workstation:   http://localhost:5174');
console.log('\x1b[33m%s\x1b[0m', '  • Authoritative Backend:    http://127.0.0.1:8000');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '═════════════════════════════════════════════════════════════════════\n');

function runService(name, color, command, args) {
  const child = spawn(command, args, {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  const prefix = `${color}[${name}]\x1b[0m `;

  const rlOut = readline.createInterface({ input: child.stdout });
  rlOut.on('line', (line) => {
    console.log(`${prefix}${line}`);
  });

  const rlErr = readline.createInterface({ input: child.stderr });
  rlErr.on('line', (line) => {
    console.error(`${prefix}\x1b[31m${line}\x1b[0m`);
  });

  child.on('error', (err) => {
    console.error(`${prefix}Failed to start: ${err.message}`);
  });

  return child;
}

const patientProc = runService('Patient :5173', '\x1b[36m', 'npx', ['vite', '--config', 'vite.patient.config.ts']);
const doctorProc = runService('Doctor  :5174', '\x1b[35m', 'npx', ['vite', '--config', 'vite.doctor.config.ts']);

function cleanup() {
  console.log('\n\x1b[33mShutting down SwasthyaSaathi dev surfaces...\x1b[0m');
  try { patientProc.kill('SIGTERM'); } catch (_) {}
  try { doctorProc.kill('SIGTERM'); } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
