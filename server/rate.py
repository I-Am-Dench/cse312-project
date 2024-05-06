import threading
import time

class IPState:
    def __init__(self):
        self._lock = threading.Lock()
        self.requests = 0
        self.time = time.time()
        self.blocked = False

    def block(self):
        with self._lock:
            self.blocked = True
    
    def increment(self):
        with self._lock:
            self.requests += 1
            self.time = time.time()
            return self.requests
        
    def reset(self):
        with self._lock:
            self.requests = 0
            self.blocked = False
        
    def time_since_last_request(self):
        return time.time() - self.time

class RateLimiter:
    def __init__(self):
        self._requests = {}

    def request(self, ip: str) -> bool:
        state: IPState = self._requests.get(ip, IPState())
        self._requests[ip] = state

        delta = state.time_since_last_request()
        if (not state.blocked and delta > 10) or delta > 30:
            state.reset()
            state.increment()
            return True

        num_requests = state.increment()
        if num_requests > 50:
            state.block()
            return False
        
        return True