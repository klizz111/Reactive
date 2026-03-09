import { Observable, fromEvent, interval, Subject, BehaviorSubject } from 'rxjs';
import { map, filter, mergeMap, catchError, retry, debounceTime, takeUntil } from 'rxjs/operators';

/**
 * Reactive Network - Entry Point
 *
 * This file demonstrates core reactive programming concepts
 * applied to network scenarios.
 */

// --- Basic Observable Example ---
const helloReactive = new Observable<string>((subscriber) => {
  subscriber.next('Hello from Reactive Network!');
  subscriber.next('Observing data streams...');
  subscriber.complete();
});

helloReactive.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('Stream completed.\n'),
});

// --- Simulated Network Data Stream ---
interface NetworkPacket {
  id: number;
  source: string;
  destination: string;
  size: number;
  timestamp: Date;
}

const simulateNetworkStream = (): Observable<NetworkPacket> => {
  const sources = ['192.168.1.1', '10.0.0.2', '172.16.0.5'];
  const destinations = ['8.8.8.8', '1.1.1.1', '192.168.1.255'];
  let id = 0;

  return new Observable<NetworkPacket>((subscriber) => {
    const intervalId = setInterval(() => {
      if (id < 5) {
        subscriber.next({
          id: ++id,
          source: sources[Math.floor(Math.random() * sources.length)],
          destination: destinations[Math.floor(Math.random() * destinations.length)],
          size: Math.floor(Math.random() * 1500) + 64,
          timestamp: new Date(),
        });
      } else {
        subscriber.complete();
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  });
};

// --- BehaviorSubject for Connection State ---
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

const connectionState$ = new BehaviorSubject<ConnectionState>('disconnected');

connectionState$.subscribe((state) => {
  console.log(`[Connection State] → ${state}`);
});

// Simulate a connection lifecycle
const simulateConnection = () => {
  connectionState$.next('connecting');
  setTimeout(() => connectionState$.next('connected'), 300);
  setTimeout(() => connectionState$.next('disconnected'), 700);
};

// --- Main Reactive Network Demo ---
console.log('=== Reactive Network Demo ===\n');

const stop$ = new Subject<void>();

simulateNetworkStream()
  .pipe(
    filter((packet) => packet.size > 100),
    map((packet) => ({
      ...packet,
      sizeKB: (packet.size / 1024).toFixed(2) + ' KB',
    })),
    takeUntil(stop$),
  )
  .subscribe({
    next: (packet) => {
      console.log(
        `[Packet #${packet.id}] ${packet.source} → ${packet.destination} | Size: ${packet.sizeKB}`,
      );
    },
    error: (err) => console.error('Stream error:', err),
    complete: () => {
      console.log('\n[Stream] Packet capture complete.');
      simulateConnection();
    },
  });
