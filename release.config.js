const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 
const conventionalCommitsPreset = require('conventional-changelog-conventionalcommits');

const commitTemplatePath = resolve(__dirname, './commit-template.hbs');
const commitTemplateContent = readFileSync(commitTemplatePath, 'utf8');
console.log('Loaded commit template content:', commitTemplateContent.substring(0, 50));

function findExtraReleaseNotes (commit) {
    const releaseNotesRegex = /(\n|^)RELEASE NOTES:[^\n|$]+/i
    const match = releaseNotesRegex.exec(commit.message);
    if (match) {
        commit.releaseNotes = match[0].trim();
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