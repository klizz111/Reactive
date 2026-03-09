# Reactive Network

> Repository of Reactive Network Studying

A hands-on environment for learning **reactive programming** concepts applied to **network applications**, using [RxJS](https://rxjs.dev/) and TypeScript.

## 🚀 Getting Started with GitHub Codespaces

This repository is configured to work with **GitHub Codespaces**, providing a fully set-up development environment with a single click.

### Open in Codespaces

1. Click the green **Code** button at the top of this repository.
2. Select **Codespaces** tab.
3. Click **Create codespace on main**.

The environment will automatically:
- Install Node.js 20, Python 3.11
- Install all npm dependencies (`npm install`)
- Configure VS Code extensions (TypeScript, ESLint, Prettier, etc.)
- Forward ports 3000 and 8080

---

## 📁 Project Structure

```
.
├── .devcontainer/
│   ├── devcontainer.json   # GitHub Codespaces configuration
│   └── Dockerfile          # Dev container image definition
├── src/
│   └── index.ts            # Entry point with core RxJS examples
├── examples/
│   ├── http-polling.ts     # Reactive HTTP polling with retry
│   └── traffic-monitor.ts  # Real-time network traffic monitoring
├── package.json
└── tsconfig.json
```

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Run Examples

```bash
# Run the main entry point
npm run dev

# Run HTTP polling example
npx ts-node examples/http-polling.ts

# Run traffic monitor example
npx ts-node examples/traffic-monitor.ts
```

### Build

```bash
npm run build
```

---

## 📚 Reactive Concepts Covered

| Concept | Description | Example |
|---|---|---|
| `Observable` | Lazy data stream | `src/index.ts` |
| `Subject` | Multicast stream / event bus | `examples/traffic-monitor.ts` |
| `BehaviorSubject` | State management with current value | `src/index.ts` |
| `retry` | Auto-retry on failure | `examples/http-polling.ts` |
| `bufferTime` | Batch events over time | `examples/traffic-monitor.ts` |
| `switchMap` | Cancel previous inner streams | `examples/http-polling.ts` |
| `scan` | Accumulate state reactively | `examples/traffic-monitor.ts` |

---

## 🌐 Network Tools Available

The dev container includes the following network tools for hands-on study:

- `curl`, `wget` — HTTP clients
- `nmap` — Network scanner
- `tcpdump` — Packet capture
- `netcat` (`nc`) — TCP/UDP client/server
- `ping` — ICMP ping
- `dig`, `nslookup` — DNS tools
- `ip`, `netstat` — Network interface tools

---

## 📖 Learning Resources

- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [ReactiveX — Introduction](https://reactivex.io/intro.html)
- [Learn RxJS](https://www.learnrxjs.io/)
- [Reactive Programming with RxJS (book)](https://www.oreilly.com/library/view/reactive-programming-with/9781491931646/)
