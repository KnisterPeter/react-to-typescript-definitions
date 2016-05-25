<a name="0.12.0"></a>
# [0.12.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.11.1...v0.12.0) (2016-05-25)


### Features

* Adds option create write typings to top-level (#116) ([a4cb090](https://github.com/knisterpeter/react-to-typescript-definitions/commit/a4cb090))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2016-05-06",
  "version": "0.11.1",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.11.1",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "afa57ac794d6bcd2d3fb47efefd22fdad8a05158",
  "gitTags": " (tag: v0.11.1)",
  "committerDate": "2016-05-06",
  "commitGroups": [],
  "noteGroups": [],
  "isPatch": true,
  "currentTag": "v0.11.1",
  "previousTag": "v0.11.0",
  "linkCompare": true
}
<a name="0.11.1"></a>
## [0.11.1](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.11.0...v0.11.1) (2016-05-06)



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2016-04-09",
  "version": "0.11.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.11.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "f9790d661e666112ecbc5b62b54e042c7f63f3a3",
  "gitTags": " (tag: v0.11.0)",
  "committerDate": "2016-04-09",
  "commitGroups": [
    {
      "title": "Bug Fixes",
      "commits": [
        {
          "type": "Bug Fixes",
          "scope": "parser",
          "subject": "configure babel to be as permissive as possible",
          "merge": null,
          "header": "fix(parser): configure babel to be as permissive as possible",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "586b5ec",
          "gitTags": "",
          "committerDate": "2016-04-09",
          "raw": {
            "type": "fix",
            "scope": "parser",
            "subject": "configure babel to be as permissive as possible",
            "merge": null,
            "header": "fix(parser): configure babel to be as permissive as possible",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "586b5ec0b10389351b196c8c512e36bdc898cf5e",
            "gitTags": "",
            "committerDate": "2016-04-09"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.11.0",
  "previousTag": "v0.10.0",
  "linkCompare": true
}
<a name="0.11.0"></a>
# [0.11.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.10.0...v0.11.0) (2016-04-09)


### Bug Fixes

* **parser:** configure babel to be as permissive as possible ([586b5ec](https://github.com/knisterpeter/react-to-typescript-definitions/commit/586b5ec))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2016-02-01",
  "version": "0.10.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.10.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "4a2239cfdc85d01a09513d2bba8e64f1950652f4",
  "gitTags": " (tag: v0.10.0)",
  "committerDate": "2016-02-01",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Added support for ref attributes",
          "merge": null,
          "header": "feat: Added support for ref attributes",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "d6f5b46",
          "gitTags": "",
          "committerDate": "2016-02-01",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added support for ref attributes",
            "merge": null,
            "header": "feat: Added support for ref attributes",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "d6f5b46fed1eadb9683327dd9038b3124027f6b0",
            "gitTags": "",
            "committerDate": "2016-02-01"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.10.0",
  "previousTag": "v0.9.0",
  "linkCompare": true
}
<a name="0.10.0"></a>
# [0.10.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.9.0...v0.10.0) (2016-02-01)


### Features

* Added support for ref attributes ([d6f5b46](https://github.com/knisterpeter/react-to-typescript-definitions/commit/d6f5b46))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2016-01-29",
  "version": "0.9.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.9.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "f7076e6ed27c7fbaaf447e94144c1603337c3113",
  "gitTags": " (tag: v0.9.0)",
  "committerDate": "2016-01-29",
  "commitGroups": [],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.9.0",
  "previousTag": "v0.8.0",
  "linkCompare": true
}
<a name="0.9.0"></a>
# [0.9.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.8.0...v0.9.0) (2016-01-29)



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2016-01-21",
  "version": "0.8.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.8.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "bbcc2828c04929f45e6bf606c2e77d0b22a75950",
  "gitTags": " (tag: v0.8.0)",
  "committerDate": "2016-01-21",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Exported component interfaces",
          "merge": null,
          "header": "feat: Exported component interfaces",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "511767d",
          "gitTags": "",
          "committerDate": "2016-01-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Exported component interfaces",
            "merge": null,
            "header": "feat: Exported component interfaces",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "511767d1b47075ac277a921c6e174a662cbb65fa",
            "gitTags": "",
            "committerDate": "2016-01-21"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.8.0",
  "previousTag": "v0.7.0",
  "linkCompare": true
}
<a name="0.8.0"></a>
# [0.8.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.7.0...v0.8.0) (2016-01-21)


### Features

* Exported component interfaces ([511767d](https://github.com/knisterpeter/react-to-typescript-definitions/commit/511767d))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-31",
  "version": "0.7.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.7.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "2f5b67601e1dabeb7b485c604fe4befea5466db6",
  "gitTags": " (tag: v0.7.0)",
  "committerDate": "2015-12-31",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Support es6 class syntax",
          "merge": null,
          "header": "feat: Support es6 class syntax",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "8b27145",
          "gitTags": "",
          "committerDate": "2015-12-22",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Support es6 class syntax",
            "merge": null,
            "header": "feat: Support es6 class syntax",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "8b2714568b830157ca1344664b5709e3518f5f40",
            "gitTags": "",
            "committerDate": "2015-12-22"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.7.0",
  "previousTag": "v0.6.0",
  "linkCompare": true
}
<a name="0.7.0"></a>
# [0.7.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.6.0...v0.7.0) (2015-12-31)


### Features

* Support es6 class syntax ([8b27145](https://github.com/knisterpeter/react-to-typescript-definitions/commit/8b27145))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-21",
  "version": "0.6.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.6.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "dc55cfc396e4394d72475cd5fd38c98b835b9bd1",
  "gitTags": " (tag: v0.6.0)",
  "committerDate": "2015-12-21",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Added instanceOf proptypes",
          "merge": null,
          "header": "feat: Added instanceOf proptypes",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "c548b7b",
          "gitTags": "",
          "committerDate": "2015-12-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added instanceOf proptypes",
            "merge": null,
            "header": "feat: Added instanceOf proptypes",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "c548b7bc0f9c5882c15c9856bd872ed8e5a4dd52",
            "gitTags": "",
            "committerDate": "2015-12-21"
          }
        },
        {
          "type": "Features",
          "scope": null,
          "subject": "Added jsdoc to d.ts files",
          "merge": null,
          "header": "feat: Added jsdoc to d.ts files",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "1a40858",
          "gitTags": "",
          "committerDate": "2015-12-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added jsdoc to d.ts files",
            "merge": null,
            "header": "feat: Added jsdoc to d.ts files",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "1a408586df30f7f6441df39dbb8f1c89539e938f",
            "gitTags": "",
            "committerDate": "2015-12-21"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.6.0",
  "previousTag": "v0.5.0",
  "linkCompare": true
}
<a name="0.6.0"></a>
# [0.6.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.5.0...v0.6.0) (2015-12-21)


### Features

* Added instanceOf proptypes ([c548b7b](https://github.com/knisterpeter/react-to-typescript-definitions/commit/c548b7b))
* Added jsdoc to d.ts files ([1a40858](https://github.com/knisterpeter/react-to-typescript-definitions/commit/1a40858))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-21",
  "version": "0.5.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.5.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "44914b7213750b695ec53c671bb21072ac36e198",
  "gitTags": " (tag: v0.5.0)",
  "committerDate": "2015-12-21",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Added arrayOf type props",
          "merge": null,
          "header": "feat: Added arrayOf type props",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "faa9e0b",
          "gitTags": "",
          "committerDate": "2015-12-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added arrayOf type props",
            "merge": null,
            "header": "feat: Added arrayOf type props",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "faa9e0bb045e260b81aaa59ccae38398317ec134",
            "gitTags": "",
            "committerDate": "2015-12-21"
          }
        },
        {
          "type": "Features",
          "scope": null,
          "subject": "Added required props",
          "merge": null,
          "header": "feat: Added required props",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "f5d8cf7",
          "gitTags": "",
          "committerDate": "2015-12-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added required props",
            "merge": null,
            "header": "feat: Added required props",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "f5d8cf74684d130cfb29e520152792ead62b0811",
            "gitTags": "",
            "committerDate": "2015-12-21"
          }
        },
        {
          "type": "Features",
          "scope": null,
          "subject": "Added union proptypes",
          "merge": null,
          "header": "feat: Added union proptypes",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "033a159",
          "gitTags": "",
          "committerDate": "2015-12-21",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added union proptypes",
            "merge": null,
            "header": "feat: Added union proptypes",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "033a159d1ed2a46910d3802c4491430476fafc9a",
            "gitTags": "",
            "committerDate": "2015-12-21"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.5.0",
  "previousTag": "v0.4.0",
  "linkCompare": true
}
<a name="0.5.0"></a>
# [0.5.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.4.0...v0.5.0) (2015-12-21)


### Features

* Added arrayOf type props ([faa9e0b](https://github.com/knisterpeter/react-to-typescript-definitions/commit/faa9e0b))
* Added required props ([f5d8cf7](https://github.com/knisterpeter/react-to-typescript-definitions/commit/f5d8cf7))
* Added union proptypes ([033a159](https://github.com/knisterpeter/react-to-typescript-definitions/commit/033a159))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-19",
  "version": "0.4.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.4.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "1260ec10f927c61aeb1a6442e52138f2f4e0555e",
  "gitTags": " (tag: v0.4.0)",
  "committerDate": "2015-12-19",
  "commitGroups": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": null,
          "subject": "Added react key to generated props",
          "merge": null,
          "header": "feat: Added react key to generated props",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "a54511e",
          "gitTags": "",
          "committerDate": "2015-12-19",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Added react key to generated props",
            "merge": null,
            "header": "feat: Added react key to generated props",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "a54511e6b71ec958924dcef021752e67fb9c0758",
            "gitTags": "",
            "committerDate": "2015-12-19"
          }
        }
      ]
    },
    {
      "title": "Performance Improvements",
      "commits": [
        {
          "type": "Performance Improvements",
          "scope": null,
          "subject": "Tests are written in typescript",
          "merge": null,
          "header": "perf: Tests are written in typescript",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "2b04aa6",
          "gitTags": "",
          "committerDate": "2015-12-19",
          "raw": {
            "type": "perf",
            "scope": null,
            "subject": "Tests are written in typescript",
            "merge": null,
            "header": "perf: Tests are written in typescript",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "2b04aa6c7919159acdbeb544c9c2e085a816b4bb",
            "gitTags": "",
            "committerDate": "2015-12-19"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.4.0",
  "previousTag": "v0.3.2",
  "linkCompare": true
}
<a name="0.4.0"></a>
# [0.4.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.3.2...v0.4.0) (2015-12-19)


### Features

* Added react key to generated props ([a54511e](https://github.com/knisterpeter/react-to-typescript-definitions/commit/a54511e))


### Performance Improvements

* Tests are written in typescript ([2b04aa6](https://github.com/knisterpeter/react-to-typescript-definitions/commit/2b04aa6))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-15",
  "version": "0.3.2",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.3.2",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "33916f96b00d350cb97638223a7c766f051fe99e",
  "gitTags": " (tag: v0.3.2)",
  "committerDate": "2015-12-15",
  "commitGroups": [
    {
      "title": "Performance Improvements",
      "commits": [
        {
          "type": "Performance Improvements",
          "scope": null,
          "subject": "Reduced indention depth",
          "merge": null,
          "header": "perf: Reduced indention depth",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "d981864",
          "gitTags": "",
          "committerDate": "2015-12-10",
          "raw": {
            "type": "perf",
            "scope": null,
            "subject": "Reduced indention depth",
            "merge": null,
            "header": "perf: Reduced indention depth",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "d98186437bac8da8ff3b37d09a84ec50b8dc4dd5",
            "gitTags": "",
            "committerDate": "2015-12-10"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": true,
  "currentTag": "v0.3.2",
  "previousTag": "v0.3.1",
  "linkCompare": true
}
<a name="0.3.2"></a>
## [0.3.2](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.3.1...v0.3.2) (2015-12-15)


### Performance Improvements

* Reduced indention depth ([d981864](https://github.com/knisterpeter/react-to-typescript-definitions/commit/d981864))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-10",
  "version": "0.3.1",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.3.1",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "f68e76a25885405bce45fdead33746233d5d49e5",
  "gitTags": " (tag: v0.3.1)",
  "committerDate": "2015-12-10",
  "commitGroups": [
    {
      "title": "Bug Fixes",
      "commits": [
        {
          "type": "Bug Fixes",
          "scope": null,
          "subject": "Terminate node if no input from stdin",
          "merge": null,
          "header": "fix: Terminate node if no input from stdin",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "61734ca",
          "gitTags": "",
          "committerDate": "2015-12-10",
          "raw": {
            "type": "fix",
            "scope": null,
            "subject": "Terminate node if no input from stdin",
            "merge": null,
            "header": "fix: Terminate node if no input from stdin",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "61734ca614950c004244b6c75b887892398fe87b",
            "gitTags": "",
            "committerDate": "2015-12-10"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": true,
  "currentTag": "v0.3.1",
  "previousTag": "v0.3.0",
  "linkCompare": true
}
<a name="0.3.1"></a>
## [0.3.1](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.3.0...v0.3.1) (2015-12-10)


### Bug Fixes

* Terminate node if no input from stdin ([61734ca](https://github.com/knisterpeter/react-to-typescript-definitions/commit/61734ca))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-10",
  "version": "0.3.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.3.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "94a2da1ef1683cb2d1d6aff29e8dca6bbb834f94",
  "gitTags": " (tag: v0.3.0)",
  "committerDate": "2015-12-10",
  "commitGroups": [
    {
      "title": "Bug Fixes",
      "commits": [
        {
          "type": "Bug Fixes",
          "scope": "CHANGELOG",
          "subject": "Fixed changelog urls",
          "merge": null,
          "header": "fix(CHANGELOG): Fixed changelog urls",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "5aa784d",
          "gitTags": "",
          "committerDate": "2015-12-02",
          "raw": {
            "type": "fix",
            "scope": "CHANGELOG",
            "subject": "Fixed changelog urls",
            "merge": null,
            "header": "fix(CHANGELOG): Fixed changelog urls",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "5aa784de61bc5ca9a68ce010ecb166d573d64876",
            "gitTags": "",
            "committerDate": "2015-12-02"
          }
        }
      ]
    },
    {
      "title": "Features",
      "commits": [
        {
          "type": "Features",
          "scope": "types",
          "subject": "Added explicit any type",
          "merge": null,
          "header": "feat(types): Added explicit any type",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "d06dc20",
          "gitTags": "",
          "committerDate": "2015-12-02",
          "raw": {
            "type": "feat",
            "scope": "types",
            "subject": "Added explicit any type",
            "merge": null,
            "header": "feat(types): Added explicit any type",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "d06dc202baa436d33105f3160b0c624d390870a7",
            "gitTags": "",
            "committerDate": "2015-12-02"
          }
        },
        {
          "type": "Features",
          "scope": "types",
          "subject": "Added more optional types",
          "merge": null,
          "header": "feat(types): Added more optional types",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "5ab5736",
          "gitTags": "",
          "committerDate": "2015-12-02",
          "raw": {
            "type": "feat",
            "scope": "types",
            "subject": "Added more optional types",
            "merge": null,
            "header": "feat(types): Added more optional types",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "5ab5736402413a81cacfe03d86821471851cfb51",
            "gitTags": "",
            "committerDate": "2015-12-02"
          }
        },
        {
          "type": "Features",
          "scope": null,
          "subject": "Implemented pipes",
          "merge": null,
          "header": "feat: Implemented pipes",
          "body": "Enabled stdin/stdout redirection to use react2dts as unix filter",
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "2c4b42a",
          "gitTags": "",
          "committerDate": "2015-12-10",
          "raw": {
            "type": "feat",
            "scope": null,
            "subject": "Implemented pipes",
            "merge": null,
            "header": "feat: Implemented pipes",
            "body": "Enabled stdin/stdout redirection to use react2dts as unix filter",
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "2c4b42a689bc1e5ef2cfe687bc4095b919158d15",
            "gitTags": "",
            "committerDate": "2015-12-10"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.3.0",
  "previousTag": "v0.2.1",
  "linkCompare": true
}
<a name="0.3.0"></a>
# [0.3.0](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.2.1...v0.3.0) (2015-12-10)


### Bug Fixes

* **CHANGELOG:** Fixed changelog urls ([5aa784d](https://github.com/knisterpeter/react-to-typescript-definitions/commit/5aa784d))


### Features

* **types:** Added explicit any type ([d06dc20](https://github.com/knisterpeter/react-to-typescript-definitions/commit/d06dc20))
* **types:** Added more optional types ([5ab5736](https://github.com/knisterpeter/react-to-typescript-definitions/commit/5ab5736))
* Implemented pipes ([2c4b42a](https://github.com/knisterpeter/react-to-typescript-definitions/commit/2c4b42a))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-02",
  "version": "0.2.1",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.2.1",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "faa47d3bba1a84b97fa04fd2a68b8b2e136e9250",
  "gitTags": " (tag: v0.2.1)",
  "committerDate": "2015-12-02",
  "commitGroups": [
    {
      "title": "Bug Fixes",
      "commits": [
        {
          "type": "Bug Fixes",
          "scope": "main",
          "subject": "Fixed mail file attribute",
          "merge": null,
          "header": "fix(main): Fixed mail file attribute",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "c694f3e",
          "gitTags": "",
          "committerDate": "2015-12-02",
          "raw": {
            "type": "fix",
            "scope": "main",
            "subject": "Fixed mail file attribute",
            "merge": null,
            "header": "fix(main): Fixed mail file attribute",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "c694f3e326cccfcd0a64f30bbccfa3eca7a0e603",
            "gitTags": "",
            "committerDate": "2015-12-02"
          }
        },
        {
          "type": "Bug Fixes",
          "scope": "npm",
          "subject": "Fixed publishing",
          "merge": null,
          "header": "fix(npm): Fixed publishing",
          "body": null,
          "footer": null,
          "notes": [],
          "references": [],
          "mentions": [],
          "revert": null,
          "hash": "28c64d8",
          "gitTags": "",
          "committerDate": "2015-12-02",
          "raw": {
            "type": "fix",
            "scope": "npm",
            "subject": "Fixed publishing",
            "merge": null,
            "header": "fix(npm): Fixed publishing",
            "body": null,
            "footer": null,
            "notes": [],
            "references": [],
            "mentions": [],
            "revert": null,
            "hash": "28c64d846beb0831029d25aebe614ce4a01736e4",
            "gitTags": "",
            "committerDate": "2015-12-02"
          }
        }
      ]
    }
  ],
  "noteGroups": [],
  "isPatch": true,
  "currentTag": "v0.2.1",
  "previousTag": "v0.2.0",
  "linkCompare": true
}
<a name="0.2.1"></a>
## [0.2.1](https://github.com/knisterpeter/react-to-typescript-definitions/compare/v0.2.0...v0.2.1) (2015-12-02)


### Bug Fixes

* **main:** Fixed mail file attribute ([c694f3e](https://github.com/knisterpeter/react-to-typescript-definitions/commit/c694f3e))
* **npm:** Fixed publishing ([28c64d8](https://github.com/knisterpeter/react-to-typescript-definitions/commit/28c64d8))



Your final context is:
{
  "commit": "commit",
  "issue": "issues",
  "date": "2015-12-02",
  "version": "0.2.0",
  "host": "https://github.com",
  "owner": "knisterpeter",
  "repository": "react-to-typescript-definitions",
  "repoUrl": "https://github.com/knisterpeter/react-to-typescript-definitions",
  "packageData": {
    "name": "react-to-typescript-definitions",
    "version": "0.12.0",
    "description": "Create typescript definitions files (d.ts) from react components",
    "main": "index.js",
    "bin": {
      "react2dts": "cli.js"
    },
    "files": [
      "index.js",
      "cli.js",
      "index.d.ts",
      "index.js.map"
    ],
    "scripts": {
      "start": "npm test",
      "clean": "rm -f index.js index.js.map tests/*.js tests/*.js.map",
      "prebuild": "npm run clean",
      "build": "tsc --sourceMap",
      "build:inline": "tsc --inlineSourceMap",
      "pretest": "npm run clean && npm run build:inline",
      "test": "nyc --reporter lcov ./node_modules/.bin/mocha --recursive tests --all",
      "coverage": "cat ./coverage/lcov.info | ./node_modules/.bin/coveralls",
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w",
      "preversion": "npm test",
      "version": "npm run build && conventional-changelog -p angular -v -r 0 > CHANGELOG.md && git add -A .",
      "postversion": "git push && git push --tags",
      "prepublish": "not-in-install && npm run build || echo 'In install cycle, skipping prepublish'"
    },
    "author": {
      "name": "Markus Wolf",
      "email": "knister.peter@shadowrun-clan.de"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/knisterpeter/react-to-typescript-definitions.git"
    },
    "license": "MIT",
    "devDependencies": {
      "babel-core": "6.9.0",
      "babel-preset-es2015": "6.9.0",
      "babel-register": "6.9.0",
      "chai": "3.5.0",
      "chokidar-cli": "1.2.0",
      "conventional-changelog-cli": "1.2.0",
      "coveralls": "2.11.9",
      "cz-conventional-changelog": "1.1.6",
      "in-publish": "2.0.0",
      "mocha": "2.5.2",
      "nyc": "6.4.4",
      "react": "15.1.0",
      "tslint": "3.10.2",
      "typescript": "1.8.10"
    },
    "dependencies": {
      "babylon": "6.8.0",
      "minimist": "1.2.0"
    },
    "publishConfig": {
      "tag": "next"
    },
    "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "nyc": {
      "exclude": [
        "coverage",
        "tests"
      ]
    },
    "bugs": {
      "url": "https://github.com/knisterpeter/react-to-typescript-definitions/issues"
    },
    "readme": "ERROR: No README data found!",
    "homepage": "https://github.com/knisterpeter/react-to-typescript-definitions#readme",
    "_id": "react-to-typescript-definitions@0.12.0"
  },
  "gitSemverTags": [
    "v0.11.1",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
    "v0.6.0",
    "v0.5.0",
    "v0.4.0",
    "v0.3.2",
    "v0.3.1",
    "v0.3.0",
    "v0.2.1",
    "v0.2.0"
  ],
  "linkReferences": true,
  "type": null,
  "scope": null,
  "subject": null,
  "merge": null,
  "header": "0.2.0",
  "body": null,
  "footer": null,
  "notes": [],
  "references": [],
  "mentions": [],
  "revert": null,
  "hash": "09b212faf481afb3ae4e8c4cf23a841cbf2994b7",
  "gitTags": " (tag: v0.2.0)",
  "committerDate": "2015-12-02",
  "commitGroups": [],
  "noteGroups": [],
  "isPatch": false,
  "currentTag": "v0.2.0",
  "previousTag": null
}
<a name="0.2.0"></a>
# 0.2.0 (2015-12-02)



