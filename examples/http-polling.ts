import { Observable, Subject, interval, fromEvent, EMPTY } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  map,
  filter,
  retry,
  catchError,
  switchMap,
  takeUntil,
  share,
  tap,
  distinctUntilChanged,
} from 'rxjs/operators';

/**
 * Example: Reactive HTTP Polling
 *
 * Demonstrates how to build a reactive HTTP polling mechanism
 * that automatically retries on failure and stops on demand.
 */

interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: Date;
}

// Simulate an HTTP GET request as an Observable
const httpGet = <T>(url: string): Observable<ApiResponse<T>> => {
  return new Observable<ApiResponse<T>>((subscriber) => {
    // Simulate async HTTP fetch
    const timeoutId = setTimeout(() => {
      // Simulate occasional failures
      if (Math.random() < 0.2) {
        subscriber.error(new Error(`HTTP request to ${url} failed`));
      } else {
        subscriber.next({
          data: { message: `Response from ${url}` } as T,
          status: 200,
          timestamp: new Date(),
        });
        subscriber.complete();
      }
    }, Math.random() * 500 + 100);

    return () => clearTimeout(timeoutId);
  });
};

// Reactive polling with retry
const poll$ = <T>(url: string, intervalMs: number): Observable<ApiResponse<T>> => {
  const stop$ = new Subject<void>();

  return interval(intervalMs).pipe(
    switchMap(() =>
      httpGet<T>(url).pipe(
        retry({ count: 3, delay: 500 }),
        catchError((err) => {
          console.error(`[Polling] Failed after retries: ${err.message}`);
          return EMPTY;
        }),
      ),
    ),
    takeUntil(stop$),
    share(),
  );
};

// --- Demo ---
console.log('=== Reactive HTTP Polling Example ===\n');

const stop$ = new Subject<void>();

const poller$ = poll$<{ message: string }>('https://api.example.com/status', 800);

const subscription = poller$.subscribe({
  next: (response) => {
    console.log(
      `[Poll] Status: ${response.status} | ${JSON.stringify(response.data)} @ ${response.timestamp.toISOString()}`,
    );
  },
  error: (err) => console.error('[Poll] Error:', err),
  complete: () => console.log('[Poll] Completed.'),
});

// Stop polling after 5 seconds
setTimeout(() => {
  console.log('\n[Poll] Stopping poller...');
  subscription.unsubscribe();
  process.exit(0);
}, 5000);
