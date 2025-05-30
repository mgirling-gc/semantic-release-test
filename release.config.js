const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 
const conventionalCommitsPreset = require('conventional-changelog-conventionalcommits');

const commitTemplatePath = resolve(__dirname, './commit-template.hbs');
const commitTemplateContent = readFileSync(commitTemplatePath, 'utf8');
console.log('Loaded commit template content:', commitTemplateContent.substring(0, 50));


let customWriterOpts;

(async () => {
    const { writerOpts: customWriterOpts } = await conventionalCommitsPreset();

})
module.exports = () => {

    
  customWriterOpts.transform = (commit, context) => {
              if (commit.footer) {
                commit.releaseNotes = commit.footer["release-notes"];
              }
              return commit;
            }

            customWriterOpts.commitPartial = readFileSync(commitTemplatePath, 'utf8')
    return {
  branches: [
    { name: "main" },
    { name: "maintenance-v1", range: "1.x.x" }
  ],
  plugins: [
    ["@semantic-release/npm", { npmPublish: false, verifyConditions: false, publish: false, prepare: false, addChannel: false }], 
    "@semantic-release/github",
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
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
};}