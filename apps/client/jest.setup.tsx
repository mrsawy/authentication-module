import '@testing-library/jest-dom'

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () { };
});


jest.mock('@/lib/utils/nats/client', () => ({
    natsClient: {},
}));

jest.mock('@/lib/actions/auth.action', () => ({
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            pathname: '/',
            query: {},
            asPath: '/',
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    redirect: jest.fn(),
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />
    },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => ({
        theme: 'light',
        setTheme: jest.fn(),
    }),
}))

// Mock environment variables
process.env.AUTH_COOKIE_NAME = 'test-auth-cookie'
process.env.NATS_URLS = 'nats://localhost:4222'
process.env.REDIS_URL = 'redis://localhost:6379'
if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test'
}

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserver;