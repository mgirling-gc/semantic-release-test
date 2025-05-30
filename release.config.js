const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 
const conventionalCommitsPreset = require('conventional-changelog-conventionalcommits');

const commitTemplatePath = resolve(__dirname, './commit-template.hbs');
const commitTemplateContent = readFileSync(commitTemplatePath, 'utf8');
console.log('Loaded commit template content:', commitTemplateContent.substring(0, 50));


let newWriterOpts;


// const getModifiedWriterOpts = async () => {
//     const { writerOpts: customWriterOpts } = await conventionalCommitsPreset();
//     customWriterOpts.transform = (commit, context) => {
//         if (commit.footer) {
//         commit.releaseNotes = commit.footer["release-notes"];
//         }
//         return commit;
//     }

//     customWriterOpts.commitPartial = readFileSync(commitTemplatePath, 'utf8')

//     return customWriterOpts
// }

// (async () => {
//     newWriterOpts = await getModifiedWriterOpts()
// })()

module.exports =  {
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
        writerOpts: {
            transform: (commit, context) => {
            // Find the index of your custom note
            const customFooterIndex = commit.notes.findIndex(
              (note) => note.title === 'RELEASE NOTES'
            );

            if (customFooterIndex > -1) {
              const [customNote] = commit.notes.splice(customFooterIndex, 1);
              commit.myCustomFooter = customNote.text;
            }

            // Return the modified commit object
            return commit;
          },
            commitPartial: commitTemplateContent
        },
        parserOpts: {
          noteKeywords: ["RELEASE NOTES"]
        }
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