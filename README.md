# snippets-resycler

## Overview
Atom snippets translate vim snippet format.

## Install

```sh
$ sudo npm i -g snippets-resycler
```

## Usage
```sh
$ snippets-resycler
```
1. Enter path/to/Vim-snippet-directory.
1. Enter path/to/Atom-snippet-directory.
1. Enter snippets options.
    1. Enter snippet's extension. If you don't know, please check [this page.](https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers)
    1. Enter snippet's indent info. If you use 2 spaces, please enter "2". If you use tab, please enter "tab".

### options
|     option      |           effect           |            remark            |
| --------------- | -------------------------- | ---------------------------- |
|   -h, --help    |         view help          |                              |
| -o, --overwrite | snippets will be overwrite | default, it will be appended |

## Screenshots
### Before
/path/to/Atom-snippets-dir/snippets.cson
![image](https://user-images.githubusercontent.com/31335755/45288542-e67a6b00-b525-11e8-8b02-65e4cbd711b5.png)

### After
/path/to/Vim-snippets-dir/cpp.snip
![image](https://user-images.githubusercontent.com/31335755/45288623-17f33680-b526-11e8-9481-7c43e767f92f.png)
