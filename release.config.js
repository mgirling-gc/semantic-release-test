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

function finalizeContext (context) {
	for (const commitGroup of context.commitGroups) {
		for (const commit of commitGroup.commits) {
            console.log(commit.notes)
            commit.notes = commit.notes.filter((note) => note.title === "BREAKING CHANGE")
		}
	}

	return context
}

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
            finalizeContext: finalizeContext,
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