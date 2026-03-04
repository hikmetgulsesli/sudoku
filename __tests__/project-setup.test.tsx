import '@testing-library/jest-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import * as fs from 'fs';

describe('Project Setup', () => {
  it('should have Next.js configured', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('next');
  });

  it('should have React configured', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('react');
  });

  it('should have Tailwind CSS configured', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
  });

  it('should have typecheck script', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.scripts).toHaveProperty('typecheck');
    expect(packageJson.scripts.typecheck).toBe('tsc --noEmit');
  });

  it('should have dev script', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.scripts).toHaveProperty('dev');
  });

  it('should have build script', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.scripts).toHaveProperty('build');
  });

  it('should have test script', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.scripts).toHaveProperty('test');
  });

  it('should have lint script', () => {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    expect(packageJson.scripts).toHaveProperty('lint');
  });
});

describe('shadcn/ui Components', () => {
  it('should export Button component', () => {
    expect(Button).toBeDefined();
    expect(Button.displayName).toBe('Button');
  });

  it('should export Card component', () => {
    expect(Card).toBeDefined();
    expect(Card.displayName).toBe('Card');
  });

  it('should export Card sub-components', () => {
    expect(CardHeader).toBeDefined();
    expect(CardFooter).toBeDefined();
    expect(CardTitle).toBeDefined();
    expect(CardDescription).toBeDefined();
    expect(CardContent).toBeDefined();
  });
});

describe('Project Structure', () => {
  it('should have app directory', () => {
    expect(fs.existsSync('./app')).toBe(true);
  });

  it('should have components directory', () => {
    expect(fs.existsSync('./components')).toBe(true);
  });

  it('should have lib directory', () => {
    expect(fs.existsSync('./lib')).toBe(true);
  });

  it('should have types directory', () => {
    expect(fs.existsSync('./types')).toBe(true);
  });
});

describe('Configuration Files', () => {
  it('should have .env.example', () => {
    expect(fs.existsSync('./.env.example')).toBe(true);
  });

  it('should have .gitignore', () => {
    expect(fs.existsSync('./.gitignore')).toBe(true);
  });

  it('should have next.config.ts', () => {
    expect(fs.existsSync('./next.config.ts')).toBe(true);
  });

  it('should have tsconfig.json', () => {
    expect(fs.existsSync('./tsconfig.json')).toBe(true);
  });
});
