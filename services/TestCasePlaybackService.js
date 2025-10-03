/**
 * TestCasePlaybackService - Handles test case playback and execution
 * This service provides the missing functionality referenced in the logs
 */

class TestCasePlaybackService {
  constructor(options = {}) {
    this.databaseService = options.databaseService || null;
    this.websocketBroadcast = options.websocketBroadcast || null;
    this.isPlaying = false;
    this.currentTestCase = null;
    this.playbackSpeed = 1.0;
    this.startTime = null;
    this.intervalId = null;
  }

  /**
   * Start playback of a test case
   */
  async startPlayback({ testCaseId, runId, speed = 1.0, apiBaseUrl = '/api' }) {
    try {
      if (this.isPlaying) {
        throw new Error('Playback is already in progress');
      }

      this.currentTestCase = testCaseId;
      this.playbackSpeed = speed;
      this.isPlaying = true;
      this.startTime = Date.now();

      console.log(`🎬 Starting playback for test case: ${testCaseId}`);
      
      // Broadcast playback start event
      if (this.websocketBroadcast) {
        this.websocketBroadcast('playback_started', 'test_case_playback', {
          testCaseId,
          runId,
          speed,
          startTime: this.startTime
        });
      }

      // Simulate playback progress
      this.simulatePlaybackProgress();

      return {
        success: true,
        testCaseId,
        runId,
        status: 'playing',
        startTime: this.startTime
      };

    } catch (error) {
      console.error('❌ Playback start error:', error);
      this.isPlaying = false;
      this.currentTestCase = null;
      throw error;
    }
  }

  /**
   * Stop current playback
   */
  async stopPlayback() {
    try {
      if (!this.isPlaying) {
        return { success: false, message: 'No playback in progress' };
      }

      this.isPlaying = false;
      
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      console.log(`⏹️ Stopping playback for test case: ${this.currentTestCase}`);

      // Broadcast playback stop event
      if (this.websocketBroadcast) {
        this.websocketBroadcast('playback_stopped', 'test_case_playback', {
          testCaseId: this.currentTestCase,
          duration: Date.now() - this.startTime
        });
      }

      const result = {
        success: true,
        testCaseId: this.currentTestCase,
        status: 'stopped',
        duration: Date.now() - this.startTime
      };

      this.currentTestCase = null;
      this.startTime = null;

      return result;

    } catch (error) {
      console.error('❌ Playback stop error:', error);
      throw error;
    }
  }

  /**
   * Get current playback status
   */
  status() {
    return {
      isPlaying: this.isPlaying,
      currentTestCase: this.currentTestCase,
      playbackSpeed: this.playbackSpeed,
      startTime: this.startTime,
      duration: this.startTime ? Date.now() - this.startTime : 0
    };
  }

  /**
   * Simulate playback progress with realistic data
   */
  simulatePlaybackProgress() {
    let progress = 0;
    const totalSteps = 100;
    const stepDuration = 1000 / this.playbackSpeed; // Adjust for speed

    this.intervalId = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.intervalId);
        return;
      }

      progress += 1;
      
      // Simulate realistic test execution data
      const testData = {
        step: progress,
        totalSteps,
        progress: Math.round((progress / totalSteps) * 100),
        message: this.generateTestMessage(progress),
        timestamp: Date.now(),
        testCaseId: this.currentTestCase
      };

      // Broadcast progress update
      if (this.websocketBroadcast) {
        this.websocketBroadcast('playback_progress', 'test_case_playback', testData);
      }

      // Complete playback when done
      if (progress >= totalSteps) {
        this.completePlayback();
      }

    }, stepDuration);
  }

  /**
   * Complete the playback
   */
  completePlayback() {
    this.isPlaying = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log(`✅ Playback completed for test case: ${this.currentTestCase}`);

    // Broadcast completion event
    if (this.websocketBroadcast) {
      this.websocketBroadcast('playback_completed', 'test_case_playback', {
        testCaseId: this.currentTestCase,
        duration: Date.now() - this.startTime,
        status: 'completed'
      });
    }

    this.currentTestCase = null;
    this.startTime = null;
  }

  /**
   * Generate realistic test messages
   */
  generateTestMessage(step) {
    const messages = [
      'Initializing test environment...',
      'Loading test case configuration...',
      'Starting protocol simulation...',
      'Establishing network connections...',
      'Executing test procedures...',
      'Validating test results...',
      'Generating test report...',
      'Cleaning up test environment...'
    ];

    const messageIndex = Math.floor((step / 100) * messages.length);
    return messages[Math.min(messageIndex, messages.length - 1)];
  }
}

module.exports = TestCasePlaybackService;