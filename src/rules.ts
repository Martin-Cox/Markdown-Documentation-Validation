import fileSystem from "fs-extra";

import { Rule } from "./rule";

// export const rules: Rule[] = [
// 	new Rule("No AP", "\\bAP\\b", { suggestion: "Awesome Product", keyword: "AP" }),
// 	new Rule("File Name Casing", "\\\.JSON", { caseSensitive: true, suggestion: ".json" }),
// 	new Rule("Strict Equality", "==", { suggestion: "===" }),
// 	new Rule("No buh", "buh")
// ];

/**  */
interface ConfigurationRule {
	/**  */
	name: string;

	/**  */
	regex: string;

	/**  */
	options?: {
		/** A suggested resolution to resolve rule violations. */
		suggestion?: string;

		/** The keyword that triggered the rule violation. */
		keyword?: string;

		/** Whether the regex should be case sensitive or not. */
		caseSensitive?: boolean;

		/** The justification for this rule (if not immediately obvious). */
		justification?: string;
	}
}

interface ConfigurationOptions {
	rules?: ConfigurationRule[];
};


export class Rules {
	/** The collection of individual rules. */
	private _rules: Rule[] = [];
	
	/** The location of the configuration file. */
	private _configLocation: string | undefined;

	/**
	 * Creates the Rules collection.
	 * @param configLocation The optional location of the configuration file.
	 */
	public constructor(configLocation?: string) {
		this._configLocation = configLocation;

		// TODO: Convert all "system" rules to config file equivalents.
		this._rules = this._rules.concat([
			new Rule("No TODO", "\\bTODO\\b"),
			new Rule("File Name Casing", "\\\.JSON", { caseSensitive: true, suggestion: ".json" }),
			new Rule("Strict Equality", "==", { suggestion: "===" }),
			new Rule("Strict Equality", "!=", { suggestion: "!==" }),
			new Rule("Context Format", "\\$\\$.*?\\$\\$", { suggestion: "\\$\\$fldvalue\\$\\$", keyword: "$$context$$", justification: "the markdown processor incorrectly formats contexts when the dollar signs are not escaped"})
		]);
	}

	/** Gets the list of rules. */
	public get rules(): Rule[] {
		return this._rules;
	}

	/**
	 * 
	 * @returns
	 */
	public buildRules(): Promise<void> {
		// If no configuration file was provided then simply return a resolved promise.
		if (!this._configLocation) {
			return Promise.resolve();
		}


		// TODO: Typings for config
		// TODO: Convert to Promises/async
		const config: ConfigurationOptions = JSON.parse(fileSystem.readFileSync(this._configLocation, "utf8"));
		config;

		// Add any rules from the options (if there are any).
		if (config.rules) {
			config.rules.forEach((configRule) => {
				this._rules.push(new Rule(configRule.name, configRule.regex, configRule.options));
			});
		}

		return Promise.resolve();
	}
}

//TODO: Can probably have buildRules() return a promise containing the rules collection and chain that through in index.ts