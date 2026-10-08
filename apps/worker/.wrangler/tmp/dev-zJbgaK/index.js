var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __name = (target, value) => __defProp(target, 'name', { value, configurable: true });
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
  return value;
};

// .wrangler/tmp/bundle-xH9rY6/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete('CF-Connecting-IP');
  return request;
}
__name(stripCfConnectingIPHeader, 'stripCfConnectingIPHeader');
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [stripCfConnectingIPHeader.apply(null, argArray)]);
  },
});

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, 'createNotImplementedError');
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, 'fn');
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, 'notImplemented');
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, 'notImplementedClass');

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now
  ? globalThis.performance.now.bind(globalThis.performance)
  : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: 'node',
  entryType: 'node',
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0,
  },
  detail: void 0,
  toJSON() {
    return this;
  },
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = 'event';
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail,
    };
  }
};
__name(PerformanceEntry, 'PerformanceEntry');
var PerformanceMark = /* @__PURE__ */ __name(
  class PerformanceMark2 extends PerformanceEntry {
    entryType = 'mark';
    constructor() {
      super(...arguments);
    }
    get duration() {
      return 0;
    }
  },
  'PerformanceMark'
);
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = 'measure';
};
__name(PerformanceMeasure, 'PerformanceMeasure');
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = 'resource';
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = '';
  name = '';
  nextHopProtocol = '';
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, 'PerformanceResourceTiming');
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, 'PerformanceObserverEntryList');
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError('Performance.timerify');
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming('');
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName
      ? this._entries.filter((e) => e.name !== markName)
      : this._entries.filter((e) => e.entryType !== 'mark');
  }
  clearMeasures(measureName) {
    this._entries = measureName
      ? this._entries.filter((e) => e.name !== measureName)
      : this._entries.filter((e) => e.entryType !== 'measure');
  }
  clearResourceTimings() {
    this._entries = this._entries.filter(
      (e) => e.entryType !== 'resource' || e.entryType !== 'navigation'
    );
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === 'string') {
      start = this.getEntriesByName(startOrMeasureOptions, 'mark')[0]?.startTime;
      end = this.getEntriesByName(endMark, 'mark')[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end,
      },
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError('Performance.addEventListener');
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError('Performance.removeEventListener');
  }
  dispatchEvent(event) {
    throw createNotImplementedError('Performance.dispatchEvent');
  }
  toJSON() {
    return this;
  }
};
__name(Performance, 'Performance');
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError('PerformanceObserver.disconnect');
  }
  observe(options) {
    throw createNotImplementedError('PerformanceObserver.observe');
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, 'PerformanceObserver');
__publicField(PerformanceObserver, 'supportedEntryTypes', []);
var performance =
  globalThis.performance && 'addEventListener' in globalThis.performance
    ? globalThis.performance
    : new Performance();

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.0.2_unenv@2.0.0-rc.14_workerd@1.20250718.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from 'node:stream';

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {}, { __unenv__: true });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented('console.createTask');
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass('console.Console');
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.0.2_unenv@2.0.0-rc.14_workerd@1.20250718.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis['console'];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2,
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times,
});
var console_default = workerdConsole;

// ../../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@4.20260702.1/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ __name(function hrtime2(startTime) {
    const now = Date.now();
    const seconds = Math.trunc(now / 1e3);
    const nanos = (now % 1e3) * 1e6;
    if (startTime) {
      let diffSeconds = seconds - startTime[0];
      let diffNanos = nanos - startTime[0];
      if (diffNanos < 0) {
        diffSeconds = diffSeconds - 1;
        diffNanos = 1e9 + diffNanos;
      }
      return [diffSeconds, diffNanos];
    }
    return [seconds, nanos];
  }, 'hrtime'),
  {
    bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, 'bigint'),
  }
);

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from 'node:events';

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from 'node:net';
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, 'ReadStream');

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from 'node:net';
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === 'function' && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, 'WriteStream');

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [
      ...Object.getOwnPropertyNames(Process.prototype),
      ...Object.getOwnPropertyNames(EventEmitter.prototype),
    ]) {
      const value = this[prop];
      if (typeof value === 'function') {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ''}${type ? `${type}: ` : ''}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return (this.#stdin ??= new ReadStream(0));
  }
  get stdout() {
    return (this.#stdout ??= new WriteStream(1));
  }
  get stderr() {
    return (this.#stderr ??= new WriteStream(2));
  }
  #cwd = '/';
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = '';
  platform = '';
  argv = [];
  argv0 = '';
  execArgv = [];
  execPath = '';
  title = '';
  pid = 200;
  ppid = 100;
  get version() {
    return '';
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {}
  unref() {}
  umask() {
    throw createNotImplementedError('process.umask');
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError('process.getActiveResourcesInfo');
  }
  exit() {
    throw createNotImplementedError('process.exit');
  }
  reallyExit() {
    throw createNotImplementedError('process.reallyExit');
  }
  kill() {
    throw createNotImplementedError('process.kill');
  }
  abort() {
    throw createNotImplementedError('process.abort');
  }
  dlopen() {
    throw createNotImplementedError('process.dlopen');
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError('process.setSourceMapsEnabled');
  }
  loadEnvFile() {
    throw createNotImplementedError('process.loadEnvFile');
  }
  disconnect() {
    throw createNotImplementedError('process.disconnect');
  }
  cpuUsage() {
    throw createNotImplementedError('process.cpuUsage');
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError('process.setUncaughtExceptionCaptureCallback');
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError('process.hasUncaughtExceptionCaptureCallback');
  }
  initgroups() {
    throw createNotImplementedError('process.initgroups');
  }
  openStdin() {
    throw createNotImplementedError('process.openStdin');
  }
  assert() {
    throw createNotImplementedError('process.assert');
  }
  binding() {
    throw createNotImplementedError('process.binding');
  }
  permission = { has: /* @__PURE__ */ notImplemented('process.permission.has') };
  report = {
    directory: '',
    filename: '',
    signal: 'SIGUSR2',
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented('process.report.getReport'),
    writeReport: /* @__PURE__ */ notImplemented('process.report.writeReport'),
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented('process.finalization.register'),
    unregister: /* @__PURE__ */ notImplemented('process.finalization.unregister'),
    registerBeforeExit: /* @__PURE__ */ notImplemented('process.finalization.registerBeforeExit'),
  };
  memoryUsage = Object.assign(
    () => ({
      arrayBuffers: 0,
      rss: 0,
      external: 0,
      heapTotal: 0,
      heapUsed: 0,
    }),
    { rss: () => 0 }
  );
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, 'Process');

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.0.2_unenv@2.0.0-rc.14_workerd@1.20250718.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis['process'];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule('node:process');
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick,
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding,
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding,
};
var process_default = _process;

// ../../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@4.20260702.1/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  return new Response(arrayBuffer, {
    headers: {
      'Content-Type': contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()),
    },
  }).formData();
}, 'bufferToFormData');

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/utils/body.js
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = /* @__PURE__ */ __name((request) => 'headers' in request, 'isRawRequest');
var parseBody = /* @__PURE__ */ __name(
  async (request, options = /* @__PURE__ */ Object.create(null)) => {
    const { all = false, dot = false } = options;
    const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers)
      .get('Content-Type')
      ?.split(';')[0]
      .trim()
      .toLowerCase();
    if (mediaType === 'multipart/form-data' || mediaType === 'application/x-www-form-urlencoded')
      return parseFormData(request, {
        all,
        dot,
      });
    return {};
  },
  'parseBody'
);
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData)
    return convertFormDataToBodyData(await request.bodyCache.formData, options);
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get('Content-Type') || '');
  if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
  const formData = await formDataPromise;
  if (formData) return convertFormDataToBodyData(formData, options);
  return {};
}
__name(parseFormData, 'parseFormData');
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    if (!(options.all || key.endsWith('[]'))) form[key] = value;
    else handleParsingAllValues(form, key, value);
  });
  if (options.dot)
    Object.entries(form).forEach(([key, value]) => {
      if (key.includes('.')) {
        handleParsingNestedValues(form, key, value, nestingState);
        delete form[key];
      }
    });
  return form;
}
__name(convertFormDataToBodyData, 'convertFormDataToBodyData');
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) form[key].push(value);
    else form[key] = [form[key], value];
  } else if (!key.endsWith('[]')) form[key] = value;
  else form[key] = [value];
}, 'handleParsingAllValues');
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) return;
  let nestedForm = form;
  const keys = key.split('.', 34);
  if (keys.length > 33) throwNestingLimitExceeded();
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) nestedForm[key2] = value;
    else {
      if (
        !nestedForm[key2] ||
        typeof nestedForm[key2] !== 'object' ||
        Array.isArray(nestedForm[key2]) ||
        nestedForm[key2] instanceof File
      ) {
        if (state.count++ >= MAX_NESTED_OBJECTS) throwNestingLimitExceeded();
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, 'handleParsingNestedValues');
var throwNestingLimitExceeded = /* @__PURE__ */ __name(() => {
  throw new Error('Nesting limit exceeded');
}, 'throwNestingLimitExceeded');

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split('/');
  if (paths[0] === '') paths.shift();
  return paths;
}, 'splitPath');
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, 'splitRoutingPath');
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return {
    groups,
    path,
  };
}, 'extractGroupsFromPath');
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--)
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
  }
  return paths;
}, 'replaceGroupMarks');
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === '*') return '*';
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2])
        patternCache[cacheKey] =
          next && next[0] !== ':' && next[0] !== '*'
            ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)]
            : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      else patternCache[cacheKey] = [label, match2[1], true];
    }
    return patternCache[cacheKey];
  }
  return null;
}, 'getPattern');
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, 'tryDecode');
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), 'tryDecodeURI');
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf('/', url.indexOf(':') + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf('?', i);
      const hashIndex = url.indexOf('#', i);
      const end =
        queryIndex === -1
          ? hashIndex === -1
            ? void 0
            : hashIndex
          : hashIndex === -1
            ? queryIndex
            : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes('%25') ? path.replace(/%25/g, '%2525') : path);
    } else if (charCode === 63 || charCode === 35) break;
  }
  return url.slice(start, i);
}, 'getPath');
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === '/' ? result.slice(0, -1) : result;
}, 'getPathNoStrict');
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) sub = mergePath(sub, ...rest);
  return `${base?.[0] === '/' ? '' : '/'}${base}${sub === '/' ? '' : `${base?.at(-1) === '/' ? '' : '/'}${sub?.[0] === '/' ? sub.slice(1) : sub}`}`;
}, 'mergePath');
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(':')) return null;
  const segments = path.split('/');
  const results = [];
  let basePath = '';
  segments.forEach((segment) => {
    if (segment !== '' && !/\:/.test(segment)) basePath += '/' + segment;
    else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === '') results.push('/');
        else results.push(basePath);
        const optionalSegment = segment.slice(0, -1);
        basePath += '/' + optionalSegment;
        results.push(basePath);
      } else basePath += '/' + segment;
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, 'checkOptionalParameter');
var tryDecodeURIComponent = /* @__PURE__ */ __name(
  (str) => (str.indexOf('%') !== -1 ? tryDecode(str, decodeURIComponent_) : str),
  'tryDecodeURIComponent'
);
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (value.indexOf('+') !== -1) value = value.replace(/\+/g, ' ');
  return tryDecodeURIComponent(value);
}, '_decodeURI');
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  const hashIndex = url.indexOf('#', 8);
  if (hashIndex !== -1) url = url.slice(0, hashIndex);
  let encoded;
  if (!multiple && key && key.indexOf('%') === -1 && key.indexOf('+') === -1) {
    let keyIndex2 = url.indexOf('?', 8);
    if (keyIndex2 === -1) return;
    if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf('&', valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) return '';
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) return;
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf('?', 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf('&', keyIndex + 1);
    let valueIndex = url.indexOf('=', keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? (nextKeyIndex === -1 ? void 0 : nextKeyIndex) : valueIndex
    );
    if (encoded) name = _decodeURI(name);
    keyIndex = nextKeyIndex;
    if (name === '') continue;
    let value;
    if (valueIndex === -1) value = '';
    else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) value = _decodeURI(value);
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
      results[name].push(value);
    } else results[name] ??= value;
  }
  return key ? results[key] : results;
}, '_getQueryParam');
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, 'getQueryParams');
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/request.js
var HonoRequest = /* @__PURE__ */ __name(
  class {
    /**
     * `.raw` can get the raw Request object.
     *
     * @see {@link https://hono.dev/docs/api/request#raw}
     *
     * @example
     * ```ts
     * // For Cloudflare Workers
     * app.post('/', async (c) => {
     *   const metadata = c.req.raw.cf?.hostMetadata?
     *   ...
     * })
     * ```
     */
    raw;
    #validatedData;
    #matchResult;
    routeIndex = 0;
    /**
     * `.path` can get the pathname of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#path}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const pathname = c.req.path // `/about/me`
     * })
     * ```
     */
    path;
    bodyCache = {};
    constructor(request, path = '/', matchResult = [[]]) {
      this.raw = request;
      this.path = path;
      this.#matchResult = matchResult;
    }
    param(key) {
      return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
    }
    #getDecodedParam(key) {
      const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
      const param = this.#getParamValue(paramKey);
      return param && tryDecodeURIComponent(param);
    }
    #getAllDecodedParams() {
      const decoded = {};
      const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
      for (const key of keys) {
        const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
        if (value !== void 0) decoded[key] = tryDecodeURIComponent(value);
      }
      return decoded;
    }
    #getParamValue(paramKey) {
      return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
    }
    query(key) {
      return getQueryParam(this.url, key);
    }
    queries(key) {
      return getQueryParams(this.url, key);
    }
    header(name) {
      if (name) return this.raw.headers.get(name) ?? void 0;
      const headerData = /* @__PURE__ */ Object.create(null);
      this.raw.headers.forEach((value, key) => {
        headerData[key] = value;
      });
      return headerData;
    }
    async parseBody(options) {
      return parseBody(this, options);
    }
    #cachedBody = (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) return cachedBody;
      for (const anyCachedKey in bodyCache)
        return bodyCache[anyCachedKey].then((body) => {
          if (anyCachedKey === 'json') body = JSON.stringify(body);
          const contentType =
            anyCachedKey === 'formData' ? void 0 : raw2.headers.get('content-type');
          return new Response(body, {
            headers: contentType ? { 'Content-Type': contentType } : void 0,
          })[key]();
        });
      return (bodyCache[key] = raw2[key]());
    };
    /**
     * `.json()` can parse Request body of type `application/json`
     *
     * @see {@link https://hono.dev/docs/api/request#json}
     *
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.json()
     * })
     * ```
     */
    json() {
      return this.#cachedBody('text').then((text) => JSON.parse(text));
    }
    /**
     * `.text()` can parse Request body of type `text/plain`
     *
     * @see {@link https://hono.dev/docs/api/request#text}
     *
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.text()
     * })
     * ```
     */
    text() {
      return this.#cachedBody('text');
    }
    /**
     * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
     *
     * @see {@link https://hono.dev/docs/api/request#arraybuffer}
     *
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.arrayBuffer()
     * })
     * ```
     */
    arrayBuffer() {
      return this.#cachedBody('arrayBuffer');
    }
    /**
     * `.bytes()` parses the request body as a `Uint8Array`.
     *
     * @see {@link https://hono.dev/docs/api/request#bytes}
     *
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.bytes()
     * })
     * ```
     */
    bytes() {
      return this.#cachedBody('arrayBuffer').then((buffer) => new Uint8Array(buffer));
    }
    /**
     * Parses the request body as a `Blob`.
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.blob();
     * });
     * ```
     * @see https://hono.dev/docs/api/request#blob
     */
    blob() {
      return this.#cachedBody('blob');
    }
    /**
     * Parses the request body as `FormData`.
     * @example
     * ```ts
     * app.post('/entry', async (c) => {
     *   const body = await c.req.formData();
     * });
     * ```
     * @see https://hono.dev/docs/api/request#formdata
     */
    formData() {
      return this.#cachedBody('formData');
    }
    /**
     * Adds validated data to the request.
     *
     * @param target - The target of the validation.
     * @param data - The validated data to add.
     */
    addValidatedData(target, data) {
      (this.#validatedData ??= {})[target] = data;
    }
    valid(target) {
      return this.#validatedData?.[target];
    }
    /**
     * `.url` can get the request url strings.
     *
     * @see {@link https://hono.dev/docs/api/request#url}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const url = c.req.url // `http://localhost:8787/about/me`
     *   ...
     * })
     * ```
     */
    get url() {
      return this.raw.url;
    }
    /**
     * `.method` can get the method name of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#method}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const method = c.req.method // `GET`
     * })
     * ```
     */
    get method() {
      return this.raw.method;
    }
    get [GET_MATCH_RESULT]() {
      return this.#matchResult;
    }
    /**
     * `.matchedRoutes` can return a matched route in the handler
     *
     * @deprecated
     *
     * Use matchedRoutes helper defined in "hono/route" instead.
     *
     * @see {@link https://hono.dev/docs/api/request#matchedroutes}
     *
     * @example
     * ```ts
     * app.use('*', async function logger(c, next) {
     *   await next()
     *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
     *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
     *     console.log(
     *       method,
     *       ' ',
     *       path,
     *       ' '.repeat(Math.max(10 - path.length, 0)),
     *       name,
     *       i === c.req.routeIndex ? '<- respond from here' : ''
     *     )
     *   })
     * })
     * ```
     */
    get matchedRoutes() {
      return this.#matchResult[0].map(([[, route]]) => route);
    }
    /**
     * `.routePath` can retrieve the path registered within the handler
     *
     * @deprecated
     *
     * Use routePath helper defined in "hono/route" instead.
     *
     * @see {@link https://hono.dev/docs/api/request#routepath}
     *
     * @example
     * ```ts
     * app.get('/posts/:id', (c) => {
     *   return c.json({ path: c.req.routePath })
     * })
     * ```
     */
    get routePath() {
      return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
    }
  },
  'HonoRequest'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3,
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, 'raw');
var resolveCallback = /* @__PURE__ */ __name(
  async (str, phase, preserveCallbacks, context2, buffer) => {
    if (typeof str === 'object' && !(str instanceof String)) {
      if (!(str instanceof Promise)) str = str.toString();
      if (str instanceof Promise) str = await str;
    }
    const callbacks = str.callbacks;
    if (!callbacks?.length) return Promise.resolve(str);
    if (buffer) buffer[0] += str;
    else buffer = [str];
    const resStr = Promise.all(
      callbacks.map((c) =>
        c({
          phase,
          buffer,
          context: context2,
        })
      )
    ).then((res) =>
      Promise.all(
        res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
      ).then(() => buffer[0])
    );
    if (preserveCallbacks) return raw(await resStr, callbacks);
    else return resStr;
  },
  'resolveCallback'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/context.js
var TEXT_PLAIN = 'text/plain; charset=UTF-8';
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    'Content-Type': contentType,
    ...headers,
  };
}, 'setDefaultContentType');
var createResponseInstance = /* @__PURE__ */ __name(
  (body, init) => new Response(body, init),
  'createResponseInstance'
);
var Context = /* @__PURE__ */ __name(
  class {
    #rawRequest;
    #req;
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    env = {};
    #var;
    finalized = false;
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/docs/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    error;
    #status;
    #executionCtx;
    #res;
    #layout;
    #renderer;
    #notFoundHandler;
    #preparedHeaders;
    #matchResult;
    #path;
    /**
     * Creates an instance of the Context class.
     *
     * @param req - The Request object.
     * @param options - Optional configuration options for the context.
     */
    constructor(req, options) {
      this.#rawRequest = req;
      if (options) {
        this.#executionCtx = options.executionCtx;
        this.env = options.env;
        this.#notFoundHandler = options.notFoundHandler;
        this.#path = options.path;
        this.#matchResult = options.matchResult;
      }
    }
    /**
     * `.req` is the instance of {@link HonoRequest}.
     */
    get req() {
      this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
      return this.#req;
    }
    /**
     * @see {@link https://hono.dev/docs/api/context#event}
     * The FetchEvent associated with the current request.
     *
     * @throws Will throw an error if the context does not have a FetchEvent.
     */
    get event() {
      if (this.#executionCtx && 'respondWith' in this.#executionCtx) return this.#executionCtx;
      else throw Error('This context has no FetchEvent');
    }
    /**
     * @see {@link https://hono.dev/docs/api/context#executionctx}
     * The ExecutionContext associated with the current request.
     *
     * @throws Will throw an error if the context does not have an ExecutionContext.
     */
    get executionCtx() {
      if (this.#executionCtx) return this.#executionCtx;
      else throw Error('This context has no ExecutionContext');
    }
    /**
     * @see {@link https://hono.dev/docs/api/context#res}
     * The Response object for the current request.
     */
    get res() {
      return (this.#res ||= createResponseInstance(null, {
        headers: (this.#preparedHeaders ??= new Headers()),
      }));
    }
    /**
     * Sets the Response object for the current request.
     *
     * @param _res - The Response object to set.
     */
    set res(_res) {
      if (this.#res && _res) {
        _res = createResponseInstance(_res.body, _res);
        for (const [k, v] of this.#res.headers.entries()) {
          if (k === 'content-type') continue;
          if (k === 'set-cookie') {
            const cookies = this.#res.headers.getSetCookie();
            _res.headers.delete('set-cookie');
            for (const cookie of cookies) _res.headers.append('set-cookie', cookie);
          } else _res.headers.set(k, v);
        }
      }
      this.#res = _res;
      this.finalized = true;
    }
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    render = (...args) => {
      this.#renderer ??= (content) => this.html(content);
      return this.#renderer(...args);
    };
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    setLayout = (layout) => (this.#layout = layout);
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    getLayout = () => this.#layout;
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    setRenderer = (renderer) => {
      this.#renderer = renderer;
    };
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/docs/api/context#header}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   // Append multiple headers using the append option (e.g. Vary)
     *   c.header('Vary', 'Accept-Encoding', { append: true })
     *   c.header('Vary', 'User-Agent', { append: true })
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    header = (name, value, options) => {
      if (this.finalized) this.#res = createResponseInstance(this.#res.body, this.#res);
      const headers = this.#res ? this.#res.headers : (this.#preparedHeaders ??= new Headers());
      if (value === void 0) headers.delete(name);
      else if (options?.append) headers.append(name, value);
      else headers.set(name, value);
    };
    status = (status) => {
      this.#status = status;
    };
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is hot!!')
     *   await next()
     * })
     * ```
     */
    set = (key, value) => {
      this.#var ??= /* @__PURE__ */ new Map();
      this.#var.set(key, value);
    };
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    get = (key) => {
      return this.#var ? this.#var.get(key) : void 0;
    };
    /**
     * `.var` can access the value of a variable.
     *
     * @see {@link https://hono.dev/docs/api/context#var}
     *
     * @example
     * ```ts
     * const result = c.var.client.oneMethod()
     * ```
     */
    get var() {
      if (!this.#var) return {};
      return Object.fromEntries(this.#var);
    }
    #newResponse(data, arg, headers) {
      let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
      if (typeof arg === 'object' && arg.headers) {
        responseHeaders ??= new Headers();
        for (const [key, value] of new Headers(arg.headers))
          if (key === 'set-cookie') responseHeaders.append(key, value);
          else responseHeaders.set(key, value);
      }
      if (headers) {
        if (!responseHeaders) {
          let count3 = 0;
          for (const k in headers)
            if (++count3 > 1 || typeof headers[k] !== 'string') {
              responseHeaders = new Headers();
              break;
            }
        }
        if (responseHeaders)
          for (const k in headers) {
            const v = headers[k];
            if (typeof v === 'string') responseHeaders.set(k, v);
            else {
              responseHeaders.delete(k);
              for (const v2 of v) responseHeaders.append(k, v2);
            }
          }
      }
      const status = typeof arg === 'number' ? arg : (arg?.status ?? this.#status);
      return createResponseInstance(data, {
        status,
        headers: responseHeaders ?? headers,
      });
    }
    newResponse = (...args) => this.#newResponse(...args);
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/docs/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    body = (data, arg, headers) => this.#newResponse(data, arg, headers);
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/docs/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    text = (text, arg, headers) => {
      return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized
        ? new Response(text)
        : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
    };
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/docs/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    json = (object, arg, headers) => {
      return this.#newResponse(
        JSON.stringify(object),
        arg,
        setDefaultContentType('application/json', headers)
      );
    };
    html = (html, arg, headers) => {
      const res = /* @__PURE__ */ __name(
        (html2) =>
          this.#newResponse(html2, arg, setDefaultContentType('text/html; charset=UTF-8', headers)),
        'res'
      );
      return typeof html === 'object'
        ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res)
        : res(html);
    };
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/docs/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    redirect = (location, status) => {
      const locationString = String(location);
      this.header(
        'Location',
        !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
      );
      return this.newResponse(null, status ?? 302);
    };
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    notFound = () => {
      this.#notFoundHandler ??= () => createResponseInstance();
      return this.#notFoundHandler(this);
    };
  },
  'Context'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else handler = (i === middleware.length && next) || void 0;
      if (handler)
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else throw err;
        }
      else if (context2.finalized === false && onNotFound) res = await onNotFound(context2);
      if (res && (context2.finalized === false || isError)) context2.res = res;
      return context2;
    }
    __name(dispatch, 'dispatch');
  };
}, 'compose');

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router.js
var METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch', 'query'];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = 'Can not add a route since the matcher is already built.';
var UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {}, 'UnsupportedPathError');

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = '__COMPOSED_HANDLER';

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text('404 Not Found', 404);
}, 'notFoundHandler');
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ('getResponse' in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text('Internal Server Error', 500);
}, 'errorHandler');
var Hono = /* @__PURE__ */ __name(
  class Hono2 {
    get;
    post;
    put;
    delete;
    options;
    patch;
    query;
    all;
    on;
    use;
    router;
    getPath;
    _basePath = '/';
    #path = '/';
    routes = [];
    constructor(options = {}) {
      [...METHODS, 'all'].forEach((method) => {
        this[method] = (args1, ...args) => {
          const methodName = method.toUpperCase();
          if (typeof args1 === 'string') this.#path = args1;
          else this.#addRoute(methodName, this.#path, args1);
          args.forEach((handler) => {
            this.#addRoute(methodName, this.#path, handler);
          });
          return this;
        };
      });
      this.on = (method, path, ...handlers) => {
        for (const p of [path].flat()) {
          this.#path = p;
          for (const m of [method].flat()) {
            const methodName = m.toUpperCase();
            for (const handler of handlers) this.#addRoute(methodName, this.#path, handler);
          }
        }
        return this;
      };
      this.use = (arg1, ...handlers) => {
        if (typeof arg1 === 'string') this.#path = arg1;
        else {
          this.#path = '*';
          handlers.unshift(arg1);
        }
        handlers.forEach((handler) => {
          this.#addRoute('ALL', this.#path, handler);
        });
        return this;
      };
      const { strict, ...optionsWithoutStrict } = options;
      Object.assign(this, optionsWithoutStrict);
      this.getPath = (strict ?? true) ? (options.getPath ?? getPath) : getPathNoStrict;
    }
    #clone() {
      const clone = new Hono2({
        router: this.router,
        getPath: this.getPath,
      });
      clone.errorHandler = this.errorHandler;
      clone.#notFoundHandler = this.#notFoundHandler;
      clone.routes = this.routes;
      return clone;
    }
    #notFoundHandler = notFoundHandler;
    errorHandler = errorHandler;
    /**
     * `.route()` allows grouping other Hono instance in routes.
     *
     * @see {@link https://hono.dev/docs/api/routing#grouping}
     *
     * @param {string} path - base Path
     * @param {Hono} app - other Hono instance
     * @returns {Hono} routed Hono instance
     *
     * @example
     * ```ts
     * const app = new Hono()
     * const app2 = new Hono()
     *
     * app2.get("/user", (c) => c.text("user"))
     * app.route("/api", app2) // GET /api/user
     * ```
     */
    route(path, app7) {
      const subApp = this.basePath(path);
      app7.routes.map((r) => {
        let handler;
        if (app7.errorHandler === errorHandler) handler = r.handler;
        else {
          handler = /* @__PURE__ */ __name(
            async (c, next) =>
              (await compose([], app7.errorHandler)(c, () => r.handler(c, next))).res,
            'handler'
          );
          handler[COMPOSED_HANDLER] = r.handler;
        }
        subApp.#addRoute(r.method, r.path, handler, r.basePath);
      });
      return this;
    }
    /**
     * `.basePath()` allows base paths to be specified.
     *
     * @see {@link https://hono.dev/docs/api/routing#base-path}
     *
     * @param {string} path - base Path
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * const api = new Hono().basePath('/api')
     * ```
     */
    basePath(path) {
      const subApp = this.#clone();
      subApp._basePath = mergePath(this._basePath, path);
      return subApp;
    }
    /**
     * `.onError()` handles an error and returns a customized Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#error-handling}
     *
     * @param {ErrorHandler} handler - request Handler for error
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.onError((err, c) => {
     *   console.error(`${err}`)
     *   return c.text('Custom Error Message', 500)
     * })
     * ```
     */
    onError = (handler) => {
      this.errorHandler = handler;
      return this;
    };
    /**
     * `.notFound()` allows you to customize a Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#not-found}
     *
     * @param {NotFoundHandler} handler - request handler for not-found
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.notFound((c) => {
     *   return c.text('Custom 404 Message', 404)
     * })
     * ```
     */
    notFound = (handler) => {
      this.#notFoundHandler = handler;
      return this;
    };
    /**
     * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
     *
     * @deprecated Use `mount()` from `hono/mount` instead. `.mount()` will be removed in v5.
     *
     * @see {@link https://hono.dev/docs/api/hono#mount}
     *
     * @param {string} path - base Path
     * @param {Function} applicationHandler - other Request Handler
     * @param {MountOptions} [options] - options of `.mount()`
     * @returns {Hono} mounted Hono instance
     *
     * @example
     * ```ts
     * import { Router as IttyRouter } from 'itty-router'
     * import { Hono } from 'hono'
     * // Create itty-router application
     * const ittyRouter = IttyRouter()
     * // GET /itty-router/hello
     * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
     *
     * const app = new Hono()
     * app.mount('/itty-router', ittyRouter.handle)
     * ```
     *
     * @example
     * ```ts
     * const app = new Hono()
     * // Send the request to another application without modification.
     * app.mount('/app', anotherApp, {
     *   replaceRequest: (req) => req,
     * })
     * ```
     */
    mount(path, applicationHandler, options) {
      let replaceRequest;
      let optionHandler;
      if (options) {
        if (typeof options === 'function') optionHandler = options;
        else {
          optionHandler = options.optionHandler;
          if (options.replaceRequest === false)
            replaceRequest = /* @__PURE__ */ __name((request) => request, 'replaceRequest');
          else replaceRequest = options.replaceRequest;
        }
      }
      const getOptions = optionHandler
        ? (c) => {
            const options2 = optionHandler(c);
            return Array.isArray(options2) ? options2 : [options2];
          }
        : (c) => {
            let executionContext = void 0;
            try {
              executionContext = c.executionCtx;
            } catch {}
            return [c.env, executionContext];
          };
      replaceRequest ||= (() => {
        const mergedPath = mergePath(this._basePath, path);
        const pathPrefixLength = mergedPath === '/' ? 0 : mergedPath.length;
        return (request) => {
          const url = new URL(request.url);
          url.pathname = this.getPath(request).slice(pathPrefixLength) || '/';
          return new Request(url, request);
        };
      })();
      const handler = /* @__PURE__ */ __name(async (c, next) => {
        const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
        if (res) return res;
        await next();
      }, 'handler');
      this.#addRoute('ALL', mergePath(path, '*'), handler);
      return this;
    }
    #addRoute(method, path, handler, baseRoutePath) {
      path = mergePath(this._basePath, path);
      const r = {
        basePath:
          baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
        path,
        method,
        handler,
      };
      this.router.add(method, path, [handler, r]);
      this.routes.push(r);
    }
    #handleError(err, c) {
      if (err instanceof Error) return this.errorHandler(err, c);
      throw err;
    }
    #dispatch(request, executionCtx, env2, method) {
      if (method === 'HEAD')
        return (async () =>
          new Response(null, await this.#dispatch(request, executionCtx, env2, 'GET')))();
      const path = this.getPath(request, { env: env2 });
      const matchResult = this.router.match(method, path);
      const c = new Context(request, {
        path,
        matchResult,
        env: env2,
        executionCtx,
        notFoundHandler: this.#notFoundHandler,
      });
      if (matchResult[0].length === 1) {
        let res;
        try {
          res = matchResult[0][0][0][0](c, async () => {
            c.res = await this.#notFoundHandler(c);
          });
        } catch (err) {
          return this.#handleError(err, c);
        }
        return res instanceof Promise
          ? res
              .then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c)))
              .catch((err) => this.#handleError(err, c))
          : (res ?? this.#notFoundHandler(c));
      }
      const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
      return (async () => {
        try {
          const context2 = await composed(c);
          if (!context2.finalized)
            throw new Error(
              'Context is not finalized. Did you forget to return a Response object or `await next()`?'
            );
          return context2.res;
        } catch (err) {
          return this.#handleError(err, c);
        }
      })();
    }
    /**
     * `.fetch()` will be entry point of your app.
     *
     * @see {@link https://hono.dev/docs/api/hono#fetch}
     *
     * @param {Request} request - request Object of request
     * @param {Env} env - env Object
     * @param {ExecutionContext} executionCtx - context of execution
     * @returns {Response | Promise<Response>} response of request
     *
     */
    fetch = (request, ...rest) => {
      return this.#dispatch(request, rest[1], rest[0], request.method);
    };
    /**
     * `.request()` is a useful method for testing.
     * You can pass a URL or pathname to send a GET request.
     * app will return a Response object.
     * ```ts
     * test('GET /hello is ok', async () => {
     *   const res = await app.request('/hello')
     *   expect(res.status).toBe(200)
     * })
     * ```
     * @see https://hono.dev/docs/api/hono#request
     */
    request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request)
        return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
      input = input.toString();
      return this.fetch(
        new Request(
          /^https?:\/\//.test(input) ? input : `http://localhost${mergePath('/', input)}`,
          requestInit
        ),
        Env,
        executionCtx
      );
    };
    /**
     * `.fire()` automatically adds a global fetch event listener.
     * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
     * @deprecated
     * Use `fire` from `hono/service-worker` instead.
     * ```ts
     * import { Hono } from 'hono'
     * import { fire } from 'hono/service-worker'
     *
     * const app = new Hono()
     * // ...
     * fire(app)
     * ```
     * @see https://hono.dev/docs/api/hono#fire
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
     * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
     */
    fire = () => {
      addEventListener('fetch', (event) => {
        event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
      });
    };
  },
  'Hono'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/utils.js
var createNullObject = /* @__PURE__ */ __name(
  () => /* @__PURE__ */ Object.create(null),
  'createNullObject'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers['ALL'];
    const staticMatch = matcher[2][path2];
    if (staticMatch) return staticMatch;
    const match3 = path2.match(matcher[0]);
    if (!match3) return [[], emptyParam];
    const index = match3.indexOf('', 1);
    return [matcher[1][index], match3];
  }, 'match');
  this.match = match2;
  return match2(method, path);
}
__name(match, 'match');

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = '[^/]+';
var TAIL_WILDCARD_REG_EXP_STR = '(?:|/.*)';
var PATH_ERROR = Symbol();
var regExpMetaChars = /* @__PURE__ */ new Set('.\\+*[^]$()');
function compareKey(a, b) {
  if (a.length === 1) return b.length === 1 ? (a < b ? -1 : 1) : -1;
  if (b.length === 1) return 1;
  if (a === '.*' || a === '(?:|/.*)') return b === '(?:|/.*)' ? -1 : 1;
  else if (b === '.*' || b === '(?:|/.*)') return -1;
  if (a === '[^/]+') return 1;
  else if (b === '[^/]+') return -1;
  return a.length === b.length ? (a < b ? -1 : 1) : b.length - a.length;
}
__name(compareKey, 'compareKey');
var Node = /* @__PURE__ */ __name(
  class Node2 {
    #index;
    #varIndex;
    #children = createNullObject();
    insert(tokens, index, paramMap, context2, isStatic) {
      let node = this;
      for (let i = 0, len = tokens.length; i < len; i++) {
        const token = tokens[i];
        const pattern =
          token.length === 1
            ? token === '*'
              ? i === len - 1
                ? ['', '', '.*']
                : ['', '', LABEL_REG_EXP_STR]
              : null
            : token === '/*'
              ? ['', '', TAIL_WILDCARD_REG_EXP_STR]
              : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let nextNode;
        if (pattern) {
          const name = pattern[1];
          let regexpStr = pattern[2] || '[^/]+';
          if (name && pattern[2]) {
            if (regexpStr === '.*') throw PATH_ERROR;
            regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, '(?:');
            if (/\((?!\?:)/.test(regexpStr)) throw PATH_ERROR;
            if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) throw PATH_ERROR;
          }
          nextNode = node.#children[regexpStr];
          if (!nextNode) {
            if (regexpStr !== '.*' && regexpStr !== '(?:|/.*)') {
              for (const k in node.#children)
                if ((regexpStr.length > 1 || k.length > 1) && k !== '.*' && k !== '(?:|/.*)')
                  throw PATH_ERROR;
            }
            nextNode = node.#children[regexpStr] = new Node2();
          }
          if (name !== '') {
            nextNode.#varIndex ??= context2.varIndex++;
            paramMap.push([name, nextNode.#varIndex]);
          }
        } else {
          nextNode = node.#children[token];
          if (!nextNode) {
            for (const k in node.#children)
              if (k.length > 1 && k !== '.*' && k !== '(?:|/.*)') throw PATH_ERROR;
            nextNode = node.#children[token] = new Node2();
          }
        }
        node = nextNode;
      }
      if (node.#index !== void 0) throw PATH_ERROR;
      node.#index = isStatic ? -1 : index;
    }
    buildRegExpStr() {
      const strList = Object.keys(this.#children)
        .sort(compareKey)
        .map((k) => {
          const c = this.#children[k];
          const childStr = c.buildRegExpStr();
          return childStr === ''
            ? ''
            : (typeof c.#varIndex === 'number'
                ? `(${k})@${c.#varIndex}`
                : regExpMetaChars.has(k)
                  ? `\\${k}`
                  : k) + childStr;
        })
        .filter(Boolean);
      if (typeof this.#index === 'number' && this.#index !== -1) strList.unshift(`#${this.#index}`);
      if (strList.length === 0) return '';
      if (strList.length === 1) return strList[0];
      return '(?:' + strList.join('|') + ')';
    }
  },
  'Node'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = /* @__PURE__ */ __name(
  class {
    #context = { varIndex: 0 };
    #root = new Node();
    #index = 0;
    paths = createNullObject();
    insert(path, isStatic) {
      if (isStatic) {
        this.#root.insert(path.split(''), 0, [], this.#context, true);
        return;
      }
      const paramAssoc = [];
      const groups = [];
      let markedPath = path;
      for (let i = 0; ;) {
        let replaced = false;
        markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
          const mark = `@\\${i}`;
          groups[i] = [mark, m];
          i++;
          replaced = true;
          return mark;
        });
        if (!replaced) break;
      }
      const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
      for (let i = groups.length - 1; i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = tokens.length - 1; j >= 0; j--)
          if (tokens[j].indexOf(mark) !== -1) {
            tokens[j] = tokens[j].replace(mark, groups[i][1]);
            break;
          }
      }
      this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
      this.paths[path] = [this.#index++, paramAssoc];
    }
    buildRegExp() {
      let regexp = this.#root.buildRegExpStr();
      if (regexp === '') return [/^$/, [], []];
      let captureIndex = 0;
      const indexReplacementMap = [];
      const paramReplacementMap = [];
      regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
        if (handlerIndex !== void 0) {
          indexReplacementMap[++captureIndex] = Number(handlerIndex);
          return '$()';
        }
        if (paramIndex !== void 0) {
          paramReplacementMap[Number(paramIndex)] = ++captureIndex;
          return '';
        }
        return '';
      });
      return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
    }
  },
  'Trie'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return (wildcardRegExpCache[path] ??= new RegExp(
    `^${path.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (match2, metaChar) => (metaChar ? `\\${metaChar}` : match2 === '/*' ? TAIL_WILDCARD_REG_EXP_STR : match2 === '*' ? '.*' : `/:${LABEL_REG_EXP_STR}`))}$`
  ));
}
__name(buildWildcardRegExp, 'buildWildcardRegExp');
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length))
    if (buildWildcardRegExp(k).test(path)) return [...middleware[k]];
}
__name(findMiddleware, 'findMiddleware');
var RegExpRouter = /* @__PURE__ */ __name(
  class {
    name = 'RegExpRouter';
    #middleware;
    #routes;
    #tries;
    constructor() {
      this.#middleware = { ['ALL']: createNullObject() };
      this.#routes = { ['ALL']: createNullObject() };
      this.#tries = { ['ALL']: new Trie() };
    }
    #insertPath(method, path) {
      try {
        this.#tries[method].insert(path, !/\*|\/:/.test(path));
      } catch (e) {
        throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
      }
    }
    add(method, path, handler) {
      const middleware = this.#middleware;
      const routes = this.#routes;
      if (!middleware) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
      if (!middleware[method]) {
        this.#tries[method] = new Trie();
        for (const handlerMap of [middleware, routes]) {
          handlerMap[method] = createNullObject();
          for (const p in handlerMap['ALL']) {
            handlerMap[method][p] = [...handlerMap['ALL'][p]];
            this.#insertPath(method, p);
          }
        }
      }
      if (path === '/*') path = '*';
      const methods = method === 'ALL' ? Object.keys(middleware) : [method];
      if (/\*$/.test(path)) {
        const re = buildWildcardRegExp(path);
        for (const m of methods)
          if (!middleware[m][path]) {
            this.#insertPath(m, path);
            middleware[m][path] =
              findMiddleware(middleware[m], path) || findMiddleware(middleware['ALL'], path) || [];
          }
        for (const handlerMap of [middleware, routes])
          for (const m of methods)
            for (const p in handlerMap[m]) re.test(p) && handlerMap[m][p].push([handler, path]);
        return;
      }
      const paths = checkOptionalParameter(path) || [path];
      for (const path2 of paths)
        for (const m of methods) {
          if (!routes[m][path2]) {
            this.#insertPath(m, path2);
            routes[m][path2] =
              findMiddleware(middleware[m], path2) ||
              findMiddleware(middleware['ALL'], path2) ||
              [];
          }
          routes[m][path2].push([handler, path2]);
        }
    }
    match = match;
    buildAllMatchers() {
      const matchers = createNullObject();
      for (const method of Object.keys(this.#routes)) matchers[method] = this.#buildMatcher(method);
      this.#middleware = this.#routes = this.#tries = void 0;
      wildcardRegExpCache = createNullObject();
      return matchers;
    }
    #buildMatcher(method) {
      const middleware = this.#middleware[method];
      const routes = this.#routes[method];
      const trie = this.#tries[method];
      const staticMap = createNullObject();
      const handlerData = [];
      const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
      for (const r of [middleware, routes])
        for (const path in r) {
          const handlers = r[path];
          const pathData = trie.paths[path];
          if (!pathData) {
            staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
            continue;
          }
          handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [
            h,
            trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
              map[key] = paramReplacementMap[pathData[1][i][1]];
              return map;
            }, createNullObject()),
          ]);
        }
      return [regexp, indexReplacementMap.map((i) => handlerData[i]), staticMap];
    }
  },
  'RegExpRouter'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = /* @__PURE__ */ __name(
  class {
    name = 'SmartRouter';
    #routers = [];
    #routes = [];
    constructor(init) {
      this.#routers = init.routers;
    }
    add(method, path, handler) {
      if (!this.#routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
      this.#routes.push([method, path, handler]);
    }
    match(method, path) {
      if (!this.#routes) throw new Error('Fatal error');
      const routers = this.#routers;
      const routes = this.#routes;
      const len = routers.length;
      let i = 0;
      let res;
      for (; i < len; i++) {
        const router = routers[i];
        try {
          for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) router.add(...routes[i2]);
          res = router.match(method, path);
        } catch (e) {
          if (e instanceof UnsupportedPathError) continue;
          throw e;
        }
        this.match = router.match.bind(router);
        this.#routers = [router];
        this.#routes = void 0;
        break;
      }
      if (i === len) throw new Error('Fatal error');
      this.name = `SmartRouter + ${this.activeRouter.name}`;
      return res;
    }
    get activeRouter() {
      if (this.#routes || this.#routers.length !== 1)
        throw new Error('No active router has been determined yet.');
      return this.#routers[0];
    }
  },
  'SmartRouter'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node3 = /* @__PURE__ */ __name(
  class Node4 {
    #methods = [];
    #children = createNullObject();
    #patterns = [];
    #pattern;
    #params = emptyParams;
    insert(method, path, handler) {
      let curNode = this;
      const parts = splitRoutingPath(path);
      const possibleKeys = /* @__PURE__ */ new Set();
      let i = 0;
      for (const p of parts) {
        const nextP = parts[++i];
        const pattern =
          getPattern(p, nextP) ||
          (nextP === void 0 && p && p.indexOf('*') === p.length - 1 ? p : null);
        const isParam = Array.isArray(pattern);
        const key = isParam ? pattern[0] : pattern || p;
        const child = (curNode.#children[key] ||= new Node4());
        if (pattern && !child.#pattern) {
          child.#pattern = pattern;
          curNode.#patterns.push(child);
        }
        curNode = child;
        if (isParam) possibleKeys.add(pattern[1]);
      }
      curNode.#methods.push({
        [method]: {
          handler,
          possibleKeys: [...possibleKeys],
          score: ++order,
        },
      });
    }
    #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
      for (let i = 0, len = node.#methods.length; i < len; i++) {
        const m = node.#methods[i];
        const handlerSet = m[method] || m['ALL'];
        if (handlerSet) {
          handlerSet.params = createNullObject();
          handlerSets.push(handlerSet);
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            handlerSet.params[key] =
              params?.[key] && !i2 ? params[key] : (nodeParams[key] ?? params?.[key]);
          }
        }
      }
    }
    search(method, path) {
      const handlerSets = [];
      this.#params = emptyParams;
      let curNodes = [this];
      const parts = splitPath(path);
      const curNodesQueue = [];
      const len = parts.length;
      let partOffsets = null;
      for (let i = 0; i < len; i++) {
        const part = parts[i];
        const isLast = i === len - 1;
        const tempNodes = [];
        for (let j = 0, len2 = curNodes.length; j < len2; j++) {
          const node = curNodes[j];
          const nextNode = node.#children[part];
          if (nextNode) {
            nextNode.#params = node.#params;
            if (isLast) {
              if (nextNode.#children['*'])
                this.#pushHandlerSets(handlerSets, nextNode.#children['*'], method, node.#params);
              this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
            } else tempNodes.push(nextNode);
          }
          for (const child of node.#patterns) {
            const pattern = child.#pattern;
            const params = node.#params === emptyParams ? {} : { ...node.#params };
            if (typeof pattern === 'string') {
              if (pattern === '*' || part.startsWith(pattern.slice(0, -1))) {
                this.#pushHandlerSets(handlerSets, child, method, node.#params);
                if (pattern === '*') {
                  child.#params = params;
                  tempNodes.push(child);
                }
              }
              continue;
            }
            const [, name, matcher] = pattern;
            if (!part && matcher === true) continue;
            if (matcher !== true) {
              if (!partOffsets) {
                partOffsets = [];
                let offset = path[0] === '/' ? 1 : 0;
                for (let p = 0; p < len; p++) {
                  partOffsets[p] = offset;
                  offset += parts[p].length + 1;
                }
              }
              const restPathString = path.slice(partOffsets[i]);
              const m = matcher.exec(restPathString);
              if (m) {
                params[name] = m[0];
                this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
                if (m[0].length === restPathString.length && child.#children['*'])
                  this.#pushHandlerSets(
                    handlerSets,
                    child.#children['*'],
                    method,
                    node.#params,
                    params
                  );
                for (const _ in child.#children) {
                  child.#params = params;
                  const componentCount = m[0].match(/\//g)?.length ?? 0;
                  (curNodesQueue[componentCount] ||= []).push(child);
                  break;
                }
                continue;
              }
            }
            if (matcher === true || matcher.test(part)) {
              params[name] = part;
              if (isLast) {
                this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
                if (child.#children['*'])
                  this.#pushHandlerSets(
                    handlerSets,
                    child.#children['*'],
                    method,
                    params,
                    node.#params
                  );
              } else {
                child.#params = params;
                tempNodes.push(child);
              }
            }
          }
        }
        const shifted = curNodesQueue.shift();
        curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
      }
      if (handlerSets[1])
        handlerSets.sort((a, b) => {
          return a.score - b.score;
        });
      return [handlerSets.map(({ handler, params }) => [handler, params])];
    }
  },
  'Node'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = /* @__PURE__ */ __name(
  class {
    name = 'TrieRouter';
    #node = new Node3();
    add(method, path, handler) {
      for (const result of checkOptionalParameter(path) || [path])
        this.#node.insert(method, result, handler);
    }
    match(method, path) {
      return this.#node.search(method, path);
    }
  },
  'TrieRouter'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/hono.js
var Hono3 = /* @__PURE__ */ __name(
  class extends Hono {
    /**
     * Creates an instance of the Hono class.
     *
     * @param options - Optional configuration options for the Hono instance.
     */
    constructor(options = {}) {
      super(options);
      this.router =
        options.router ?? new SmartRouter({ routers: [new RegExpRouter(), new TrieRouter()] });
    }
  },
  'Hono'
);

// ../../node_modules/.pnpm/hono@4.13.13/node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'QUERY'],
    allowHeaders: [],
    exposeHeaders: [],
    ...options,
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(',') : void 0;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(',') : void 0;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === 'string') {
      if (optsOrigin === '*') return () => optsOrigin;
      else return (origin) => (optsOrigin === origin ? origin : null);
    } else if (typeof optsOrigin === 'function') return optsOrigin;
    else return (origin) => (optsOrigin.includes(origin) ? origin : null);
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === 'function')
      return async (origin, c) => (await optsAllowMethods(origin, c)).join(',');
    else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(',');
      return () => methodsStr;
    } else return () => '';
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, 'set');
    const allowOrigin = await findAllowOrigin(c.req.header('origin') || '', c);
    if (allowOrigin) set('Access-Control-Allow-Origin', allowOrigin);
    if (opts.credentials) set('Access-Control-Allow-Credentials', 'true');
    if (exposeHeadersStr) set('Access-Control-Expose-Headers', exposeHeadersStr);
    if (c.req.method === 'OPTIONS') {
      if (opts.origin !== '*') c.res.headers.append('Vary', 'Origin');
      if (opts.maxAge != null) set('Access-Control-Max-Age', opts.maxAge.toString());
      const allowMethods = await findAllowMethods(c.req.header('origin') || '', c);
      if (allowMethods) set('Access-Control-Allow-Methods', allowMethods);
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header('Access-Control-Request-Headers');
        if (requestHeaders)
          headersStr = requestHeaders
            .split(',')
            .map((h) => h.trim())
            .join(',');
      }
      if (headersStr) {
        set('Access-Control-Allow-Headers', headersStr);
        c.res.headers.append('Vary', 'Access-Control-Request-Headers');
      }
      c.res.headers.delete('Content-Length');
      c.res.headers.delete('Content-Type');
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: 'No Content',
      });
    }
    await next();
    if (opts.origin !== '*') c.header('Vary', 'Origin', { append: true });
  }, 'cors');
}, 'cors');

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType,
});

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function (util2) {
  util2.assertEqual = (_) => {};
  function assertIs(_arg) {}
  __name(assertIs, 'assertIs');
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, 'assertNever');
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== 'number');
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function (e) {
      return obj[e];
    });
  };
  util2.objectKeys =
    typeof Object.keys === 'function'
      ? (obj) => Object.keys(obj)
      : (object) => {
          const keys = [];
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              keys.push(key);
            }
          }
          return keys;
        };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item)) return item;
    }
    return void 0;
  };
  util2.isInteger =
    typeof Number.isInteger === 'function'
      ? (val) => Number.isInteger(val)
      : (val) => typeof val === 'number' && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = ' | ') {
    return array.map((val) => (typeof val === 'string' ? `'${val}'` : val)).join(separator);
  }
  __name(joinValues, 'joinValues');
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function (objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second,
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  'string',
  'nan',
  'number',
  'integer',
  'float',
  'boolean',
  'date',
  'bigint',
  'symbol',
  'function',
  'undefined',
  'null',
  'array',
  'object',
  'unknown',
  'promise',
  'void',
  'never',
  'map',
  'set',
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case 'undefined':
      return ZodParsedType.undefined;
    case 'string':
      return ZodParsedType.string;
    case 'number':
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case 'boolean':
      return ZodParsedType.boolean;
    case 'function':
      return ZodParsedType.function;
    case 'bigint':
      return ZodParsedType.bigint;
    case 'symbol':
      return ZodParsedType.symbol;
    case 'object':
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (
        data.then &&
        typeof data.then === 'function' &&
        data.catch &&
        typeof data.catch === 'function'
      ) {
        return ZodParsedType.promise;
      }
      if (typeof Map !== 'undefined' && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== 'undefined' && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== 'undefined' && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, 'getParsedType');

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  'invalid_type',
  'invalid_literal',
  'custom',
  'invalid_union',
  'invalid_union_discriminator',
  'invalid_enum_value',
  'unrecognized_keys',
  'invalid_arguments',
  'invalid_return_type',
  'invalid_date',
  'invalid_string',
  'too_small',
  'too_big',
  'invalid_intersection_types',
  'not_multiple_of',
  'not_finite',
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, '$1:');
}, 'quotelessJson');
var ZodError = class extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = 'ZodError';
    this.issues = issues;
  }
  format(_mapper) {
    const mapper =
      _mapper ||
      function (issue) {
        return issue.message;
      };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error3) => {
      for (const issue of error3.issues) {
        if (issue.code === 'invalid_union') {
          issue.unionErrors.map(processError);
        } else if (issue.code === 'invalid_return_type') {
          processError(issue.returnTypeError);
        } else if (issue.code === 'invalid_arguments') {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, 'processError');
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
__name(ZodError, 'ZodError');
ZodError.create = (issues) => {
  const error3 = new ZodError(issues);
  return error3;
};

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Required';
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ', ')}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === 'number') {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `Invalid ${issue.validation}`;
      } else {
        message = 'Invalid';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `Array must contain ${issue.exact ? 'exactly' : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === 'string')
        message = `String must contain ${issue.exact ? 'exactly' : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === 'number')
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === 'bigint')
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === 'date')
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else message = 'Invalid input';
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === 'string')
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === 'number')
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === 'bigint')
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === 'date')
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else message = 'Invalid input';
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Number must be finite';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, 'errorMap');
var en_default = errorMap;

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, 'setErrorMap');
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, 'getErrorMap');

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...(issueData.path || [])];
  const fullIssue = {
    ...issueData,
    path: fullPath,
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message,
    };
  }
  let errorMessage = '';
  const maps = errorMaps
    .filter((m) => !!m)
    .slice()
    .reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage,
  };
}, 'makeIssue');
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default,
      // then global default map
    ].filter((x) => !!x),
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, 'addIssueToContext');
var ParseStatus = class {
  constructor() {
    this.value = 'valid';
  }
  dirty() {
    if (this.value === 'valid') this.value = 'dirty';
  }
  abort() {
    if (this.value !== 'aborted') this.value = 'aborted';
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === 'aborted') return INVALID;
      if (s.status === 'dirty') status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value,
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === 'aborted') return INVALID;
      if (value.status === 'aborted') return INVALID;
      if (key.status === 'dirty') status.dirty();
      if (value.status === 'dirty') status.dirty();
      if (key.value !== '__proto__' && (typeof value.value !== 'undefined' || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
__name(ParseStatus, 'ParseStatus');
var INVALID = Object.freeze({
  status: 'aborted',
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: 'dirty', value }), 'DIRTY');
var OK = /* @__PURE__ */ __name((value) => ({ status: 'valid', value }), 'OK');
var isAborted = /* @__PURE__ */ __name((x) => x.status === 'aborted', 'isAborted');
var isDirty = /* @__PURE__ */ __name((x) => x.status === 'dirty', 'isDirty');
var isValid = /* @__PURE__ */ __name((x) => x.status === 'valid', 'isValid');
var isAsync = /* @__PURE__ */ __name(
  (x) => typeof Promise !== 'undefined' && x instanceof Promise,
  'isAsync'
);

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function (errorUtil2) {
  errorUtil2.errToObj = (message) => (typeof message === 'string' ? { message } : message || {});
  errorUtil2.toString = (message) => (typeof message === 'string' ? message : message?.message);
})(errorUtil || (errorUtil = {}));

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
__name(ParseInputLazyPath, 'ParseInputLazyPath');
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error('Validation failed but no issues detected.');
    }
    return {
      success: false,
      get error() {
        if (this._error) return this._error;
        const error3 = new ZodError(ctx.common.issues);
        this._error = error3;
        return this._error;
      },
    };
  }
}, 'handleResult');
function processCreateParams(params) {
  if (!params) return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`
    );
  }
  if (errorMap2) return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    const { message } = params;
    if (iss.code === 'invalid_enum_value') {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === 'undefined') {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== 'invalid_type') return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  }, 'customMap');
  return { errorMap: customMap, description };
}
__name(processCreateParams, 'processCreateParams');
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return (
      ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      }
    );
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      },
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error('Synchronous parse encountered promise.');
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success) return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap,
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  '~validate'(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this['~standard'].async,
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    if (!this['~standard'].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result)
          ? {
              value: result.value,
            }
          : {
              issues: ctx.common.issues,
            };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes('encountered')) {
          this['~standard'].async = true;
        }
        ctx.common = {
          issues: [],
          async: true,
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) =>
      isValid(result)
        ? {
            value: result.value,
          }
        : {
            issues: ctx.common.issues,
          }
    );
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success) return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true,
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult)
      ? maybeAsyncResult
      : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message === 'string' || typeof message === 'undefined') {
        return { message };
      } else if (typeof message === 'function') {
        return message(val);
      } else {
        return message;
      }
    }, 'getIssueProperties');
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(
        () =>
          ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val),
          }),
        'setError'
      );
      if (typeof Promise !== 'undefined' && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(
          typeof refinementData === 'function' ? refinementData(val, ctx) : refinementData
        );
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: 'refinement', refinement },
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this['~standard'] = {
      version: 1,
      vendor: 'zod',
      validate: (data) => this['~validate'](data),
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: 'transform', transform },
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === 'function' ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def),
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === 'function' ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description,
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
__name(ZodType, 'ZodType');
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex =
  /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? '+' : '?';
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
__name(timeRegexSource, 'timeRegexSource');
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, 'timeRegex');
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join('|')})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, 'datetimeRegex');
function isValidIP(ip, version2) {
  if ((version2 === 'v4' || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === 'v6' || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, 'isValidIP');
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt)) return false;
  try {
    const [header] = jwt.split('.');
    if (!header) return false;
    const base64 = header
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(header.length + ((4 - (header.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== 'object' || decoded === null) return false;
    if ('typ' in decoded && decoded?.typ !== 'JWT') return false;
    if (!decoded.alg) return false;
    if (alg && decoded.alg !== alg) return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, 'isValidJWT');
function isValidCidr(ip, version2) {
  if ((version2 === 'v4' || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === 'v6' || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, 'isValidCidr');
var ZodString = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: 'string',
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: 'string',
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'length') {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: 'string',
              inclusive: true,
              exact: true,
              message: check.message,
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: 'string',
              inclusive: true,
              exact: true,
              message: check.message,
            });
          }
          status.dirty();
        }
      } else if (check.kind === 'email') {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'email',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'emoji') {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, 'u');
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'emoji',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'uuid') {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'uuid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'nanoid') {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'nanoid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'cuid') {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'cuid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'cuid2') {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'cuid2',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'ulid') {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'ulid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'url') {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'url',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'regex') {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'regex',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'trim') {
        input.data = input.data.trim();
      } else if (check.kind === 'includes') {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'toLowerCase') {
        input.data = input.data.toLowerCase();
      } else if (check.kind === 'toUpperCase') {
        input.data = input.data.toUpperCase();
      } else if (check.kind === 'startsWith') {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'endsWith') {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'datetime') {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: 'datetime',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'date') {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: 'date',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'time') {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: 'time',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'duration') {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'duration',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'ip') {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'ip',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'jwt') {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'jwt',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'cidr') {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'cidr',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'base64') {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'base64',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'base64url') {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'base64url',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message),
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  email(message) {
    return this._addCheck({ kind: 'email', ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: 'url', ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: 'emoji', ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: 'uuid', ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: 'nanoid', ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: 'cuid', ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: 'cuid2', ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: 'ulid', ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: 'base64', ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: 'base64url',
      ...errorUtil.errToObj(message),
    });
  }
  jwt(options) {
    return this._addCheck({ kind: 'jwt', ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: 'ip', ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: 'cidr', ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === 'string') {
      return this._addCheck({
        kind: 'datetime',
        precision: null,
        offset: false,
        local: false,
        message: options,
      });
    }
    return this._addCheck({
      kind: 'datetime',
      precision: typeof options?.precision === 'undefined' ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message),
    });
  }
  date(message) {
    return this._addCheck({ kind: 'date', message });
  }
  time(options) {
    if (typeof options === 'string') {
      return this._addCheck({
        kind: 'time',
        precision: null,
        message: options,
      });
    }
    return this._addCheck({
      kind: 'time',
      precision: typeof options?.precision === 'undefined' ? null : options?.precision,
      ...errorUtil.errToObj(options?.message),
    });
  }
  duration(message) {
    return this._addCheck({ kind: 'duration', ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: 'regex',
      regex,
      ...errorUtil.errToObj(message),
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: 'includes',
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message),
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: 'startsWith',
      value,
      ...errorUtil.errToObj(message),
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: 'endsWith',
      value,
      ...errorUtil.errToObj(message),
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: 'min',
      value: minLength,
      ...errorUtil.errToObj(message),
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: 'max',
      value: maxLength,
      ...errorUtil.errToObj(message),
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: 'length',
      value: len,
      ...errorUtil.errToObj(message),
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'trim' }],
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'toLowerCase' }],
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'toUpperCase' }],
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === 'datetime');
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === 'date');
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === 'time');
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === 'duration');
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === 'email');
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === 'url');
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === 'emoji');
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === 'uuid');
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === 'nanoid');
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === 'cuid');
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === 'cuid2');
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === 'ulid');
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === 'ip');
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === 'cidr');
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === 'base64');
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === 'base64url');
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
};
__name(ZodString, 'ZodString');
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params),
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split('.')[1] || '').length;
  const stepDecCount = (step.toString().split('.')[1] || '').length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace('.', ''));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace('.', ''));
  return (valInt % stepInt) / 10 ** decCount;
}
__name(floatSafeRemainder, 'floatSafeRemainder');
var ZodNumber = class extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === 'int') {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: 'integer',
            received: 'float',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'min') {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: 'number',
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: 'number',
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'multipleOf') {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'finite') {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit('min', value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit('min', value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit('max', value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit('max', value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  int(message) {
    return this._addCheck({
      kind: 'int',
      message: errorUtil.toString(message),
    });
  }
  positive(message) {
    return this._addCheck({
      kind: 'min',
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  negative(message) {
    return this._addCheck({
      kind: 'max',
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: 'max',
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: 'min',
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: 'multipleOf',
      value,
      message: errorUtil.toString(message),
    });
  }
  finite(message) {
    return this._addCheck({
      kind: 'finite',
      message: errorUtil.toString(message),
    });
  }
  safe(message) {
    return this._addCheck({
      kind: 'min',
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message),
    })._addCheck({
      kind: 'max',
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message),
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find(
      (ch) => ch.kind === 'int' || (ch.kind === 'multipleOf' && util.isInteger(ch.value))
    );
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'finite' || ch.kind === 'int' || ch.kind === 'multipleOf') {
        return true;
      } else if (ch.kind === 'min') {
        if (min === null || ch.value > min) min = ch.value;
      } else if (ch.kind === 'max') {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
__name(ZodNumber, 'ZodNumber');
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params),
  });
};
var ZodBigInt = class extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: 'bigint',
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: 'bigint',
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'multipleOf') {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType,
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit('min', value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit('min', value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit('max', value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit('max', value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  positive(message) {
    return this._addCheck({
      kind: 'min',
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  negative(message) {
    return this._addCheck({
      kind: 'max',
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: 'max',
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: 'min',
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: 'multipleOf',
      value,
      message: errorUtil.toString(message),
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max;
  }
};
__name(ZodBigInt, 'ZodBigInt');
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params),
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodBoolean, 'ZodBoolean');
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params),
  });
};
var ZodDate = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date,
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: 'date',
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: 'date',
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime()),
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: 'min',
      value: minDate.getTime(),
      message: errorUtil.toString(message),
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: 'max',
      value: maxDate.getTime(),
      message: errorUtil.toString(message),
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
__name(ZodDate, 'ZodDate');
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params),
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodSymbol, 'ZodSymbol');
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params),
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodUndefined, 'ZodUndefined');
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params),
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodNull, 'ZodNull');
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params),
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name(ZodAny, 'ZodAny');
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params),
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name(ZodUnknown, 'ZodUnknown');
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params),
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType,
    });
    return INVALID;
  }
};
__name(ZodNever, 'ZodNever');
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params),
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodVoid, 'ZodVoid');
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params),
  });
};
var ZodArray = class extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: 'array',
          inclusive: true,
          exact: true,
          message: def.exactLength.message,
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: 'array',
          inclusive: true,
          exact: false,
          message: def.minLength.message,
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: 'array',
          inclusive: true,
          exact: false,
          message: def.maxLength.message,
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all(
        [...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })
      ).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) },
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) },
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) },
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name(ZodArray, 'ZodArray');
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params),
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape,
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element),
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, 'deepPartialify');
var ZodObject = class extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === 'strip')) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: 'valid', value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data,
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === 'passthrough') {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: 'valid', value: key },
            value: { status: 'valid', value: ctx.data[key] },
          });
        }
      } else if (unknownKeys === 'strict') {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys,
          });
          status.dirty();
        }
      } else if (unknownKeys === 'strip') {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: 'valid', value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data,
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve()
        .then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet,
            });
          }
          return syncPairs;
        })
        .then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: 'strict',
      ...(message !== void 0
        ? {
            errorMap: (issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === 'unrecognized_keys')
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError,
                };
              return {
                message: defaultError,
              };
            },
          }
        : {}),
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: 'strip',
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: 'passthrough',
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation,
      }),
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape(),
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject,
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index,
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
__name(ZodObject, 'ZodObject');
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: 'strip',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: 'strict',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: 'strip',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === 'valid') {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === 'dirty') {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
    __name(handleResults, 'handleResults');
    if (ctx.common.async) {
      return Promise.all(
        options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: [],
            },
            parent: null,
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx,
            }),
            ctx: childCtx,
          };
        })
      ).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: [],
          },
          parent: null,
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx,
        });
        if (result.status === 'valid') {
          return result;
        } else if (result.status === 'dirty' && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
__name(ZodUnion, 'ZodUnion');
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params),
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, 'getDiscriminator');
var ZodDiscriminatedUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator],
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(
          `A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`
        );
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(
            `Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`
          );
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params),
    });
  }
};
__name(ZodDiscriminatedUnion, 'ZodDiscriminatedUnion');
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, 'mergeValues');
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types,
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, 'handleParsed');
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(
        this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        })
      );
    }
  }
};
__name(ZodIntersection, 'ZodIntersection');
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params),
  });
};
var ZodTuple = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: 'array',
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: 'array',
      });
      status.dirty();
    }
    const items = [...ctx.data]
      .map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema) return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      })
      .filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest,
    });
  }
};
__name(ZodTuple, 'ZodTuple');
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error('You must pass an array of schemas to z.tuple([ ... ])');
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params),
  });
};
var ZodRecord = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data,
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third),
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second),
    });
  }
};
__name(ZodRecord, 'ZodRecord');
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, 'key'])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, 'value'])),
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === 'aborted' || value.status === 'aborted') {
            return INVALID;
          }
          if (key.status === 'dirty' || value.status === 'dirty') {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === 'aborted' || value.status === 'aborted') {
          return INVALID;
        }
        if (key.status === 'dirty' || value.status === 'dirty') {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
__name(ZodMap, 'ZodMap');
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params),
  });
};
var ZodSet = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: 'set',
          inclusive: true,
          exact: false,
          message: def.minSize.message,
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: 'set',
          inclusive: true,
          exact: false,
          message: def.maxSize.message,
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === 'aborted') return INVALID;
        if (element.status === 'dirty') status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, 'finalizeSet');
    const elements = [...ctx.data.values()].map((item, i) =>
      valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i))
    );
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) },
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) },
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name(ZodSet, 'ZodSet');
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params),
  });
};
var ZodFunction = class extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    function makeArgsIssue(args, error3) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          en_default,
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error3,
        },
      });
    }
    __name(makeArgsIssue, 'makeArgsIssue');
    function makeReturnsIssue(returns, error3) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          en_default,
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error3,
        },
      });
    }
    __name(makeReturnsIssue, 'makeReturnsIssue');
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function (...args) {
        const error3 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error3.addIssue(makeArgsIssue(args, e));
          throw error3;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type
          .parseAsync(result, params)
          .catch((e) => {
            error3.addIssue(makeReturnsIssue(result, e));
            throw error3;
          });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function (...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create()),
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType,
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params),
    });
  }
};
__name(ZodFunction, 'ZodFunction');
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
__name(ZodLazy, 'ZodLazy');
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params),
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value,
      });
      return INVALID;
    }
    return { status: 'valid', value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
__name(ZodLiteral, 'ZodLiteral');
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params),
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params),
  });
}
__name(createZodEnum, 'createZodEnum');
var ZodEnum = class extends ZodType {
  _parse(input) {
    if (typeof input.data !== 'string') {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef,
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(
      this.options.filter((opt) => !values.includes(opt)),
      {
        ...this._def,
        ...newDef,
      }
    );
  }
};
__name(ZodEnum, 'ZodEnum');
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
__name(ZodNativeEnum, 'ZodNativeEnum');
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params),
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const promisified =
      ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(
      promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap,
        });
      })
    );
  }
};
__name(ZodPromise, 'ZodPromise');
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params),
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      },
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === 'preprocess') {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === 'aborted') return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx,
          });
          if (result.status === 'aborted') return INVALID;
          if (result.status === 'dirty') return DIRTY(result.value);
          if (status.value === 'dirty') return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === 'aborted') return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx,
        });
        if (result.status === 'aborted') return INVALID;
        if (result.status === 'dirty') return DIRTY(result.value);
        if (status.value === 'dirty') return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === 'refinement') {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error(
            'Async refinement encountered during synchronous parse operation. Use .parseAsync instead.'
          );
        }
        return acc;
      }, 'executeRefinement');
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inner.status === 'aborted') return INVALID;
        if (inner.status === 'dirty') status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((inner) => {
            if (inner.status === 'aborted') return INVALID;
            if (inner.status === 'dirty') status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
      }
    }
    if (effect.type === 'transform') {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (!isValid(base)) return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(
            `Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`
          );
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((base) => {
            if (!isValid(base)) return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result,
            }));
          });
      }
    }
    util.assertNever(effect);
  }
};
__name(ZodEffects, 'ZodEffects');
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params),
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: 'preprocess', transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params),
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodOptional, 'ZodOptional');
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params),
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodNullable, 'ZodNullable');
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params),
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
__name(ZodDefault, 'ZodDefault');
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === 'function' ? params.default : () => params.default,
    ...processCreateParams(params),
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: [],
      },
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx,
      },
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: 'valid',
          value:
            result2.status === 'valid'
              ? result2.value
              : this._def.catchValue({
                  get error() {
                    return new ZodError(newCtx.common.issues);
                  },
                  input: newCtx.data,
                }),
        };
      });
    } else {
      return {
        status: 'valid',
        value:
          result.status === 'valid'
            ? result.value
            : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data,
              }),
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
__name(ZodCatch, 'ZodCatch');
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === 'function' ? params.catch : () => params.catch,
    ...processCreateParams(params),
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return { status: 'valid', value: input.data };
  }
};
__name(ZodNaN, 'ZodNaN');
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params),
  });
};
var BRAND = Symbol('zod_brand');
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }
  unwrap() {
    return this._def.type;
  }
};
__name(ZodBranded, 'ZodBranded');
var ZodPipeline = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inResult.status === 'aborted') return INVALID;
        if (inResult.status === 'dirty') {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx,
          });
        }
      }, 'handleAsync');
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
      if (inResult.status === 'aborted') return INVALID;
      if (inResult.status === 'dirty') {
        status.dirty();
        return {
          status: 'dirty',
          value: inResult.value,
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx,
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline,
    });
  }
};
__name(ZodPipeline, 'ZodPipeline');
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, 'freeze');
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodReadonly, 'ZodReadonly');
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params),
  });
};
function cleanParams(params, data) {
  const p =
    typeof params === 'function'
      ? params(data)
      : typeof params === 'string'
        ? { message: params }
        : params;
  const p2 = typeof p === 'string' ? { message: p } : p;
  return p2;
}
__name(cleanParams, 'cleanParams');
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: 'custom', ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: 'custom', ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, 'custom');
var late = {
  object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2['ZodString'] = 'ZodString';
  ZodFirstPartyTypeKind2['ZodNumber'] = 'ZodNumber';
  ZodFirstPartyTypeKind2['ZodNaN'] = 'ZodNaN';
  ZodFirstPartyTypeKind2['ZodBigInt'] = 'ZodBigInt';
  ZodFirstPartyTypeKind2['ZodBoolean'] = 'ZodBoolean';
  ZodFirstPartyTypeKind2['ZodDate'] = 'ZodDate';
  ZodFirstPartyTypeKind2['ZodSymbol'] = 'ZodSymbol';
  ZodFirstPartyTypeKind2['ZodUndefined'] = 'ZodUndefined';
  ZodFirstPartyTypeKind2['ZodNull'] = 'ZodNull';
  ZodFirstPartyTypeKind2['ZodAny'] = 'ZodAny';
  ZodFirstPartyTypeKind2['ZodUnknown'] = 'ZodUnknown';
  ZodFirstPartyTypeKind2['ZodNever'] = 'ZodNever';
  ZodFirstPartyTypeKind2['ZodVoid'] = 'ZodVoid';
  ZodFirstPartyTypeKind2['ZodArray'] = 'ZodArray';
  ZodFirstPartyTypeKind2['ZodObject'] = 'ZodObject';
  ZodFirstPartyTypeKind2['ZodUnion'] = 'ZodUnion';
  ZodFirstPartyTypeKind2['ZodDiscriminatedUnion'] = 'ZodDiscriminatedUnion';
  ZodFirstPartyTypeKind2['ZodIntersection'] = 'ZodIntersection';
  ZodFirstPartyTypeKind2['ZodTuple'] = 'ZodTuple';
  ZodFirstPartyTypeKind2['ZodRecord'] = 'ZodRecord';
  ZodFirstPartyTypeKind2['ZodMap'] = 'ZodMap';
  ZodFirstPartyTypeKind2['ZodSet'] = 'ZodSet';
  ZodFirstPartyTypeKind2['ZodFunction'] = 'ZodFunction';
  ZodFirstPartyTypeKind2['ZodLazy'] = 'ZodLazy';
  ZodFirstPartyTypeKind2['ZodLiteral'] = 'ZodLiteral';
  ZodFirstPartyTypeKind2['ZodEnum'] = 'ZodEnum';
  ZodFirstPartyTypeKind2['ZodEffects'] = 'ZodEffects';
  ZodFirstPartyTypeKind2['ZodNativeEnum'] = 'ZodNativeEnum';
  ZodFirstPartyTypeKind2['ZodOptional'] = 'ZodOptional';
  ZodFirstPartyTypeKind2['ZodNullable'] = 'ZodNullable';
  ZodFirstPartyTypeKind2['ZodDefault'] = 'ZodDefault';
  ZodFirstPartyTypeKind2['ZodCatch'] = 'ZodCatch';
  ZodFirstPartyTypeKind2['ZodPromise'] = 'ZodPromise';
  ZodFirstPartyTypeKind2['ZodBranded'] = 'ZodBranded';
  ZodFirstPartyTypeKind2['ZodPipeline'] = 'ZodPipeline';
  ZodFirstPartyTypeKind2['ZodReadonly'] = 'ZodReadonly';
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name(
  (
    cls,
    params = {
      message: `Input not instance of ${cls.name}`,
    }
  ) => custom((data) => data instanceof cls, params),
  'instanceOfType'
);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), 'ostring');
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), 'onumber');
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), 'oboolean');
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) =>
    ZodBoolean.create({
      ...arg,
      coerce: true,
    }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true }),
};
var NEVER = INVALID;

// ../../packages/shared/src/types.ts
var ArticleIdSchema = external_exports.string().uuid();
var TrendIdSchema = external_exports.string().uuid();
var SourceIdSchema = external_exports.string().uuid();
var FactIdSchema = external_exports.string().uuid();
var AssetIdSchema = external_exports.string().uuid();
var ContentVariantIdSchema = external_exports.string().uuid();
var PublishingJobIdSchema = external_exports.string().uuid();
var ResearchIdSchema = external_exports.string().uuid();
var TopicIdSchema = external_exports.string().uuid();
var AnalyticsEventIdSchema = external_exports.string().uuid();
var AuditLogIdSchema = external_exports.string().uuid();

// ../../packages/shared/src/errors.ts
var AppError = class extends Error {
  code;
  statusCode;
  details;
  constructor(message, code, statusCode, details) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
};
__name(AppError, 'AppError');
var ValidationError = class extends AppError {
  constructor(message, details) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
};
__name(ValidationError, 'ValidationError');

// ../../packages/shared/src/logger.ts
var SENSITIVE_FIELDS = /* @__PURE__ */ new Set([
  'password',
  'token',
  'apiKey',
  'secret',
  'apikey',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'session',
  'private_key',
  'privateKey',
]);
var SENSITIVE_SUBSTRINGS = [
  'password',
  'token',
  'apikey',
  'secret',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'session',
  'private_key',
  'privatekey',
];
function redactSensitiveData(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.has(lowerKey) || SENSITIVE_SUBSTRINGS.some((s) => lowerKey.includes(s))) {
      result[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = redactSensitiveData(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) => (v && typeof v === 'object' ? redactSensitiveData(v) : v));
    } else {
      result[key] = value;
    }
  }
  return result;
}
__name(redactSensitiveData, 'redactSensitiveData');
var _Logger = class {
  service;
  minLevel;
  constructor(service, minLevel = 'info') {
    this.service = service;
    this.minLevel = minLevel;
  }
  shouldLog(level) {
    return _Logger.levelOrder[level] <= _Logger.levelOrder[this.minLevel];
  }
  formatEntry(level, message, metadata) {
    return {
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      level,
      service: this.service,
      message,
      metadata: metadata ? redactSensitiveData(metadata) : void 0,
    };
  }
  write(entry) {
    console.log(JSON.stringify(entry));
  }
  error(message, metadata) {
    if (!this.shouldLog('error')) return;
    this.write(this.formatEntry('error', message, metadata));
  }
  warn(message, metadata) {
    if (!this.shouldLog('warn')) return;
    this.write(this.formatEntry('warn', message, metadata));
  }
  info(message, metadata) {
    if (!this.shouldLog('info')) return;
    this.write(this.formatEntry('info', message, metadata));
  }
  debug(message, metadata) {
    if (!this.shouldLog('debug')) return;
    this.write(this.formatEntry('debug', message, metadata));
  }
  child(additionalMetadata) {
    const childLogger = new _Logger(this.service, this.minLevel);
    const originalMethods = {
      error: childLogger.error.bind(childLogger),
      warn: childLogger.warn.bind(childLogger),
      info: childLogger.info.bind(childLogger),
      debug: childLogger.debug.bind(childLogger),
    };
    childLogger.error = (message, metadata) =>
      originalMethods.error(message, { ...additionalMetadata, ...metadata });
    childLogger.warn = (message, metadata) =>
      originalMethods.warn(message, { ...additionalMetadata, ...metadata });
    childLogger.info = (message, metadata) =>
      originalMethods.info(message, { ...additionalMetadata, ...metadata });
    childLogger.debug = (message, metadata) =>
      originalMethods.debug(message, { ...additionalMetadata, ...metadata });
    return childLogger;
  }
};
var Logger = _Logger;
__name(Logger, 'Logger');
__publicField(Logger, 'levelOrder', {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
});
function createLogger(service, minLevel) {
  return new Logger(service, minLevel);
}
__name(createLogger, 'createLogger');
var defaultLogger = createLogger('semburat');

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.0.2_unenv@2.0.0-rc.14_workerd@1.20250718.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs
var workerdAsyncHooks = process.getBuiltinModule('node:async_hooks');
var { AsyncLocalStorage, AsyncResource } = workerdAsyncHooks;

// ../../packages/shared/src/tracer.ts
var asyncLocalStorage = new AsyncLocalStorage();

// src/middleware/error.ts
var errorMiddleware = /* @__PURE__ */ __name(async (c, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      return c.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        err.statusCode
      );
    }
    console.error('Unhandled error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500);
  }
}, 'errorMiddleware');

// src/middleware/rate-limit.ts
var limits = /* @__PURE__ */ new Map();
var rateLimitMiddleware = /* @__PURE__ */ __name(async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const window = 6e4;
  const maxRequests = 60;
  const timestamps = limits.get(ip)?.filter((t) => now - t < window) ?? [];
  timestamps.push(now);
  limits.set(ip, timestamps);
  if (timestamps.length > maxRequests) {
    return c.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }, 429);
  }
  await next();
}, 'rateLimitMiddleware');

// src/routes/health.ts
var app = new Hono3();
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: /* @__PURE__ */ new Date().toISOString(),
  });
});
var health_default = app;

// ../../packages/domain/src/value-objects/Slug.ts
var Slug = class {
  value;
  constructor(value) {
    this.value = value;
  }
  static fromString(input) {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      throw new ValidationError('Slug cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new ValidationError('Slug cannot exceed 100 characters');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      throw new ValidationError(
        'Slug must contain only lowercase alphanumeric characters and hyphens, no consecutive hyphens'
      );
    }
    if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
      throw new ValidationError('Slug cannot start or end with a hyphen');
    }
    if (trimmed.includes('--')) {
      throw new ValidationError('Slug cannot contain consecutive hyphens');
    }
    return new Slug(trimmed);
  }
  toString() {
    return this.value;
  }
  equals(other) {
    return this.value === other.value;
  }
};
__name(Slug, 'Slug');

// ../../packages/domain/src/value-objects/RiskLevel.ts
var RiskLevel = class {
  value;
  constructor(value) {
    this.value = value;
  }
  static fromString(input) {
    const upper = input.trim().toUpperCase();
    if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH') {
      return new RiskLevel(upper);
    }
    throw new ValidationError(`Invalid risk level: ${input}. Must be LOW, MEDIUM, or HIGH`);
  }
  static fromScore(score) {
    if (score >= 70) return new RiskLevel('HIGH');
    if (score >= 40) return new RiskLevel('MEDIUM');
    return new RiskLevel('LOW');
  }
  isHighRisk() {
    return this.value === 'HIGH';
  }
  toString() {
    return this.value;
  }
  equals(other) {
    return this.value === other.value;
  }
};
__name(RiskLevel, 'RiskLevel');

// ../../packages/domain/src/value-objects/QualityScore.ts
var QualityScore = class {
  value;
  constructor(value) {
    this.value = value;
  }
  static fromNumber(input) {
    if (!Number.isInteger(input)) {
      throw new ValidationError('Quality score must be an integer');
    }
    if (input < 0 || input > 100) {
      throw new ValidationError('Quality score must be between 0 and 100');
    }
    return new QualityScore(input);
  }
  getValue() {
    return this.value;
  }
  isPassing() {
    return this.value >= 75;
  }
  isAutoPublishable() {
    return this.value >= 90;
  }
  isRejected() {
    return this.value < 60;
  }
  toString() {
    return this.value.toString();
  }
  equals(other) {
    return this.value === other.value;
  }
};
__name(QualityScore, 'QualityScore');

// ../../packages/domain/src/entities/Article.ts
var VALID_TRANSITIONS = {
  ['draft' /* DRAFT */]: [
    'researching' /* RESEARCHING */,
    'needs_research' /* NEEDS_RESEARCH */,
    'rejected' /* REJECTED */,
  ],
  ['researching' /* RESEARCHING */]: [
    'verified' /* VERIFIED */,
    'needs_research' /* NEEDS_RESEARCH */,
    'rejected' /* REJECTED */,
  ],
  ['verified' /* VERIFIED */]: [
    'editorial_review' /* EDITORIAL_REVIEW */,
    'needs_research' /* NEEDS_RESEARCH */,
    'rejected' /* REJECTED */,
  ],
  ['editorial_review' /* EDITORIAL_REVIEW */]: [
    'approved' /* APPROVED */,
    'needs_review' /* NEEDS_REVIEW */,
    'rejected' /* REJECTED */,
  ],
  ['approved' /* APPROVED */]: [
    'scheduled' /* SCHEDULED */,
    'published' /* PUBLISHED */,
    'rejected' /* REJECTED */,
  ],
  ['scheduled' /* SCHEDULED */]: ['published' /* PUBLISHED */, 'rejected' /* REJECTED */],
  ['published' /* PUBLISHED */]: ['archived' /* ARCHIVED */, 'rejected' /* REJECTED */],
  ['archived' /* ARCHIVED */]: [],
  ['rejected' /* REJECTED */]: ['draft' /* DRAFT */],
  ['needs_research' /* NEEDS_RESEARCH */]: [
    'researching' /* RESEARCHING */,
    'rejected' /* REJECTED */,
  ],
  ['needs_asset' /* NEEDS_ASSET */]: [
    'editorial_review' /* EDITORIAL_REVIEW */,
    'rejected' /* REJECTED */,
  ],
  ['needs_license' /* NEEDS_LICENSE */]: [
    'editorial_review' /* EDITORIAL_REVIEW */,
    'rejected' /* REJECTED */,
  ],
  ['needs_review' /* NEEDS_REVIEW */]: [
    'editorial_review' /* EDITORIAL_REVIEW */,
    'approved' /* APPROVED */,
    'rejected' /* REJECTED */,
  ],
};
var Article = class {
  id;
  researchId;
  title;
  slug;
  dek;
  summary;
  body;
  category;
  subcategory;
  status;
  riskLevel;
  qualityScore;
  seoTitle;
  metaDescription;
  canonicalUrl;
  heroAssetId;
  topicId;
  publishedAt;
  createdAt;
  updatedAt;
  version;
  sourceCount;
  factCheckStatus;
  constructor(params) {
    if (!params.title || params.title.length < 5 || params.title.length > 200) {
      throw new ValidationError('Title must be between 5 and 200 characters');
    }
    if (!params.dek || params.dek.length < 10 || params.dek.length > 300) {
      throw new ValidationError('Dek must be between 10 and 300 characters');
    }
    if (!params.body || params.body.length < 100) {
      throw new ValidationError('Body must be at least 100 characters');
    }
    if (!params.category) {
      throw new ValidationError('Category is required');
    }
    this.id = params.id;
    this.researchId = params.researchId;
    this.title = params.title;
    this.slug = params.slug instanceof Slug ? params.slug : Slug.fromString(params.slug);
    this.dek = params.dek;
    this.summary = params.summary;
    this.body = params.body;
    this.category = params.category;
    this.subcategory = params.subcategory;
    this.status = params.status ?? 'draft'; /* DRAFT */
    this.riskLevel =
      params.riskLevel instanceof RiskLevel
        ? params.riskLevel
        : RiskLevel.fromString(params.riskLevel ?? 'LOW');
    this.qualityScore =
      params.qualityScore instanceof QualityScore
        ? params.qualityScore
        : QualityScore.fromNumber(params.qualityScore ?? 0);
    this.seoTitle = params.seoTitle;
    this.metaDescription = params.metaDescription;
    this.canonicalUrl = params.canonicalUrl;
    this.heroAssetId = params.heroAssetId;
    this.topicId = params.topicId;
    this.publishedAt = params.publishedAt;
    this.createdAt = params.createdAt ?? /* @__PURE__ */ new Date();
    this.updatedAt = params.updatedAt ?? /* @__PURE__ */ new Date();
    this.version = params.version ?? 1;
    this.sourceCount = params.sourceCount ?? 0;
    this.factCheckStatus = params.factCheckStatus ?? 'pending'; /* PENDING */
  }
  canTransitionTo(newStatus) {
    return VALID_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
  }
  withTitle(title2) {
    return new Article({
      ...this.toParams(),
      title: title2,
      updatedAt: /* @__PURE__ */ new Date(),
      version: this.version + 1,
    });
  }
  withStatus(status) {
    if (!this.canTransitionTo(status)) {
      throw new ValidationError(`Cannot transition from ${this.status} to ${status}`);
    }
    return new Article({
      ...this.toParams(),
      status,
      updatedAt: /* @__PURE__ */ new Date(),
      version: this.version + 1,
    });
  }
  withQualityScore(score) {
    const qualityScore = score instanceof QualityScore ? score : QualityScore.fromNumber(score);
    return new Article({
      ...this.toParams(),
      qualityScore,
      updatedAt: /* @__PURE__ */ new Date(),
      version: this.version + 1,
    });
  }
  markPublished() {
    return new Article({
      ...this.toParams(),
      status: 'published' /* PUBLISHED */,
      publishedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      version: this.version + 1,
    });
  }
  markRejected(reason) {
    return new Article({
      ...this.toParams(),
      status: 'rejected' /* REJECTED */,
      updatedAt: /* @__PURE__ */ new Date(),
      version: this.version + 1,
    });
  }
  toParams() {
    return {
      id: this.id,
      researchId: this.researchId,
      title: this.title,
      slug: this.slug,
      dek: this.dek,
      summary: this.summary,
      body: this.body,
      category: this.category,
      subcategory: this.subcategory,
      status: this.status,
      riskLevel: this.riskLevel,
      qualityScore: this.qualityScore,
      seoTitle: this.seoTitle,
      metaDescription: this.metaDescription,
      canonicalUrl: this.canonicalUrl,
      heroAssetId: this.heroAssetId,
      topicId: this.topicId,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
      sourceCount: this.sourceCount,
      factCheckStatus: this.factCheckStatus,
    };
  }
};
__name(Article, 'Article');

// ../../packages/domain/src/entities/Trend.ts
var Trend = class {
  id;
  topicId;
  title;
  normalizedKey;
  score;
  velocity;
  relevance;
  freshness;
  sourceCount;
  status;
  detectedAt;
  createdAt;
  updatedAt;
  constructor(params) {
    if (!params.title || params.title.trim().length === 0) {
      throw new ValidationError('Trend title cannot be empty');
    }
    if (!params.normalizedKey || params.normalizedKey.trim().length === 0) {
      throw new ValidationError('Normalized key cannot be empty');
    }
    if (params.score !== void 0 && (params.score < 0 || params.score > 100)) {
      throw new ValidationError('Score must be between 0 and 100');
    }
    if (params.velocity !== void 0 && (params.velocity < 0 || params.velocity > 100)) {
      throw new ValidationError('Velocity must be between 0 and 100');
    }
    if (params.relevance !== void 0 && (params.relevance < 0 || params.relevance > 100)) {
      throw new ValidationError('Relevance must be between 0 and 100');
    }
    if (params.freshness !== void 0 && (params.freshness < 0 || params.freshness > 100)) {
      throw new ValidationError('Freshness must be between 0 and 100');
    }
    this.id = params.id;
    this.topicId = params.topicId;
    this.title = params.title.trim();
    this.normalizedKey = params.normalizedKey.trim().toLowerCase();
    this.score = params.score ?? 0;
    this.velocity = params.velocity ?? 0;
    this.relevance = params.relevance ?? 0;
    this.freshness = params.freshness ?? 0;
    this.sourceCount = params.sourceCount ?? 0;
    this.status = params.status ?? 'candidate'; /* CANDIDATE */
    this.detectedAt = params.detectedAt ?? /* @__PURE__ */ new Date();
    this.createdAt = params.createdAt ?? /* @__PURE__ */ new Date();
    this.updatedAt = params.updatedAt ?? /* @__PURE__ */ new Date();
  }
  withScore(score) {
    if (score < 0 || score > 100) {
      throw new ValidationError('Score must be between 0 and 100');
    }
    return new Trend({
      ...this.toParams(),
      score,
      status: this.score === 0 && score > 0 ? 'scored' /* SCORED */ : this.status,
      updatedAt: /* @__PURE__ */ new Date(),
    });
  }
  incrementSourceCount() {
    return new Trend({
      ...this.toParams(),
      sourceCount: this.sourceCount + 1,
      updatedAt: /* @__PURE__ */ new Date(),
    });
  }
  toParams() {
    return {
      id: this.id,
      topicId: this.topicId,
      title: this.title,
      normalizedKey: this.normalizedKey,
      score: this.score,
      velocity: this.velocity,
      relevance: this.relevance,
      freshness: this.freshness,
      sourceCount: this.sourceCount,
      status: this.status,
      detectedAt: this.detectedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
};
__name(Trend, 'Trend');

// ../../packages/domain/src/entities/Asset.ts
var Asset = class {
  id;
  articleId;
  type;
  storageKey;
  sourceUrl;
  hash;
  creator;
  licenseState;
  creditText;
  altText;
  metadataJson;
  createdAt;
  constructor(params) {
    if (!params.storageKey || params.storageKey.trim().length === 0) {
      throw new ValidationError('Storage key cannot be empty');
    }
    this.id = params.id;
    this.articleId = params.articleId;
    this.type = params.type;
    this.storageKey = params.storageKey.trim();
    this.sourceUrl = params.sourceUrl?.trim();
    this.hash = params.hash?.trim();
    this.creator = params.creator?.trim();
    this.licenseState = params.licenseState ?? 'unknown'; /* UNKNOWN */
    this.creditText = params.creditText?.trim();
    this.altText = params.altText?.trim();
    this.metadataJson = params.metadataJson ?? '{}';
    this.createdAt = params.createdAt ?? /* @__PURE__ */ new Date();
  }
  withLicense(state) {
    return new Asset({ ...this.toParams(), licenseState: state });
  }
  withCredit(text) {
    return new Asset({ ...this.toParams(), creditText: text.trim() });
  }
  canBePublished() {
    return (
      this.licenseState !== 'unknown' /* UNKNOWN */ && this.licenseState !== 'restricted'
    ); /* RESTRICTED */
  }
  toParams() {
    return {
      id: this.id,
      articleId: this.articleId,
      type: this.type,
      storageKey: this.storageKey,
      sourceUrl: this.sourceUrl,
      hash: this.hash,
      creator: this.creator,
      licenseState: this.licenseState,
      creditText: this.creditText,
      altText: this.altText,
      metadataJson: this.metadataJson,
      createdAt: this.createdAt,
    };
  }
};
__name(Asset, 'Asset');

// ../../packages/domain/src/entities/AnalyticsEvent.ts
var AnalyticsEvent = class {
  id;
  contentId;
  eventType;
  value;
  metadata;
  occurredAt;
  constructor(params) {
    if (!params.eventType || params.eventType.trim().length === 0) {
      throw new ValidationError('Event type cannot be empty');
    }
    if (!params.contentId || params.contentId.trim().length === 0) {
      throw new ValidationError('Content id cannot be empty');
    }
    if (params.value !== void 0 && params.value < 0) {
      throw new ValidationError('Event value cannot be negative');
    }
    this.id = params.id;
    this.contentId = params.contentId;
    this.eventType = params.eventType.trim();
    this.value = params.value ?? 0;
    this.metadata = params.metadata ?? {};
    this.occurredAt = params.occurredAt ?? /* @__PURE__ */ new Date();
  }
  static forContent(contentId, eventType, value = 0, metadata) {
    return new AnalyticsEvent({ id: crypto.randomUUID(), contentId, eventType, value, metadata });
  }
};
__name(AnalyticsEvent, 'AnalyticsEvent');

// ../../packages/infra/src/repositories/D1Helpers.ts
function toISO(date) {
  return date ? new Date(date).toISOString() : void 0;
}
__name(toISO, 'toISO');
function fromISO(date) {
  if (typeof date === 'string' && date.length > 0) return new Date(date);
  return void 0;
}
__name(fromISO, 'fromISO');
function jsonQuote(value) {
  return JSON.stringify(value ?? null);
}
__name(jsonQuote, 'jsonQuote');
function jsonParse(value, fallback) {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
__name(jsonParse, 'jsonParse');

// ../../packages/infra/src/repositories/D1TrendRepository.ts
var D1TrendRepository = class {
  constructor(db) {
    this.db = db;
  }
  async insert(trend) {
    await this.upsert(trend);
  }
  async findById(id) {
    const row = await this.db.prepare('SELECT * FROM trends WHERE id = ? LIMIT 1').bind(id).first();
    return row ? this.fromRow(row) : null;
  }
  async findByNormalizedKey(key) {
    const row = await this.db
      .prepare('SELECT * FROM trends WHERE normalized_key = ? LIMIT 1')
      .bind(key)
      .first();
    return row ? this.fromRow(row) : null;
  }
  async findByStatus(status) {
    const result = await this.db
      .prepare('SELECT * FROM trends WHERE status = ?')
      .bind(status)
      .all();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }
  async findByScore(minScore, limit) {
    const result = await this.db
      .prepare('SELECT * FROM trends WHERE score >= ? ORDER BY score DESC, id LIMIT ?')
      .bind(minScore, limit)
      .all();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }
  async update(trend) {
    const sql = [
      'UPDATE trends SET topic_id = ?, title = ?, normalized_key = ?, score = ?, velocity = ?,',
      'relevance = ?, freshness = ?, source_count = ?, status = ?, detected_at = ?, updated_at = ?',
      'WHERE id = ?',
    ].join(' ');
    await this.db
      .prepare(sql)
      .bind(
        trend.topicId ?? null,
        trend.title,
        trend.normalizedKey,
        trend.score,
        trend.velocity,
        trend.relevance,
        trend.freshness,
        trend.sourceCount,
        trend.status,
        toISO(trend.detectedAt),
        toISO(trend.updatedAt),
        trend.id
      )
      .run();
  }
  async upsert(trend) {
    const sql = [
      'INSERT OR REPLACE INTO trends',
      '(id, topic_id, title, normalized_key, score, velocity, relevance, freshness,',
      'source_count, status, detected_at, created_at, updated_at)',
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
    ].join(' ');
    await this.db
      .prepare(sql)
      .bind(
        trend.id,
        trend.topicId ?? null,
        trend.title,
        trend.normalizedKey,
        trend.score,
        trend.velocity,
        trend.relevance,
        trend.freshness,
        trend.sourceCount,
        trend.status,
        toISO(trend.detectedAt),
        toISO(trend.createdAt),
        toISO(trend.updatedAt)
      )
      .run();
  }
  fromRow(row) {
    return new Trend({
      id: row.id,
      topicId: row.topic_id ? row.topic_id : void 0,
      title: row.title,
      normalizedKey: row.normalized_key,
      score: row.score,
      velocity: row.velocity,
      relevance: row.relevance,
      freshness: row.freshness,
      sourceCount: row.source_count,
      status: row.status,
      detectedAt: fromISO(row.detected_at),
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
    });
  }
};
__name(D1TrendRepository, 'D1TrendRepository');

// ../../packages/infra/src/repositories/D1ArticleRepository.ts
var D1ArticleRepository = class {
  constructor(db) {
    this.db = db;
  }
  async insert(article) {
    const sql =
      'INSERT OR REPLACE INTO articles (id, research_id, title, slug, dek, summary, body, category, subcategory, status, risk_level, quality_score, seo_title, meta_description, canonical_url, hero_asset_id, topic_id, source_count, fact_check_status, version, published_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(article.id, ...this.bindValues(article))
      .run();
  }
  async findById(id) {
    const row = await this.db
      .prepare('SELECT * FROM articles WHERE id = ? LIMIT 1')
      .bind(id)
      .first();
    return row ? this.fromRow(row) : null;
  }
  async findBySlug(slug) {
    const row = await this.db
      .prepare('SELECT * FROM articles WHERE slug = ? LIMIT 1')
      .bind(slug)
      .first();
    return row ? this.fromRow(row) : null;
  }
  async findByStatus(status, limit, cursor) {
    let sql;
    let params;
    if (cursor) {
      sql = 'SELECT * FROM articles WHERE status = ? AND id > ? ORDER BY id LIMIT ?';
      params = [status, cursor, limit];
    } else {
      sql = 'SELECT * FROM articles WHERE status = ? ORDER BY id LIMIT ?';
      params = [status, limit];
    }
    const result = await this.db
      .prepare(sql)
      .bind(...params)
      .all();
    const articles = (result.results ?? []).map((row) => this.fromRow(row));
    const nextCursor =
      articles.length === limit && articles.length > 0 ? articles[articles.length - 1].id : null;
    return { articles, nextCursor };
  }
  async update(article) {
    const sql =
      'UPDATE articles SET research_id = ?, title = ?, slug = ?, dek = ?, summary = ?, body = ?, category = ?, subcategory = ?, status = ?, risk_level = ?, quality_score = ?, seo_title = ?, meta_description = ?, canonical_url = ?, hero_asset_id = ?, topic_id = ?, source_count = ?, fact_check_status = ?, version = ?, published_at = ?, created_at = ?, updated_at = ? WHERE id = ?';
    const values = this.bindValues(article);
    await this.db
      .prepare(sql)
      .bind(...values, article.id)
      .run();
  }
  async updateStatus(id, status) {
    const sql =
      'UPDATE articles SET status = ?, updated_at = ?, version = version + 1 WHERE id = ?';
    await this.db.prepare(sql).bind(status, toISO(/* @__PURE__ */ new Date()), id).run();
  }
  bindValues(article) {
    return [
      article.researchId,
      article.title,
      article.slug.toString(),
      article.dek,
      article.summary ?? null,
      article.body,
      article.category,
      article.subcategory ?? null,
      article.status,
      article.riskLevel.toString().toLowerCase(),
      article.qualityScore.value,
      article.seoTitle ?? null,
      article.metaDescription ?? null,
      article.canonicalUrl ?? null,
      article.heroAssetId ?? null,
      article.topicId ?? null,
      article.sourceCount,
      article.factCheckStatus,
      article.version,
      toISO(article.publishedAt),
      toISO(article.createdAt),
      toISO(article.updatedAt),
    ];
  }
  fromRow(row) {
    return new Article({
      id: row.id,
      researchId: row.research_id,
      title: row.title,
      slug: row.slug,
      dek: row.dek,
      summary: row.summary ?? '',
      body: row.body,
      category: row.category,
      subcategory: row.subcategory ? row.subcategory : void 0,
      status: row.status,
      riskLevel: row.risk_level,
      qualityScore: row.quality_score,
      seoTitle: row.seo_title ? row.seo_title : void 0,
      metaDescription: row.meta_description ? row.meta_description : void 0,
      canonicalUrl: row.canonical_url ? row.canonical_url : void 0,
      heroAssetId: row.hero_asset_id ? row.hero_asset_id : void 0,
      topicId: row.topic_id ? row.topic_id : void 0,
      publishedAt: fromISO(row.published_at),
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
      version: row.version,
      sourceCount: row.source_count,
      factCheckStatus: row.fact_check_status,
    });
  }
};
__name(D1ArticleRepository, 'D1ArticleRepository');

// ../../packages/infra/src/repositories/D1AssetRepository.ts
var D1AssetRepository = class {
  constructor(db) {
    this.db = db;
  }
  async insert(asset) {
    const sql =
      'INSERT OR REPLACE INTO assets (id, article_id, type, storage_key, source_url, hash, creator, license_state, credit_text, alt_text, metadata_json, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        asset.id,
        asset.articleId,
        asset.type,
        asset.storageKey,
        asset.sourceUrl ?? null,
        asset.hash ?? null,
        asset.creator ?? null,
        asset.licenseState,
        asset.creditText ?? null,
        asset.altText ?? null,
        asset.metadataJson,
        toISO(asset.createdAt)
      )
      .run();
  }
  async findById(id) {
    const row = await this.db.prepare('SELECT * FROM assets WHERE id = ? LIMIT 1').bind(id).first();
    return row ? this.fromRow(row) : null;
  }
  async findByArticleId(articleId) {
    const result = await this.db
      .prepare('SELECT * FROM assets WHERE article_id = ? ORDER BY created_at ASC')
      .bind(articleId)
      .all();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }
  async findByHash(hash2) {
    const row = await this.db
      .prepare('SELECT * FROM assets WHERE hash = ? LIMIT 1')
      .bind(hash2)
      .first();
    return row ? this.fromRow(row) : null;
  }
  async update(asset) {
    const sql =
      'UPDATE assets SET article_id = ?, type = ?, storage_key = ?, source_url = ?, hash = ?, creator = ?, license_state = ?, credit_text = ?, alt_text = ?, metadata_json = ?, created_at = ? WHERE id = ?';
    await this.db
      .prepare(sql)
      .bind(
        asset.articleId,
        asset.type,
        asset.storageKey,
        asset.sourceUrl ?? null,
        asset.hash ?? null,
        asset.creator ?? null,
        asset.licenseState,
        asset.creditText ?? null,
        asset.altText ?? null,
        asset.metadataJson,
        toISO(asset.createdAt),
        asset.id
      )
      .run();
  }
  async delete(id) {
    await this.db.prepare('DELETE FROM assets WHERE id = ?').bind(id).run();
  }
  fromRow(row) {
    return new Asset({
      id: row.id,
      articleId: row.article_id,
      type: row.type,
      storageKey: row.storage_key,
      sourceUrl: row.source_url ? row.source_url : void 0,
      hash: row.hash ? row.hash : void 0,
      creator: row.creator ? row.creator : void 0,
      licenseState: row.license_state,
      creditText: row.credit_text ? row.credit_text : void 0,
      altText: row.alt_text ? row.alt_text : void 0,
      metadataJson: row.metadata_json,
      createdAt: fromISO(row.created_at),
    });
  }
};
__name(D1AssetRepository, 'D1AssetRepository');

// ../../packages/infra/src/repositories/D1AnalyticsEventRepository.ts
var D1AnalyticsEventRepository = class {
  constructor(db) {
    this.db = db;
  }
  async insert(event) {
    const sql =
      'INSERT OR REPLACE INTO analytics_events (id, content_id, event_type, value, metadata_json, occurred_at) VALUES (?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        event.id,
        event.contentId,
        event.eventType,
        event.value,
        jsonQuote(event.metadata),
        toISO(event.occurredAt)
      )
      .run();
  }
  async findByContentId(contentId, limit) {
    const result = await this.db
      .prepare(
        'SELECT * FROM analytics_events WHERE content_id = ? ORDER BY occurred_at DESC LIMIT ?'
      )
      .bind(contentId, limit)
      .all();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }
  async aggregateByEventType(contentId) {
    const result = await this.db
      .prepare('SELECT event_type, value FROM analytics_events WHERE content_id = ?')
      .bind(contentId)
      .all();
    const aggregates = /* @__PURE__ */ new Map();
    for (const row of result.results ?? []) {
      const eventType = row.event_type;
      const value = row.value ?? 0;
      aggregates.set(eventType, (aggregates.get(eventType) ?? 0) + value);
    }
    return Array.from(aggregates.entries()).map(([eventType, total]) => ({ eventType, total }));
  }
  fromRow(row) {
    return new AnalyticsEvent({
      id: row.id,
      contentId: row.content_id,
      eventType: row.event_type,
      value: row.value,
      metadata: jsonParse(row.metadata_json, {}),
      occurredAt: fromISO(row.occurred_at),
    });
  }
};
__name(D1AnalyticsEventRepository, 'D1AnalyticsEventRepository');

// ../../node_modules/.pnpm/unenv@2.0.0-rc.14/node_modules/unenv/dist/runtime/node/internal/crypto/node.mjs
var webcrypto = new Proxy(globalThis.crypto, {
  get(_, key) {
    if (key === 'CryptoKey') {
      return globalThis.CryptoKey;
    }
    if (typeof globalThis.crypto[key] === 'function') {
      return globalThis.crypto[key].bind(globalThis.crypto);
    }
    return globalThis.crypto[key];
  },
});

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.0.2_unenv@2.0.0-rc.14_workerd@1.20250718.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/crypto.mjs
var workerdCrypto = process.getBuiltinModule('node:crypto');
var {
  Certificate,
  DiffieHellman,
  DiffieHellmanGroup,
  Hash,
  Hmac,
  KeyObject,
  X509Certificate,
  checkPrime,
  checkPrimeSync,
  createDiffieHellman,
  createDiffieHellmanGroup,
  createHash,
  createHmac,
  createPrivateKey,
  createPublicKey,
  createSecretKey,
  generateKey,
  generateKeyPair,
  generateKeyPairSync,
  generateKeySync,
  generatePrime,
  generatePrimeSync,
  getCiphers,
  getCurves,
  getDiffieHellman,
  getFips,
  getHashes,
  hkdf,
  hkdfSync,
  pbkdf2,
  pbkdf2Sync,
  randomBytes,
  randomFill,
  randomFillSync,
  randomInt,
  randomUUID,
  scrypt,
  scryptSync,
  secureHeapUsed,
  setEngine,
  setFips,
  subtle,
  timingSafeEqual,
} = workerdCrypto;
var getRandomValues = workerdCrypto.getRandomValues.bind(workerdCrypto.webcrypto);
var webcrypto2 = {
  // @ts-expect-error unenv has unknown type
  CryptoKey: webcrypto.CryptoKey,
  getRandomValues,
  randomUUID,
  subtle,
};
var fips = workerdCrypto.fips;

// ../../packages/infra/src/services/LicenseValidationService.ts
var PUBLISHABLE_LICENSES = /* @__PURE__ */ new Set([
  'owned' /* OWNED */,
  'licensed' /* LICENSED */,
  'public_domain' /* PUBLIC_DOMAIN */,
  'permitted' /* PERMITTED */,
  'generated' /* GENERATED */,
]);
var CREDIT_REQUIRED_LICENSES = /* @__PURE__ */ new Set([
  'licensed' /* LICENSED */,
  'permitted' /* PERMITTED */,
]);

// ../../packages/infra/src/services/AssetTransformationService.ts
var IMAGE_VARIANTS = [
  { type: 'hero' /* HERO */, width: 1200, height: 630, label: 'hero' },
  { type: 'thumbnail' /* THUMBNAIL */, width: 400, height: 200, label: 'thumbnail' },
  { type: 'og' /* OG */, width: 1200, height: 630, label: 'og' },
];

// ../../packages/infra/src/services/AffiliateService.ts
var DEFAULT_CONFIG = {
  partnerId: process.env.AFFILIATE_PARTNER_ID ?? 'semburat-default',
  commissionRate: Number(process.env.AFFILIATE_COMMISSION_RATE ?? 0.05),
  baseUrl: process.env.AFFILIATE_BASE_URL ?? 'https://affiliate.example.com',
};

// ../../packages/infra/src/services/ErrorAlertingService.ts
var logger = createLogger('ErrorAlertingService');
var RATE_LIMIT_WINDOW_MS = 5 * 60 * 1e3;

// src/routes/trends.ts
var app2 = new Hono3();
app2.get('/', async (c) => {
  const repo = new D1TrendRepository(c.env.DB);
  const topic = c.req.query('topic');
  const status = c.req.query('status');
  const minScore = parseInt(c.req.query('min_score') || '0');
  const limit = parseInt(c.req.query('limit') || '20');
  const cursor = c.req.query('cursor');
  let trends;
  if (status) {
    trends = await repo.findByStatus(status);
  } else {
    trends = await repo.findByScore(minScore, limit);
  }
  return c.json({ data: trends, meta: { limit, cursor: null } });
});
var trends_default = app2;

// src/routes/articles.ts
var app3 = new Hono3();
app3.get('/:slug', async (c) => {
  const repo = new D1ArticleRepository(c.env.DB);
  const article = await repo.findBySlug(c.req.param('slug'));
  if (!article) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  }
  return c.json({ data: article });
});
var articles_default = app3;

// src/routes/assets.ts
var app4 = new Hono3();
app4.get('/:id', async (c) => {
  const repo = new D1AssetRepository(c.env.DB);
  const asset = await repo.findById(c.req.param('id'));
  if (!asset) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Asset not found' } }, 404);
  }
  return c.json({ data: asset });
});
var assets_default = app4;

// src/routes/analytics.ts
var app5 = new Hono3();
app5.post('/events', async (c) => {
  const repo = new D1AnalyticsEventRepository(c.env.DB);
  const body = await c.req.json();
  return c.json({ data: { received: true } }, 201);
});
var analytics_default = app5;

// src/index.ts
var app6 = new Hono3();
app6.use('*', cors());
app6.use('*', rateLimitMiddleware);
app6.use('*', errorMiddleware);
app6.route('/api/health', health_default);
app6.route('/api/trends', trends_default);
app6.route('/api/articles', articles_default);
app6.route('/api/assets', assets_default);
app6.route('/api/analytics', analytics_default);
app6.get('/', (c) => {
  return c.json({ name: 'SEMBURAT Worker', version: '1.0.0', status: 'running' });
});
var src_default = app6;

// ../../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@4.20260702.1/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {}
      }
    } catch (e) {
      console.error('Failed to drain the unused request body.', e);
    }
  }
}, 'drainBody');
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@4.20260702.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause),
  };
}
__name(reduceError, 'reduceError');
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { 'MF-Experimental-Error-Stack': 'true' },
    });
  }
}, 'jsonError');
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-xH9rY6/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default,
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@4.20260702.1/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, '__facade_register__');
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    },
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, '__facade_invokeChain__');
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware,
  ]);
}
__name(__facade_invoke__, '__facade_invoke__');

// .wrangler/tmp/bundle-xH9rY6/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError('Illegal invocation');
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, '__Facade_ScheduledController__');
function wrapExportedHandler(worker) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function (request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error('Handler does not export a fetch() function.');
    }
    return worker.fetch(request, env2, ctx);
  }, 'fetchDispatcher');
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function (type, init) {
        if (type === 'scheduled' && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? '',
            () => {}
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, 'dispatcher');
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    },
  };
}
__name(wrapExportedHandler, 'wrapExportedHandler');
function wrapWorkerEntrypoint(klass) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error('Entrypoint class does not define a fetch() function.');
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === 'scheduled' && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? '',
          () => {}
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, 'wrapWorkerEntrypoint');
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === 'object') {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === 'function') {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export { __INTERNAL_WRANGLER_MIDDLEWARE__, middleware_loader_entry_default as default };
//# sourceMappingURL=index.js.map
