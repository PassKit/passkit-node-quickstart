# Contributing

Use Node.js 20 or later and install the locked dependencies with `npm ci`.

Before opening a pull request, run:

```sh
npm run check
npm run security
```

`npm test` is offline and never contacts PassKit. `npm run test:integration` uses the credentials in `.env`, creates live PassKit resources, and deletes them afterwards. Never commit `.env` or anything in `src/certs`.

Keep examples independently runnable through `npm run example -- <name>`. Add configuration through `src/config/config.js` and document it in `.env.example`; do not put credentials or developer-specific values in source files.
