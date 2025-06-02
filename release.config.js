const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 
const commitTemplatePath = resolve(__dirname, './commit-template.hbs');
const commitTemplateContent = readFileSync(commitTemplatePath, 'utf8');

function finalizeContext (context) {
	for (const commitGroup of context.commitGroups) {
		for (const commit of commitGroup.commits) {   
            // Extract extra release notes from commit description
            const releaseNotesRegex = /(\n|^)RELEASE NOTES:[^\n|$]+/i
            const match = releaseNotesRegex.exec(commit.message);
            if (match) {
                commit.releaseNotes = match[0].substring("RELEASE NOTES:".length + 1).trim()
            }
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