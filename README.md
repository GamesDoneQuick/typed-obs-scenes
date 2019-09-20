# typed-obs-scenes [![npm](https://img.shields.io/npm/v/@gamesdonequick/typed-obs-scenes.svg)](https://www.npmjs.com/package/@gamesdonequick/typed-obs-scenes) [![Build Status](https://dev.azure.com/gamesdonequick/typed-obs-scenes/_apis/build/status/GamesDoneQuick.typed-obs-scenes?branchName=master)](https://dev.azure.com/gamesdonequick/typed-obs-scenes/_build/latest?definitionId=9&branchName=master)

> Generate a d.ts file full of enums describing an OBS Scene Collection.

## Table of Contents

-   [Motivation](#motivation)
-   [Installation](#installation)
-   [Usage](#usage)

## Motivation

We often need to write code which remotely controls one or more OBS Studio instances via `obs-websocket`. When doing this, it is common to need to reference specific Scene and Source names. This can be really dangerous, as it's easy to typo and these typos might go unnoticed until it is too late.

That's where this CLI tool comes in. It takes an OBS Scene Collection JSON file as input, and outputs a TypeScript `d.ts` typedef file with enums describing the Scenes, Sources, Groups, and Transitions present in that Collection. It looks like this (don't worry, you can use `UpperCamelCase` if you don't like `snake_case`):

```ts
export const enum Group {
	'camera_interview' = 'Camera (Interview)',
	'camera_widescreen_2' = 'Camera (Widescreen 2)',
	'camera_widescreen_1' = 'Camera (Widescreen 1)',
}

export const enum Source {
	'layout_widescreen_3' = 'Layout Widescreen 3',
	'layout_standard_4_ff_4_fe' = 'Layout Standard 4 FF4FE',
	'layout_standard_2_sms' = 'Layout Standard 2 SMS',
	'countdown_anim' = 'Countdown Anim',
	'layout_ds_vertical' = 'Layout DS Vertical',
	'closing_slate' = 'Closing Slate',
}

export const enum Scene {
	'main_stage_full_camera' = 'Main Stage Full Camera',
	'widescreen_3' = 'Widescreen 3',
	'standard_4_ff_4_fe' = 'Standard 4 FF4FE',
	'standard_2_sms' = 'Standard 2 SMS',
}

export const enum Transition {
	'fade_to_color' = 'Fade to Color',
	'blank_stinger' = 'Blank Stinger',
}
```

## Installation

This is a CLI program, so you don't need to write any code to use it. Just install and run.

```
npm i -g @gamesdonequick/typed-obs-scenes
```

## Usage

1. Export your Scene Collection from OBS (this is done via the `Scene Collection > Export` dropdown menu).
2. Run `typed-obs-scenes` on it:

    ```bash
    typed-obs-scenes --input path/to/your/scene/collection.json
    ```

3. Import the resulting `d.ts` file in your TypeScript project and start using it!

    ```ts
    import * as SceneCollection from 'path/to/your/scene/collection.d.ts';
    import * as ObsWebsocketJs from 'obs-websocket-js';

    const obs = new OBSWebSocket();
    obs.connect({ address: 'localhost:4444', password: '$up3rSecretP@ssw0rd' }).then(() => {
    	obs.send('SetCurrentScene', {
    		'scene-name': SceneCollection.Scene.main_stage_full_camera,
    	});
    });
    ```

You can also run `typed-obs-scenes` (with no arguments) at any time, and it will print a list of its options and how to use them:

```
Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --input    the OBS Scene Collection to generate typedefs from
                                                             [string] [required]
  --output   the location to write the generated typedefs to            [string]
  --case     the casing to use in the enum key names
                                  [choices: "camel", "snake"] [default: "snake"]

Missing required argument: input
```

# License

[MIT](LICENSE)
