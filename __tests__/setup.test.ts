import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Project Setup', () => {
  it('should have TypeScript configuration', () => {
    expect(fs.existsSync('./tsconfig.json')).toBe(true);
  });

  it('should have Next.js configuration', () => {
    const hasTsConfig = fs.existsSync('./next.config.ts');
    const hasJsConfig = fs.existsSync('./next.config.js');
    const hasMjsConfig = fs.existsSync('./next.config.mjs');
    expect(hasTsConfig || hasJsConfig || hasMjsConfig).toBe(true);
  });

  it('should have package.json with required scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.typecheck).toBeDefined();
  });

  it('should have .env.example file', () => {
    expect(fs.existsSync('./.env.example')).toBe(true);
  });

  it('should have .gitignore file', () => {
    expect(fs.existsSync('./.gitignore')).toBe(true);
  });

  it('should have globals.css with design tokens', () => {
    const globalsCss = fs.readFileSync('./app/globals.css', 'utf-8');
    expect(globalsCss).toContain('--primary');
    expect(globalsCss).toContain('--font-heading');
    expect(globalsCss).toContain('--font-body');
  });

  it('should have layout.tsx with Google Fonts', () => {
    const layoutContent = fs.readFileSync('./app/layout.tsx', 'utf-8');
    expect(layoutContent).toContain('Space_Grotesk');
    expect(layoutContent).toContain('DM_Sans');
  });

  it('should have Button component installed', () => {
    expect(fs.existsSync('./components/ui/button.tsx')).toBe(true);
  });

  it('should have Card component installed', () => {
    expect(fs.existsSync('./components/ui/card.tsx')).toBe(true);
  });
});
