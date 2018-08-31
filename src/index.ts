import fileSystem from "fs-extra";
import * as lineReader from "line-reader";
import * as yargs from "yargs";

import { Rule } from "./rule";
import { Rules } from "./rules";

// Set up the command line arguments
const argv = yargs
	.wrap(yargs.terminalWidth())
	.usage("Validates markdown documentation against a set of rules.")
	.option("directory", {
			default: "example",
			defaultDescription: "The directory containing example documentation.",
			description: "The directory to read markdown documentation from."
	})
	.option("config", {
			description: "The location of the config file."
	}).argv;

const directory = argv.directory;
const config = argv.config;
const rules = new Rules(config);

rules.buildRules().then(() => {
	// Read all of the files in the directory.
	fileSystem.readdir(directory).then((fileNames: string[]) => {
		// Filter out any files that are not .md files.
		return fileNames.filter((fileName) => /\.md$/g.test(fileName));
	}).then((fileNames: string[]) => {
		fileNames.forEach((fileName) => {
			const violations:{ line: number, rule: Rule}[] = [];
			let lineNumber = 1;
			
			// Poor typings mean we have to cast eachLine as any.
			(lineReader.eachLine as any)(`${directory}/${fileName}`, (line: string, last: boolean, callBack: (done: boolean) => void) => {
				rules.rules.forEach((rule) => {
					const matches = rule.matches(line);
			
					for (let i = 0; i < matches; i++) {
						violations.push({ line: lineNumber, rule });
					}
				});

				lineNumber++;

				callBack(!last);
			}, () => {
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
	});
});

//TODO:
// - Remove restriction on .md files
// - Expand rules to determine whether they apply on a per line/per file basis
// - Better validation of config files