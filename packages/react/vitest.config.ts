import { defineConfig } from 'vitest/config';
import {config} from 'dotenv';

config();

export default defineConfig({
    test: {
        name: '@infinite-scroll/react',
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.ts',
        reporters: ['default', 'verbose'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './test-coverage',
            reporter: ['text', 'json', 'html'],
            exclude: [
                "/dist",
            ],
            include: ["src/**/*.{ts,tsx}"]
        },
        watch: process.env.NODE_ENV === 'development'
    },
});