### Pipeline2DCD

Converts JSON Spinnaker pipelines to DCD pipelines (https://github.com/spinnaker/dcd-spec).

#### Installation

##### Firefox

Install addon from https://addons.mozilla.org/en-GB/firefox/addon/pipeline2dcd/

##### Chrome

Install extension from https://github.com/sergi/pipeline2dcd/releases

#### Contribute

Suggestions and pull requests are highly encouraged!

In order to make modifications to the extension you'd need to run it locally.
Please follow the steps below:

```sh
git clone git@github.com:sergi/pipeline2dcd.git
cd pipeline2dcd
npm install    # Install dev dependencies
npm run build  # Build the extension code so it's ready for the browser
npm run watch  # Listen for file changes and automatically rebuild
```

Once built, load it in the browser of your choice:

<table>
	<tr>
		<th>Chrome</th>
		<th>Firefox</th>
	</tr>
	<tr>
		<td width="50%">
			<ol>
				<li>Open <code>chrome://extensions</code>
				<li>Check the <strong>Developer mode</strong> checkbox
				<li>Click on the <strong>Load unpacked extension</strong> button
				<li>Select the folder <code>pipeline2dcd/extension</code>
			</ol>
		</td>
		<td width="50%">
			<ol>
				<li>Open <code>about:debugging#addons</code>
				<li>Click on the <strong>Load Temporary Add-on</strong> button
				<li>Select the file <code>pipeline2dcd/extension/manifest.json</code>
			</ol>
		</td>
	</tr>
</table>

## Related

- [spin-dcd-converter](https://github.com/robzienert/spin-dcd-converter) - Tool to help convert Spinnaker JSON pipelines to DCD pipelines

#### Copyright
Icons by Ralf Schmitzer from the Noun Project