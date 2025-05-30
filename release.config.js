const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 

const commitTemplatePath = resolve(__dirname, './commit-template.hbs');

module.exports = {
  branches: [
    { name: "main" },
    { name: "maintenance-v1", range: "1.x.x" }
  ],
  plugins: [
    "@semantic-release/github",
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {

          writerOpts: {
            transform: (commit, context) => {
              if (commit.footer) {
                commit.releaseNotes = commit.footer["release-notes"];
              }
              return commit;
            },
          },
           commitPartial: readFileSync(commitTemplatePath, 'utf8'), 
        },
      },
    ],
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["docs/CHANGELOG.md"]
      }
    ]
  ]
};