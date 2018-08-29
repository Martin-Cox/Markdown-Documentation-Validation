import fileSystem from "fs-extra";

import { Rule } from "./rule";
import { rules } from "./rules";

const demoMarkdown = fileSystem.readFileSync("example/example.md", "utf8");
const violations:{ line: number, rule: Rule}[] = [];

rules.forEach((rule) => {
	const matches = rule.matches(demoMarkdown);

	for (let i = 0; i < matches; i++) {
		violations.push({ line: -1, rule });
	}
});

if (violations) {
	console.log("------------------------------------------------");
	console.log("demo.md");
	console.log(`${violations.length} warnings:`);
	violations.forEach((violation) => {
		const violationText = violation.rule.getViolationText();
		console.log(`Line ${violation.line}: ${violation.rule.name}${violationText ? ` - ${violationText}` : ""}`);
	});
	console.log("------------------------------------------------");
}

//TODO:
// - Read files from a given directory (yargs?)
// - Read files line by line so it is easier to track down violations within a file
// - Add optional justification to Rule
// - Add some mechanism for reading in rules from an external file so people can customise their rules
// - Print real file names out
// - Parse markdown via https://github.com/markdown-it/markdown-it
// - Read files async