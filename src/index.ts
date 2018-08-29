import fileSystem from "fs-extra";
import * as yargs from "yargs";

import { Rule } from "./rule";
import { rules } from "./rules";

// Set up the command line arguments
const argv = yargs
	.wrap(yargs.terminalWidth())
	.usage("Validates markdown documentation against a set of rules.")
	.option("directory", {
			default: "example",
			defaultDescription: "The directory containing example documentation.",
			description: "The directory to read markdown documentation from."
	}).argv;

const directory = argv.directory;

// Read all of the files in the directory.
fileSystem.readdir(directory).then((fileNames: string[]) => {
	// Filter out any files that are not .md files.
	return fileNames.filter((fileName) => /\.md$/g.test(fileName));
}).then((fileNames: string[]) => {
	fileNames.forEach((fileName) => {
		const markdownString = fileSystem.readFileSync(`${directory}/${fileName}`, "utf8");

		const violations:{ line: number, rule: Rule}[] = [];

		rules.forEach((rule) => {
			const matches = rule.matches(markdownString);
	
			for (let i = 0; i < matches; i++) {
				violations.push({ line: -1, rule });
			}
		});
	
		if (violations.length > 0) {
			console.log(fileName);
			console.log(`${violations.length} warnings:`);
			violations.forEach((violation) => {
				const violationText = violation.rule.getViolationText();
				console.log(`Line ${violation.line}: ${violation.rule.name}${violationText ? ` - ${violationText}` : ""}`);
			});
			console.log("------------------------------------------------");
		}
	});
});

//TODO:
// - Read files line by line so it is easier to track down violations within a file -> replace match with exec
// - Add optional justification to Rule
// - Add some mechanism for reading in rules from an external file so people can customise their rules
// - Parse markdown via https://github.com/markdown-it/markdown-it
// - Read files async