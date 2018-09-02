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
			description: "The directory from which to read markdown documentation files."
	})
	.option("config", {
			description: "The location of the config file."
	}).argv;

const directory = argv.directory;
const config = argv.config;

// Build the rules collection.
Rules.buildRules(config).then((rules: Rule[]) => {
	// Read all of the files in the directory.
	fileSystem.readdir(directory).then((fileNames: string[]) => {
		// Filter out any files that are not .md files.
		return fileNames.filter((fileName) => /\.md$/g.test(fileName));
	}).then((fileNames: string[]) => {
		fileNames.forEach((fileName) => {
			const violations:{ line: number, rule: Rule, instances: number}[] = [];
			let lineNumber = 1;

			// Poor typings mean we have to cast eachLine as any.
			(lineReader.eachLine as any)(`${directory}/${fileName}`, (line: string, last: boolean, callBack: (done: boolean) => void) => {
				rules.forEach((rule) => {
					const instances = rule.instances(line);

					if (instances > 0) {
						violations.push({ line: lineNumber, rule, instances });
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
						const instancesText = violation.instances > 1 ? `(x${violation.instances})` : ""; 

						console.log(`Line ${violation.line}: ${violation.rule.name}${violationText ? ` - ${violationText}` : ""} ${instancesText}`);
					});
					console.log("------------------------------------------------");
				}
			});
		});
	});
});

//TODO:
// - Remove restriction on .md files -> or maybe pass in a regex filter to allow people to choose which types of files are validated
// - Expand rules to determine whether they apply on a per line/per file basis
// - Better validation of config files