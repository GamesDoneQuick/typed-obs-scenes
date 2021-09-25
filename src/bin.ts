#!/usr/bin/env node

// Native
import * as fs from 'fs';
import * as path from 'path';

// Packages
import * as yargs from 'yargs';

// Ours
import { changeExtension } from './util';
import { generateTypes, CodeCase, SceneCollection } from './lib';

const { argv } = yargs.options({
	input: {
		type: 'string',
		describe: 'the OBS Scene Collection to generate typedefs from',
		demandOption: true,
	},
	output: {
		type: 'string',
		describe: 'the location to write the generated typedefs to',
	},
	case: {
		choices: ['camel', 'snake'],
		describe: 'the casing to use in the enum key names',
		default: 'snake',
	},
});

const outputPath = path.resolve(process.cwd(), argv.output ? argv.output : changeExtension(argv.input, 'd.ts'));
const sceneCollection = JSON.parse(
	fs.readFileSync(argv.input, {
		encoding: 'utf8',
	}),
) as SceneCollection;
const types = generateTypes(sceneCollection, argv.case as CodeCase);
fs.writeFileSync(outputPath, types);

console.log(`Types written to ${outputPath}`);
