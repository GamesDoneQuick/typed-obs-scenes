export function changeExtension(filename: string, newExtension: string): string {
	const extStartIndex = filename.lastIndexOf('.');

	// Handles files with no extension.
	if (extStartIndex < 0) {
		return `${filename}.${newExtension}`;
	}

	return `${filename.slice(0, extStartIndex)}.${newExtension}`;
}
