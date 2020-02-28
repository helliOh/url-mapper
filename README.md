Getting Started
```
npm install
npm install -g mermaid.cli

```

app.js
```
const ROOT_DOMAIN = 'target-url';//my target web-site
const MMDC_PATH = 'my mmdc path';//my mmdc path
```

```
/* This is for windows, in Linux, skip the cmd part */
let cmd = spawn('cmd', [MMDC_PATH, '-i', input, '-o', output], { stdio: 'inherit'});
```