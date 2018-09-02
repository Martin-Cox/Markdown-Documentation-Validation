import fileSystem from "fs-extra";

import { Rule } from "./rule";

/** A rule as defined in the configuration file. */
interface ConfigurationRule {
	/** The name of the rule. */
	name: string;

	/** The regex used to determine if the rule has been violated. */
	regex: string;

	/** The options. */
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

/** The configuration options. */
interface ConfigurationOptions {
	/** The rules. */
	rules?: ConfigurationRule[];
};

/** The class responsible for building the individual Rules. */
export class Rules {
	/**
	 * Builds the Rule objects from the configuration file at the given location.
	 * @param configFileLocation The location of the configuration file.
	 * @returns A promise containing an array of the built rules.
	 */
	public static buildRules(configFileLocation?: string): Promise<Rule[]> {
		// If no configuration file was provided then simply return a resolved promise with no rules.
		if (!configFileLocation) {
			return Promise.resolve([]);
		}

		return fileSystem.readFile(configFileLocation, "utf8").then((configString: string) => {
			const config: ConfigurationOptions = JSON.parse(configString);
			const rules: Rule[] = [];

			// Add any rules from the options (if there are any).
			if (config.rules) {
				config.rules.forEach((configRule) => {
					rules.push(new Rule(configRule.name, configRule.regex, configRule.options));
				});
			}

			return rules;
		}).then((value: Rule[]) => {
			return value;
		});
	}
}
