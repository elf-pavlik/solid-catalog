# Solid Efforts (core)

TODO

### Similar projects

[Solid Catalog](https://github.com/solid/catalog)  After an attempt to use solid/catalog repo as a common core, currently there is an ongoing exploration of interop/reuse of shapes, taxonomies and data between the projects.


## CLI

```bash
$ npx catalog
Usage: solid-catalog [options] [command]

CLI to manage Solid Catalog

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  format          Formats catalog data in a deterministic way
  validate
  migrate
  help [command]  display help for command
```

```bash
$ npx catalog validate
Usage: solid-catalog validate [options] [command]

Options:
  -h, --help      display help for command

Commands:
  webid           Checks statements with ex:webid that subject and object are the same
  help [command]  display help for command

```

```bash
$ npx catalog migrate
Usage: solid-catalog migrate [options] [command]

Options:
  -h, --help      display help for command

Commands:
  webid           Picks object in statement with ex:webid and makes it a subject, then updates all other statements using the old subject
  help [command]  display help for command
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.


## Acknowledgements

TODO

