/**
 * command-console.tsx
 * Kodaxa relay console — press ~ anywhere to open.
 * One concern: diegetic command interface with in-world responses.
 *
 * Supported commands:
 *   help          — list available commands
 *   status        — system health readout
 *   ping <sector> — mock latency to a named sector
 *   whoami        — operative identity check
 *   clear         — clear output
 *   uplink        — navigate to auth
 *   ops           — navigate to /planner
 *   intel         — navigate to /items
 *   commerce      — navigate to /directory
 *   dispatch      — navigate to /patch-notes
 *   corp          — navigate to /corporation
 *   exit / close  — dismiss console
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────

interface ConsoleLine {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

// ── Command definitions ────────────────────────────────────────────────

const HELP_OUTPUT = [
  '  help              — list available commands',
  '  status            — system health readout',
  '  ping <sector>     — relay ping to a named sector',
  '  whoami            — operative identity check',
  '  uplink            — navigate to authentication',
  '  ops               — open Operations division',
  '  intel             — open Intelligence division',
  '  commerce          — open Commerce division',
  '  dispatch          — open Dispatch newsroom',
  '  corp              — open Corporation Registry',
  '  clear             — clear console output',
  '  exit              — close relay console',
].join('\n');

const STATUS_OUTPUT = [
  '  Satellite uplink       ● NOMINAL',
  '  Relay network          ● NOMINAL',
  '  Schematics Archive     ● ONLINE',
  '  Material Registry      ● ONLINE',
  '  Commerce Registry      ● ONLINE',
  '  Workforce Intelligence ● ONLINE',
  '  Data pipeline          ● SYNCING',
  '  Server locality        FRONTIER-WEST-3',
].join('\n');

function pingOutput(sector: string): string {
  const ms = Math.floor(Math.random() * 120) + 20;
  const name = sector || 'UNKNOWN';
  return `  RELAY_PING ${name.toUpperCase()} — ${ms}ms — uplink stable`;
}

// ── Component ──────────────────────────────────────────────────────────

export function CommandConsole() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [history, setHistory] = useState<ConsoleLine[]>([
    { type: 'system', text: 'KODAXA RELAY CONSOLE · Type `help` for commands · Press ~ or Esc to close' },
  ]);
  const [cmdHistory, setCmdHistory]   = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // historyIdx is read inside setHistoryIdx functional updaters (ArrowUp/Down handlers).
  // ESLint cannot trace state values used only inside setState callbacks, so it false-flags this.
  const [historyIdx, setHistoryIdx]   = useState(-1);
  const inputRef  = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  // Open/close on ~ key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const addLine = useCallback((lines: ConsoleLine[]) => {
    setHistory((h) => [...h, ...lines]);
  }, []);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
    const arg = args.join(' ');

    // Echo input
    const inputLine: ConsoleLine = { type: 'input', text: `> ${raw}` };

    if (cmd === 'clear') {
      setHistory([{ type: 'system', text: 'KODAXA RELAY CONSOLE · Type `help` for commands · Press ~ or Esc to close' }]);
      return;
    }

    if (cmd === 'exit' || cmd === 'close') {
      addLine([inputLine, { type: 'system', text: 'Relay console closed.' }]);
      setTimeout(() => setOpen(false), 300);
      return;
    }

    const navigate = (path: string, label: string) => {
      addLine([inputLine, { type: 'output', text: `  Routing to ${label}…` }]);
      setTimeout(() => { setOpen(false); router.push(path); }, 400);
    };

    switch (cmd) {
      case 'help':
        addLine([inputLine, { type: 'output', text: HELP_OUTPUT }]); break;
      case 'status':
        addLine([inputLine, { type: 'output', text: STATUS_OUTPUT }]); break;
      case 'ping':
        addLine([inputLine, { type: 'output', text: pingOutput(arg) }]); break;
      case 'whoami':
        addLine([inputLine, { type: 'output', text: '  OPERATIVE: UNIDENTIFIED · Uplink not established · Run `uplink` to authenticate' }]); break;
      case 'uplink':
        navigate('/auth/sign-in', 'Account Services'); break;
      case 'ops':
        navigate('/planner', 'Operations Division'); break;
      case 'intel':
        navigate('/items', 'Intelligence Division'); break;
      case 'commerce':
        navigate('/directory', 'Commerce Division'); break;
      case 'dispatch':
        navigate('/patch-notes', 'Dispatch Newsroom'); break;
      case 'corp':
        navigate('/corporation', 'Corporation Registry'); break;
      default:
        addLine([inputLine, { type: 'error', text: `  System fault: unknown command "${cmd}" — type \`help\` for available commands` }]);
    }
  }, [addLine, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      setCmdHistory((h) => [val, ...h].slice(0, 50));
      setHistoryIdx(-1);
      setInput('');
      runCommand(val);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIdx((i) => {
        const next = Math.min(i + 1, cmdHistory.length - 1);
        setInput(cmdHistory[next] ?? '');
        return next;
      });
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIdx((i) => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? '' : cmdHistory[next] ?? '');
        return next;
      });
    }
    if (e.key === 'Escape') setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[150] border-t border-sr-border bg-sr-bg/97 backdrop-blur-sm shadow-2xl"
      style={{ height: 'clamp(260px, 40vh, 480px)' }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-sr-border bg-sr-surface">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-600 uppercase tracking-[0.35em]">
            Kodaxa Relay Console
          </span>
          <span className="text-xs font-mono text-teal-600">● CONNECTED</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-xs font-mono text-slate-700 hover:text-slate-400 transition-colors uppercase tracking-wider"
        >
          [Esc] Close
        </button>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 font-mono text-xs"
        style={{ height: 'calc(100% - 64px)' }}
      >
        {history.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'input'  ? 'text-cyan-400' :
              line.type === 'error'  ? 'text-red-400'  :
              line.type === 'system' ? 'text-slate-600' :
              'text-slate-400'
            }`}
          >
            {line.text}
          </pre>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-center border-t border-sr-border px-4 py-2 gap-2 bg-sr-surface">
        <span className="text-cyan-600 font-mono text-xs shrink-0">kdx:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-slate-200 placeholder-slate-700 focus:outline-none caret-cyan-400"
          placeholder="type a command…"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
