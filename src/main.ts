import './style.css';

// A type describes the shape of an object, much like a struct declaration.
type Tool = {
  name: string;
  role: string;
  url: string;
};

const tools: Tool[] = [
  { name: 'Node.js', role: 'runs JavaScript outside the browser, including all the tools below', url: 'https://nodejs.org' },
  { name: 'npm', role: 'installs packages and runs the scripts in package.json', url: 'https://docs.npmjs.com' },
  { name: 'Vite', role: 'the dev server with instant reload, and the production bundler', url: 'https://vite.dev' },
  { name: 'TypeScript', role: 'JavaScript with static types, checked by tsc', url: 'https://www.typescriptlang.org' },
];

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Hello from Vite and TypeScript</h1>
  <ul>
    ${tools.map((tool) => `<li><a href="${tool.url}">${tool.name}</a>: ${tool.role}</li>`).join('')}
  </ul>
`;