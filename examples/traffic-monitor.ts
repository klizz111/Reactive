import { Subject, Observable, BehaviorSubject, interval, EMPTY } from 'rxjs';
import {
  map,
  filter,
  bufferTime,
  scan,
  share,
  takeUntil,
  distinctUntilChanged,
  catchError,
} from 'rxjs/operators';

/**
 * Example: Reactive Network Traffic Monitor
 *
 * Demonstrates how reactive programming can be used to build
 * a real-time network traffic monitoring system.
 */

interface TrafficPacket {
  id: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
  source: string;
  destination: string;
  port: number;
  size: number;
  timestamp: number;
}

interface TrafficStats {
  totalPackets: number;
  totalBytes: number;
  avgPacketSize: number;
  packetsPerSecond: number;
  topProtocol: string;
}

// Simulate incoming network traffic
const createTrafficSimulator = (): Observable<TrafficPacket> => {
  const protocols: TrafficPacket['protocol'][] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
  const sources = ['10.0.0.1', '192.168.1.100', '172.16.0.1', '10.0.0.50'];
  const destinations = ['8.8.8.8', '1.1.1.1', '104.21.0.1', '151.101.1.69'];
  const commonPorts: Record<string, number> = {
    HTTP: 80,
    HTTPS: 443,
    TCP: 8080,
    UDP: 53,
    ICMP: 0,
  };

  let packetId = 0;

  return new Observable<TrafficPacket>((subscriber) => {
    const intervalId = setInterval(() => {
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      subscriber.next({
        id: ++packetId,
        protocol,
        source: sources[Math.floor(Math.random() * sources.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        port: commonPorts[protocol],
        size: Math.floor(Math.random() * 1460) + 40,
        timestamp: Date.now(),
      });
    }, 100);

    return () => clearInterval(intervalId);
  });
};

// Compute stats from a buffer of packets
const computeStats = (packets: TrafficPacket[]): TrafficStats => {
  if (packets.length === 0) {
    return { totalPackets: 0, totalBytes: 0, avgPacketSize: 0, packetsPerSecond: 0, topProtocol: 'N/A' };
  }

  const totalBytes = packets.reduce((sum, p) => sum + p.size, 0);
  const protocolCounts: Record<string, number> = {};
  packets.forEach((p) => {
    protocolCounts[p.protocol] = (protocolCounts[p.protocol] ?? 0) + 1;
  });
  const topProtocol = Object.entries(protocolCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    totalPackets: packets.length,
    totalBytes,
    avgPacketSize: Math.round(totalBytes / packets.length),
    packetsPerSecond: packets.length,
    topProtocol,
  };
};

// --- Demo ---
console.log('=== Reactive Network Traffic Monitor ===\n');

const stop$ = new Subject<void>();
const traffic$ = createTrafficSimulator().pipe(share(), takeUntil(stop$));

// Stream 1: Log suspicious large packets (> 1400 bytes)
traffic$
  .pipe(filter((p) => p.size > 1400))
  .subscribe((p) => {
    console.log(`[ALERT] Large packet: #${p.id} | ${p.protocol} | ${p.source} → ${p.destination} | ${p.size} bytes`);
  });

// Stream 2: Aggregate stats every second
traffic$
  .pipe(
    bufferTime(1000),
    filter((packets) => packets.length > 0),
    map(computeStats),
    distinctUntilChanged((a, b) => a.totalPackets === b.totalPackets),
  )
  .subscribe((stats) => {
    console.log(
      `[Stats] Packets/s: ${stats.packetsPerSecond} | Total bytes: ${stats.totalBytes} | Avg size: ${stats.avgPacketSize}B | Top protocol: ${stats.topProtocol}`,
    );
  });

// Stream 3: Count cumulative packets
traffic$
  .pipe(
    scan((count) => count + 1, 0),
    filter((count) => count % 50 === 0),
  )
  .subscribe((count) => {
    console.log(`[Counter] Processed ${count} packets so far.`);
  });

// Stop after 5 seconds
setTimeout(() => {
  console.log('\n[Monitor] Stopping traffic monitor...');
  stop$.next();
  stop$.complete();
  process.exit(0);
}, 5000);
