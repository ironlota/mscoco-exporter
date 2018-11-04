<p align="center">
  <img height="150" width="500" src="http://cocodataset.org/images/coco-logo.png" alt="MSCOCO" />
  <br>
    Taken from <a href="http://cocodataset.org">COCO Dataset</a>
  <br>
</p>

<h1 align="center">
  MSCOCO Caption Dataset Exporter
  <br>
</h1>

---

## Installation

```bash
git clone https://github.com/rayandrews/mscoco-exporter.git
cd mscoco-exporter
npm install
```

---

## Quickstart

```bash
  Usage: yarn start ([command] | [options])

  Commands:
    index.js  migrations              Migrate to MongoDB
    index.js  normalize-file          Normalize Annotation JSON file

  Options:
    -version  Show version number     [boolean]
    --help    Show help               [boolean]
```

## Normalize File (Export to JSON and CSV)

```bash
    Usage: yarn start normalize-file [options]

    Normalize Annotation JSON file

    Options:
      --version             Show version number                            [boolean]
      --help                Show help                                      [boolean]
      ----file, --file      Annotation JSON file                          [required]
      ----query, --query    JSONStream query                          [default: "*"]
      ----folder, --folder  Output folder                          [default: "data"]
```

## Migrate to MongoDB

Make `env` file for overriding configuration

```
  MONGO_URL=mongodb://mongo:27017/images
  imagesCollection=images
```

```bash
    Usage: yarn start migrations [options]

    Migrate to MongoDB

    Options:
      --version             Show version number                            [boolean]
      --help                Show help                                      [boolean]
      ----file, --file      Annotation JSON file                       [default: ""]
      ----folder, --folder  Output folder                          [default: "data"]
```

## Translating Caption to Another Language

Make `env` file for overriding configuration

```
  GOOGLE_PROJECT_ID=="project"
  GOOGLE_APPLICATION_CREDENTIALS="google-auth.json"
```

```bash
    Usage: yarn start translate [options]

    Translate Captions from English to another language

    Options:
      --version             Show version number                            [boolean]
      --help                Show help                                      [boolean]
      ----file, --file      Normalized JSON file                       [default: ""]
      ----folder, --folder  Output folder                          [default: "data"]
      ----target, --target  Target Language                          [default: "id"]
```

## Author

- Ray Andrew - [Email](raydreww@gmail.com) - [Github](https://github.com/rayandrews)
