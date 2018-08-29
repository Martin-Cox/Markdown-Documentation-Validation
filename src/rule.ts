/** Rule Options. */
interface RuleOptions {
	/** A suggested resolution to resolve rule violations. */
	suggestion?: string;

	/** The keyword that triggered the rule violation. */
	keyword?: string;

	/** Whether the regex should be case sensitive or not. */
	caseSensitive?: boolean;
}

/** A Rule. */
export class Rule {
	/** The name of the rule. */
	private _name: string;

	/** The regex used to determine if the rule has been violated. */
	private _regex: RegExp;

	/** The options. */
	private _options: RuleOptions;

	/**
	 * Creates a new Rule.
	 * @param name The name of the rule.
	 * @param regex The regex used to determine if the rule has been violated.
	 * @param options The options.
	 */
	public constructor(name: string, regex: string, options: RuleOptions = {}) {
		this._name = name;
		this._regex = new RegExp(regex, options.caseSensitive ? "g" : "gi");
		this._options = options;
	};

	/** Gets the name of the rule. */
	public get name(): string {
		return this._name;
	}

	/** Gets the suggestion text. */
	private get _suggestion(): string | undefined {
		return this._options.suggestion;
	}

	/** Gets the keyword that this rule blacklists. */
	private get _keyword(): string | undefined {
		return this._options.keyword;
	}

	/**
	 * Gets the number of times the given string violates the rule.
	 * @param testString The string to test.
	 * @returns Then number of times the string violates the rules.
	 */
	public matches(testString: string): number {
		const match = testString.match(this._regex);
		return match ? match.length : 0;
	}

	/**
	 * Gets the text to display when this rule is violated. If the rule has no suggestion, this simply returns an empty string.
	 * If the rule has a suggestion, it returns the suggestion followed by the violating keyword (if specified).
	 * @returns The text to display when the rule is violated.
	 */
	public getViolationText(): string {
		if (!this._suggestion) {
			return "";
		}

		return `Use "${this._suggestion}" instead${this._keyword ? ` of "${this._keyword}"` : ""}.`;
	}
}
