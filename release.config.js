const { readFileSync } = require('fs');
const path = require('path'); 
const { resolve } = path; 
const commitTemplatePath = resolve(__dirname, './commit-template.hbs');
const commitTemplateContent = readFileSync(commitTemplatePath, 'utf8');


function extractReleaseNotes(str) {
    const releaseNotesRegex = /--START RELEASE NOTES--(.)+--END RELEASE NOTES--/i
    const match = releaseNotesRegex.exec(str);
    if (match) {
        return match[0].substring("--START RELEASE NOTES--".length + 1, "--END RELEASE NOTES--".length).trim()
    }
    return null
}

function finalizeContext (context) {
	for (const commitGroup of context.commitGroups) {
		for (const commit of commitGroup.commits) {   
            // Extract extra release notes from commit description
            // commit.releaseNotes = extractReleaseNotes(commit.message)

            // const footerReleaseNotes = extractReleaseNotes(commit.footer)
            // commit.releaseNotes ||= footerReleaseNotes

            // if (footerReleaseNotes) {
            //     commit.footer = commit.footer.replace('--START RELEASE NOTES--', '')
            //     commit.footer = commit.footer.replace(footerReleaseNotes, '')
            //     commit.footer = commit.footer.replace('--END RELEASE NOTES--', '')        
            // }

            commit.releaseNotes = commit['RELEASE NOTES']

            console.log(commit)
            console.log(commit.footer)
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