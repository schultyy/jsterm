# jsterm

This provides basic Terminal operations in a terminal app written in Typescript. It uses Atom's electron to provide a basic graphical user interface.


## Development

```
$ npm install
```

You also need `tsd`:

```
$ npm install -g tsd
```

Also `grunt-cli` installed with `-g` switch:

```
$ npm install -g grunt-cli
```

### Run

```
$ npm start
```

This compiles all Typescript files and starts jsterm.

### Build

```
$ npm run build
```

### Configuration

jsterm looks by default for `~/.jstermrc`. This file allows you to override parameters with custom values.

You can configure the following properties:
- fontColor
- fontsize
- backgroundColor
- fontFamily

```json
{
  "font-family": "Courier",
  "fontsize": 20,
  "fontColor": "#FFFFFF",
  "backgroundColor": "#45036F"
}
```

## License

MIT © [Jan Schulte](https://github.com/schultyy/jsterm)
