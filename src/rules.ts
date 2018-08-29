import { Rule } from "./rule";

export const rules: Rule[] = [
	new Rule("No AP", "AP", { suggestion: "Awesome Product", keyword: "AP" }),
	new Rule("File Name Casing", "\\.JSON", { caseSensitive: true, suggestion: ".json" }),
	new Rule("Strict Equality", "==", { suggestion: "===" }),
	new Rule("No buh", "buh")
];