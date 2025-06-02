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

function findExtraReleaseNotes (commit) {
    const releaseNotesRegex = /(\n|^)RELEASE NOTES:/i
    console.log(commit.message)

    if (releaseNotesRegex.test(commit.message)) {
        console.log("found release notes")
        // find index of first character after "RELEASE NOTES:"
        const index = commit.message.indexOf("RELEASE NOTES:") + "RELEASE NOTES:".length + 1
        console.log(index)
        
        // get substring from index until next line break or end
        commit.releaseNotes = commit.message.substring(index, commit.message.indexOf("\n", index))
        console.log(commit.releaseNotes)

    }
}

function finalizeContext (context) {
	for (const commitGroup of context.commitGroups) {
		for (const commit of commitGroup.commits) {
            console.log(commit)
            findExtraReleaseNotes(commit)
            console.log("release notes")
            console.log(commit.releaseNotes)
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