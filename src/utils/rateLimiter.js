class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 10000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
    this.isBlocked = false;
    this.blockTimeout = null;
  }

  checkLimit() {
    const now = Date.now();
    // Remove requests older than the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Add current request
    this.requests.push(now);

    // Check if we've exceeded the limit
    if (this.requests.length > this.maxRequests) {
      this.block();
      throw new Error('Too many requests. System has been temporarily blocked.');
    }

    return true;
  }

  block() {
    this.isBlocked = true;
    this.requests = []; // Clear the requests

    // Unblock after the time window
    if (this.blockTimeout) {
      clearTimeout(this.blockTimeout);
    }
    
    this.blockTimeout = setTimeout(() => {
      this.isBlocked = false;
      this.requests = [];
    }, this.timeWindow);
  }

  isRequestAllowed() {
    if (this.isBlocked) {
      return false;
    }
    try {
      return this.checkLimit();
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();
export default rateLimiter;