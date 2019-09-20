// Packages
import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';
import * as prettier from 'prettier';

interface SceneItem {
	id: string;
	name: string;
	settings?: {
		[k: string]: unknown;
	};
}

export type CodeCase = 'camel' | 'snake';
type Source = SceneItem;
type Transition = SceneItem;
type Group = SceneItem;
type SceneCollection = {
	groups: Group[];
	sources: Source[];
	transitions: Transition[];
};

export function generateTypes(sceneCollection: SceneCollection, codeCase: CodeCase): string {
	const groups = generateEnum('Group', sceneCollection.groups, codeCase);
	const sources = generateEnum('Source', sceneCollection.sources, codeCase);
	const transitions = generateEnum('Transition', sceneCollection.transitions, codeCase);
	return prettier.format(
		`
		export ${groups}

		export ${sources}

		export ${transitions}
	`,
		{
			parser: 'typescript',
			singleQuote: true,
			quoteProps: 'as-needed',
		},
	);
}

function generateEnum(enumName: string, items: Array<Group | Source | Transition>, codeCase: CodeCase): string {
	const casingFn =
		codeCase === 'camel'
			? (str: string): string => {
					const casedKey = `${camelCase(str)}`;
					return `${casedKey.charAt(0).toUpperCase()}${casedKey.slice(1)}`;
			  }
			: snakeCase;
	const lines: string[] = items.map(item => {
		return `'${casingFn(item.name)}' = '${item.name}',`;
	});
	return `const enum ${enumName} {
	${lines.join('\n')}
}`;
}
