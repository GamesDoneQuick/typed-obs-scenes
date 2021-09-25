// Packages
import { uniqBy, camelCase, snakeCase } from 'lodash';
import * as prettier from 'prettier';

interface SceneItem {
	id: string;
	name: string;
	settings?: Record<string, unknown>;
}

export type CodeCase = 'camel' | 'snake';
type Source = SceneItem;
type Transition = SceneItem;
type Group = SceneItem;
export type SceneCollection = {
	groups: Group[];
	sources: Source[];
	transitions: Transition[];
};

export function generateTypes(sceneCollection: SceneCollection, codeCase: CodeCase): string {
	const groups = generateEnum('Group', sceneCollection.groups, codeCase);
	const sources = generateEnum(
		'Source',
		sceneCollection.sources.filter((source) => source.id !== 'scene'),
		codeCase,
	);
	const scenes = generateEnum(
		'Scene',
		sceneCollection.sources.filter((source) => source.id === 'scene'),
		codeCase,
	);
	const transitions = generateEnum('Transition', sceneCollection.transitions, codeCase);
	return prettier.format(
		`
		export ${groups}

		export ${sources}

		export ${scenes}

		export ${transitions}
	`,
		{
			parser: 'typescript',
			singleQuote: true,
			quoteProps: 'as-needed',
		},
	);
}

function capitalCamelCase(str: string): string {
	const casedKey = `${camelCase(str)}`;
	return `${casedKey.charAt(0).toUpperCase()}${casedKey.slice(1)}`;
}

function generateEnum(enumName: string, items: Array<Group | Source | Transition>, codeCase: CodeCase): string {
	const casingFn = codeCase === 'camel' ? capitalCamelCase : snakeCase;
	items = uniqBy(items, (item) => casingFn(item.name));
	const lines: string[] = items.map((item) => `'${casingFn(item.name)}' = '${item.name}',`);
	return `const enum ${enumName} {
	${lines.join('\n')}
}`;
}
