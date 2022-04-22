# Contributing

## Reporting Bugs

When submitting a new bug report, please first
[search](https://github.com/mxenabled/web-widget-sdk/issues) for an existing or
similar report. If no duplicate exists, file the issue with the following
information:

1. OS and browser name and version.
2. Steps to reproduce the issue.
3. Example code snippet that causes the issue.
4. Screenshots of the broken UI.


## Development

Clone this repo and install [Node v16](https://nodejs.org/en/download/). Below
are commands we use to perform various tasks:

- `npm install`, install depedencies.
- `npm run compile`, run compiler.
- `npm run build`, run compiler and bundle all modules.
- `npm run test`, run unit tests.
- `npm run test:integration`, run integration tests.
- `npm run lint`, run linter.
- `npm run format`, run code formatter.
- `npm run print-integrity-hashes`, print integrity hashes for all distributed
  SDK assets.


## Publishing a new version

1. Update `CHANGELOG.md` with any changes that need to be communicated to a
   user of the SDK. See https://keepachangelog.com/en/1.1.0/ for details on
   what and how content should be included.
2. Run `npm version <newversion>` to set the new SDK version and create the git
   tag.
3. [Publish new version to npm.](#publishing-to-npm)


### Publishing to npm

You will need permission to publish to the [mxenabled][mxenabled_npm_org]
organization in npm before you can publish this package. Once you are able to
publish, log into npm with `npm login` then run `npm publish` to publish. Note
that running `npm publish` will automatically execute `npm run build` for you.


[mxenabled_npm_org]: https://www.npmjs.com/org/mxenabled "mxenabled npm organization"
